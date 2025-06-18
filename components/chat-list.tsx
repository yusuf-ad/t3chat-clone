"use client";

import Link from "next/link";
import { DeleteChatDialog } from "./delete-chat-dialog";
import { Chat } from "@/server/db/schema";
import { useOptimistic, startTransition } from "react";
import { attempt } from "@/lib/try-catch";
import { deleteChat, toggleChatPin } from "@/server/actions/chat";
import { groupChatsByDate } from "@/lib/utils";
import PinChatButton from "./pin-chat-button";

export default function ChatList({ chats }: { chats: Chat[] }) {
  const pinnedChats = chats.filter((chat) => chat.pinned);
  const unpinnedChats = chats.filter((chat) => !chat.pinned);

  console.log(pinnedChats.length, unpinnedChats.length, chats.length);

  const [optimisticChatHistory, setOptimisticChatHistory] = useOptimistic(
    unpinnedChats,
    (
      currentHistory,
      action: { type: "delete" | "toggle"; chatId: string; chat?: Chat },
    ) => {
      if (action.type === "delete") {
        return currentHistory.filter((chat) => chat.id !== action.chatId);
      } else if (action.type === "toggle" && action.chat) {
        // Pin operation: remove from unpinned list
        return currentHistory.filter((chat) => chat.id !== action.chatId);
      }
      return currentHistory;
    },
  );

  const [optimisticPinnedChats, setOptimisticPinnedChats] = useOptimistic(
    pinnedChats,
    (
      currentPinnedChats,
      action: { type: "delete" | "toggle"; chatId: string; chat?: Chat },
    ) => {
      if (action.type === "delete") {
        return currentPinnedChats.filter((chat) => chat.id !== action.chatId);
      } else if (action.type === "toggle" && action.chat) {
        const existingChat = currentPinnedChats.find(
          (c) => c.id === action.chatId,
        );
        if (existingChat) {
          // Unpin operation: remove from pinned list
          return currentPinnedChats.filter((chat) => chat.id !== action.chatId);
        } else {
          // Pin operation: add to pinned list
          return [...currentPinnedChats, { ...action.chat, pinned: true }];
        }
      }
      return currentPinnedChats;
    },
  );

  const deleteChatById = async (chatId: string) => {
    startTransition(() => {
      // Remove from both lists
      setOptimisticChatHistory({ type: "delete", chatId });
      setOptimisticPinnedChats({ type: "delete", chatId });
    });

    const [, error] = await attempt(async () => {
      await deleteChat({ id: chatId });
    });

    if (error) {
      console.error(error);
    }
  };

  const pinChatById = async (chatId: string) => {
    const chatToToggle = [...pinnedChats, ...unpinnedChats].find(
      (c) => c.id === chatId,
    );
    if (!chatToToggle) return;

    startTransition(() => {
      setOptimisticChatHistory({ type: "toggle", chatId, chat: chatToToggle });
      setOptimisticPinnedChats({ type: "toggle", chatId, chat: chatToToggle });
    });

    const [, error] = await attempt(async () => {
      await toggleChatPin({ id: chatId });
    });

    if (error) {
      console.error(error);
    }
  };

  const groupedChats = groupChatsByDate(optimisticChatHistory || []);

  return (
    <>
      {optimisticPinnedChats.length > 0 && (
        <div className="pb-2">
          <h3 className="text-sidebar-heading pb-2 text-xs font-semibold tracking-widest uppercase">
            Pinned
          </h3>

          <ul className="flex flex-col gap-1">
            {optimisticPinnedChats.map((chat) => (
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
                  <PinChatButton
                    chatId={chat.id}
                    isPinned={chat.pinned}
                    onPin={pinChatById}
                  />
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
                      <PinChatButton
                        chatId={chat.id}
                        isPinned={chat.pinned}
                        onPin={pinChatById}
                      />
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
