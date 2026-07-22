import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { joinGroup, leaveGroup, sendMessage } from "@/socket/chat.socket";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !socket.connected) {
      connectSocket(token);
    }
  }, []);

  // 1. GET joined groups from backend API (GET only)
  const {
    data: groupsResponse,
    isLoading: isLoadingGroups,
    isError: isGroupsError,
  } = useQuery({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
  });

  // 2. GET messages for selected group from backend API (GET only)
  const { data: messagesResponse, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["groupMessages", selectedId],
    queryFn: () => getGroupMessages(selectedId!),
    enabled: !!selectedId,
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

  // Map backend messages array (backend returns newest first, reverse for chronological order)
  const rawMessages = messagesResponse?.data || [];
  const fetchedMessages: Message[] = [...rawMessages]
    .reverse()
    .map((m: any) => {
      const senderId = m.sender?.id || m.senderId;
      const isMine =
        senderId &&
        currentUserId &&
        senderId.toString() === currentUserId.toString();

      const senderRole = m.sender?.role || m.senderRole;
      const isTeacher =
        senderRole?.toLowerCase() === "teacher" ||
        m.sender?.name?.startsWith("Dr.") ||
        m.sender?.name?.startsWith("Prof.");

      const formattedTime = m.createdAt
        ? new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      return {
        id: m.id || m._id,
        conversationId: m.groupId,
        senderId: senderId || "",
        senderName: m.sender?.name || "Member",
        senderAvatar: m.sender?.avatar || "",
        senderRole: senderRole || "Student",
        isTeacher: Boolean(isTeacher),
        text: m.content || "",
        timestamp: formattedTime,
        isMine: Boolean(isMine),
        isSeen: true,
      };
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
                isTyping={false}
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
