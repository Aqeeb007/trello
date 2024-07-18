"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { UpdateCard } from "./schema"
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

    const { id, boardId, ...values } = data

    let card
    try {

        card = await db.card.update({
            where: {
                id,
                boardId,
                list: {
                    board: {
                        orgId
                    }
                }
            },
            data: {
                ...values
            }
        })

        await createAuditLog({
            action: ACTION.UPDATE,
            entityType: ENTITY_TYPE.CARD,
            entityTitle: card.title,
            entityId: card.id
        })

    } catch (error) {
        console.log("handler ~ error:", error)
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/board/${id}`)

    return { data: card }
}

export const updateCard = safeAction(UpdateCard, handler)