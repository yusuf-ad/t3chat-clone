import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center justify-center relative">
          <Link href={"/"} className="text-center">
            <h1 className="text-sidebar-logo font-extrabold text-xl">
              T3.chat
            </h1>
          </Link>
        </div>

        <Button className="py-5 bg-sidebar-button hover:bg-sidebar-button-hover hover:cursor-pointer my-4 shadow-xl">
          <span className="font-bold ">New Chat</span>
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <h3 className="uppercase tracking-widest text-sm text-sidebar-heading font-semibold">
          Last 30 Days
        </h3>

        <ul className="my-2">
          <li className="px-2">
            <Link
              className="truncate block text-sidebar-link font-semibold"
              href={"/"}
            >
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Officia, nobis.
            </Link>
          </li>
        </ul>
      </SidebarContent>

      <SidebarFooter className="px-4">
        <div className="flex items-center gap-4 border-t py-4 border-sidebar-border-light">
          <Avatar className="h-10 w-10">
            <AvatarImage src={"/avatar.png"} />
          </Avatar>

          <div className="flex flex-col  justify-center">
            <h4 className=" text-sm text-sidebar-logo font-semibold">
              Yusuf Ad
            </h4>
            <span className="text-xs text-sidebar-text-muted">Pro</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
