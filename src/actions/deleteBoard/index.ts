"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { DeleteBoard } from "./schema"
import { InputType, ReturnType } from "./types"
import { redirect } from "next/navigation"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"


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

        await createAuditLog({
            action: ACTION.DELETE,
            entityType: ENTITY_TYPE.BOARD,
            entityTitle: board.title,
            entityId: board.id
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