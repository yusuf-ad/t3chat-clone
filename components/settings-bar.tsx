"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Settings2, Sun } from "lucide-react";

export function SettingsBar() {
  const { setTheme, theme } = useTheme();

  return (
    <div
      className={`bg-sidebar p-1 fixed z-10 right-3 top-2 rounded-lg flex items-center gap-1`}
    >
      <Button className="h-8 w-8 z-20 text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar cursor-pointer shadow-none">
        <Settings2 />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <Button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="h-8 w-8 z-20 text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar cursor-pointer shadow-none"
      >
        {theme === "light" ? <Sun /> : <Moon />}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </div>
  );
}
