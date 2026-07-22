import { useEffect, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { AppLayout } from "../components/Layout/AppLayout";
import { getMyGroups } from "../api/groups";
import { getGroupMessages } from "../api/chat";
import { useUserStore } from "../stores/use-user-store";
import { type Conversation } from "../data/chat/mockConversations";
import { type Message } from "../data/chat/mockMessages";
import { ConversationList } from "../components/chat/ConversationList";
import { ChatWindow } from "../components/chat/ChatWindow";
import { EmptyState } from "../components/chat/EmptyState";
import { Loader2 } from "lucide-react";
import {
  joinGroup,
  leaveGroup,
  sendMessage,
  onReceiveMessage,
  offReceiveMessage,
  onTyping,
  offTyping,
  onStopTyping,
  offStopTyping,
  seenMessage,
  onSeenMessage,
  offSeenMessage,
} from "@/socket/chat.socket";
import { connectSocket } from "@/socket/socketConnection";
import { socket } from "@/socket/socket";

import toast from "react-hot-toast";

export default function ChatsPage() {
  const { currentUser } = useUserStore();
  const currentUserId = currentUser?._id || currentUser?.id;
  const currentUserRole = currentUser?.role;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localMessagesMap, setLocalMessagesMap] = useState<
    Record<string, Message[]>
  >({});

  const [typingMap, setTypingMap] = useState<
    Record<string, { id: string; name: string; avatar?: string } | null>
  >({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !socket.connected) {
      connectSocket(token);
    }
  }, []);

  // Listen to typing & stop typing socket events
  useEffect(() => {
    const handleTyping = ({ groupId, user }: { groupId: string; user: any }) => {
      console.log("Typing event received:", groupId, user);
      const rawUserId = user?.id || user?._id;
      if (
        rawUserId &&
        currentUserId &&
        rawUserId.toString() === currentUserId.toString()
      ) {
        return; // Ignore typing indicator for self
      }
      setTypingMap((prev) => ({
        ...prev,
        [groupId]: user,
      }));
    };

    const handleStopTyping = ({
      groupId,
    }: {
      groupId: string;
      userId: string;
    }) => {
      console.log("Stop typing event received:", groupId);
      setTypingMap((prev) => ({
        ...prev,
        [groupId]: null,
      }));
    };

    onTyping(handleTyping);
    onStopTyping(handleStopTyping);

    return () => {
      offTyping(handleTyping);
      offStopTyping(handleStopTyping);
    };
  }, [currentUserId]);

  const parseMessage = (m: any): Message => {
    const senderObj = m.sender || (typeof m.senderId === "object" ? m.senderId : null);
    const rawSenderId = senderObj?.id || senderObj?._id || m.senderId;
    const senderIdStr = rawSenderId ? rawSenderId.toString() : "";
    const currentUserIdStr = currentUserId ? currentUserId.toString() : "";

    const isMine = Boolean(
      senderIdStr && currentUserIdStr && senderIdStr === currentUserIdStr,
    );

    const senderRole = senderObj?.role || m.senderRole;
    const senderName = senderObj?.name || m.senderName || "Member";
    const isTeacher =
      senderRole?.toLowerCase() === "teacher" ||
      senderName.startsWith("Dr.") ||
      senderName.startsWith("Prof.");

    const formattedTime = m.createdAt
      ? new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

    return {
      id: m.id || m._id || `msg-${Date.now()}`,
      conversationId: m.groupId,
      senderId: senderIdStr,
      senderName,
      senderAvatar: senderObj?.avatar || m.senderAvatar || "",
      senderRole: senderRole || "Student",
      isTeacher: Boolean(isTeacher),
      text: m.content || m.text || "",
      timestamp: formattedTime,
      isMine,
      isSeen: true,
    };
  };

  // Real-time socket message listener
  useEffect(() => {
    const handleIncomingMessage = (m: any) => {
      console.log("Real-time message received in ChatsPage:", m);
      const groupId = m.groupId;
      if (!groupId) return;

      const newMsg = parseMessage(m);

      setLocalMessagesMap((prev) => {
        const currentList = prev[groupId] || [];
        if (newMsg.isMine) {
          const hasTemp = currentList.some((msg) =>
            msg.id.startsWith("local-msg-"),
          );
          if (hasTemp) {
            const filtered = currentList.filter(
              (msg) => !msg.id.startsWith("local-msg-"),
            );
            return {
              ...prev,
              [groupId]: [...filtered, newMsg],
            };
          }
        }
        if (currentList.some((msg) => msg.id === newMsg.id)) {
          return prev;
        }
        return {
          ...prev,
          [groupId]: [...currentList, newMsg],
        };
      });
    };

    onReceiveMessage(handleIncomingMessage);
    return () => {
      offReceiveMessage(handleIncomingMessage);
    };
  }, [currentUserId]);

  // 1. GET joined groups from backend API (GET only)
  const {
    data: groupsResponse,
    isLoading: isLoadingGroups,
    isError: isGroupsError,
  } = useQuery({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
  });

  // 2. GET messages for selected group from backend API with 20-item pagination
  const {
    data: messagesInfiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useInfiniteQuery({
    queryKey: ["groupMessages", selectedId],
    queryFn: ({ pageParam = 1 }) =>
      getGroupMessages(selectedId!, pageParam, 20),
    getNextPageParam: (lastPage, allPages) => {
      const messages = lastPage?.data || [];
      if (messages.length === 20) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!selectedId,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!selectedId) return;
    joinGroup(selectedId, (ack) => {
      console.log("Joined group ack:", ack);
    });
    return () => {
      leaveGroup(selectedId);
    };
  }, [selectedId]);

  const backendGroups = groupsResponse?.data || [];

  // Map backend messages array (reverse pages so oldest fetched page comes first, reverse messages for chronological order)
  const pagesList = messagesInfiniteData?.pages || [];
  const fetchedMessages: Message[] = [...pagesList]
    .reverse()
    .flatMap((pageResp: any) => {
      const rawMsgs = pageResp?.data || [];
      return [...rawMsgs].reverse().map((m: any) => parseMessage(m));
    });

  // Combine fetched messages with locally sent messages for active group
  const activeMessages = selectedId
    ? [...fetchedMessages, ...(localMessagesMap[selectedId] || [])]
    : [];

  // Map backend groups to Conversation objects
  const conversations: Conversation[] = backendGroups.map((g: any) => {
    const teacherName =
      g.teacher?.name || g.createdBy?.name || g.subject || "Instructor";
    const membersCount = (g.students?.length || 0) + 1;

    const isSelectedGroup = g._id === selectedId;
    const lastMsgText =
      isSelectedGroup && activeMessages.length > 0
        ? activeMessages[activeMessages.length - 1].text
        : `Group chat for ${g.subject || g.groupName}`;

    const lastMsgTime =
      isSelectedGroup && activeMessages.length > 0
        ? activeMessages[activeMessages.length - 1].timestamp
        : "";

    return {
      id: g._id,
      name: g.groupName,
      teacherName: teacherName,
      membersCount: membersCount,
      image: g.image || g.groupImage || "",
      lastMessage: lastMsgText,
      lastMessageTime: lastMsgTime,
      unreadCount: 0,
      isOnline: true,
    };
  });

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedId(conversation.id);
  };

  // Local-only message sending (no POST API calls)
  const handleSendMessage = (text: string) => {
    if (!selectedId) return;

    // Send message over socket to server
    sendMessage(selectedId, text, (ack: any) => {
      console.log("Message sent acknowledgment from server:", ack);
      if (ack && !ack.success) {
        toast.error("Failed to send message");
      }
    });

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isUserTeacher = currentUserRole?.toLowerCase() === "teacher";

    const newLocalMessage: Message = {
      id: `local-msg-${Date.now()}`,
      conversationId: selectedId,
      senderId: currentUserId || "user-current",
      senderName: "You",
      senderRole: currentUserRole || "Student",
      isTeacher: isUserTeacher,
      text,
      timestamp: timeString,
      isMine: true,
      isSeen: false,
    };

    setLocalMessagesMap((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newLocalMessage],
    }));
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  return (
    <AppLayout title="Chats">
      <div className="h-[calc(100vh-4rem)] -mx-4 md:-mx-8 -mb-20 md:-mb-0 flex overflow-hidden bg-background">
        {/* Left Column: Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
            selectedId ? "hidden md:block" : "block"
          }`}
        >
          {isLoadingGroups ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-muted-foreground gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-medium">Loading groups...</span>
            </div>
          ) : isGroupsError ? (
            <div className="p-6 text-center text-sm text-red-500">
              Failed to load joined groups. Please refresh.
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              onSelectConversation={handleSelectConversation}
            />
          )}
        </div>

        {/* Right Column: Chat Window or Empty State */}
        <div
          className={`flex-1 flex flex-col h-full ${
            !selectedId ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedConversation ? (
            isLoadingMessages ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-muted-foreground gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-sm font-medium">Loading messages...</span>
              </div>
            ) : (
              <ChatWindow
                conversation={selectedConversation}
                messages={activeMessages}
                onSendMessage={handleSendMessage}
                onBack={handleBack}
                isTyping={Boolean(selectedId && typingMap[selectedId])}
                typerName={selectedId ? typingMap[selectedId]?.name : undefined}
                typerAvatar={
                  selectedId ? typingMap[selectedId]?.avatar : undefined
                }
                onLoadMore={() => fetchNextPage()}
                hasMore={Boolean(hasNextPage)}
                isLoadingMore={isFetchingNextPage}
              />
            )
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
