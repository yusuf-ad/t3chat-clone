"use client";

import { Message } from "ai";
import { ChatBubble, ChatBubbleMessage } from "./ui/chat-bubble";
import { MarkdownContent } from "./ui/markdown-content";
import { Edit, RefreshCcw } from "lucide-react";
import CustomButton from "./custom-button";
import CopyButton from "./ui/copy-button";
import { useState } from "react";
import EditMessage from "./edit-message";
import { UseChatHelpers } from "@ai-sdk/react";
import { toast } from "sonner";
import { deleteTrailingMessages } from "@/server/actions/message";
import { attempt } from "@/lib/try-catch";

export default function ChatMessage({
  message,
  setMessages,
  reload,
}: {
  message: Message;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
}) {
  const isUser = message.role === "user";
  const [mode, setMode] = useState<"view" | "edit">("view");

  const handleSetMode = (mode: "view" | "edit") => {
    setMode(mode);
  };

  const handleRetry = async (draftContent?: string) => {
    // todo: add retry message for assistant

    const [, errorDeleteTrailingMessage] = await attempt(async () => {
      await deleteTrailingMessages({ id: message.id });
    });

    if (errorDeleteTrailingMessage) {
      toast.error(errorDeleteTrailingMessage.message);
    }

    // @ts-expect-error todo: support UIMessage in setMessages
    setMessages((messages) => {
      const index = messages.findIndex((m) => m.id === message.id);

      if (index !== -1) {
        const updatedMessage = {
          ...message,
          content: "",
          parts: [{ type: "text", text: draftContent || "" }],
        };

        return [...messages.slice(0, index), updatedMessage];
      }

      return messages;
    });

    reload();
  };

  return (
    <>
      {message.parts?.map((part, index) => {
        const { type } = part;
        const key = `message-${message.id}-part-${index}`;

        if (type === "text") {
          if (isUser) {
            return (
              <div key={key}>
                {mode === "view" ? (
                  <ChatBubble
                    className="max-w-[80%] justify-self-end break-words"
                    variant="sent"
                  >
                    <div className="group flex flex-col items-end gap-1">
                      <ChatBubbleMessage
                        className="bg-chat-user-background text-chat-text px-4 py-3"
                        variant="sent"
                      >
                        <MarkdownContent content={part.text} id={message.id} />
                      </ChatBubbleMessage>
                      <div className="pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
                        <CustomButton
                          description="Retry message"
                          className="bg-transparent"
                          onClick={() => handleRetry(part.text)}
                        >
                          <RefreshCcw />
                        </CustomButton>
                        <CustomButton
                          description="Edit message"
                          className="bg-transparent"
                          onClick={() => handleSetMode("edit")}
                        >
                          <Edit />
                        </CustomButton>
                        <CopyButton value={part.text} />
                      </div>
                    </div>
                  </ChatBubble>
                ) : (
                  <EditMessage
                    initialText={part.text}
                    setMode={handleSetMode}
                    setMessages={setMessages}
                    reload={reload}
                    message={message}
                  />
                )}
              </div>
            );
          } else {
            return (
              <ChatBubble
                className="w-full max-w-full break-words"
                key={key}
                variant="received"
              >
                <div className="group flex w-full flex-col items-start">
                  <ChatBubbleMessage
                    variant="sent"
                    className="text-chat-text bg-transparent px-0"
                  >
                    <MarkdownContent content={part.text} id={message.id} />
                  </ChatBubbleMessage>

                  {message.annotations?.map((annotation, index) => {
                    if (
                      typeof annotation === "object" &&
                      annotation !== null &&
                      "hasStopped" in annotation
                    ) {
                      return (
                        <div
                          key={`annotation-${index}`}
                          className="text-chat-text/75 mb-2 w-full rounded-lg bg-red-200 px-4 py-3 dark:bg-red-900/50 dark:text-red-400"
                        >
                          Stopped by user
                        </div>
                      );
                    }
                  })}

                  <div className="pointer-events-none flex items-center opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
                    <CopyButton value={part.text} />
                    {/* todo: add retry message for assistant */}
                    {/* <CustomButton
                      description="Retry message"
                      className="bg-transparent"
                    >
                      <RefreshCcw />
                    </CustomButton> */}
                    {message.annotations?.map((annotation, index) => {
                      if (
                        typeof annotation === "object" &&
                        annotation !== null &&
                        "modelId" in annotation
                      ) {
                        return (
                          <p
                            className="text-sidebar-logo ml-1 text-xs font-semibold"
                            key={`annotation-${index}`}
                          >
                            {annotation.modelId as string}
                          </p>
                        );
                      }
                    })}
                  </div>
                </div>
              </ChatBubble>
            );
          }
        }
      })}
    </>
  );
}
