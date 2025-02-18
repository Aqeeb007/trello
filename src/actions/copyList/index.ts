"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { CopyList } from "./schema"
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

    let list
    try {
        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
            include: {
                cards: true
            }
        })

        if (!listToCopy) {
            return {
                error: "List not found"
            }
        }

        const lastList = await db.list.findFirst({
            where: {
                boardId
            },
            orderBy: {
                order: "desc"
            },
            select: { order: true }
        })

        const newOrder = lastList ? lastList.order + 1 : 1

        list = await db.list.create({
            data: {
                title: `${listToCopy.title}-Copy`,
                order: newOrder,
                boardId,
                cards: {
                    create: listToCopy?.cards.map((card) => ({
                        title: card.title,
                        description: card.description,
                        order: card.order
                    }))
                }
            },
            include: { cards: true }
        })

        await createAuditLog({
            action: ACTION.CREATE,
            entityType: ENTITY_TYPE.LIST,
            entityTitle: list.title,
            entityId: list.id
        })

    } catch (error) {
        console.log("handler ~ error:", error)
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/board/${boardId}`)

    return { data: list }
}

export const copyList = safeAction(CopyList, handler)