"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { UpdateBoard } from "./schema"
import { InputType, ReturnType } from "./types"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"


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

        await createAuditLog({
            action: ACTION.UPDATE,
            entityType: ENTITY_TYPE.BOARD,
            entityTitle: board.title,
            entityId: board.id
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