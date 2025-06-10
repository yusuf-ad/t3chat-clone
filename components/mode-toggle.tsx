"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ModeToggle({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar z-20 flex h-8 w-8 cursor-pointer items-center justify-center shadow-none",
        className,
      )}
      {...props}
    >
      <div className="flex h-full w-full items-center justify-center">
        {mounted ? theme === "light" ? <Sun /> : <Moon /> : null}
      </div>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
