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
        <button className="p-1 ">
          <Info className="h-3 w-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-sidebar-border-light text-black border-2 border-sidebar-border">
        <p>{modelInfo}</p>
      </TooltipContent>
    </Tooltip>
  );
}
