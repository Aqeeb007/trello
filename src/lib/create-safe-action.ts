import { string, z } from "zod"

export type FieldError<T> = {
    [K in keyof T]?: string[]
}

export type ActionState<TInput, TOutPut> = {
    fieldErrors?: FieldError<TInput>
    error?: null | string
    data?: TOutPut
}


export const safeAction = <TInput, TOutPut>(schema: z.Schema<TInput>, handler: (input: TInput) => Promise<ActionState<TInput, TOutPut>>) => {
    return async (input: TInput) => {
        const validated = schema.safeParse(input)
        if (!validated.success) {
            return {
                fieldErrors: validated.error.flatten().fieldErrors
            }
        }

        return handler(validated.data)
    }
}