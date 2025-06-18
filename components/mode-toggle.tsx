"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import CustomButton from "./custom-button";

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
    <CustomButton
      description="Theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar z-20 flex h-8 w-8 cursor-pointer items-center justify-center shadow-none",
        className,
      )}
      {...props}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {mounted ? (
          <>
            <Sun
              className={cn(
                "absolute h-5 w-5 transition-all duration-300",
                theme === "light"
                  ? "translate-y-0 rotate-0 opacity-100"
                  : "translate-y-5 rotate-180 opacity-0",
              )}
            />
            <Moon
              className={cn(
                "absolute h-5 w-5 transition-all duration-300",
                theme === "dark"
                  ? "translate-y-0 rotate-0 opacity-100"
                  : "translate-y-5 rotate-180 opacity-0",
              )}
            />
          </>
        ) : null}
      </div>
      <span className="sr-only">Toggle Theme</span>
    </CustomButton>
  );
}
