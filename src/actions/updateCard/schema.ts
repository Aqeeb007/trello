import { z } from "zod";

export const UpdateCard = z.object({
    title: z.optional(z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).min(3, {
        message: "Length should be greater than 3"
    })),
    description: z.optional(z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string"
    }).min(3, {
        message: "Length should be greater than 3"
    })),
    id: z.string(),
    boardId: z.string()

});
