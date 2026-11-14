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

    stopRepl = async (req: Request, res: Response) => {

        const sessionId = req.params.sessionId?.toString();

        try {

            if(!sessionId) {
                res.status(401).json({ message: "no session id shared", success: false });
                return;
            }

            this.sandboxService.stopRepl(sessionId)
            
            res.json({ success: true, message: "REPL stopped successfully" });

        } catch (err) {

            console.log(err);

            res.status(400).json({ err, success: false, message: "Failed to stop REPL" });
        }
    };

    writeToRepl = async (req: Request, res: Response) => {
        const sessionId = req.params.sessionId?.toString();
        const { input } = req.body;
        console.log(`[REPL INPUT] Received input for sessionId: ${sessionId}, input: "${input}"`);

        try {
            if (!input) {
                console.log(`[REPL INPUT] ERROR: No input provided for sessionId: ${sessionId}`);
                res.status(400).json({ message: "Input is required", success: false });
                return;
            }

            if (!sessionId) {
                console.log('[REPL INPUT] ERROR: No session id provided');
                res.status(400).json({ message: "Session Id is required", success: false });
                return;
            }

            console.log(`[REPL INPUT] Writing input to REPL for sessionId: ${sessionId}`);
            this.sandboxService.writeToRepl(sessionId, input)
            console.log(`[REPL INPUT] Input written successfully for sessionId: ${sessionId}`);

            res.json({ success: true, message: "Input sent successfully" });
        } catch (err) {
            console.error(`[REPL INPUT] ERROR for sessionId ${sessionId}:`, err);
            res.status(400).json({
            err: err instanceof Error ? err.message : err,
            success: false,
            message: "Failed to send input",
            });
        }
    }

    getEmitter = async (req: Request, res: Response) => {

        const sessionId = req.params.sessionId?.toString();

        const emitter = this.sandboxService.getReplEmitter(sessionId!);

        // Set basic CORS headers for SSE
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Set SSE headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

        res.write('data: {"type": "connected"}\n\n');

        const outputHandler = (data: string) => {
            console.log(
            `[REPL STREAM] Output received for sessionId ${sessionId}:`,
            data
            );
            res.write(`data: ${JSON.stringify({ type: "output", data })}\n\n`);
        };

        const endHandler = () => {
            console.log(`[REPL STREAM] End event received for sessionId: ${sessionId}`);
            res.write('data: {"type": "end"}\n\n');
            res.end();
        };

        emitter.on("output", outputHandler);
        emitter.on("end", endHandler);

        res.on("close", () => {
            console.log(`[REPL STREAM] Connection closed for sessionId: ${sessionId}`);
            emitter.off("output", outputHandler);
            emitter.off("end", endHandler);
        });

        res.on("error", (error) => {
            console.error(
            `[REPL STREAM] Connection error for sessionId ${sessionId}:`,
            error
            );
            emitter.off("output", outputHandler);
            emitter.off("end", endHandler);
        });

        req.on("close", () => {
            console.log(
            `[REPL STREAM] Client disconnected for sessionId: ${sessionId}`
            );
            emitter.off("output", outputHandler);
            emitter.off("end", endHandler);
        });
    }
}