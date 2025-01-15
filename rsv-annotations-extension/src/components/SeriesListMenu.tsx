import React, { useEffect, useState, useCallback } from 'react';
import { Header, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@ohif/ui-next';
import getImageSrcFromImageId from '../panels/getImageSrcFromImageId';


const SeriesListMenu = ({ servicesManager, viewPortId, dataSource, getImageSrc }) => {
    const { viewportGridService, displaySetService } = servicesManager.services;



    const [currentDisplaySets, setCurrentStudyDisplaySets] = useState([]);

    const [currentTimepoint, setCurrentTimepoint] = useState("");

    const [imageSrcMap, setImageSrcMap] = useState({});




    const handleGridStateChange = useCallback(({ state }) => {

        setTimeout(() => {
            const activeViewportId = state.activeViewportId;

            if (activeViewportId != viewPortId) {
                return;
            }

            if (activeViewportId) {
                console.log("Active View Port ID", activeViewportId);

                const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(activeViewportId);
                const displaySet = displaySetService.getDisplaySetByUID(displaySetUIDs[0]);

                console.log(displaySet);

                //setDisplaySets(getDisplaySetsForViewport(activeViewportId));
                const currentDisplaySets = displaySetService.activeDisplaySets;
                const currentStudyDisplaySets = currentDisplaySets.filter(ds => ds.StudyInstanceUID == displaySet.StudyInstanceUID);
                console.log("CurrentStudy Display Sets", currentStudyDisplaySets);
                setCurrentStudyDisplaySets(currentStudyDisplaySets);
                setCurrentTimepoint(displaySet.instance.ClinicalTrialTimePointDescription);
            }
        }, 1000);
    });

    useEffect(() => {
        const viewportGridStateChangedSubscription = viewportGridService.subscribe(
            viewportGridService.EVENTS.GRID_STATE_CHANGED, handleGridStateChange
        );
        return () => {
            viewportGridStateChangedSubscription && viewportGridStateChangedSubscription();
        }
    }, []);



    useEffect(() => {

        console.log("Changed");
        const newImageSrcEntry = {};
        currentDisplaySets.forEach(async (dSet) => {
            const imageIds = dataSource.getImageIdsForDisplaySet(dSet);
            const imageId = imageIds[Math.floor(imageIds.length / 2)];

            // TODO: Is it okay that imageIds are not returned here for SR displaysets?
            if (!imageId) {
                return;
            }
            // When the image arrives, render it and store the result in the thumbnailImgSrcMap
            newImageSrcEntry[dSet.displaySetInstanceUID] = await getImageSrc(
                imageId,
                dSet.initialViewport
            );

            console.log("New Image Entry", newImageSrcEntry);
            setImageSrcMap(prevState => {
                return { ...prevState, ...newImageSrcEntry };
            });

        });


    }, [dataSource, currentDisplaySets]);

    const updateCurrentViewPort = (ds) => {
        //viewportGridService.setActiveViewportId(viewPortId);
        viewportGridService.setDisplaySetsForViewports([
            {
                viewportId: viewPortId,
                displaySetInstanceUIDs: [ds.displaySetInstanceUID],
            },
        ]);

    };

    const renderSeries = (ds) => {
        console.log(imageSrcMap);
        return (

            <div className="flex gap-4">
                <div className="w-20 h-20 inline-block">
                    <img src={imageSrcMap[ds.displaySetInstanceUID]}
                        alt={"Test"}
                        className="h-full w-full object-contain"
                        crossOrigin="anonymous"></img>
                </div>
                <div className="flex flex-col justify-center ">
                    <div>{ds.SeriesNumber}</div>
                    <div>{ds.SeriesDescription}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* <div className="flex flex-wrap justify-start gap-4 p-4 w-40">
                <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
                <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
                <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
            </div> */}
            <div className="relative text-white inline-block ml-10 mr-10" >{currentTimepoint}</div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button>Click</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {currentDisplaySets.map(ds => {
                        return (<DropdownMenuItem onClick={e => updateCurrentViewPort(ds)}>{renderSeries(ds)}</DropdownMenuItem>)
                    })
                    }

                </DropdownMenuContent>

            </DropdownMenu>
        </div>
    );

};
export default SeriesListMenu;


