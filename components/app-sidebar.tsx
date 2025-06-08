import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-4">
        <div className=" flex items-center justify-between">
          <SidebarTrigger className="text-[#8935d2]" />

          <h1 className="text-[#8935d2] font-extrabold text-2xl flex-1 text-center">
            T3.chat
          </h1>
        </div>

        <Button className="py-5 bg-[#a855f7] hover:bg-[#9333ea] hover:cursor-pointer my-4 shadow-xl">
          <Plus />
          <span className="font-bold">New Chat</span>
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <h3 className="uppercase tracking-widest text-sm text-[#be82f8] font-semibold">
          Last 30 Days
        </h3>

        <ul className="my-2">
          <li className="px-2">
            <Link
              className="truncate block text-[#9a51d9] font-semibold"
              href={"/"}
            >
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Officia, nobis.
            </Link>
          </li>
        </ul>
      </SidebarContent>

      <SidebarFooter className="px-3  ">
        <div className="flex items-center gap-4 border-t py-6 border-[#efe1ff]">
          <Avatar className="h-10 w-10">
            <AvatarImage src={"/avatar.png"} />
          </Avatar>

          <div className="flex flex-col justify-center">
            <h4 className="-mb-1  text-[#8935d2] font-semibold">Yusuf Ad</h4>
            <span className="text-sm text-[#8c52bd]">Pro</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
