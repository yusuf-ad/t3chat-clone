"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomButton from "./custom-button";
import { Trash2 } from "lucide-react";

export function DeleteChatDialog({
  title,
  chatId,
  onDelete,
}: {
  title: string;
  chatId: string;
  onDelete: (chatId: string) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton className="hover:bg-sidebar-button-hover hover:text-white">
          <Trash2 />
        </CustomButton>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="">Delete Thread</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{title}&quot;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <CustomButton
              className="dark:hover:bg-sidebar-border-light! w-auto cursor-pointer bg-transparent py-5"
              variant="ghost"
            >
              Cancel
            </CustomButton>
          </DialogClose>
          <CustomButton
            onClick={() => onDelete(chatId)}
            type="submit"
            variant="destructive"
            className="bg-destructive/60 hover:bg-destructive/50 dark:hover:bg-destructive/70 text-muted w-auto cursor-pointer py-5 dark:text-white"
          >
            Delete
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
