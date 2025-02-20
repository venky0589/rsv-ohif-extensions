import React, { useEffect, useState, useRef } from "react";
import TargetTable from "./TargetTable";

const LesionTracker = (props) => {
    const { commandsManager, extensionManager, servicesManager } = props;

    const { measurementService } = servicesManager.services;

    const dataSource = extensionManager.getDataSources()[0];



    const [data, setData] = useState({});

    const [curAndPrev, setCurAnPrev] = useState([])

    const dataRef = useRef(data);

    // Update the ref whenever data changes
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    // Prepare and set the data on mount
    useEffect(() => {
        const preparedData = prepareData();
        setData(preparedData);
    }, []);

    const updateROILabel = (annotation) => {

        console.log("TEST", annotation);
        if (annotation.measurement.data?.lesionInfo || annotation.measurement.metadata?.lesionInfo) {
            console.log("Measurement UPDated");
            const lesionInfo = annotation.measurement.data?.lesionInfo || annotation.measurement.metadata?.lesionInfo;

            const lesionsArray = dataRef.current[lesionInfo.timepoint][lesionInfo.lesionType].lesions;//.filter(lesion => lesion.ROILabel == lesionInfo.ROILabel);
            // Find the index of an existing object with the same key value.
            const index = lesionsArray.findIndex(lesion => lesion.ROILabel == lesionInfo.ROILabel);

            if (index !== -1) {
                // Replace the existing object.
                lesionsArray[index] = lesionInfo;
            } else {
                // The array is assumed to be sorted based on the key.
                // Find the correct insertion index.
                let insertIndex = 0;
                while (insertIndex < lesionsArray.length && parseInt(lesionsArray[insertIndex]["ROILabel"]) < parseInt(lesionInfo["ROILabel"])) {
                    insertIndex++;
                }
                // Insert newObj at the determined index.
                lesionsArray.splice(insertIndex, 0, lesionInfo);
            }
            setData({ ...dataRef.current });
            console.log("Current Data", dataRef.current);
        }

    };

    const prepareData = () => {
        const { visitOrder, taskTimepoints, currentTimepoint, visit_to_studydate_map } = dataSource.store.visitInfo();

        const currIndex = taskTimepoints.indexOf(currentTimepoint);
        if (currIndex > 0) {
            setCurAnPrev([taskTimepoints[currIndex - 1], currentTimepoint])
        } else {
            setCurAnPrev([currentTimepoint])
        }
        const map = {};
        taskTimepoints.forEach(visit => {
            const timePontMeasurementObj = {};
            timePontMeasurementObj["studyDate"] = visit_to_studydate_map[visit];
            timePontMeasurementObj["target"] = {
                title: "Targets",
                maxItems: 5,
                lesions: [],
                summary: {
                    sumAll: "-",
                    baseline: "-",
                    smallest: "-"

                },
                response: "-"

            };
            timePontMeasurementObj["non-target"] = {
                title: "Non Targets",
                maxItems: 5,
                lesions: []
            };
            timePontMeasurementObj["new-lesion"] = {
                title: "New Lesions",
                maxItems: 5,
                lesions: []
            };
            map[visit] = timePontMeasurementObj;
        });
        return map;

    };

    useEffect(() => {
        const data = prepareData();
        setData(data);

    }, []);


    useEffect(() => {
        console.log("Lesion tracker Mounted...................");



        const unsubscribe = measurementService.subscribe(measurementService.EVENTS.MEASUREMENT_UPDATED, updateROILabel).unsubscribe;

        setTimeout(() => {
            measurementService.getMeasurements().forEach(measurement => {
                updateROILabel({ measurement });
            });
        }, 500);



        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            {Object.keys(data).length === 0 ? <div> Loading...</div> : <TargetTable data={data} curAndPrev={curAndPrev} />}
        </div>

    );

};
export default LesionTracker;