import { z } from "zod";

export const CreateList = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }),
    boardId: z.string()
});
