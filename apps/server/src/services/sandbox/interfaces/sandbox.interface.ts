import { EventEmitter } from "stream";

export interface StartReplInterface {
    emitter: EventEmitter,
    sessionId: string
}

export interface SandboxProvider {

    createContainer() : Promise<string>;

    deleteContainer(id: string) : Promise<void>

    startRepl(id: string) : Promise<string>

    stopRepl(id: string) : Promise<string>;

    writeToRepl(id: string, input: string) : void;

    getReplEmitter(sessionId: string): EventEmitter | undefined;
}