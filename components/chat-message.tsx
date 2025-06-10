import { Message } from "ai";
import { ChatBubble, ChatBubbleMessage } from "./ui/chat-bubble";
import { MarkdownContent } from "./ui/markdown-content";
import { Copy, Edit, RefreshCcw } from "lucide-react";
import CustomButton from "./custom-button";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <ChatBubble variant="sent">
        <div className="group flex flex-col items-end gap-1">
          <ChatBubbleMessage
            className="bg-chat-user-background text-chat-text px-4 py-3"
            variant="sent"
          >
            <MarkdownContent content={message.content} id={message.id} />
          </ChatBubbleMessage>

          <div className="pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
            <CustomButton className="bg-transparent">
              <RefreshCcw />
            </CustomButton>
            <CustomButton className="bg-transparent">
              <Edit />
            </CustomButton>
            <CustomButton className="bg-transparent">
              <Copy />
            </CustomButton>
          </div>
        </div>
      </ChatBubble>
    );
  }

  return (
    <ChatBubble variant="received">
      <div className="group flex flex-col items-start">
        <ChatBubbleMessage
          variant="sent"
          className="text-chat-text bg-transparent px-0"
        >
          <MarkdownContent content={message.content} id={message.id} />
        </ChatBubbleMessage>

        {message.id.endsWith("-stop") && (
          <div className="text-chat-text/75 mb-2 w-full rounded-lg bg-red-200 px-4 py-3 dark:bg-red-900/50 dark:text-red-400">
            Stopped by user
          </div>
        )}

        <div className="pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
          <CustomButton className="bg-transparent">
            <Copy />
          </CustomButton>
          <CustomButton className="bg-transparent">
            <RefreshCcw />
          </CustomButton>
        </div>
      </div>
    </ChatBubble>
  );
}
