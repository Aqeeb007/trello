"use server"

import { safeAction } from "@/lib/create-safe-action"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { CreateBoard } from "./schema"
import { InputType, ReturnType } from "./types"


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, image } = data
    const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUsername] = image.split("|")

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUsername) {
        return {
            error: "Missing image data. Failed to create board"
        }
    }

    let board
    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,
                imageUsername,
            }
        })
    } catch (error) {
        return {
            error: "Database Error"
        }
    }

    revalidatePath(`/organization/${board.id}`)

    return { data: board }
}

export const createBoard = safeAction(CreateBoard, handler)