"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { DeleteCard } from "./schema"
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

    const { id, boardId } = data

    let card
    try {
        card = await db.card.delete({
            where: {
                id,
                boardId,
                list: {
                    board: {
                        orgId
                    }
                }
            },

        })

        await createAuditLog({
            action: ACTION.DELETE,
            entityType: ENTITY_TYPE.CARD,
            entityTitle: card.title,
            entityId: card.id
        })

    } catch (error) {
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/board/${boardId}`)

    return { data: card }
}

export const deleteCard = safeAction(DeleteCard, handler)