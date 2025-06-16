import { Settings2 } from "lucide-react";
import ModeToggle from "./mode-toggle";
import CustomButton from "./custom-button";
import Link from "next/link";

export function SettingsBar() {
  return (
    <div
      className={`bg-sidebar fixed top-2 right-2 z-10 hidden items-center gap-1 rounded-lg p-1 md:flex`}
    >
      <CustomButton
        description="Settings"
        className="text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar z-20 h-8 w-8 cursor-pointer shadow-none"
        asChild
      >
        <Link href="/settings">
          <Settings2 />
          <span className="sr-only">Settings</span>
        </Link>
      </CustomButton>

      <ModeToggle />
    </div>
  );
}
