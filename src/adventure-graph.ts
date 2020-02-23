import { graph } from '@stitch-money/brittle-graph';


export type AdventureGraphState = {
};

export type AdventureGraphContext = { currentState: AdventureGraphState };

export const adventureGraph = graph({
    nodes: {
        'Dock': {
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
            fields: {
                describe: () => 'The dock could be at best be called crusty looking',
                summary: () => 'The misty dock'
            }
        }

    },
    initializer: async () => {
        const currentState: AdventureGraphState = {};

        return { currentState, currentNode: 'Dock' };
    }
});
