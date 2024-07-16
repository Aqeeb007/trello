"use client";

import { createCard } from "@/actions/createCard";
import { CreateCard } from "@/actions/createCard/schema";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { forwardRef, useRef, ElementRef, KeyboardEventHandler } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams();
    const fromRef = useRef<ElementRef<"form">>(null);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(fromRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e,
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        fromRef.current?.requestSubmit();
      }
    };

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card ${data.title} Created`);
        fromRef.current?.reset();
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;

      execute({ title, listId, boardId: params.boardId as string });
      disableEditing();
    };

    if (isEditing) {
      return (
        <form
          ref={fromRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter a title"
            errors={fieldErrors}
          />
          <input hidden id="listId" name="listId" value={listId} />
          <FormSubmit>Add a card</FormSubmit>
          <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
            <X className="h-4 w-4" />
          </Button>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          variant={"ghost"}
          size={"sm"}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  },
);

CardForm.displayName = "CardForm";
