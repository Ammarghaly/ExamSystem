import React from "react";
import { MessageSquare } from "lucide-react";

export const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/40 dark:bg-slate-950/40">
      <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-4 shadow-xs">
        <MessageSquare className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">
        No Conversation Selected
      </h3>
      <p className="text-sm text-muted-foreground">
        Select a conversation to start chatting.
      </p>
    </div>
  );
};
