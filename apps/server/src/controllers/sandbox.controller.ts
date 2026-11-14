import { Request, Response } from "express";
import { SandboxService } from "../services/sandbox/sandbox.service.ts";
import { NotFoundError } from "../errors/notFound.ts";

export class SandboxController {

    constructor(private readonly sandboxService: SandboxService) {}

    getContainers = async (req: Request, res: Response) : Promise<void> => {

        try {
            const sandboxes = await this.sandboxService.getContainers();

            res.json({ message: "Fetched all containers", success: true, sandboxes });

        } catch (err) {

            console.error("[SERVER GET] ERROR:", err);
            res.status(400).json({ err, success: false, message: "Faced error in server" });
        }
    };

    createContainer = async (req: Request, res: Response) : Promise<void> => {

        try {
            const sandboxId = await this.sandboxService.createContainer();

            res.json({ message: "Created new container", success: true, sandboxId });

        } catch (err) {

            console.error("[SERVER CREATE] ERROR:", err);
            res.status(500).json({ message: "Faced error in server", success: false, err });
        }
    };

    deleteContainer = async (req: Request, res: Response) => {
        
        const sandboxId = req.query.id?.toString();

        try {

            if (!sandboxId) {
                res.status(401).json({ message: "no sandbox id shared", success: false });
                return;
            }

            await this.sandboxService.deleteContainer(sandboxId)

            res.json({ message: "Deleted the sandbox successfully", success: true });

        } catch (err) {

            if(err instanceof NotFoundError) {
                res.status(404).json({ message: err.message })
            }

            console.error("[SERVER DELETE] ERROR:", err);
            res.status(500).json({message: "Faced error in the server", success: false, err})
        }
    };

    startRepl = async (req: Request, res: Response) => {

        const sandboxId = req.params.id?.toString();

        try {
            if (!sandboxId) {
                res.status(401).json({ message: "no sandbox id shared", success: false });
                return;
            }

            const sessionId = await this.sandboxService.startRepl(sandboxId);

            console.log(`[REPL START] REPL started successfully with sessionId: ${sessionId}`);

            res.json({ message: "Started the REPL successfully", success: true });

        } catch (err) {

            console.error(`[REPL START] ERROR:`, err);
            res.status(400).json({
            err: err instanceof Error ? err.message : err,
            success: false,
            message: "Failed to start REPL",
            });
        }
    };
}