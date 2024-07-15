"use client";

import { Plus, X } from "lucide-react";
import { useState, useRef, ElementRef } from "react";
import { ListWrapper } from "./ListWrapper";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { createList } from "@/actions/createList";
import { toast } from "sonner";

interface ListFromProps {}

export const ListFrom = () => {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState("");
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const disableEditing = () => {
    setIsEditing(false);
    setTitle("");
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} created`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = (fromData: FormData) => {
    const title = fromData.get("title") as string;
    const boardId = fromData.get("boardId") as string;

    execute({ title, boardId });
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          action={onSubmit}
          className="w-full rounded-md p-3 bg-white space-y-4  shadow-md"
        >
          <FormInput
            ref={inputRef}
            errors={fieldErrors}
            id="title"
            placeholder="Enter list title"
            className="text-sm px-2 py-1 h-7 font-medium bg-transparent hover:border-input focus:border-input transition"
          />
          <input value={params.boardId} hidden name="boardId" />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add list</FormSubmit>
            <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};

{
  /* <form
action=""
className="w-full rounded-md p-3 bg-white space-y-4  shadow-md"
> */
}
