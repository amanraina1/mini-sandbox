import { Request, Response } from "express";
import { SandboxService } from "../services/sandbox/sandbox.service.ts";

export class SandboxController {

    constructor(private readonly sandboxService: SandboxService) {}

    getContainers = async (req: Request, res: Response) => {

        try {
            const sandboxes = await this.sandboxService.getContainers();

            res.json({ message: "Fetched all containers", success: true, sandboxes });

        } catch (err) {

            console.log(err);

            res.status(400).json({ err, success: false, message: "Faced error in server" });
        }
    };

    createContainer = async (req: Request, res: Response) : Promise<void> => {

        try {
            const sandboxId = await this.sandboxService.createContainer();

            res.json({ message: "Created new container", success: true, sandboxId });

        } catch (err) {

            console.log(err);

            res.status(400).json({ err, success: false, message: "Faced error in server" });
        }
    }
}