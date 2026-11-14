import { SandboxProvider, StartReplInterface } from "../interfaces/sandbox.interface.ts";

export class FirecrackerProvider implements SandboxProvider {

    createContainer(): Promise<string> {
        
    }

    deleteContainer(id: string): Promise<void> {
        
    }

    writeToRepl(id: string, input: string): void {
        
    }

    executeCommand(id: string, command: string): Promise<unknown> {
        
    }

    startRepl(id: string): Promise<StartReplInterface> {
        
    }

    stopRepl(id: string): void {
        
    }

    getReplEmitter(sessionId: string): import("events") | undefined {
        
    }
}