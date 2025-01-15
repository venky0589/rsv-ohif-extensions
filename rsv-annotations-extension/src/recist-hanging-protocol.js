const recistHangingProtocol = {
    id: 'rsv-annotations-extension.hangingProtocolModule.recist-workflow-protocol',
    name: 'RECIST Protocol',
    locked: true,
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    imageLoadStrategy: 'default',

    // Matching rules to determine when this protocol is applied
    protocolMatchingRules: [
        {
            attribute: 'ModalitiesInStudy',
            constraint: {
                contains: ['CT'],
            },
        },
        {
            attribute: 'ClinicalTrialProtocolID',
            constraint: {
                contains: '17606',
            },
        },
    ],

    // Display Set Selectors to select the appropriate series for each viewport
    displaySetSelectors: {
        ctDisplaySetTP1: {
            seriesMatchingRules: [
                {
                    attribute: 'Modality',
                    constraint: {
                        equals: 'CT',
                    },
                    required: true,
                },
                {
                    attribute: 'ClinicalTrialTimePointDescription',
                    constraint: {
                        equals: '1_Screening',
                    },
                    required: true,
                },
            ],
        },
        ctDisplaySetTP2: {
            seriesMatchingRules: [
                {
                    attribute: 'Modality',
                    constraint: {
                        equals: 'CT',
                    },
                    required: true,
                },
                {
                    attribute: 'ClinicalTrialTimePointDescription',
                    constraint: {
                        equals: '2_Treatment_01',
                    },
                    required: true,
                },
            ],
        },
    },

    // Stages define the layout and what is displayed in each viewport
    stages: [
        /*{
            id: 'recistStage',
            name: 'RECIST Layout',
            viewportStructure: {
                layoutType: 'stacked',
                properties: {
                    rows: 1,
                    columns: 2,
                },
            },
            viewports: [
                {
                    viewportOptions: {
                        viewportId: 'ctTP1',
                        viewportType: 'stack',
                        initialImageOptions: {
                            preset: 'middle',
                        },
                        syncGroups: [
                            {
                                type: 'scroll',
                                id: 'scrollSyncGroup',
                                source: true,
                                target: true,
                            },
                        ],
                    },
                    displaySets: [
                        {
                            id: 'ctDisplaySetTP1',
                        },
                    ],
                },
                {
                    viewportOptions: {
                        viewportId: 'ctTP2',
                        viewportType: 'stack',
                        initialImageOptions: {
                            preset: 'middle',
                        },
                        syncGroups: [
                            {
                                type: 'scroll',
                                id: 'scrollSyncGroup',
                                source: false,
                                target: true,
                            },
                        ],
                    },
                    displaySets: [
                        {
                            id: 'ctDisplaySetTP2',
                        },
                    ],
                },
            ],
        },*/
    ],
};


export default recistHangingProtocol;
