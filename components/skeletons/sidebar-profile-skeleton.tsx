import { Skeleton } from "../ui/skeleton";

export default function SidebarProfileSkeleton() {
  return (
    <div className="border-t">
      <div className="mb-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3">
        {/* Avatar skeleton */}
        <Skeleton className="dark:bg-sidebar-border-light h-8 w-8 rounded-full bg-purple-300" />

        <div className="flex flex-col items-start justify-center gap-1">
          {/* Name skeleton */}
          <Skeleton className="dark:bg-sidebar-border-light h-4 w-20 bg-purple-300" />
          {/* "Pro" text skeleton */}
          <Skeleton className="dark:bg-sidebar-border-light h-3 w-6 bg-purple-300" />
        </div>
      </div>
    </div>
  );
}
