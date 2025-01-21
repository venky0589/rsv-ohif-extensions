import React, { useEffect, useRef, useState, useCallback } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import getImageSrcFromImageId from '../panels/getImageSrcFromImageId';
import { useTimePointToggleViewportGridStore } from "../stores/useTimePointState";
import { useViewportGrid } from '@ohif/ui-next';

const ViewPortNavigation = ({ servicesManager, extensionManager, commandsManager, viewPortId }) => {
    const { viewportGridService, displaySetService, cornerstoneViewportService, viewportActionCornersService } = servicesManager.services;

    const [currentDisplaySets, setCurrentStudyDisplaySets] = useState([]);
    const dataSource = extensionManager.getDataSources()[0];
    const [imageSrcMap, setImageSrcMap] = useState({});

    const [currentViewPortId, setCurrentViewPortId] = useState(viewPortId);

    const [currentDisplaySetInstanceUID, setCurrentDisplaySetInstanceUID] = useState(null);

    const [dsIndex, setDSIndex] = useState(0);
    const { timePointToggleViewportGridStore, setTimePointToggleViewportGridStore } =
        useTimePointToggleViewportGridStore.getState();
    const { visitOrder, taskTimepoints, currentTimepoint } = dataSource.store.visitInfo();

    const [visitIndex, setVisitIndex] = useState(-1);
    const [viewportGridState, viewportGridServiceAPI] =
        useViewportGrid();

    const [show, setShow] = useState(false);

    const _getImageSrcFromImageId = useCallback(
        _createGetImageSrcFromImageIdFn(),
        []
    );

    const handleGridStateChange = () => {
        const gridState = viewportGridService.getState();
        setShow(currentViewPortId.indexOf('sl-') != -1 && gridState.layout.numRows == 1 && (gridState.layout.numCols == 2 || gridState.layout.numCols == 1));

    };

    useEffect(() => {
        handleGridStateChange();
        const viewportGridStateChangedSubscription = viewportGridService.subscribe(
            viewportGridService.EVENTS.LAYOUT_CHANGED, handleGridStateChange
        );
        return () => {

            console.log("Unloading........");
            viewportGridStateChangedSubscription && viewportGridStateChangedSubscription.unsubscribe();
        };

    }, []);

    useEffect(() => {

        const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(currentViewPortId);
        const displaySets = displaySetUIDs.map(uid => displaySetService.getDisplaySetByUID(uid));


        const viewportInfo = cornerstoneViewportService.getViewportInfo(currentViewPortId);
        if (show && viewportInfo) {
            const viewportData = viewportInfo.getViewportData();
            const currentDisplaySetInstanceUID = viewportData.data[0].displaySetInstanceUID;
            const activeDisplaySetIndex = displaySetUIDs.indexOf(currentDisplaySetInstanceUID);
            setCurrentStudyDisplaySets(displaySets);
            setCurrentDisplaySetInstanceUID(currentDisplaySetInstanceUID);
            setDSIndex(activeDisplaySetIndex);
        }


    }, [show]);




    useEffect(() => {
        if (dsIndex >= 0 && currentDisplaySets.length > 0) {
            const currentVisit = currentDisplaySets[dsIndex].instance.ClinicalTrialTimePointDescription;
            const currentVisitIndex = taskTimepoints.indexOf(currentVisit);
            setVisitIndex(currentVisitIndex);
        }

    }, [dsIndex, currentDisplaySets])

    useEffect(() => {
        const newImageSrcEntry = {};

        console.log("************DataSource:", dataSource);
        currentDisplaySets.forEach(async (dSet) => {
            const imageIds = dataSource.getImageIdsForDisplaySet(dSet);
            const imageId = imageIds[Math.floor(imageIds.length / 2)];

            if (!imageId) return;

            newImageSrcEntry[dSet.displaySetInstanceUID] = await _getImageSrcFromImageId(imageId, dSet.initialViewport);

            setImageSrcMap((prevState) => ({
                ...prevState,
                ...newImageSrcEntry,
            }));
        });
    }, [dataSource, currentDisplaySets]);

    const handleUp = () => {

        let index = dsIndex + 1;
        if (index == currentDisplaySets.length) {
            index = 0;

        }
        setDSIndex(index);
        updateCurrentViewPort(currentDisplaySets[index]);

    }

    const handleDown = () => {
        let index = dsIndex - 1;
        if (index <= 0) {
            index = currentDisplaySets.length - 1;
        }
        setDSIndex(index);
        updateCurrentViewPort(currentDisplaySets[index]);
    }


    function _createGetImageSrcFromImageIdFn() {
        const utilities = extensionManager.getModuleEntry(
            '@ohif/extension-cornerstone.utilityModule.common'
        );

        try {
            const { cornerstone } = utilities.exports.getCornerstoneLibraries();
            return getImageSrcFromImageId.bind(null, cornerstone);
        } catch (ex) {
            throw new Error('Required command not found');
        }
    }

    const updateViewPortCorners = (viewportIdNext) => {
        const _getComp = (viewPortId) => {
            return (
                <ViewPortNavigation servicesManager={servicesManager} extensionManager={extensionManager} commandsManager={commandsManager} viewPortId={viewPortId} />
            );
        }
        viewportActionCornersService.addComponent({
            viewportId: viewportIdNext,
            id: 'view-port-navigation',
            component: _getComp(viewPortId),
            location: viewportActionCornersService.LOCATIONS.topRight,
        });
    };

    const handleLeft = () => {
        console.log("Handle Left", viewportGridState);
        const displaySetActive = currentDisplaySets[dsIndex];
        const visit = displaySetActive.instance.ClinicalTrialTimePointDescription;
        const currentVisitIndex = taskTimepoints.indexOf(visit);
        let tempIndex = currentVisitIndex - 1;
        if (tempIndex < 0) {
            tempIndex = taskTimepoints.length - 1;
        }
        if (taskTimepoints[tempIndex] == currentTimepoint) {
            tempIndex = tempIndex - 1;
            if (tempIndex < 0) {
                tempIndex = taskTimepoints.length - 1;
            }
        }

        const visitIndex = tempIndex;

        const viewPort = { ...timePointToggleViewportGridStore["viewports"][taskTimepoints[visitIndex]], height: 1, width: 0.5, x: 0, y: 0 };

        // const gridState = viewportGridService.getState();
        //console.log("Grid State", gridState);

        //viewportGridService.setActiveViewportId(viewPort.viewPortId);
        const viewPorts = new Map([
            [viewPort.viewportId, viewPort],
            Array.from(viewportGridState.viewports.entries()).find((e) => e[0].indexOf('sl-') == -1)
        ]);


        viewportGridService.set({ ...viewportGridState, viewports: viewPorts, activeViewportId: viewPort.viewportId });

        setVisitIndex(visitIndex);
        //updateViewPortCorners(viewPort.viewportId);
        //setCurrentViewPortId(viewPort.viewportId);


    };
    const handleRight = () => {
        console.log("Right", viewportGridState);
        const displaySetActive = currentDisplaySets[dsIndex];
        const visit = displaySetActive.instance.ClinicalTrialTimePointDescription;
        const currentVisitIndex = taskTimepoints.indexOf(visit);
        let tempIndex = currentVisitIndex + 1;
        if (tempIndex >= taskTimepoints.length) {
            tempIndex = 0;
        }
        if (taskTimepoints[tempIndex] == currentTimepoint) {
            tempIndex = tempIndex + 1;
            if (tempIndex >= taskTimepoints.length) {
                tempIndex = 0;
            }
        }

        const visitIndex = tempIndex;

        const viewPort = { ...timePointToggleViewportGridStore["viewports"][taskTimepoints[visitIndex]], height: 1, width: 0.5, x: 0, y: 0 };

        //const gridState = viewportGridService.getState();
        //console.log("Grid State", gridState);

        const viewPorts = new Map([
            [viewPort.viewportId, viewPort],
            Array.from(viewportGridState.viewports.entries()).find((e) => e[0].indexOf('sl-') == -1)
        ]);

        viewportGridService.set({ ...viewportGridState, viewports: viewPorts, activeViewportId: viewPort.viewportId });


        setVisitIndex(visitIndex);

        //  updateViewPortCorners(viewPort.viewportId);
        //setCurrentViewPortId(viewPort.viewportId);

    };


    const updateCurrentViewPort = (ds) => {
        viewportGridService.setDisplaySetsForViewports([
            {
                viewportId: currentViewPortId,
                displaySetInstanceUIDs: [ds.displaySetInstanceUID],
            },
        ]);

        setCurrentDisplaySetInstanceUID(ds.displaySetInstanceUID);
    };
    const renderSeries = (ds, index) => {
        return (
            <div
                key={index}
                className="flex-shrink-0 w-40"
                onClick={() => updateCurrentViewPort(ds)}
            >
                <img
                    src={imageSrcMap[ds.displaySetInstanceUID]}
                    alt="Series Thumbnail"
                    className="w-full h-28 object-cover rounded"
                    crossOrigin="anonymous"
                />
                <div className="mt-2 text-sm text-gray-600">
                    <div>{ds.instance.ClinicalTrialSeriesDescription}</div>
                </div>
            </div>
        );
    };


    const renderComp = () => {
        return (

            <div className="relative w-12 h-12 mx-auto rounded-full flex items-center justify-center">


                {/* Up Button */}
                <button
                    className="absolute -top-1 bg-gray-700 w-4 h-4 rounded-md shadow-md text-primary-light font-bold text-sm flex items-center justify-center hover:text-white hover:text-white hover:bg-secondary-light/60"
                    onClick={() => handleUp()}
                >
                    &#11165;
                </button>

                {/* Down Button */}
                <button
                    className="absolute -bottom-1 bg-gray-700 w-4 h-4 rounded-md shadow-md text-primary-light font-bold text-sm flex items-center justify-center hover:text-white hover:bg-secondary-light/60"
                    onClick={() => handleDown()}
                >
                    &#11167;
                </button>

                {/* Left Button */}
                <button
                    className="relative -left-1 bg-gray-700 w-4 h-4 rounded-md shadow-md text-primary-light font-bold text-2 flex items-center justify-center hover:text-white hover:bg-secondary-light/60"
                    onClick={() => handleLeft()}
                >
                    &#11164;
                </button>
                {/* Center Button */}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="relative  bg-blue-500 w-4 h-4 rounded-full shadow-md text-primary-light font-bold text-2 flex items-center justify-center hover:text-white hover:bg-secondary-light/60"
                        >&#11096;</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal className="border-primary-light border-2 rounded ">
                        <DropdownMenu.Content
                            sideOffset={5}
                            className="w-96 border-primary-light border-2 rounded bg-popover text-popover-foreground max-h-64 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                        >
                            {currentDisplaySets.map((ds, index) => { return (<div className="focus:bg-accent focus:text-accent-foreground hover:bg-accent relative flex cursor-default select-none items-center rounded px-1 py-1 text-base outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50">{renderSeries(ds, index)}</div>) })}
                            <DropdownMenu.Arrow className="fill-gray-300" />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>


                {/* Right Button */}
                <button
                    className="relative -right-5 bg-gray-700 w-4 h-4 rounded-md shadow-md text-primary-light font-bold text-2 flex items-center justify-center hover:text-white hover:bg-secondary-light/60"
                    onClick={() => handleRight()}
                >
                    &#11166;
                </button>
            </div>
        );
    }
    return (
        <>
            {show ? renderComp() : null}
        </>
    )
};

export default ViewPortNavigation;
