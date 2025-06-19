"use client";

import { ChatBubble, ChatBubbleMessage } from "./ui/chat-bubble";
import { Textarea } from "./ui/textarea";
import CustomButton from "./custom-button";
import { Check, Edit, RefreshCcw, X } from "lucide-react";
import CopyButton from "./ui/copy-button";
import { useState, useRef, useEffect } from "react";

export default function EditMessage({
  initialText,
  setMode,
  onSave,
}: {
  initialText: string;
  setMode: (mode: "view" | "edit") => void;
  onSave?: (newText: string) => void;
}) {
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Add a space to the end of the text if it doesn't already end with one
      setText((prev) => {
        if (!prev.endsWith(" ")) return prev + " ";
        return prev;
      });
      // Move the cursor to the end
      const len = initialText.endsWith(" ")
        ? initialText.length
        : initialText.length + 1;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [initialText]);

  const handleSave = () => {
    if (onSave) {
      onSave(text.trim());
    }
    setMode("view");
  };

  const handleCancel = () => {
    setText(initialText); // Reset to original text

    setMode("view");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <ChatBubble
      className="group flex w-full max-w-[80%] flex-col items-end justify-self-end break-words"
      variant="sent"
    >
      <ChatBubbleMessage className="w-full px-0 py-0">
        <Textarea
          ref={textareaRef}
          className="text-chat-text border-sidebar-border/25 focus-visible:border-sidebar-border min-h-min w-full resize-none border-4 bg-purple-50 px-4 py-3 break-words focus-visible:ring-0 focus-visible:outline-0"
          value={text}
          autoFocus
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Edit your message..."
        />
      </ChatBubbleMessage>

      <div className="pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
        <CustomButton description="Retry message" className="bg-transparent">
          <RefreshCcw />
        </CustomButton>
        <CustomButton
          description="Edit message"
          className="bg-transparent"
          onClick={() => setMode("view")}
        >
          <Edit />
        </CustomButton>
        <CopyButton value={text} />
      </div>
    </ChatBubble>
  );
}
