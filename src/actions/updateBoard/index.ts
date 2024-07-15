"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { UpdateBoard } from "./schema"
import { InputType, ReturnType } from "./types"


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, id } = data

    let board
    try {
        board = await db.board.update({
            where: {
                id,
                orgId
            },
            data: {
                title,
            }
        })
    } catch (error) {
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/board/${id}`)

    return { data: board }
}

export const updateBoard = safeAction(UpdateBoard, handler)