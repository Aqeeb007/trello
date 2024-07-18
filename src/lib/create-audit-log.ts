import { auth, currentUser } from "@clerk/nextjs/server"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { db } from "./db"

interface AuditLogProps {
    entityId: string
    entityType: ENTITY_TYPE
    action: ACTION
    entityTitle: string
}

export const createAuditLog = async (props: AuditLogProps) => {
    try {
        const { orgId } = auth()
        const user = await currentUser()

        if (!user || !orgId) {
            throw new Error("Unauthorized")
        }

        const { action, entityId, entityTitle, entityType } = props

        const username = user.firstName || ""
        const log = await db.auditLog.create({
            data: {
                action,
                entityId,
                entityType,
                entityTitle,
                userId: user.id,
                userImage: user?.imageUrl,
                username,
                orgId,
            }
        })

    } catch (error) {
        console.log("createAuditLog ~ error:", error)

    }
}