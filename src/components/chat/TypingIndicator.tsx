import React from "react";

interface TypingIndicatorProps {
  typerName?: string;
  avatarUrl?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typerName = "Someone",
  avatarUrl,
}) => {
  const defaultAvatar =
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(typerName)}&background=00288E&color=fff`;

  return (
    <div className="flex items-center gap-3 animate-in fade-in duration-200">
      <img
        src={defaultAvatar}
        alt={typerName}
        className="w-7 h-7 rounded-full object-cover shrink-0 border border-border/40 shadow-2xs"
      />
      <div className="flex items-center gap-2 p-2.5 px-4 bg-surface-container-low dark:bg-slate-800 rounded-full border border-border/30 shadow-2xs">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
        </div>
      </div>
      <span className="text-xs text-muted-foreground italic">
        {typerName} is typing...
      </span>
    </div>
  );
};
