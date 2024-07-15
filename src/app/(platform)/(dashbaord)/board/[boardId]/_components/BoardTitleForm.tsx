"use client";

import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { updateBoard } from "@/actions/updateBoard";
import { useAction } from "@/hooks/useAction";
import { toast } from "sonner";

interface BoardTitleFormProps {
  board: Board;
}

export const BoardTitleForm = ({ board }: BoardTitleFormProps) => {
  const fromRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(board.title);
  const [isEditing, setIsEditing] = useState(false);
  const { execute, fieldErrors } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board "${data.title}" updated`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    execute({ title, id: board.id });
    setIsEditing(false);
  };

  const onBlur = () => {
    fromRef.current?.requestSubmit();
  };

  if (isEditing) {
    return (
      <form
        action={onSubmit}
        ref={fromRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          id="title"
          ref={inputRef}
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold p-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant={"transparent"}
      className="font-bold h-auto w-auto p-1 px-2 text-lg"
    >
      {title}
    </Button>
  );
};
