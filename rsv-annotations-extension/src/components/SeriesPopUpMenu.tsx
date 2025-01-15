// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { Header, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@ohif/ui-next';

// import getImageSrcFromImageId from '../panels/getImageSrcFromImageId';
// const SeriesPopUpMenu = (

//     { servicesManager, viewPortId, dataSource, getImageSrc }) => {
//     const { viewportGridService, displaySetService } = servicesManager.services;



//     const [currentDisplaySets, setCurrentStudyDisplaySets] = useState([]);

//     const [currentTimepoint, setCurrentTimepoint] = useState("");

//     const [imageSrcMap, setImageSrcMap] = useState({});
//     const [isPopupVisible, setPopupVisible] = useState(false);

//     const popupRef = useRef(null);

//     const togglePopup = () => {
//         setPopupVisible(!isPopupVisible);
//     };

//     // Close popup when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (popupRef.current && !popupRef.current.contains(event.target)) {
//                 setPopupVisible(false);
//             }
//         };

//         if (isPopupVisible) {
//             document.addEventListener("mousedown", handleClickOutside);
//         } else {
//             document.removeEventListener("mousedown", handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [isPopupVisible]);


//     const handleGridStateChange = useCallback(({ state }) => {

//         setTimeout(() => {
//             const activeViewportId = state.activeViewportId;

//             if (activeViewportId != viewPortId) {
//                 return;
//             }

//             if (activeViewportId) {
//                 console.log("Active View Port ID", activeViewportId);

//                 const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(activeViewportId);
//                 const displaySet = displaySetService.getDisplaySetByUID(displaySetUIDs[0]);

//                 console.log(displaySet);

//                 //setDisplaySets(getDisplaySetsForViewport(activeViewportId));
//                 const currentDisplaySets = displaySetService.activeDisplaySets;
//                 const currentStudyDisplaySets = currentDisplaySets.filter(ds => ds.StudyInstanceUID == displaySet.StudyInstanceUID);
//                 console.log("CurrentStudy Display Sets", currentStudyDisplaySets);
//                 setCurrentStudyDisplaySets(currentStudyDisplaySets);
//                 setCurrentTimepoint(displaySet.instance.ClinicalTrialTimePointDescription);
//             }
//         }, 1000);
//     });

//     useEffect(() => {
//         const viewportGridStateChangedSubscription = viewportGridService.subscribe(
//             viewportGridService.EVENTS.GRID_STATE_CHANGED, handleGridStateChange
//         );
//         return () => {
//             viewportGridStateChangedSubscription && viewportGridStateChangedSubscription();
//         }
//     }, []);



//     useEffect(() => {

//         console.log("Changed");
//         const newImageSrcEntry = {};
//         currentDisplaySets.forEach(async (dSet) => {
//             const imageIds = dataSource.getImageIdsForDisplaySet(dSet);
//             const imageId = imageIds[Math.floor(imageIds.length / 2)];

//             // TODO: Is it okay that imageIds are not returned here for SR displaysets?
//             if (!imageId) {
//                 return;
//             }
//             // When the image arrives, render it and store the result in the thumbnailImgSrcMap
//             newImageSrcEntry[dSet.displaySetInstanceUID] = await getImageSrc(
//                 imageId,
//                 dSet.initialViewport
//             );

//             console.log("New Image Entry", newImageSrcEntry);
//             setImageSrcMap(prevState => {
//                 return { ...prevState, ...newImageSrcEntry };
//             });

//         });


//     }, [dataSource, currentDisplaySets]);

//     const updateCurrentViewPort = (ds) => {
//         //viewportGridService.setActiveViewportId(viewPortId);
//         viewportGridService.setDisplaySetsForViewports([
//             {
//                 viewportId: viewPortId,
//                 displaySetInstanceUIDs: [ds.displaySetInstanceUID],
//             },
//         ]);

//     };

//     const renderSeries = (ds, index) => {
//         console.log(imageSrcMap);
//         // return (

//         //     <div className="flex gap-4">
//         //         <div className="w-20 h-20 inline-block">
//         //             <img src={imageSrcMap[ds.displaySetInstanceUID]}
//         //                 alt={"Test"}
//         //                 className="h-full w-full object-contain"
//         //                 crossOrigin="anonymous"></img>
//         //         </div>
//         //         <div className="flex flex-col justify-center ">
//         //             <div>{ds.SeriesNumber}</div>
//         //             <div>{ds.SeriesDescription}</div>
//         //         </div>
//         //     </div>
//         // );


//         return (
//             <div key={index} className="flex-shrink-0 w-40" onClick={e => updateCurrentViewPort(ds)}>
//                 <img
//                     src={imageSrcMap[ds.displaySetInstanceUID]}
//                     alt={"Test"}
//                     className="w-full h-28 object-cover rounded"
//                     crossOrigin="anonymous"
//                 />
//                 <div className="mt-2 text-sm text-gray-600">
//                     <div>{ds.SeriesNumber}</div>
//                     <div>{ds.SeriesDescription}</div>
//                 </div>
//             </div>
//         );
//     }



