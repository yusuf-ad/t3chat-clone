/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "./ui/button";
import Link from "next/link";

export default function ErrorMessage({
  chatError,
  error,
}: {
  chatError: any;
  error: any;
}) {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-2 pt-14">
      <div className="text-sidebar-text-muted text-center">
        <h1 className="mb-4 text-3xl font-bold">
          {/* Show 404 if chatError or error, otherwise try to show status if available */}
          {(() => {
            // Try to get a status code from either error if available
            // Most likely, these are generic Error objects, so fallback to 404
            const status =
              (typeof (chatError as any)?.statusCode === "number" &&
                (chatError as any).statusCode) ||
              (typeof (error as any)?.statusCode === "number" &&
                (error as any).statusCode) ||
              404;
            return status;
          })()}{" "}
          -{" "}
          {chatError?.cause?.toString?.() ||
            error?.cause?.toString?.() ||
            chatError?.message ||
            error?.message ||
            "Unknown error"}
        </h1>

        <p className="mb-8 text-gray-500">Oops, something went wrong.</p>

        <Button
          asChild
          className="bg-sidebar-button hover:bg-sidebar-button-hover py-5 shadow-xl hover:cursor-pointer dark:text-white"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
