import CustomButton from "@/components/custom-button";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons/google-icon";
import { SignInButton } from "@clerk/nextjs";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="bg-sidebar flex min-h-screen flex-col">
      {/* Back to Chat */}
      <div className="absolute top-4 left-4">
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
      </div>
      {/* Centered Card */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center rounded-xl px-8 py-10">
          <h1 className="mb-2 text-center text-2xl font-semibold">
            Welcome to{" "}
            <span className="font-bold text-purple-600">T3.chat</span>
          </h1>
          <p className="text-text-muted dark:text-muted-foreground mb-8 text-center">
            Sign in below (we&apos;ll increase your message limits if you do{" "}
            <span className="align-middle">😏</span>)
          </p>
          <div className="relative mb-6 w-full max-w-sm rounded-lg bg-gradient-to-r from-purple-600 via-purple-950 to-purple-700 p-[1px]">
            <SignInButton mode="redirect">
              <Button className="bg-interactive-primary text-interactive-ghost hover:bg-interactive-primary-hover flex h-14 w-full cursor-pointer items-center justify-center gap-4 rounded-lg py-4 text-base font-semibold shadow-sm transition dark:bg-purple-300 dark:text-purple-950 dark:hover:bg-purple-400">
                <GoogleIcon />
                Continue with Google
              </Button>
            </SignInButton>
          </div>
          <p className="dark:text-muted-foreground text-center text-xs">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-purple-700 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-purple-700 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
