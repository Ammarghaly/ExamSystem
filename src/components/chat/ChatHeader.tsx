import React from "react";
import { ArrowLeft, Users } from "lucide-react";
import { type Conversation } from "../../data/chat/mockConversations";

interface ChatHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBack,
}) => {
  const avatarUrl =
    conversation.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.name)}&background=00288E&color=fff`;

  return (
    <div className="h-16 px-4 md:px-6 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border flex items-center justify-between sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="relative shrink-0">
          <img
            src={avatarUrl}
            alt={conversation.name}
            className="w-10 h-10 rounded-full object-cover border border-border/50 shadow-2xs"
          />
          {conversation.isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground leading-tight">
            {conversation.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-primary dark:text-sky-400">
              {conversation.teacherName}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 inline" />
              {conversation.membersCount} members
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
