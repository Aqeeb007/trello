"use client";

import { createBoard } from "@/actions/createBoard";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { useAction } from "@/hooks/useAction";

export const CreateBoardForm = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log("data: ", data);
    },
    onError: (error) => {
      console.log("error: ", error);
    },
    onComplete: () => {
      console.log("completed");
    },
  });

  const onSubmit = (fromData: FormData) => {
    const title = fromData.get("title") as string;
    execute({ title });
  };

  return (
    <form action={onSubmit}>
      <FormInput label="Board Title" id="title" errors={fieldErrors} />
      <FormSubmit>Save</FormSubmit>
    </form>
  );
};
