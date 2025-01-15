/*const recistHangingProtocol = {
    id: 'rsv-annotations-extension.hangingProtocolModule.recist-workflow-protocol',
    locked: true,
    name: 'RECIST Workflow',
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    protocolMatchingRules: [
        {
            attribute: 'ClinicalTrialProtocolName',
            constraint: {
                contains: '17067',
            },
            required: true,
        },
    ],
    displaySetSelectors: {
        currentCT: {
            seriesMatchingRules: [
                {
                    attribute: 'Modality',
                    constraint: {
                        equals: 'CT',
                    },
                    required: true,
                },
            ],
        },
        priorCT: {
            seriesMatchingRules: [
                {
                    attribute: 'Modality',
                    constraint: {
                        equals: 'CT',
                    },
                    required: true,
                },
            ],
        },
    },
    stages: [
        {
            id: 'recist-default-layout',
            name: 'RECIST Default Layout',
            viewportStructure: {
                layoutType: 'grid',
                properties: {
                    rows: 1,
                    columns: 2,
                },
            },
            viewports: [
                {
                    displaySetInstanceUID: 'currentCT',
                    options: {
                        syncGroups: [
                            {
                                type: 'scroll',
                                id: 'current-and-prior-sync',
                            },
                        ],
                    },
                },
                {
                    displaySetInstanceUID: 'priorCT',
                    options: {
                        syncGroups: [
                            {
                                type: 'scroll',
                                id: 'current-and-prior-sync',
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: 'recist-zoomed-layout',
            name: 'Zoomed Lesion Analysis',
            viewportStructure: {
                layoutType: 'grid',
                properties: {
                    rows: 1,
                    columns: 2,
                },
            },
            viewports: [
                {
                    displaySetInstanceUID: 'currentCT',
                    options: {
                        zoom: {
                            region: 'lesion',
                        },
                        syncGroups: [
                            {
                                type: 'zoom',
                                id: 'current-and-prior-zoom-sync',
                            },
                        ],
                    },
                },
                {
                    displaySetInstanceUID: 'priorCT',
                    options: {
                        zoom: {
                            region: 'lesion',
                        },
                        syncGroups: [
                            {
                                type: 'zoom',
                                id: 'current-and-prior-zoom-sync',
                            },
                        ],
                    },
                },
            ],
        },
    ],
};*/

import recistHangingProtocol from "./recist-hanging-protocol";


const getHangingProtocolModule = () => {

    return [{
        name: recistHangingProtocol.id,
        protocol: recistHangingProtocol
    }]

};
export default getHangingProtocolModule;
