import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import {
  offReceiveMessage,
  onReceiveMessage,
  sendMessage,
} from "@/socket/chat.socket";
import toast from "react-hot-toast";

interface MessageComposerProps {
  onSendMessage: (text: string) => void;
}

const SAMPLE_EMOJIS = ["👍", "❤️", "😊", "🎉", "🔥", "🙌", "📚", "💡"];

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
}) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        128,
      )}px`;
    }
  };

  useEffect(() => {
    const handleReceive = (msg: any) => {
      console.log("Message received from server: ", msg);
    };

    onReceiveMessage(handleReceive);

    return () => {
      offReceiveMessage(handleReceive);
    };
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="p-4 bg-surface dark:bg-slate-900 border-t border-border sticky bottom-0 shrink-0">
      {showEmojiPicker && (
        <div className="mb-2 p-2 bg-surface-container-low dark:bg-slate-800 border border-border rounded-xl shadow-md flex gap-2 overflow-x-auto animate-in slide-in-from-bottom-2 duration-150">
          {SAMPLE_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="text-lg p-1.5 hover:bg-muted dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 bg-surface-container-low dark:bg-slate-800/80 border border-border/60 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface dark:focus-within:bg-slate-900 transition-all">
        <div className="flex items-center h-10 px-1 gap-1 shrink-0">
          {/* Attachment button placeholder - disabled UI only */}
          <button
            type="button"
            disabled
            className="p-2 text-muted-foreground/40 cursor-not-allowed rounded-lg"
            title="Attachments coming soon"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showEmojiPicker
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground py-2.5 max-h-32 min-h-[40px] resize-none overflow-y-auto leading-relaxed"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
