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

      <SidebarFooter className="border-sidebar-border-light px-4">
        <SidebarProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
