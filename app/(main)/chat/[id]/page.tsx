import ChatInterface from "@/components/chat-interface";
import CustomButton from "@/components/custom-button";
import { PreviewChatInput } from "@/components/preview-chat-input";
import { Button } from "@/components/ui/button";
import { attempt } from "@/lib/try-catch";
import { getChatById } from "@/server/actions/chat";
import { getMessagesByChatId } from "@/server/actions/message";
import { DBMessage } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { UIMessage } from "ai";
import Link from "next/link";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col px-2 pt-14">
        <PreviewChatInput />
      </div>
    );
  }

  const { id } = await params;
  const [, chatError] = await attempt(getChatById({ id }));

  const [messagesFromDb, error] = await attempt(getMessagesByChatId({ id }));

  if (error || chatError) {
    return (
      <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-2 pt-14">
        <div className="text-sidebar-text-muted text-center">
          <h1 className="mb-4 text-3xl font-bold">
            {/* Show 404 if chatError or error, otherwise try to show status if available */}
            {(() => {
              // Try to get a status code from either error if available
              // Most likely, these are generic Error objects, so fallback to 404
              const status =
                (typeof (chatError as any)?.statusCode === "number" &&
                  (chatError as any).statusCode) ||
                (typeof (error as any)?.statusCode === "number" &&
                  (error as any).statusCode) ||
                404;
              return status;
            })()}{" "}
            -{" "}
            {chatError?.cause?.toString?.() ||
              error?.cause?.toString?.() ||
              chatError?.message ||
              error?.message ||
              "Unknown error"}
          </h1>

          <p className="mb-8 text-gray-500">Oops, something went wrong.</p>

          <Button
            asChild
            className="bg-sidebar-button hover:bg-sidebar-button-hover py-5 shadow-xl hover:cursor-pointer dark:text-white"
          >
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage["parts"],
      role: message.role as UIMessage["role"],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: "",
      createdAt: message.createdAt,
      annotations: message.annotations as UIMessage["annotations"],
    }));
  }

  return (
    <ChatInterface
      id={id}
      initialMessages={convertToUIMessages(messagesFromDb)}
    />
  );
}
