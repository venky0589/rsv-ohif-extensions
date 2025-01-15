import React, { useEffect, useState, useCallback } from 'react';
import ViewPortNavigation from './components/ViewPortNavigation';
import { useTimePointToggleViewportGridStore } from './stores/useTimePointState';

const getCommandsModule = ({ servicesManager, extensionManager, commandsManager }) => {
    const { viewportGridService, displaySetService, viewportActionCornersService } = servicesManager.services;

    const dataSource = extensionManager.getDataSources()[0];
    //const { StudyInstanceUIDs } = useImageViewer();
    //const [{ activeViewportId, viewports, isHangingProtocolLayout }, viewportGridService] = useViewportGrid();



    console.log("DataSource Store", dataSource.store);
    //setDisplaySets(getDisplaySetsForViewport(activeViewportId));
    const currentDisplaySets = displaySetService.activeDisplaySets;

    // const timepointAndDisplaySetsmap = currentDisplaySets.reduce((acc, current) => {

    //   const timePoint = current.instance.ClinicalTrialTimePointDescription;
    //   let displaySetArray = acc[timePoint];
    //   if (!displaySetArray) {
    //     displaySetArray = [];
    //     acc[timePoint] = displaySetArray;
    //   }
    //   displaySetArray.push(current);

    // }, {});


    const timepointAndDisplaySetsmap = currentDisplaySets.reduce((map, current) => {
        const timePoint = current.instance.ClinicalTrialTimePointDescription;
        // If the map doesn't have the key, initialize it with an empty array
        if (!map.has(timePoint)) {
            map.set(timePoint, []);
        }
        // Add the current item to the array for this key
        map.get(timePoint).push(current);
        return map;
    }, new Map());



    return {
        definitions: {
            viewPortDoubleClick: {

                commandFn: () => {

                    const viewportGridState = viewportGridService.getState();
                    const { activeViewportId, viewports, layout, isHangingProtocolLayout } = viewportGridState;
                    const { displaySetInstanceUIDs, displaySetOptions, viewportOptions } =
                        viewports.get(activeViewportId);
                    console.log("Active View Port Id", activeViewportId);

                    viewports.entries().filter(entry => entry.key.indexOf('sl-') == -1)[0];
                    const filteredValues = Array.from(viewports.entries()).filter((key, value) => key[0].indexOf('sl-') == -1);
                    const currentTimePointViewPort = filteredValues.length > 0 ? filteredValues[0][1] : null;
                    //Only works for sublayouts "sl-"
                    if (activeViewportId.indexOf("sl-") == -1 || currentTimePointViewPort === null) {
                        return;
                    }
                    //Start: store viewPorts in Store to use later for navigation
                    const { timePointToggleViewportGridStore, setTimePointToggleViewportGridStore } =
                        useTimePointToggleViewportGridStore.getState();
                    const viewPortMapByVisit = {};
                    viewports.forEach(viewport => {
                        const dUID = viewport.displaySetInstanceUIDs[0];
                        if (!dUID) {
                            return;
                        }
                        const displaySet = displaySetService.getDisplaySetByUID(dUID);
                        const tp = displaySet.instance.ClinicalTrialTimePointDescription;
                        viewPortMapByVisit[tp] = viewport;

                    });
                    setTimePointToggleViewportGridStore("viewports", viewPortMapByVisit);

                    console.log("ViewPorts By VisitMap", viewPortMapByVisit);
                    //End



                    const findOrCreateViewport = (position, positionId, options) => {
                        console.log("Find Or Create View Port", position, positionId, options);

                        const viewport = position == 0 ? viewports.get(activeViewportId) : currentTimePointViewPort;

                        return {
                            displaySetInstanceUIDs: viewport.displaySetInstanceUIDs,
                            viewportOptions: viewport.viewportOptions,
                            displaySetOptions: viewport.displaySetOptions
                        }
                    };

                    viewportGridService.setLayout({
                        numRows: 1,
                        numCols: 2,
                        findOrCreateViewport,
                        isHangingProtocolLayout: true,
                    });

                    const _getComp = (viewPortId) => {
                        return (
                            <ViewPortNavigation servicesManager={servicesManager} extensionManager={extensionManager} commandsManager={commandsManager} viewPortId={viewPortId} />
                        );
                    }
                    viewportActionCornersService.addComponent({
                        viewportId: activeViewportId,
                        id: 'view-port-navigation',
                        component: _getComp(activeViewportId),
                        location: viewportActionCornersService.LOCATIONS.topRight,
                    });
                },
                // storeContexts: ['viewports'],
                context: 'VIEWER', // optional
            },
        },
        defaultContext: 'VIEWER'
    }
};

export default getCommandsModule;