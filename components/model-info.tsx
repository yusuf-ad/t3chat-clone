import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function ModelInfo({ modelInfo }: { modelInfo: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="cursor-pointer p-1">
          <Info className="h-3 w-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-sidebar-border-light border-sidebar-border border-2 text-black dark:text-white">
        <p>{modelInfo}</p>
      </TooltipContent>
    </Tooltip>
  );
}
