import { EventEmitter } from "stream";
import { SandboxProvider, StartReplInterface } from "../interfaces/sandbox.interface.ts";

export class DockerProvider implements SandboxProvider {

    private socketPath: string

    constructor(socketPath: string) {
        this.socketPath = socketPath
    }

    async createContainer(): Promise<string> {
        
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