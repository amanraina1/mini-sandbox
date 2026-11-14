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
}
