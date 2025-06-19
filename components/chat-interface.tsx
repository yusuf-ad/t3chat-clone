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
    setInput,
    handleSubmit,
    stop,
    status,
    setMessages,
    reload,
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

    onFinish(message) {
      console.log("message", message);

      if (pathname === "/") {
        router.push(`/chat/${id}`);
        // TODO: remove this when you find a better way to sync with the server when you create a new chat
        router.refresh();
      }

      // add the modelId to the last message
      const usedModel = selectedModel.split(":")[1];

      setMessages((prevMessages) => {
        return [
          ...prevMessages.slice(0, -1),
          {
            ...message,
            annotations: [
              {
                modelId: usedModel,
              },
            ],
          },
        ];
      });
    },

    onError(error) {
      let errorMessage =
        "An unexpected error occurred. Please try again later.";
      let action = null;

      try {
        // error.message might contain the JSON response from the server
        const errorResponse = JSON.parse(error.message);

        if (errorResponse.error) {
          errorMessage = errorResponse.error;
        }

        if (errorResponse.status === 401 || errorResponse.status === 400) {
          errorMessage = "You need to provide your API key to continue.";
          action = {
            label: "Go to settings",
            onClick: () => {
              router.push("/settings?tab=api-keys");
            },
          };
        }

        if (errorResponse.status === 402) {
          errorMessage = "You don't have enough credits to continue.";
          action = {
            label: "Go to settings",
            onClick: () => {
              router.push("/settings?tab=api-keys");
            },
          };
        }
      } catch {
        // If parsing fails, use the error message directly
        errorMessage = error.message || errorMessage;

        if (error.message.split("-")[1] === "402") {
          errorMessage = "You don't have enough credits to continue.";
          action = {
            label: "Go to settings",
            onClick: () => {
              router.push("/settings?tab=api-keys");
            },
          };
        }

        toast.error(errorMessage);
      }

      if (pathname === "/") {
        router.push(`/chat/${id}`);

        router.refresh();
      }

      toast.error(errorMessage, { action });
    },
  });

  const [containerRef, showScrollButton, scrollToBottom] =
    useScrollToBottom<HTMLDivElement>();

  const handleEditMessage = async (messageId: string, newContent: string) => {
    // Find the index of the message being edited
    const messageIndex = messages.findIndex((m) => m.id === messageId);

    if (messageIndex === -1) {
      toast.error("Message not found");
      return;
    }

    // Create updated messages array:
    // 1. Keep all messages up to the edited message
    // 2. Update the edited message with new content
    // 3. Remove all messages after the edited message (they'll be regenerated)
    const updatedMessages = messages.slice(0, messageIndex + 1);
    updatedMessages[messageIndex] = {
      ...messages[messageIndex],
      content: newContent,
      parts: [
        {
          type: "text",
          text: newContent,
        },
      ],
    };

    // Update the messages state
    setMessages(updatedMessages);

    // If this was the last message, we need to trigger a new AI response
    // Only if the edited message was a user message
    if (
      messageIndex === messages.length - 1 &&
      messages[messageIndex].role === "user"
    ) {
      // The reload() function will automatically send the last message to get a new AI response
      setTimeout(() => {
        reload();
      }, 100); // Small delay to ensure state is updated
    } else if (
      messages[messageIndex].role === "user" &&
      messageIndex < messages.length - 1
    ) {
      // If there were assistant messages after this user message, trigger a new response
      setTimeout(() => {
        reload();
      }, 100);
    }
  };

  const handleStopStream = async () => {
    stop();

    const lastMessage = messages[messages.length - 1];

    const usedModel = selectedModel.split(":")[1];

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
                modelId: usedModel,
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
              modelId: usedModel,
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
          modelId: usedModel,
        });
      }
    });

    if (error) {
      toast.error("Error saving chat on stop");
    }

    if (pathname === "/") {
      router.push(`/chat/${id}`);

      router.refresh();
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
                <ChatMessage
                  message={message}
                  onEditMessage={handleEditMessage}
                />
              </div>
            ))}
            {status === "submitted" && (
              <div className="block">
                <MessageLoading />
              </div>
            )}
          </div>
        ) : (
          <ChatWelcome onQuestionClick={setInput} />
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
