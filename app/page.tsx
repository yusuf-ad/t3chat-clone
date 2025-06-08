"use client";

import ChatMessage from "@/components/chat-message";
import {
  ChatInput,
  ChatInputSubmit,
  ChatInputTextArea,
} from "@/components/ui/chat-input";

import { useChat } from "@ai-sdk/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="h-full flex flex-col pb-8">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap mt-8">
          <ChatMessage message={message} />
        </div>
      ))}

      <ChatInput
        variant="default"
        className="mt-auto border-sidebar-border shadow-lg"
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      >
        <ChatInputTextArea placeholder="Type a message..." />
        <ChatInputSubmit />
      </ChatInput>
    </div>
  );
}
