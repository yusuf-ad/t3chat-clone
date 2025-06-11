"use client";

import ChatMessage from "@/components/chat-message";
import ChatWelcome from "@/components/chat-welcome";
import { ModelSelector } from "@/components/model-selector";
import {
  ChatInput,
  ChatInputSubmit,
  ChatInputTextArea,
} from "@/components/ui/chat-input";
import {
  ChatMessageArea,
  ScrollButton,
} from "@/components/ui/chat-message-area";
import { MessageLoading } from "@/components/ui/message-loading";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { updateChat } from "@/server/actions/chat";

import { Message, useChat } from "@ai-sdk/react";
import { usePathname, useRouter } from "next/navigation";

export default function ChatInterface({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: Message[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    status,
    setMessages,
    append,
  } = useChat({
    id,
    initialMessages,
    sendExtraMessageFields: true,

    // only send the last message to the server:
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },

    onResponse() {
      if (pathname === "/") {
        router.push(`/chat/${id}`);
      }
    },
  });

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
            {status === "submitted" && (
              <div className="block">
                <MessageLoading />
              </div>
            )}
          </div>
        ) : (
          <ChatWelcome />
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
            <ChatInputSubmit
              loading={status === "submitted" || status === "streaming"}
              onStop={async () => {
                stop();

                if (pathname === "/") {
                  router.push(`/chat/${id}`);
                }

                setMessages((prevMessages) => {
                  const lastMessage = messages[messages.length - 1];

                  if (!lastMessage.id.startsWith("msg")) {
                    return [
                      ...messages,
                      {
                        id: lastMessage.id + "-stop",
                        role: "assistant",
                        content: "",
                      },
                    ];
                  }

                  return [
                    ...prevMessages.slice(0, prevMessages.length - 1),
                    {
                      id: lastMessage.id + "-stop",
                      role: "assistant",
                      content: lastMessage.content,
                    },
                  ];
                });
              }}
              className="bg-sidebar-button hover:bg-sidebar-button-hover h-10 w-10 cursor-pointer rounded-lg"
            />
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