//     return (
//         <div className="relative inline-block">
//             <div className="relative text-white inline-block ml-10 mr-10" >{currentTimepoint}</div>
//             {/* Button */}
//             <Button  onClick={togglePopup}         >
//                 Click
//             </Button>

//             {/* Popup */}
//             {isPopupVisible && (
//                 <div ref={popupRef}
//                     className="absolute left-1/5 top-1/3 mt-2 w-100 bg-white border border-gray-300 rounded shadow-lg max-h-64 overflow-auto"
//                 >
//                     <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 bg-popover text-popover-foreground border-input z-50 min-w-[8rem] overflow-hidden rounded border p-1 shadow-md">
//                         {currentDisplaySets.map((ds, index) => renderSeries(ds, index))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SeriesPopUpMenu;
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Header, Button } from "@ohif/ui-next";
import getImageSrcFromImageId from "../panels/getImageSrcFromImageId";

const SeriesPopUpMenu = ({ servicesManager, viewPortId, dataSource, getImageSrc }) => {
    const { viewportGridService, displaySetService } = servicesManager.services;

    const [currentDisplaySets, setCurrentStudyDisplaySets] = useState([]);
    const [currentTimepoint, setCurrentTimepoint] = useState("");
    const [imageSrcMap, setImageSrcMap] = useState({});

    const handleGridStateChange = useCallback(({ state }) => {
        console.log("HANDLE GRID STAE CHANGE")
        setTimeout(() => {
            const activeViewportId = state.activeViewportId;

            if (activeViewportId !== viewPortId) return;

            if (activeViewportId) {
                const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(activeViewportId);
                const displaySet = displaySetService.getDisplaySetByUID(displaySetUIDs[0]);

                const currentDisplaySets = displaySetService.activeDisplaySets;
                const currentStudyDisplaySets = currentDisplaySets.filter(
                    (ds) => ds.StudyInstanceUID === displaySet.StudyInstanceUID
                );

                setCurrentStudyDisplaySets(currentStudyDisplaySets);
                setCurrentTimepoint(displaySet.instance.ClinicalTrialTimePointDescription);
            }
        }, 1000);
    }, [viewportGridService, displaySetService, viewPortId]);

    useEffect(() => {

        handleGridStateChange({ state: { activeViewportId: viewPortId } });
        const viewportGridStateChangedSubscription = viewportGridService.subscribe(
            viewportGridService.EVENTS.GRID_STATE_CHANGED,
            handleGridStateChange
        );
        return () => {
            viewportGridStateChangedSubscription && viewportGridStateChangedSubscription();
        };
    }, [viewportGridService, handleGridStateChange]);

    useEffect(() => {
        const newImageSrcEntry = {};

        console.log("************DataSource:", dataSource);
        currentDisplaySets.forEach(async (dSet) => {
            const imageIds = dataSource.getImageIdsForDisplaySet(dSet);
            const imageId = imageIds[Math.floor(imageIds.length / 2)];

            if (!imageId) return;

            newImageSrcEntry[dSet.displaySetInstanceUID] = await getImageSrc(imageId, dSet.initialViewport);

            setImageSrcMap((prevState) => ({
                ...prevState,
                ...newImageSrcEntry,
            }));
        });
    }, [dataSource, currentDisplaySets, getImageSrc]);

    const updateCurrentViewPort = (ds) => {
        viewportGridService.setDisplaySetsForViewports([
            {
                viewportId: viewPortId,
                displaySetInstanceUIDs: [ds.displaySetInstanceUID],
            },
        ]);
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

    return (
        <div className="relative inline-block">
            {/* <div className="relative text-white inline-block ml-10 mr-10">{currentTimepoint}</div> */}
            <div className="items-center justify-center h-full text-center">
                <div className="text-[#9CCFFF] text-sm">Series</div>
                <button className="grid grid-cols-3 gap-1 mt-1">
                    {Array(6)
                        .fill(0)
                        .map((_, idx) => (
                            <div
                                key={`series-box-${idx}`}
                                className="w-4 h-4 bg-[#395973] hover:bg-[#21A6D6] rounded-sm"
                            />
                        ))}
                </button>
            </div>

            {/* Radix DropdownMenu */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <div className="items-center justify-center h-full text-center">
                        <div className="text-[#9CCFFF] text-sm">{currentTimepoint}</div>
                        <button className="w-12 h-12 bg-[#102029] border-[1px] border-[#10536B] mt-1" />
                    </div>
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
        </div>
    );
};

export default SeriesPopUpMenu;
