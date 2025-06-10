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
          className="text-chat-text bg-transparent"
        >
          <MarkdownContent content={message.content} id={message.id} />
        </ChatBubbleMessage>

        <div className="pointer-events-none ml-3 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
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
