import { prisma } from "db/client"
import type { Request, Response } from "express"

async function getSandboxes(req: Request, res: Response) {
    const sandboxes = await prisma.sandbox.findMany()
    res.status(200).json({message: "success", sandboxes})
}

export {
    getSandboxes
}