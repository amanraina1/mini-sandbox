import { NotFoundError } from "../../errors/notFound.ts";
import { SandboxProvider } from "./interfaces/sandbox.interface.ts";
import { prisma } from "db/client"

export class SandboxService {

    constructor(private readonly provider: SandboxProvider) {}

    async createContainer() : Promise<string> {

        let containerId = await this.provider.createContainer();

        const sandbox = await prisma.sandbox.create({
            data: {
                containerId,
                status: "active"
            }
        });

        return sandbox.id
    }

    async getContainers() {

        let containers = await prisma.sandbox.findMany()

        return containers;
    }

    async deleteContainer(sandboxId: string) {

        const sandbox = await prisma.sandbox.findFirst({
            where: {
                id: sandboxId,
                status: "active",
            },
        });

        if (!sandbox) {
            throw new NotFoundError("invalid sandbox id shared")
        }

        await this.provider.deleteContainer(sandbox.containerId);

        await prisma.sandbox.update({
            where: {
                id: sandboxId,
            },
            data: {
                status: "deleted",
            },
        });
    }

    async startRepl(sandboxId: string) {

        const sandboxExists = await prisma.sandbox.findFirst({
            where: {
                id: sandboxId
            }
        });

        if(!sandboxExists) {
            throw new NotFoundError("Sandbox with this id doesn't exists")
        }

        const sessionId = await this.provider.startRepl(sandboxId)

        return sessionId;
    }

    stopRepl(sessionId: string) {

        this.provider.stopRepl(sessionId);
    }

    async writeToRepl(sessionId: string, input: string) {

        this.provider.writeToRepl(sessionId, input);
    }

    getReplEmitter(sessionId: string) {

        let emitter = this.provider.getReplEmitter(sessionId);

        if (!emitter) {
            console.log(
            `[REPL STREAM] ERROR: Session not found for sessionId: ${sessionId}`
            );
            throw new NotFoundError("Session not found")
        }

        return emitter;
    }
}
