declare module "jarvis" {
    type HandlerArg = { args: any, context?: Jarvis };

    export default class Jarvis {
        constructor();

        addCommand(arg: { command: string, aliases?: string[], handler: (handlerArg: HandlerArg) => Promise<any> | any, help?: string }): void;

        addScriptMode(extension: string, script: string, envFile: string): Promise<any>;

        setCommandState(state: any): void;

        startCommand(name: string): void;
        endCommand(): void;

        send(value: string): any;

        on(event: string, callback: (arg: any) => void): void;
    }
}
