"use client";

import { ChatBubble, ChatBubbleMessage } from "./ui/chat-bubble";
import { Textarea } from "./ui/textarea";
import CustomButton from "./custom-button";
import { Edit, RefreshCcw } from "lucide-react";
import CopyButton from "./ui/copy-button";
import { useState, useRef, useEffect } from "react";
import { Message, UseChatHelpers } from "@ai-sdk/react";
import { deleteTrailingMessages } from "@/server/actions/message";
import { attempt } from "@/lib/try-catch";
import { toast } from "sonner";

export default function EditMessage({
  initialText,
  setMode,
  setMessages,
  reload,
  message,
}: {
  initialText: string;
  setMode: (mode: "view" | "edit") => void;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  message: Message;
}) {
  const [draftContent, setDraftContent] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Add a space to the end of the text if it doesn't already end with one
      setDraftContent((prev) => {
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

  const handleCancel = () => {
    setDraftContent(initialText); // Reset to original text

    setMode("view");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditMessage();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleEditMessage = async () => {
    const [, errorDeleteTrailingMessage] = await attempt(async () => {
      await deleteTrailingMessages({ id: message.id });
    });

    if (errorDeleteTrailingMessage) {
      toast.error(errorDeleteTrailingMessage.message);
    }

    // @ts-expect-error todo: support UIMessage in setMessages
    setMessages((messages) => {
      const index = messages.findIndex((m) => m.id === message.id);

      if (index !== -1) {
        const updatedMessage = {
          ...message,
          content: "",
          parts: [{ type: "text", text: draftContent }],
        };

        return [...messages.slice(0, index), updatedMessage];
      }

      return messages;
    });

    setMode("view");
    reload();
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
          value={draftContent}
          autoFocus
          onChange={(e) => setDraftContent(e.target.value)}
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
        <CopyButton value={initialText} />
      </div>
    </ChatBubble>
  );
}
