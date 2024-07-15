"use client";

import { List } from "@prisma/client";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/useAction";
import { deleteList } from "@/actions/deleteList";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/copyList";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}
export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`${data.title} Deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`${data.title} Copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  const handleDelete = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeDelete({ id, boardId });
  };

  const handleCopy = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeCopy({ id, boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="h-auto w-auto p-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-semibold text-center text-neutral-600">
          List actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2"
            variant={"ghost"}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          variant={"ghost"}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
        >
          Add card...
        </Button>
        <form action={handleCopy}>
          <input hidden name="id" id="id" value={data.id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <FormSubmit
            variant={"ghost"}
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy list...
          </FormSubmit>
        </form>
        <Separator />
        <form action={handleDelete}>
          <input hidden name="id" id="id" value={data.id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <FormSubmit
            variant={"ghost"}
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Delete this list...
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
