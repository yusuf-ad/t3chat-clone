"use client";

import ChatMessage from "@/components/chat-message";
import ChatWelcome from "@/components/chat-welcome";

import { ChatMessageArea } from "@/components/ui/chat-message-area";
import { MessageLoading } from "@/components/ui/message-loading";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { attempt } from "@/lib/try-catch";
import { storePausedMessages } from "@/server/actions/chat";

import { Message, useChat } from "@ai-sdk/react";
import { usePathname, useRouter } from "next/navigation";
import { ChatInputContainer } from "@/components/chat-input-container";
import { generateUUID } from "@/lib/utils";
import { useModel } from "@/contexts/model-context";
import { getStoredApiKeys } from "@/lib/api-keys";
import { toast } from "sonner";

export default function ChatInterface({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: Message[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedModel } = useModel();
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
    generateId: generateUUID,

    // only send the last message to the server:
    experimental_prepareRequestBody({ messages, id }) {
      // Get stored API keys to send with request
      const apiKeys = getStoredApiKeys();

      return {
        message: messages[messages.length - 1],
        id,
        model: selectedModel,
        apiKeys,
      };
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
        // error.message might contain the JSON response from the server
        const errorResponse = JSON.parse(error.message);

        if (errorResponse.error) {
          errorMessage = errorResponse.error;
        }

        if (errorResponse.status === 401) {
          errorMessage = "You need to provide your API key to continue.";

          toast.error(errorMessage, {
            action: {
              label: "Go to settings",
              onClick: () => {
                router.push("/settings?tab=api-keys");
              },
            },
          });
        }
      } catch (e) {
        // If parsing fails, use the error message directly
        console.error("Error parsing error response:", e);
        errorMessage = error.message || errorMessage;

        toast.error(errorMessage);
      }

      if (pathname === "/") {
        router.push(`/chat/${id}`);
      }
    },
  });

  const [containerRef, showScrollButton, scrollToBottom] =
    useScrollToBottom<HTMLDivElement>();

  const handleStopStream = async () => {
    stop();

    const lastMessage = messages[messages.length - 1];

    // update the messages in the client:
    setMessages((prevMessages) => {
      if (lastMessage.role === "user") {
        return [
          ...messages,
          {
            id: lastMessage.id + "-stop",
            role: "assistant",
            content: "",
            parts: [
              {
                type: "text",
                text: "",
              },
            ],
            annotations: [
              {
                hasStopped: true,
              },
            ],
          },
        ];
      }

      return [
        ...prevMessages.slice(0, prevMessages.length - 1),
        {
          id: lastMessage.id + "-stop",
          role: "assistant",
          content: "",
          parts: [
            {
              type: "text",
              text: lastMessage.content,
            },
          ],
          annotations: [
            {
              hasStopped: true,
            },
          ],
        },
      ];
    });

    // update the messages in the server:
    const [, error] = await attempt(async () => {
      if (lastMessage.role === "assistant") {
        return await storePausedMessages({
          id,
          responseMessage: {
            id: lastMessage.id,
            role: "assistant",
            parts: [
              {
                type: "text",
                text: lastMessage.content,
              },
            ],
            createdAt: lastMessage.createdAt,
          },
        });
      }
    });

    if (error) {
      console.log("Error saving chat on stop:", error);
    }

    if (pathname === "/") {
      router.push(`/chat/${id}`);
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
          <div className="flex flex-col px-4 pb-8">
            {messages.map((message) => (
              <div className="flex-1" key={message.id}>
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
          onStop={handleStopStream}
          onScrollToBottom={scrollToBottom}
        />
      </div>
    </ChatMessageArea>
  );
}
