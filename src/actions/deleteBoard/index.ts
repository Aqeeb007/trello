"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { DeleteBoard } from "./schema"
import { InputType, ReturnType } from "./types"
import { redirect } from "next/navigation"


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id } = data

    let board
    try {
        board = await db.board.delete({
            where: {
                id,
                orgId
            },

        })
    } catch (error) {
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/organization/${orgId}`)

    redirect(`/organization/${orgId}`)
}

export const deleteBoard = safeAction(DeleteBoard, handler)