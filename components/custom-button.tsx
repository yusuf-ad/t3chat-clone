import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function CustomButton({
  children,
  className,
  description,
  ...props
}: React.ComponentProps<typeof Button> & { description?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar z-20 h-8 w-8 cursor-pointer shadow-none",
            className,
          )}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      {description && (
        <TooltipContent
          side="bottom"
          className="bg-sidebar-border-light border-sidebar-border border-2 text-black dark:text-white"
        >
          {description}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
