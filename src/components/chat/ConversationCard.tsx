import React from "react";
import { type Conversation } from "../../data/chat/mockConversations";

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversation: Conversation) => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onSelect,
}) => {
  const avatarUrl =
    conversation.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.name)}&background=00288E&color=fff`;

  return (
    <div
      onClick={() => onSelect(conversation)}
      className={`group flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${
        isSelected
          ? "bg-primary/10 dark:bg-primary/20 border-primary/20 shadow-xs"
          : "border-transparent hover:bg-muted/70 dark:hover:bg-slate-800/60"
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={avatarUrl}
          alt={conversation.name}
          className="w-11 h-11 rounded-full object-cover border border-border/50 shadow-2xs"
        />
        {conversation.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {conversation.name}
          </h3>
          <span className="text-[11px] text-muted-foreground font-medium shrink-0 ml-2">
            {conversation.lastMessageTime}
          </span>
        </div>

        <p className="text-xs text-primary dark:text-sky-400 font-medium mb-0.5 truncate">
          {conversation.teacherName}
        </p>

        <p className="text-xs text-muted-foreground truncate">
          {conversation.lastMessage}
        </p>
      </div>

      {conversation.unreadCount > 0 && (
        <div className="flex shrink-0">
          <span className="min-w-[20px] h-[20px] px-1.5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
            {conversation.unreadCount}
          </span>
        </div>
      )}
    </div>
  );
};
