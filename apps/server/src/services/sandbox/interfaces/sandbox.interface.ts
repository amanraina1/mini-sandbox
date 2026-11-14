import { EventEmitter } from "stream";

export interface StartReplInterface {
    emitter: EventEmitter,
    sessionId: string
}

export interface SandboxProvider {

    createContainer() : Promise<string>;

    deleteContainer(id: string) : Promise<void>

    executeCommand(id: string, command: string): Promise<unknown>

    startRepl(id: string) : Promise<StartReplInterface>

    stopRepl(id: string) : void;

    writeToRepl(id: string, input: string) : void;

    getReplEmitter(sessionId: string): EventEmitter | undefined;
}