import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { cardId: string } }) {

    try {
        const { userId, orgId } = auth()

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const logs = await db.auditLog.findMany({
            where: {
                entityId: params.cardId,
                entityType: ENTITY_TYPE.CARD,
                orgId
            },
            orderBy: {
                createAt: "desc"
            },
            take: 6
        })

        return NextResponse.json(logs)
    } catch (error) {
        console.log("GET ~ error:", error)
        return new NextResponse("Internal server error")
    }

}