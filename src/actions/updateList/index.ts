"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { UpdateList } from "./schema"
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

    const { title, id, boardId } = data

    let list
    try {
        list = await db.list.update({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
            data: {
                title,
            }
        })

        await createAuditLog({
            action: ACTION.UPDATE,
            entityType: ENTITY_TYPE.LIST,
            entityTitle: list.title,
            entityId: list.id
        })

    } catch (error) {
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/board/${boardId}`)

    return { data: list }
}

export const updateList = safeAction(UpdateList, handler)