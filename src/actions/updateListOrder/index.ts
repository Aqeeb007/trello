"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { UpdateListOrder } from "./schema"
import { InputType, ReturnType } from "./types"


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { items, boardId } = data

    let lists

    try {

        const transaction = items.map((item) =>
            db.list.update({
                where: {
                    id: item.id,
                    board: {
                        orgId
                    }
                },
                data: {
                    order: item.order
                }
            })
        )

        lists = await db.$transaction(transaction)

    } catch (error) {
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/board/${boardId}`)

    return { data: lists }
}

export const updatedListOrder = safeAction(UpdateListOrder, handler)