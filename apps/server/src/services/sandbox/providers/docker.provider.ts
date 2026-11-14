import Docker from "dockerode"
import { EventEmitter } from "events";
import { SandboxProvider, StartReplInterface } from "../interfaces/sandbox.interface.ts";

export class DockerProvider implements SandboxProvider {

    private docker: Docker

    private replSessions = new Map<string, {
        stream: NodeJS.ReadWriteStream
        emitter: EventEmitter
    }>();

    constructor(socketPath: string = '/var/run/docker.sock') {
        this.docker = new Docker({ socketPath })
    }

    async createContainer(): Promise<string> {
        
        const images = await this.docker.listImages();
        const imageExists = images.some(img => img.RepoTags && img.RepoTags.includes("ubuntu:latest"));

        if(!imageExists) {
            console.log("Pulling latest ubuntu image. Please wait....")
            await this.docker.pull("ubuntu:latest")
            console.log("Image pulled successfully")
        }

        const container = await this.docker.createContainer({
            Image: "ubuntu:latest",
            Cmd: ["/bin/sh"],
            OpenStdin: true,
            Tty: true,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true
        })

        console.log(container.id)
        await container.start()
        console.log((await container.logs({stderr: true,stdout: true})).toString())
        return container.id
    }

    async deleteContainer(id: string): Promise<void> {
        const container = this.docker.getContainer(id);

        await container.stop();
        await container.remove();

        console.log(await this.docker.listContainers());

        return;
    }

    async startRepl(id: string): Promise<string> {

        try {
            // get the container from the docker
            const dockerContainer = this.docker.getContainer(id)

            // we need to establish the stream with the docker
            const exec = await dockerContainer.exec({
                Cmd: ["/bin/sh"],
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true
            });

            const stream = await exec.start({
                stdin: true,
                hijack: true
            });

            // we need to geenrate session id and attach the docker stream and the event emitter
            const emitter = new EventEmitter()

            // attach the callbacks to the docker stream event
            stream.on("data", (chunk: Buffer) => {
                const rawData = chunk.toString();
                const cleanData = this.cleanTerminalOutput(rawData);

                if (cleanData) {
                    console.log(
                    `[DOCKER REPL] Emitting output for container ${id}:`,
                    cleanData
                    );
                    emitter.emit("output", cleanData);
                }
            });

            stream.on("end", () => {
                console.log(`[DOCKER REPL] Stream ended for container: ${id}`);
                emitter.emit("end")
            })

            stream.on("error", (err) => {
                console.error(`[DOCKER REPL] Stream error for container ${id}:`, err);
                emitter.emit("error", err)
            })

            let sessionId = crypto.randomUUID();
            this.replSessions.set(sessionId, {stream, emitter});

            return sessionId;

        } catch (err) {
            
            console.error(`[DOCKER REPL] Error starting REPL for container ${id}:`, err);
            throw err;
        }
    }

    stopRepl(id: string): void {
        
    }

    writeToRepl(id: string, input: string): void {
        
    }

    getReplEmitter(sessionId: string): EventEmitter | undefined {
        
    }

    cleanTerminalOutput = (data: string): string => {
        return data
            .replace(/\u0001/g, "") // Remove SOH (Start of Heading)
            .replace(/\u0000/g, "") // Remove NULL characters
            .replace(/\u0008/g, "") // Remove backspace
            .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "") // Remove ANSI escape sequences
            .replace(/\u001b\[6n/g, "") // Remove specific cursor position query
            .replace(/\r\n/g, "\n") // Normalize line endings
            .replace(/\r/g, "\n") // Convert remaining \r to \n
            .trim(); // Remove leading/trailing whitespace
    };
}