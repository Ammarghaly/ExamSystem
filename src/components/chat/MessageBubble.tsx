import React from "react";
import { Check, CheckCheck, GraduationCap } from "lucide-react";
import { type Message } from "../../data/chat/mockMessages";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMine = message.isMine;
  const isTeacher =
    message.isTeacher ||
    message.senderRole?.toLowerCase() === "teacher" ||
    message.senderName?.startsWith("Dr.") ||
    message.senderName?.startsWith("Prof.");

  const senderAvatar =
    message.senderAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      message.senderName
    )}&background=${isTeacher ? "440098" : "00288E"}&color=fff`;

  if (isMine) {
    return (
      <div className="flex flex-col items-end max-w-[85%] sm:max-w-[70%] ml-auto min-w-0">
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[10px] text-muted-foreground">
            {message.timestamp}
          </span>
          <span className="text-xs font-semibold text-primary dark:text-sky-400">
            You
          </span>
        </div>
        <div className="p-3.5 bg-primary text-white rounded-2xl rounded-tr-xs text-sm leading-relaxed shadow-2xs [overflow-wrap:anywhere] break-words whitespace-pre-wrap max-w-full w-fit">
          {message.text}
        </div>
        {message.isSeen !== undefined && (
          <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-muted-foreground">
            <span>{message.isSeen ? "Seen" : "Sent"}</span>
            {message.isSeen ? (
              <CheckCheck className="w-3 h-3 text-sky-500" />
            ) : (
              <Check className="w-3 h-3" />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%] min-w-0">
      <img
        src={senderAvatar}
        alt={message.senderName}
        className={`w-8 h-8 rounded-full object-cover shrink-0 mt-1 shadow-2xs border ${
          isTeacher
            ? "ring-2 ring-indigo-500 border-indigo-200"
            : "border-border/40"
        }`}
      />
      <div className="flex flex-col items-start min-w-0 max-w-full">
        <div className="flex items-center gap-2 mb-1 px-1 flex-wrap">
          <span className="text-xs font-semibold text-foreground">
            {message.senderName}
          </span>

          {isTeacher && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-100 dark:bg-indigo-900/60 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-700/80 flex items-center gap-1 shadow-2xs">
              <GraduationCap className="w-3 h-3 inline" /> Teacher
            </span>
          )}

          <span className="text-[10px] text-muted-foreground">
            {message.timestamp}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl rounded-tl-xs text-sm leading-relaxed shadow-2xs [overflow-wrap:anywhere] break-words whitespace-pre-wrap max-w-full w-fit border ${
            isTeacher
              ? "bg-gradient-to-r from-indigo-50 to-purple-50/90 dark:from-indigo-950/80 dark:to-purple-950/50 text-foreground border-indigo-200/90 dark:border-indigo-700/80"
              : "bg-surface-container-low dark:bg-slate-800 text-foreground border-border/30"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
};
