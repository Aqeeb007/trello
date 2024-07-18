"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { CopyCard } from "./schema"
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

    const { id, boardId } = data

    let card
    try {
        const cardToCopy = await db.card.findUnique({
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

        if (!cardToCopy) {
            return {
                error: "Card not found"
            }
        }

        const lastCard = await db.card.findFirst({
            where: {
                boardId
            },
            orderBy: {
                order: "desc"
            },
            select: { order: true }
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1

        card = await db.card.create({
            data: {
                title: `${cardToCopy.title}-Copy`,
                description: cardToCopy.description,
                order: newOrder,
                listId: cardToCopy.listId,
                boardId,
            },
        })

        await createAuditLog({
            action: ACTION.CREATE,
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

    revalidatePath(`/board/${boardId}`)

    return { data: card }
}

export const copyCard = safeAction(CopyCard, handler)