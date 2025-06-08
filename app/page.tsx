"use client";

import ChatMessage from "@/components/chat-message";
import { ModelSelector } from "@/components/model-selector";
import {
  ChatInput,
  ChatInputSubmit,
  ChatInputTextArea,
} from "@/components/ui/chat-input";
import { ChatMessageArea } from "@/components/ui/chat-message-area";

import { useChat } from "@ai-sdk/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="h-full w-full relative flex flex-col">
      <ChatMessageArea>
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap mt-8">
            <ChatMessage message={message} />
          </div>
        ))}
      </ChatMessageArea>

      <div className="w-full sticky bottom-6 mt-8">
        <ChatInput
          variant="default"
          className="border-sidebar-border shadow-lg w-full"
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        >
          <ChatInputTextArea placeholder="Type a message..." />
          <ModelSelector className="absolute bottom-2 left-4" />
          <ChatInputSubmit className="bg-sidebar-button h-10 w-10 rounded-lg" />
        </ChatInput>
      </div>
    </div>
  );
}
