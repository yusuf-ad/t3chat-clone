import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function CustomButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "text-sidebar-logo hover:bg-sidebar-border-light bg-sidebar z-20 h-8 w-8 cursor-pointer shadow-none",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
