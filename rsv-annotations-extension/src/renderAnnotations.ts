
import * as cs3dTools from '@cornerstonejs/tools';
import { metaData, utilities } from '@cornerstonejs/core';
import { getFrameOfReference } from './collectViewPortInformation';


const annotation_template = {
    "invalidated": false,
    "highlighted": true,
    "metadata": {
        "toolName": "RectangleROI",
        "FrameOfReferenceUID": "",
        "referencedImageId": "",
        //"sliceIndex": 4
    },
    "data": {
        "label": "",
        "handles": {
            "points": [
            ],
            "textBox": {

            },
            "activeHandleIndex": null
        },
        "cachedStats": {
        }
    },
    "annotationUID": "",
    "isLocked": false,
    "isVisible": true
};
const getAnnotation = (servicesManager, jsonAnnotation) => {
    const annData = JSON.parse(JSON.stringify(annotation_template));

    const { FrameOfReferenceUID, ImageId, instance } = getFrameOfReference(servicesManager, jsonAnnotation.seriesInstanceUID, jsonAnnotation.sopInstanceUID);

    annData.metadata.FrameOfReferenceUID = FrameOfReferenceUID;
    annData.metadata.referencedImageId = ImageId;
    annData.data.label = jsonAnnotation.roi;


    console.log("uuidv4", utilities.uuidv4());

    annData.annotationUID = utilities.uuidv4();

    switch (jsonAnnotation.toolName) {

        case "ellipse":
            annData.metadata.toolName = "EllipticalROI";
            annData.data.handles.points = findWorldCoordinatesForEllipse(ImageId, jsonAnnotation.x, jsonAnnotation.y, jsonAnnotation.width, jsonAnnotation.height);
            cs3dTools.annotation.state.addAnnotation(annData);

            break;
        case "circle":
            annData.metadata.toolName = "CircleROI";
            annData.data.handles.points = findWorldCoordinatesForCircle(ImageId, jsonAnnotation.x, jsonAnnotation.y, jsonAnnotation.radius);
            cs3dTools.annotation.state.addAnnotation(annData);

            break;

        case "line":
            annData.metadata.toolName = "Length";
            annData.data.handles.points = findWorldCoordinatesForLine(ImageId, jsonAnnotation.x, jsonAnnotation.y, jsonAnnotation.x1, jsonAnnotation.y1);
            cs3dTools.annotation.state.addAnnotation(annData);
            break;


        case "rectangle":
            annData.metadata.toolName = "RectangleROI";
            annData.data.handles.points = findWorldCoordinatesForRectangle(ImageId, jsonAnnotation.x, jsonAnnotation.y, jsonAnnotation.width, jsonAnnotation.height);
            cs3dTools.annotation.state.addAnnotation(annData);
            break;

        case 'ClosedPath':
            annData.metadata.toolName = "ClosedPathROI";
            annData.data.handles.points = findWorldCoordinatesForClosedPath(ImageId, jsonAnnotation.x, jsonAnnotation.y, jsonAnnotation.width, jsonAnnotation.height);
            cs3dTools.annotation.state.addAnnotation(annData);

        default:
            break;
    };
};


const findWorldCoordinatesForRectangle = (imageId, x, y, width, height) => {

    const topLeftPos = utilities.imageToWorldCoords(imageId, [x, y]);
    const topRightPos = utilities.imageToWorldCoords(imageId, [x + width, y]);

    const bottomLeftPos = utilities.imageToWorldCoords(imageId, [x, y + height]);

    const bottomRightPos = utilities.imageToWorldCoords(imageId, [x + width, y + height]);

    return [topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];

};

const findWorldCoordinatesForEllipse = (imageId, x, y, sradius, lradius) => {

    const topLeftPos = utilities.imageToWorldCoords(imageId, [x - lradius, y]);
    const topRightPos = utilities.imageToWorldCoords(imageId, [x + lradius, y]);

    const bottomLeftPos = utilities.imageToWorldCoords(imageId, [x, y - sradius]);

    const bottomRightPos = utilities.imageToWorldCoords(imageId, [x, y + sradius]);

    return [topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];

};

const findWorldCoordinatesForLine = (imageId, x, y, x1, y1) => {

    const start = utilities.imageToWorldCoords(imageId, [x, y]);
    const end = utilities.imageToWorldCoords(imageId, [x1, y1]);

    return [start, end];

};


const findWorldCoordinatesForCircle = (imageId, x, y, radius) => {

    const center = utilities.imageToWorldCoords(imageId, [x, y]);
    const pointOnCircle = utilities.imageToWorldCoords(imageId, [x + radius, y + radius]);

    return [center, pointOnCircle];

};


const findWorldCoordinatesForClosedPath = (imageId, x, y, radius) => {

    const center = utilities.imageToWorldCoords(imageId, [x, y]);
    const pointOnCircle = utilities.imageToWorldCoords(imageId, [x + radius, y + radius]);

    return [center, pointOnCircle];

};

const renderAnnotations = (servicesManager, annotations) => {
    const { DisplaySetService, ViewportGridService } = servicesManager.services;


    // const unsubscribe = ViewportGridService.subscribe(ViewportGridService.EVENTS.VIEWPORTS_READY, () => {

    console.log("*****************----------------------My renderAnnotations Started");

    const annotationsArray = annotations || [{
        toolName: 'ellipse',
        x: 50,
        y: 50,
        width: 20,
        height: 50,
        roi: '101',
        seriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.211827887399040258667895649501',
        sopInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.132599067175649997415524181333'
    },
    {
        toolName: 'rectangle',
        x: 100,
        y: 100,
        width: 170,
        height: 130,
        roi: "102",
        seriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.161252729707561121988132072635',
        sopInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.876284134797014791500680910392'
    },
    {
        toolName: 'circle',
        x: 100,
        y: 100,
        radius: 20,
        roi: "103",
        seriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.211827887399040258667895649501',
        sopInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.134998327137377959273000041547'
    },
    {
        toolName: 'line',
        x: 150,
        y: 100,
        x1: 170,
        y1: 170,
        roi: "104",
        seriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.211827887399040258667895649501',
        sopInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.132599067175649997415524181333'
    },
    ];

    annotationsArray.forEach(ann => {
        getAnnotation(servicesManager, ann);
    });
    // unsubscribe();
    // });
    // }, 1000);
}
export default renderAnnotations;