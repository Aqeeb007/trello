"use client"

import { ActionState, FieldError } from "@/lib/create-safe-action";
import { useState, useCallback } from "react";


type Action<TInput, TOutput> = (data: TInput) => Promise<ActionState<TInput, TOutput>>

interface UseActionOptions<TOutput> {
    onSuccess?: (data: TOutput) => void
    onError?: (error: string) => void
    onComplete?: () => void
}

export const useAction = <TInput, TOutput>(action: Action<TInput, TOutput>, options: UseActionOptions<TOutput> = {}) => {

    const [fieldErrors, setFieldErrors] = useState<FieldError<TInput> | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const [data, setData] = useState<TOutput | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)


    const execute = useCallback(async (data: TInput) => {
        setIsLoading(true)
        try {
            const res = await action(data)

            if (!res) return
            setFieldErrors(res.fieldErrors)
            if (res.error) {
                setError(res.error)
                options.onError?.(res.error)
            }
            if (res.data) {
                setData(res.data)
                options.onSuccess?.(res.data)

            }

        } catch (error) {
            console.log('error: ', error);

        } finally {
            setIsLoading(false)
            options.onComplete?.()
        }

    }, [action, options])

    return { fieldErrors, error, data, isLoading, execute }
}