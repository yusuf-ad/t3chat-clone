import { auth, currentUser, getAuth } from "@clerk/nextjs/server";
import { Avatar, AvatarImage } from "./ui/avatar";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function SidebarProfile() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <button className="border-t">
        <Link href="/auth">
          <div className="hover:bg-sidebar-border-light text-sidebar-button dark:text-interactive-ghost mb-2 flex h-14 cursor-pointer items-center gap-3 rounded-lg px-3 py-3 font-semibold">
            <LogIn className="h-4 w-4" />
            Login
          </div>
        </Link>
      </button>
    );
  }

  const user = await currentUser();

  return (
    <button className="border-t">
      <Link href="/settings">
        <div className="hover:bg-sidebar-border-light mb-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} />
          </Avatar>

          <div className="flex flex-col items-start justify-center">
            <h4 className="text-sidebar-logo text-sm font-semibold">
              {user?.firstName} {user?.lastName}
            </h4>
            <span className="text-sidebar-text-muted text-xs">Pro</span>
          </div>
        </div>
      </Link>
    </button>
  );
}
