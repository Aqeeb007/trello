"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { CreateCard } from "./schema"
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

    const { title, boardId, listId } = data

    let card

    try {

        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId
                }
            },

        })

        if (!list) {
            return {
                error: "List not found"
            }
        }


        const lastCard = await db.
            card.findFirst({
                where: {
                    listId
                },
                orderBy: {
                    order: "desc"
                },
                select: { order: true }
            })

        const newOrder = lastCard ? lastCard.order + 1 : 1


        card = await db.card.create({
            data: {
                title,
                listId,
                boardId,
                order: newOrder,
            }
        })

        await createAuditLog({
            action: ACTION.CREATE,
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

export const createCard = safeAction(CreateCard, handler)