"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { UpdateCardOrder } from "./schema"
import { InputType, ReturnType } from "./types"


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { items, boardId } = data

    let updatedCards

    try {

        const transaction = items.map((item) =>
            db.card.update({
                where: {
                    id: item.id,
                    list: {
                        board: {
                            orgId
                        }
                    }
                },
                data: {
                    order: item.order,
                    listId: item.listId
                }
            })
        )

        updatedCards = await db.$transaction(transaction)

    } catch (error) {
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/board/${boardId}`)

    return { data: updatedCards }
}

export const updatedCardOrder = safeAction(UpdateCardOrder, handler)