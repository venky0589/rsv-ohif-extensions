import { getFrameOfReference } from './collectViewPortInformation';
import getAnnotation from './renderAnnotations';
import getUtilityModule from './getUtilityModule';
import { id } from './id';
import getLayoutTemplateModule from './getLayoutTemplateModule';
import getPanelModule from './getPanelModule';
import getHangingProtocolModule from './getHangingProtocolModule';
import getDataSourcesModule from './getDataSourcesModule';
import getCommandsModule from './getCommandsModule';
import getViewportModule from './getViewportModule';
import handleMeasurementAdded from './services/handleMeasurement';

const createAnnotationObject = ({
    topLeftPointX,
    topLeftPointY,
    width,
    height,
    tool,
    ROILabel,
    seriesInstanceUID,
    sopInstanceUID,
    pointOneX,
    pointOneY,
    pointTwoX,
    pointTwoY,
    points,
    lesionInfo,
}) => {
    if (lesionInfo.ROILabel) {
        const ROILabelStartsWith = lesionInfo.ROILabel[0];
        if (ROILabelStartsWith == '1') {
            lesionInfo.lesionType = 'target';
        }
        else if (ROILabelStartsWith == '2') {
            lesionInfo.lesionType = 'non-target';
        }
        else if (ROILabelStartsWith == '3') {
            lesionInfo.lesionType = 'new-lesion';
        }
    }
    if (tool === 'ClosedPath' || tool === 'CrossRuler') {
        return {
            toolName: tool,
            points: Array.isArray(points) ? points : [],
            roi: ROILabel || '',
            seriesInstanceUID: seriesInstanceUID || '',
            sopInstanceUID: sopInstanceUID || '',
            lesionInfo: lesionInfo,
        };
    }
    if (tool === 'Line') {
        return {
            toolName: tool,
            x: parseFloat(pointOneX) || 0,
            y: parseFloat(pointOneY) || 0,
            x1: parseFloat(pointTwoX) || 0,
            y1: parseFloat(pointTwoY) || 0,
            roi: ROILabel || '',
            seriesInstanceUID,
            sopInstanceUID,
            lesionInfo: lesionInfo,
        };
    }
    return {
        toolName: tool,
        x: parseFloat(topLeftPointX) || 0,
        y: parseFloat(topLeftPointY) || 0,
        width: parseFloat(width) || 0,
        height: parseFloat(height) || 0,
        roi: ROILabel || '',
        seriesInstanceUID,
        sopInstanceUID,
        lesionInfo: lesionInfo,
    };
};

const loadExistingAnnotations = async servicesManager => {
    console.log('*********** RSV Annotations Extension Started ***********');
    try {
        const apiResponse = await fetch('http://localhost:3003/sample-aml-test.json');
        const responseJson = await apiResponse.json();
        const annotations = responseJson.annotations;
        const annotationsArray = annotations.map(annotation => {
            try {
                return createAnnotationObject({
                    ...annotation,
                    lesionInfo: annotation.lesionInfo || annotation,
                });
            } catch (error) {
                console.error('Error creating annotation object:', error, annotation);
            }
        });
        console.log(`Processing ${annotationsArray.length} valid annotations...`);
        annotationsArray.forEach(annotation => {
            try {
                getAnnotation(servicesManager, annotation);
            } catch (error) {
                console.error('Error applying annotation:', error, annotation);
            }
        });
        console.log('Annotations processed successfully:', annotationsArray);
    } catch (error) {
        console.error('Error fetching or processing annotations:', error);
    }
};
const subscriptions: any[] = [];

const rsvAnnotationsExtension = {
    id: id,
    async onModeEnter({ servicesManager, extensionManager, commandsManager }) {
        const { measurementService, viewportGridService } = servicesManager.services;

        const handleMeasurementWithServices = (eventdata) => {
            handleMeasurementAdded({ ...eventdata, servicesManager, extensionManager, commandsManager })
        }
        const measurement_add_unsubscribe = measurementService.subscribe(measurementService.EVENTS.MEASUREMENT_ADDED, handleMeasurementWithServices).unsubscribe;
        subscriptions.push(measurement_add_unsubscribe);

        setTimeout(() => {
            console.log('Loading Existing annotations...');
            loadExistingAnnotations(servicesManager);
        }, 5000);
    },
    onModeExit() {
        subscriptions.forEach(s => s());
    },
    getUtilityModule,
    getLayoutTemplateModule,
    getPanelModule,
    getHangingProtocolModule,
    getDataSourcesModule,
    getCommandsModule,
    getViewportModule,
};

export default rsvAnnotationsExtension;