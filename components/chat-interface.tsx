"use client";

import ChatMessage from "@/components/chat-message";
import ChatWelcome from "@/components/chat-welcome";

import { ChatMessageArea } from "@/components/ui/chat-message-area";
import { MessageLoading } from "@/components/ui/message-loading";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { attempt } from "@/lib/try-catch";
import { updateChat } from "@/server/actions/chat";

import { Message, useChat } from "@ai-sdk/react";
import { usePathname, useRouter } from "next/navigation";
import { ChatInputContainer } from "@/components/chat-input-container";

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
  } = useChat({
    id,
    initialMessages,
    sendExtraMessageFields: true,

    // only send the last message to the server:
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },

    onFinish() {
      if (pathname === "/") {
        router.push(`/chat/${id}`);
      }
    },

    onError(error) {
      let errorMessage =
        "An unexpected error occurred. Please try again later.";
      try {
        const errorResponse = JSON.parse(error.message);
        if (errorResponse.error) {
          errorMessage = errorResponse.error;
        }
      } catch (e) {
        console.error("Error parsing error response:", e);
      }

      console.log("💥 Error in chat interface", errorMessage);
    },
  });

  const [containerRef, showScrollButton, scrollToBottom] =
    useScrollToBottom<HTMLDivElement>();

  const handleStop = async () => {
    stop();

    if (pathname === "/") {
      router.push(`/chat/${id}`);
    }

    const lastMessage = messages[messages.length - 1];

    // update the messages in the client:
    setMessages((prevMessages) => {
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

    const [data, error] = await attempt(async () => {
      // update the messages in the server:
      if (!lastMessage.id.startsWith("msg")) {
        return await updateChat({
          id,
          responseMessage: {
            id: lastMessage.id + "-stop",
            role: "assistant",
            content: "",
          },
          questionMessage: {
            id: lastMessage.id,
            role: "user",
            content: lastMessage.content,
          },
        });
      } else {
        return await updateChat({
          id,
          responseMessage: {
            id: lastMessage.id + "-stop",
            role: "assistant",
            content: lastMessage.content,
          },
          questionMessage: messages[messages.length - 2],
        });
      }
    });

    if (error) {
      console.log("Error saving chat on stop:", error);
    } else {
      console.log("Chat saved on stop:", await data);
    }
  };

  return (
    <ChatMessageArea
      scrollButtonAlignment="center"
      className="h-screen max-h-screen"
    >
      <div
        ref={containerRef}
        className="relative mx-auto flex h-full w-full max-w-3xl flex-col px-2 pt-14"
      >
        {messages.length > 0 || input.length > 0 ? (
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

        <ChatInputContainer
          input={input}
          status={status}
          showScrollButton={showScrollButton}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onStop={handleStop}
          onScrollToBottom={scrollToBottom}
        />
      </div>
    </ChatMessageArea>
  );
}
