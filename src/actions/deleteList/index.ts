"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { DeleteList } from "./schema"
import { InputType, ReturnType } from "./types"
import { redirect } from "next/navigation"


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data

    let list
    try {
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },

        })
    } catch (error) {
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/board/${boardId}`)

    return { data: list }
}

export const deleteList = safeAction(DeleteList, handler)