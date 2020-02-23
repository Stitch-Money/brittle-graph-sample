import Jarvis, { HandlerArg } from "jarvis";
import { Bfs } from '@stitch-money/brittle-graph/dist/src/reference-algorithms/bfs';
import { adventureGraph } from './adventure-graph';
import { compileGraph, NavigationResult } from "@stitch-money/brittle-graph";

import readline from 'readline';


const compiledGraph = compileGraph(adventureGraph, new Bfs<any>());

export async function createGameRepl() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'adventureGraph > '
    });

    const graphInstance = await compiledGraph.createInstance();
    const jarvis = new Jarvis();

    function formatCurrentNode() {
        return `${graphInstance.currentNode.name}\n======================\n${graphInstance.currentNode.fields.summary()}\n`;
    }

    jarvis.addCommand({
        command: 'display',
        aliases: ['describe', 'look', 'look around', 'explain'],
        handler: async (_args: HandlerArg) => {
            const currentNode = graphInstance.currentNode;
            return currentNode.fields.describe();
        }
    });

    jarvis.addCommand({
        command: 'goto $place',
        aliases: ['walk to $place', 'move to $place', 'go to $place', 'run to $place'],
        handler: async ({ args }: HandlerArg) => {
            const node: string = args.place;
            let resultTxt = `Attempting to navigate to ${node}\n`;
            console.log();
            const graphNode: undefined | (() => Promise<NavigationResult<typeof adventureGraph, keyof (typeof adventureGraph['nodes'])>>) = (graphInstance as any)[node];
            if (graphNode) {
                const result = await graphNode();
                if (result.type === 'successful') {
                    return `${resultTxt}${formatCurrentNode()}`;
                } else {
                    return `${resultTxt}\nHowever could not reach it`;
                }
            }
            return 'I do not know of that place';
        }
    });


    jarvis.addCommand({
        command: 'list',
        handler: async ({ args }: HandlerArg) => {
            const currentNodeName = graphInstance.currentNode.name;
            return Object.keys((adventureGraph.nodes[currentNodeName] as any).edges ?? {}).join(', ');
        }
    });


    rl.write(`Welcome to Adventure Graph!\nTo interact with the world, you can use the verbs: describe, goto, list, pickup, help, and use!\nCurrently at:\n${formatCurrentNode()}`);
    rl.prompt();

    // feed CLI input to the app, and app output back to CLI
    rl.on('line', async (line) => {
        const res = await jarvis.send(line.trim());
        console.log(res ? `${res}\n` : 'I don\'t understand\n');
        rl.prompt();
    });
}
