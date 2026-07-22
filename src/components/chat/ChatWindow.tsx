import React, { useEffect, useRef } from "react";
import { type Conversation } from "../../data/chat/mockConversations";
import { type Message } from "../../data/chat/mockMessages";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { MessageComposer } from "./MessageComposer";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack?: () => void;
  isTyping?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  onBack,
  isTyping,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background dark:bg-slate-950 relative overflow-hidden">
      {/* Active Conversation Header */}
      <ChatHeader conversation={conversation} onBack={onBack} />

      {/* Messages Scroll Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <TypingIndicator
            typerName={conversation.teacherName}
            avatarUrl={conversation.image}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Composer */}
      <MessageComposer onSendMessage={onSendMessage} />
    </div>
  );
};
