import type { Types } from '@ohif/core/types';
import { PubSubService } from '@ohif/core';
import LesionPromptModal from '../components/LesionPromptModal';

const handleMeasurementAdded = ({ servicesManager, extensionManager, commandsManager, measurement, source }) => {

    const { measurementService, uiModalService, displaySetService } = servicesManager.services;

    console.log("Handle Measurement Added", source, measurement);
    const toolsList = ["Length", "RectangleROI", "Bidirectional", "EllipticalROI", "FreehandROI"];

    if (toolsList.indexOf(measurement.toolName) != -1) { // Update with your tool name
        uiModalService.show({
            content: LesionPromptModal,
            title: 'Lesion Information',
            showOverlay: true,
            contentProps: {
                onConfirm: (data) => {
                    console.log("Measurement data", data);

                    const { LD, SD } = calculateLD_SD(measurement.points, measurement.toolName);
                    const formData = Object.fromEntries(
                        Object.entries(data).map(([key, value]) => [key, value.value])
                    );

                    formData.ld = LD;
                    formData.sd = SD;


                    const referenceImageId = measurement.referencedImageId;

                    measurement.data["imageId:" + referenceImageId].ld = LD;
                    measurement.data["imageId:" + referenceImageId].sd = SD;


                    const displaySet = displaySetService.getDisplaySetByUID(measurement.displaySetInstanceUID);
                    const tp = displaySet.instance.ClinicalTrialTimePointDescription;
                    formData.timepoint = tp;
                    formData.ROILabel = nextROILabel(measurementService, tp, formData.lesionType).toString();

                    measurementService.update(measurement.uid, {
                        ...measurement,
                        data: {
                            ...measurement.data,
                            lesionInfo: formData
                        }
                    }, true);
                    uiModalService.hide();
                },
                onCancel: () => {
                    measurementService.delete(measurement.id);
                    uiModalService.hide();
                }
            },
            containerDimensions: 'h-[200px] w-[250px]',
            contentDimensions: 'h-[180px] w-[220px]  pl-[12px] pr-[12px]',
        });
    }
};

const nextROILabel = (measurementService, timepoint, lesionType) => {
    const measurements = measurementService.getMeasurements();
    const groupedMeasurements = groupByTimepointAndLesionType(measurements);
    var roiMax = lesionType == "target" ? 100 : (lesionType == "non-target" ? 200 : 300);

    groupedMeasurements[timepoint]?.[lesionType]?.forEach((measurement, index) => {
        const ROILabel = measurement.data.lesionInfo.ROILabel;


        try {

            const roi = parseInt(ROILabel);
            if (roiMax < roi) {
                roiMax = roi;
            }

        } catch (e) {
            console.log(e);
        }


    });

    return roiMax + 1;

};

function groupByTimepointAndLesionType(array) {
    return array.reduce((acc, item) => {
        if (!item.data.lesionInfo) {
            return acc;
        }
        const { timepoint, lesionType } = item.data.lesionInfo;

        // Ensure the timepoint group exists
        if (!acc[timepoint]) {
            acc[timepoint] = {};
        }

        // Ensure the lesionType group exists within the timepoint
        if (!acc[timepoint][lesionType]) {
            acc[timepoint][lesionType] = [];
        }

        // Push the current item into the appropriate group
        acc[timepoint][lesionType].push(item);

        return acc;
    }, {});
}
const calculateLD_SD = (points, annotationType) => {
    if (!points || points.length < 2) {
        return { LD: 0, SD: 0 };
    }

    let LD = 0, SD = 0;

    if (annotationType === 'Length') {
        // Single line measurement
        LD = Math.sqrt(
            Math.pow(points[1][0] - points[0][0], 2) +
            Math.pow(points[1][1] - points[0][1], 2) +
            Math.pow(points[1][2] - points[0][2], 2)
        );
        SD = 0; // Not applicable
    }

    else if (annotationType === 'Bidirectional') {
        // Two perpendicular lines, LD is longer one, SD is shorter one
        const D1 = Math.sqrt(
            Math.pow(points[1][0] - points[0][0], 2) +
            Math.pow(points[1][1] - points[0][1], 2) +
            Math.pow(points[1][2] - points[0][2], 2)
        );
        const D2 = Math.sqrt(
            Math.pow(points[3][0] - points[2][0], 2) +
            Math.pow(points[3][1] - points[2][1], 2) +
            Math.pow(points[3][2] - points[2][2], 2)
        );
        LD = Math.max(D1, D2);
        SD = Math.min(D1, D2);
    }

    else if (annotationType === 'EllipticalROI' || annotationType === 'RectangleROI') {
        // Bounding box width and height
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (let i = 0; i < points.length; i++) {
            minX = Math.min(minX, points[i][0]);
            minY = Math.min(minY, points[i][1]);
            maxX = Math.max(maxX, points[i][0]);
            maxY = Math.max(maxY, points[i][1]);
        }
        const width = maxX - minX;
        const height = maxY - minY;

        LD = Math.max(width, height);
        SD = Math.min(width, height);
    }

    else if (annotationType === 'FreehandROI') {
        // Compute pairwise max distances (LD)
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(points[j][0] - points[i][0], 2) +
                    Math.pow(points[j][1] - points[i][1], 2) +
                    Math.pow(points[j][2] - points[i][2], 2)
                );
                LD = Math.max(LD, distance);
            }
        }
        // SD approximation: Shortest perpendicular distance to LD (not exact)
        SD = LD / 2;
    }

    return { LD, SD };
}

export default handleMeasurementAdded;