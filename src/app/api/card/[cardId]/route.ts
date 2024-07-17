import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { cardId: string } }) {

    try {
        const { userId, orgId } = auth()

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const card = await db.card.findUnique({
            where: {
                id: params.cardId, list: {
                    board: {
                        orgId
                    }
                }
            },
            include: {
                list: {
                    select: {
                        title: true
                    }
                }
            }
        })

        if (!card) {
            return new NextResponse("Card not found", { status: 404 })
        }

        return NextResponse.json(card)
    } catch (error) {
        console.log("GET ~ error:", error)
        return new NextResponse("Internal server error")
    }

}