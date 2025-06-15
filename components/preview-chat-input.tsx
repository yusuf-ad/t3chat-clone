"use client";

import { ModelSelector } from "@/components/model-selector";
import {
  ChatInput,
  ChatInputSubmit,
  ChatInputTextArea,
} from "@/components/ui/chat-input";

export function PreviewChatInput() {
  return (
    <div className="sticky bottom-0 mt-auto w-full">
      <div className="absolute inset-0 rounded-2xl rounded-t-[20px] rounded-b-none border-8 border-b-0 bg-white/30 backdrop-blur-md dark:bg-black/30" />
      <ChatInput
        variant="default"
        className="border-sidebar-border/5 focus-within:ring-sidebar-border text-sidebar-logo relative min-h-28 w-full rounded-2xl rounded-t-[20px] rounded-b-none border-8 border-b-0 bg-transparent font-semibold shadow-xl"
      >
        <ChatInputTextArea
          className="text-chat-text placeholder:text-text-placeholder cursor-not-allowed dark:bg-transparent"
          placeholder="Type your message here..."
          disabled
        />
        <ModelSelector className="absolute bottom-2 left-4" disabled />
        <ChatInputSubmit
          className="bg-sidebar-button hover:bg-sidebar-button-hover h-10 w-10 cursor-not-allowed rounded-lg opacity-50"
          disabled
        />
      </ChatInput>
    </div>
  );
}
