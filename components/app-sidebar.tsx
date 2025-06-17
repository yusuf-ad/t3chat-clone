import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import ModeToggle from "./mode-toggle";
import SidebarProfile from "./sidebar-profile";
import { auth } from "@clerk/nextjs/server";
import SidebarHistory from "./sidebar-history";
import { Suspense } from "react";
import SidebarProfileSkeleton from "./skeletons/sidebar-profile-skeleton";

export async function AppSidebar() {
  const { userId } = await auth();

  return (
    <Sidebar className="duration-100">
      <SidebarHeader className="px-4 py-4">
        <div className="relative flex items-center justify-between">
          <div className="flex flex-1 justify-center">
            <Link href={"/"}>
              <h1 className="text-sidebar-logo text-xl font-extrabold">
                T3.chat
              </h1>
            </Link>
          </div>

          <ModeToggle className="block md:hidden" />
        </div>

        <Button
          asChild
          className="bg-sidebar-button hover:bg-sidebar-button-hover my-2 py-4 shadow-xl hover:cursor-pointer dark:text-white"
        >
          <Link href="/">
            <span className="font-bold">New Chat</span>
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent className="scrollbar-hide overflow-y-auto px-4">
        {userId ? (
          <SidebarHistory userId={userId} />
        ) : (
          <div>Please sign in to continue</div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border-light px-4">
        <Suspense fallback={<SidebarProfileSkeleton />}>
          <SidebarProfile />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
