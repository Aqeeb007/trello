import { z } from "zod";

export const UpdateBoard = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).min(3, {
        message: "Length should be greater than 3"
    }),
    id: z.string()
});
