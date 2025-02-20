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
    if (tool === 'ClosedPath') {
        return {
            toolName: tool,
            points: Array.isArray(points) ? points : [],
            roi: ROILabel || '',
            seriesInstanceUID: seriesInstanceUID || '',
            sopInstanceUID: sopInstanceUID || '',
            lesionInfo: lesionInfo,
        };
    }
    if (tool === 'CrossRuler') {
        return {
            toolName: tool,
            points: Array.isArray(points) ? points : [],
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

export default createAnnotationObject;