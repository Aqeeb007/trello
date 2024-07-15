"use client";

import { updateList } from "@/actions/updateList";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/useAction";
import { List } from "@prisma/client";
import React, { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { ListOptions } from "./ListOptions";

interface ListHeaderProps {
  data: List;
}

export const ListHeader = ({ data }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const fromRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

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

  const onBlur = () => {
    fromRef.current?.requestSubmit();
  };

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to ${data.title}`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      fromRef.current?.requestSubmit();
    }
  };

  useEventListener("keydown", onKeyDown);

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) {
      disableEditing();
      return;
    }

    execute({ title, id, boardId });
    setIsEditing(false);
  };

  return (
    <div className="flex pt-2 px-2 text-sm font-semibold justify-between items-start gap-x-2">
      {isEditing ? (
        <form action={onSubmit} ref={fromRef} className="flex-1 px-[2px]">
          <input hidden name="id" id="id" value={data.id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <FormInput
            id="title"
            ref={inputRef}
            defaultValue={title}
            onBlur={onBlur}
            className="text-sm font-medium px-[7px] w-full py-1 h-7 border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <ListOptions data={data} onAddCard={() => {}} />
    </div>
  );
};
