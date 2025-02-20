import * as cs3dTools from '@cornerstonejs/tools';
import { metaData, utilities, getEnabledElements } from '@cornerstonejs/core';
import { findViewPortsForSeriesInstanceUID, getFrameOfReference } from './collectViewPortInformation';

const annotation_template = {
    invalidated: false,
    highlighted: true,
    metadata: {
        toolName: 'RectangleROI',
        FrameOfReferenceUID: '',
        referencedImageId: '',
        //"sliceIndex": 4
    },
    data: {
        label: '',
        handles: {
            points: [],
            textBox: {},
            activeHandleIndex: null,
        },
        cachedStats: {},
    },
    annotationUID: '',
    isLocked: false,
    isVisible: true,
};
const getAnnotation = (servicesManager, jsonAnnotation) => {
    const annData = JSON.parse(JSON.stringify(annotation_template));

    const { FrameOfReferenceUID, ImageId, instance, sliceIndex } = getFrameOfReference(
        servicesManager,
        jsonAnnotation.seriesInstanceUID,
        jsonAnnotation.sopInstanceUID
    );

    annData.metadata.FrameOfReferenceUID = FrameOfReferenceUID;
    annData.metadata.referencedImageId = ImageId;
    annData.metadata.sliceIndex = sliceIndex;
    annData.metadata.instance = instance;
    annData.data.label = jsonAnnotation.roi;
    annData.metadata.lesionInfo = jsonAnnotation.lesionInfo || {};
    // console.log("bbbbbbbbbbbbbbb", jsonAnnotation);
    // console.log("qqqqqqqqqqqqqqqqq", annData);

    //Find ViewUp and viewPlaneNormal
    const viewPort = findViewPortsForSeriesInstanceUID(servicesManager, jsonAnnotation.seriesInstanceUID);
    const viewportEL = getEnabledElements();
    const vpEl = viewportEL.filter(vw => vw.viewportId === viewPort.viewportId);
    const { viewUp, viewPlaneNormal } = vpEl[0].viewport.getCamera();
    annData.metadata.viewUp = viewUp;
    annData.metadata.viewPlaneNormal = viewPlaneNormal;

    switch (jsonAnnotation.toolName) {
        case 'Ellipse':
            annData.metadata.toolName = 'EllipticalROI';
            annData.data.handles.points = findWorldCoordinatesForEllipse(
                ImageId,
                jsonAnnotation.x,
                jsonAnnotation.y,
                jsonAnnotation.width,
                jsonAnnotation.height
            );

            cs3dTools.annotation.state.addAnnotation(annData);

            break;
        case 'circle':
            annData.metadata.toolName = 'CircleROI';
            annData.data.handles.points = findWorldCoordinatesForCircle(
                ImageId,
                jsonAnnotation.x,
                jsonAnnotation.y,
                jsonAnnotation.radius
            );
            cs3dTools.annotation.state.addAnnotation(annData);

            break;

        case 'Line':
            annData.metadata.toolName = 'Length';
            annData.data.handles.points = findWorldCoordinatesForLine(
                ImageId,
                jsonAnnotation.x,
                jsonAnnotation.y,
                jsonAnnotation.x1,
                jsonAnnotation.y1
            );
            cs3dTools.annotation.state.addAnnotation(annData);
            break;

        case 'Rectangle':
            annData.metadata.toolName = 'RectangleROI';
            annData.data.handles.points = findWorldCoordinatesForRectangle(
                ImageId,
                jsonAnnotation.x,
                jsonAnnotation.y,
                jsonAnnotation.width,
                jsonAnnotation.height
            );
            cs3dTools.annotation.state.addAnnotation(annData);
            break;

        case 'ClosedPath':
            annData.metadata.toolName = 'PlanarFreehandROI';
            annData.data.handles.points = findWorldCoordinatesForFreehand(ImageId, jsonAnnotation.points);
            annData.data.contour = {
                polyline: annData.data.handles.points,
                closed: true, // Ensures the path is closed

            };
            cs3dTools.annotation.state.addAnnotation(annData);
            break;

        case 'CrossRuler':
            annData.metadata.toolName = 'Bidirectional';
            annData.data.handles.points = findWorldCoordinatesForBidirectional(
                ImageId,
                jsonAnnotation.points
            );
            cs3dTools.annotation.state.addAnnotation(annData);
            break;

        default:
            break;
    }
};

const findWorldCoordinatesForRectangle = (imageId, x, y, width, height) => {
    const topLeftPos = utilities.imageToWorldCoords(imageId, [x, y]);
    const topRightPos = utilities.imageToWorldCoords(imageId, [x + width, y]);

    const bottomLeftPos = utilities.imageToWorldCoords(imageId, [x, y + height]);

    const bottomRightPos = utilities.imageToWorldCoords(imageId, [x + width, y + height]);

    return [topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];
};

const findWorldCoordinatesForEllipse = (imageId, x, y, sradius, lradius) => {
    // const topLeftPos = utilities.imageToWorldCoords(imageId, [x - lradius, y]);
    // const topRightPos = utilities.imageToWorldCoords(imageId, [x + lradius, y]);

    // const bottomLeftPos = utilities.imageToWorldCoords(imageId, [x, y - sradius]);

    // const bottomRightPos = utilities.imageToWorldCoords(imageId, [x, y + sradius]);

    // return [topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];
    const leftPos = utilities.imageToWorldCoords(imageId, [x - sradius, y]);
    const rightPos = utilities.imageToWorldCoords(imageId, [x + sradius, y]);
    const topPos = utilities.imageToWorldCoords(imageId, [x, y - lradius]);
    const bottomPos = utilities.imageToWorldCoords(imageId, [x, y + lradius]);
    return [leftPos, rightPos, topPos, bottomPos];
};

const findWorldCoordinatesForLine = (imageId, x, y, x1, y1) => {
    const start = utilities.imageToWorldCoords(imageId, [x, y]);
    const end = utilities.imageToWorldCoords(imageId, [x1, y1]);

    return [start, end];
};
const findWorldCoordinatesForFreehand = (imageId, points) => {

    return points
        .map(point => {
            try {
                return utilities.imageToWorldCoords(imageId, point);
            } catch (error) {
                console.error('Error converting point to world coordinates:', point, error);
            }
        })
};
const findWorldCoordinatesForBidirectional = (imageId, points) => {
    return points
        .map(point => {
            try {
                return utilities.imageToWorldCoords(imageId, point);
            } catch (error) {
                console.error('Error converting point to world coordinates:', point, error);
            }
        })
};

export default getAnnotation;