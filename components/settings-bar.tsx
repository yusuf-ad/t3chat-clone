import { Button } from "./ui/button";
import { Settings2 } from "lucide-react";
import ModeToggle from "./mode-toggle";

export function SettingsBar() {
  return (
    <div
      className={`bg-sidebar fixed top-2 right-2 z-10 hidden items-center gap-1 rounded-lg p-1 md:flex`}
    >
      <Button className="text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar z-20 h-8 w-8 cursor-pointer shadow-none">
        <Settings2 />
        <span className="sr-only">Settings</span>
      </Button>

      <ModeToggle />
    </div>
  );
}
