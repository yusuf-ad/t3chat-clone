import { Chat } from "@/server/db/schema";
import { subWeeks, subMonths, isToday, isYesterday } from "date-fns";
import { getChatHistory } from "@/server/actions/chat";
import Link from "next/link";
import { attempt } from "@/lib/try-catch";
import { Button } from "./ui/button";
import { Pencil, Pin, Trash2 } from "lucide-react";
import CustomButton from "./custom-button";

type GroupedChats = {
  today: Chat[];
  yesterday: Chat[];
  lastWeek: Chat[];
  lastMonth: Chat[];
  older: Chat[];
};

const groupChatsByDate = (chats: Chat[]): GroupedChats => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  const sortedChats = chats.sort((a, b) => {
    const aDate = new Date(a.createdAt);
    const bDate = new Date(b.createdAt);
    return bDate.getTime() - aDate.getTime();
  });

  return sortedChats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.createdAt);

      if (isToday(chatDate)) {
        groups.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats,
  );
};

export default async function SidebarHistory({ userId }: { userId: string }) {
  const [chatHistory, chatHistoryError] = await attempt(
    getChatHistory({ userId }),
  );

  let content = null;
  if (chatHistoryError) {
    content = <div>Error loading chat history</div>;
  } else {
    const groupedChats = groupChatsByDate(chatHistory || []);

    content = (
      <>
        {groupedChats.today.length > 0 && (
          <div className="pb-2">
            <h3 className="text-sidebar-heading pb-2 text-xs font-semibold tracking-widest uppercase">
              Today
            </h3>
            <ul className="flex flex-col gap-1">
              {groupedChats.today.map((chat) => (
                <li
                  key={chat.id}
                  className="hover:bg-sidebar-border-light group/item relative flex items-center overflow-hidden rounded-lg text-sm"
                >
                  <Link
                    className="text-sidebar-link block h-9 w-full truncate px-2 py-2"
                    href={`/chat/${chat.id}`}
                  >
                    {chat.title}
                  </Link>
                  <div className="absolute right-1 flex translate-x-full items-center transition-transform duration-150 group-hover/item:flex group-hover/item:translate-x-0">
                    <CustomButton className="hover:bg-sidebar-button-hover hover:text-white">
                      <Pin />
                    </CustomButton>
                    <CustomButton className="hover:bg-sidebar-button-hover hover:text-white">
                      <Trash2 />
                    </CustomButton>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {groupedChats.yesterday.length > 0 && (
          <div className="pb-2">
            <h3 className="text-sidebar-heading pb-2 text-xs font-semibold tracking-widest uppercase">
              Yesterday
            </h3>
            <ul className="flex flex-col gap-1">
              {groupedChats.yesterday.map((chat) => (
                <li
                  key={chat.id}
                  className="hover:bg-sidebar-border-light last flex h-9 items-center rounded-lg px-2 py-2 text-sm"
                >
                  <Link
                    className="text-sidebar-link block truncate"
                    href={`/chat/${chat.id}`}
                  >
                    {chat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {groupedChats.lastWeek.length > 0 && (
          <div className="pb-2">
            <h3 className="text-sidebar-heading text-xs font-semibold tracking-widest uppercase">
              Last Week
            </h3>
            {groupedChats.lastWeek.map((chat) => (
              <div key={chat.id}>
                <ul className="flex flex-col gap-2">
                  <li className="hover:bg-sidebar-border-light flex h-9 items-center rounded-lg px-2 py-2 text-sm">
                    <Link
                      className="text-sidebar-link block truncate"
                      href={`/chat/${chat.id}`}
                    >
                      {chat.title}
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}

        {groupedChats.lastMonth.length > 0 && (
          <div className="pb-2">
            <h3 className="text-sidebar-heading text-xs font-semibold tracking-widest uppercase">
              Last Month
            </h3>
            {groupedChats.lastMonth.map((chat) => (
              <div key={chat.id}>
                <ul className="flex flex-col gap-2">
                  <li className="hover:bg-sidebar-border-light flex h-9 items-center rounded-lg px-2 py-2 text-sm">
                    <Link
                      className="text-sidebar-link block truncate"
                      href={`/chat/${chat.id}`}
                    >
                      {chat.title}
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}

        {groupedChats.older.length > 0 && (
          <div className="pb-2">
            <h3 className="text-sidebar-heading text-xs font-semibold tracking-widest uppercase">
              Older
            </h3>
            {groupedChats.older.map((chat) => (
              <div key={chat.id}>
                <ul className="flex flex-col gap-2">
                  <li className="hover:bg-sidebar-border-light flex h-9 items-center rounded-lg px-2 py-2 text-sm">
                    <Link
                      className="text-sidebar-link block truncate"
                      href={`/chat/${chat.id}`}
                    >
                      {chat.title}
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  return content;
}
