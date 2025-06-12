import CustomButton from "@/components/custom-button";
import ModeToggle from "@/components/mode-toggle";
import { SignOutButton } from "@clerk/nextjs";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col overflow-y-auto px-4 pt-6 md:px-6 lg:px-8">
      {/* Back to Chat */}
      <div className="flex items-center justify-between">
        <CustomButton
          asChild
          className="hover:bg-sidebar-border-light! w-auto bg-transparent px-4 py-2"
          variant="ghost"
        >
          <Link
            href="/"
            className="text-primary flex items-center gap-3 text-sm font-semibold"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Chat
          </Link>
        </CustomButton>

        <div className="flex items-center gap-2">
          <ModeToggle className="bg-transparent" />

          <SignOutButton>
            <CustomButton
              className="hover:bg-sidebar-border-light! h-auto w-auto bg-transparent"
              variant="ghost"
            >
              Sign out
            </CustomButton>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
