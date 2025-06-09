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
      className="h-screen max-h-screen"
    >
      <div
        ref={containerRef}
        className="relative mx-auto flex h-full w-full max-w-3xl flex-col px-2 pt-14"
      >
        {messages.length > 0 ? (
          <div className="px-4 pb-8">
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage message={message} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-10">
            <h2 className="text-interactive-secondary-text text-3xl font-bold tracking-wide">
              How can I help you, Yusuf?
            </h2>

            <div className="my-8 flex w-full gap-4">
              {actions.map((action) => (
                <Button
                  className="bg-interactive-secondary text-interactive-secondary-text hover:bg-interactive-secondary-hover hover:text-interactive-secondary-text flex-1 cursor-pointer border-0 py-6 font-semibold"
                  key={action.name}
                >
                  <action.icon className="mr-2 h-5 w-5" />
                  {action.name}
                </Button>
              ))}
            </div>

            <div className="mt-4 flex w-full flex-col gap-2">
              {questions.map((question) => (
                <div
                  key={question}
                  className="border-sidebar-border-light flex-1 pb-1 not-last:border-b"
                >
                  <Button className="text-interactive-ghost-text hover:bg-interactive-secondary-hover hover:text-interactive-secondary-text flex w-full cursor-pointer items-center justify-start bg-transparent py-5 font-semibold tracking-wide shadow-none">
                    {question}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="sticky bottom-0 mt-auto w-full">
          <div className="absolute inset-0 rounded-2xl bg-white/30 backdrop-blur-md dark:bg-black/30" />
          <ChatInput
            variant="default"
            className="border-sidebar-border focus-within:ring-sidebar-border text-sidebar-logo relative min-h-28 w-full rounded-b-none border-2 bg-transparent font-semibold shadow-xl"
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          >
            <ChatInputTextArea
              className="text-chat-text placeholder:text-text-placeholder dark:bg-transparent"
              placeholder="Type your message here..."
            />
            <ModelSelector className="absolute bottom-2 left-4" />
            <ChatInputSubmit className="bg-sidebar-button h-10 w-10 rounded-lg" />
            {showScrollButton && (
              <ScrollButton
                onClick={scrollToBottom}
                alignment={"center"}
                className="hover:bg-secondary absolute -top-12 rounded-full shadow-lg"
              />
            )}
          </ChatInput>
        </div>
      </div>
    </ChatMessageArea>
  );
}
