"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { PanelLeftIcon, PlusIcon, SearchIcon } from "lucide-react";

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <div
      className={`bg-sidebar p-1 fixed z-10 left-3 top-2 rounded-lg flex items-center gap-1  ${
        open ? "w-10" : "w-auto"
      }`}
    >
      <Button
        className="h-10 w-10 z-20 text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar cursor-pointer shadow-none"
        onClick={toggleSidebar}
      >
        <PanelLeftIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <Button
        className={`h-10 w-10 text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar cursor-pointer shadow-none transition-all duration-100 ease-in-out ${
          open ? "-translate-x-20 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <SearchIcon />
        <span className="sr-only">Search</span>
      </Button>

      <Button
        className={`h-10 w-10 text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar cursor-pointer shadow-none transition-all duration-100 ease-in-out   ${
          open ? "-translate-x-20 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <PlusIcon />
        <span className="sr-only">New</span>
      </Button>
    </div>
  );
}
