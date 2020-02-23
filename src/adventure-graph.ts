import { graph } from '@stitch-money/brittle-graph';


export type AdventureGraphState = {
    visited: { [key: string]: boolean }
};

const visitEffect = (nodeName: string) => async (ctx: AdventureGraphContext) => [{ type: 'update_state' as 'update_state', nextState: { ...ctx.currentState, visited: { ...ctx.currentState.visited, [nodeName]: true } } }];

export type AdventureGraphContext = { currentState: AdventureGraphState };

export const adventureGraph = graph({
    nodes: {
        'Dock': {
            onEnter: visitEffect('Dock'),
            edges: {
                IslandHarbour: async () => {
                    return { type: 'transitioned', cost: 1 };
                }
            },
            fields: {
                describe: () => 'The dock could be at best be called crusty looking. ',
                summary: () => 'The misty dock'
            }
        },
        'IslandHarbour': {
            onEnter: visitEffect('IslandHarbour'),
            fields: {
                describe: () => 'The dock could be at best be called crusty looking',
                summary: () => 'The misty dock'
            }
        }

    },
    initializer: async () => {
        const currentState: AdventureGraphState = {
            visited: {}
        };

        return { currentState, currentNode: 'Dock' };
    }
});
