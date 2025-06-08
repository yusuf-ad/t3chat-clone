"use client";

import ChatMessage from "@/components/chat-message";
import { ModelSelector } from "@/components/model-selector";
import { Button } from "@/components/ui/button";
import {
  ChatInput,
  ChatInputSubmit,
  ChatInputTextArea,
} from "@/components/ui/chat-input";
import { ChatMessageArea } from "@/components/ui/chat-message-area";

import { useChat } from "@ai-sdk/react";
import {
  SparklesIcon,
  CompassIcon,
  CodeIcon,
  GraduationCap,
} from "lucide-react";

const actions = [
  { name: "Create", icon: SparklesIcon },
  { name: "Explore", icon: CompassIcon },
  { name: "Code", icon: CodeIcon },
  { name: "Learn", icon: GraduationCap },
];

const questions = [
  "How does AI work?",
  "Are black holes real?",
  "How many Rs are in the word 'Rust'?",
  "What is the meaning of life?",
];

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="h-full w-full relative flex flex-col">
      {messages.length > 0 ? (
        <ChatMessageArea className="mb-8">
          {messages.map((message) => (
            <div key={message.id} className="whitespace-pre-wrap mt-8">
              <ChatMessage message={message} />
            </div>
          ))}
        </ChatMessageArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-bold text-[#6b21a8] tracking-wide">
            How can I help you, Yusuf?
          </h2>

          <div className="flex w-full gap-4 my-8">
            {actions.map((action) => (
              <Button
                className="flex-1 py-6 bg-[#e9d5ff] text-[#6b21a8] hover:bg-[#d8b4fe] cursor-pointer hover:text-[#6b21a8] font-semibold"
                key={action.name}
              >
                <action.icon className="h-5 w-5 mr-2" />
                {action.name}
              </Button>
            ))}
          </div>

          <div className="flex flex-col w-full gap-4 mt-4">
            {questions.map((question) => (
              <Button
                className="flex-1 py-4 flex items-center justify-start text-[#a669de] bg-[#f5f3ff] hover:bg-[#e9d5ff] hover:text-[#6b21a8] cursor-pointer font-semibold tracking-wide"
                key={question}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full sticky mt-auto bottom-6">
        <ChatInput
          variant="default"
          className="border-sidebar-border border-2 shadow-xl w-full focus-within:ring-sidebar-border text-sidebar-logo font-semibold"
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        >
          <ChatInputTextArea
            className="text-[#2f025a] placeholder:text-[#6b21a860]"
            placeholder="Type your message here..."
          />
          <ModelSelector className="absolute bottom-2 left-4" />
          <ChatInputSubmit className="bg-sidebar-button h-10 w-10 rounded-lg" />
        </ChatInput>
      </div>
    </div>
  );
}
