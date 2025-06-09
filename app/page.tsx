"use client";

import ChatMessage from "@/components/chat-message";
import { ModelSelector } from "@/components/model-selector";
import { Button } from "@/components/ui/button";
import {
  ChatInput,
  ChatInputSubmit,
  ChatInputTextArea,
} from "@/components/ui/chat-input";
import {
  ChatMessageArea,
  ScrollButton,
} from "@/components/ui/chat-message-area";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";

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
  const [containerRef, showScrollButton, scrollToBottom] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <ChatMessageArea
      scrollButtonAlignment="center"
      className=" max-h-screen h-screen"
    >
      <div
        ref={containerRef}
        className="max-w-3xl mx-auto w-full relative pt-8 flex flex-col h-full"
      >
        {messages.length > 0 ? (
          <div className="pb-16">
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage message={message} />
              </div>
            ))}
          </div>
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

        <div className="sticky bottom-6 mt-auto w-full">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl" />
          <ChatInput
            variant="default"
            className="relative border-sidebar-border border-2 shadow-xl w-full focus-within:ring-sidebar-border text-sidebar-logo font-semibold bg-transparent"
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
            {showScrollButton && (
              <ScrollButton
                onClick={scrollToBottom}
                alignment={"center"}
                className="absolute -top-14 rounded-full shadow-lg hover:bg-secondary"
              />
            )}
          </ChatInput>
        </div>
      </div>
    </ChatMessageArea>
  );
}
