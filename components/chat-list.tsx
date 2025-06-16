"use client";

import Link from "next/link";
import CustomButton from "./custom-button";
import { Pin } from "lucide-react";
import { DeleteChatDialog } from "./delete-chat-dialog";
import { Chat } from "@/server/db/schema";
import { useOptimistic, startTransition } from "react";
import { attempt } from "@/lib/try-catch";
import { deleteChat } from "@/server/actions/chat";
import { groupChatsByDate } from "@/lib/utils";

export default function ChatList({ chats }: { chats: Chat[] }) {
  const [optimisticChatHistory, setOptimisticChatHistory] = useOptimistic(
    chats,
    (currentHistory, chatId) => {
      return currentHistory.filter((chat) => chat.id !== chatId);
    },
  );

  const deleteChatById = async (chatId: string) => {
    startTransition(() => {
      setOptimisticChatHistory(chatId);
    });

    const [, error] = await attempt(async () => {
      await deleteChat({ id: chatId });
    });

    if (error) {
      console.error(error);
    }
  };

  const groupedChats = groupChatsByDate(optimisticChatHistory || []);

  return (
    <>
      {Object.entries(groupedChats).map(([date, chats]) => (
        <div key={date}>
          {chats.length > 0 && (
            <div key={date} className="pb-2">
              <h3 className="text-sidebar-heading pb-2 text-xs font-semibold tracking-widest uppercase">
                {date}
              </h3>
              <ul className="flex flex-col gap-1">
                {chats.map((chat) => (
                  <li
                    key={chat.id}
                    className="hover:bg-sidebar-border-light group/item relative flex items-center overflow-hidden rounded-lg text-sm"
                  >
                    <Link
                      className="text-sidebar-link block h-9 flex-1 truncate px-2 py-2"
                      href={`/chat/${chat.id}`}
                    >
                      {chat.title}
                    </Link>
                    <div className="absolute right-1 flex translate-x-full items-center transition-transform duration-150 group-focus-within/item:hidden group-focus-within/item:translate-x-0 group-hover/item:translate-x-0">
                      <CustomButton className="hover:bg-sidebar-button-hover hover:text-white">
                        <Pin />
                      </CustomButton>
                      <DeleteChatDialog
                        onDelete={deleteChatById}
                        title={chat.title}
                        chatId={chat.id}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
