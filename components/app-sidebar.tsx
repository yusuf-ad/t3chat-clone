import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import ModeToggle from "./mode-toggle";

export function AppSidebar() {
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

        <Button className="bg-sidebar-button hover:bg-sidebar-button-hover my-2 py-4 shadow-xl hover:cursor-pointer dark:text-white">
          <span className="font-bold">New Chat</span>
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <h3 className="text-sidebar-heading text-xs font-semibold tracking-widest uppercase">
          Last 30 Days
        </h3>

        <ul className="my-2">
          <li className="px-2">
            <Link className="text-sidebar-link block truncate" href={"/"}>
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Officia, nobis.
            </Link>
          </li>
        </ul>
      </SidebarContent>

      <SidebarFooter className="px-4">
        <div className="border-sidebar-border-light flex items-center gap-4 border-t py-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={"/avatar.png"} />
          </Avatar>

          <div className="flex flex-col justify-center">
            <h4 className="text-sidebar-logo text-sm font-semibold">
              Yusuf Ad
            </h4>
            <span className="text-sidebar-text-muted text-xs">Pro</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
