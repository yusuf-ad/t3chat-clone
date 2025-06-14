import { Chat } from "@/server/db/schema";
import { subWeeks, subMonths, isToday, isYesterday } from "date-fns";
import { getChatHistory } from "@/server/actions/chat";
import Link from "next/link";
import { attempt } from "@/lib/try-catch";

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

  return chats.reduce(
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
                  className="hover:bg-sidebar-border-light last flex items-center rounded-lg text-sm"
                >
                  <Link
                    className="text-sidebar-link block h-9 truncate px-2 py-2"
                    href={`/chat/${chat.id}`}
                  >
                    {chat.title}
                  </Link>
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
