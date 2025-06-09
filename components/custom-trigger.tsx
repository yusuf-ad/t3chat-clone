"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { PanelLeftIcon, PlusIcon, SearchIcon } from "lucide-react";

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <div
      className={`bg-sidebar fixed top-2 left-2 z-10 flex items-center gap-1 rounded-lg p-1 ${
        open ? "w-8" : "w-auto"
      }`}
    >
      <Button
        className="text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar z-20 h-8 w-8 cursor-pointer shadow-none"
        onClick={toggleSidebar}
      >
        <PanelLeftIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <Button
        className={`text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar h-8 w-8 cursor-pointer shadow-none transition-all duration-200 ease-in-out ${
          open ? "-translate-x-20 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <SearchIcon />
        <span className="sr-only">Search</span>
      </Button>

      <Button
        className={`text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar h-8 w-8 cursor-pointer shadow-none transition-all duration-200 ease-in-out ${
          open ? "-translate-x-20 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <PlusIcon />
        <span className="sr-only">New</span>
      </Button>
    </div>
  );
}
