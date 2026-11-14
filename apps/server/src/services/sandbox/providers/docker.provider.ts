import Docker from "dockerode"
import { EventEmitter } from "stream";
import { SandboxProvider, StartReplInterface } from "../interfaces/sandbox.interface.ts";

export class DockerProvider implements SandboxProvider {

    private docker: Docker

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
            Cmd: ["/bin/bash"],
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

    deleteContainer(id: string): Promise<void> {
        
    }

    executeCommand(id: string, command: string): Promise<unknown> {
        
    }

    startRepl(id: string): Promise<StartReplInterface> {
        
    }

    stopRepl(id: string): void {
        
    }

    writeToRepl(id: string, input: string): void {
        
    }

    getReplEmitter(sessionId: string): EventEmitter | undefined {
        
    }
}