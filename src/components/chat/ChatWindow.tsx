import React, { useEffect, useLayoutEffect, useRef } from "react";
import { type Conversation } from "../../data/chat/mockConversations";
import { type Message } from "../../data/chat/mockMessages";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { MessageComposer } from "./MessageComposer";
import { Loader2 } from "lucide-react";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack?: () => void;
  isTyping?: boolean;
  typerName?: string;
  typerAvatar?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  onBack,
  isTyping,
  typerName,
  typerAvatar,
  onLoadMore,
  hasMore,
  isLoadingMore,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    isInitialLoadRef.current = true;
    prevScrollHeightRef.current = 0;
  }, [conversation.id]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isInitialLoadRef.current && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
      isInitialLoadRef.current = false;
      prevScrollHeightRef.current = container.scrollHeight;
      return;
    }

    if (
      prevScrollHeightRef.current > 0 &&
      container.scrollHeight > prevScrollHeightRef.current
    ) {
      const scrollDiff = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop += scrollDiff;
      prevScrollHeightRef.current = container.scrollHeight;
    } else {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        120;
      if (isAtBottom) {
        container.scrollTop = container.scrollHeight;
      }
      prevScrollHeightRef.current = container.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop < 60 && hasMore && !isLoadingMore && onLoadMore) {
      prevScrollHeightRef.current = container.scrollHeight;
      onLoadMore();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background dark:bg-slate-950 relative overflow-hidden">
      {/* Active Conversation Header */}
      <ChatHeader conversation={conversation} onBack={onBack} />

      {/* Messages Scroll Stream */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
      >
        {isLoadingMore && (
          <div className="flex items-center justify-center py-2 text-muted-foreground gap-2 text-xs font-semibold">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Loading older messages...</span>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <TypingIndicator
            typerName={typerName || conversation.teacherName}
            avatarUrl={typerAvatar || conversation.image}
          />
        )}
      </div>

      {/* Bottom Message Composer */}
      <MessageComposer
        groupId={conversation.id}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};
