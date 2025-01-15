export const addExistingAnnotations = (servicesManager,extensionManager,uid,imageuuid) => {
    const { MeasurementService,displaySetService } = servicesManager.services;

    console.log('Adding existing annotations...')
    // Sample measurement data
    const annotation = {
        id: 'sample-annotation',
        toolName: 'EllipticalRoi',
        patientID: 'TCGA-QQ-A8VH',
        studyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.215308722288168917637555384485',
        seriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.211827887399040258667895649501',
        SOPInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.132599067175649997415524181333',
        frameNumber: 1,
        points: [
            { x: 100, y: 150 },
            { x: 200, y: 250 }
        ],
    };
// Ellipse Example
const ellipseData = 
/*
{
    center: { x: 120, y: 150 },
    width: 80,
    height: 40,
    rotation: 0, // No rotation
  };*/
  {
    cachedStats:{},
    handles: {
    points: [[23.415100097656136,-72.25612396065992,15.251035118414336],[23.415100097656136,-72.25612396065992,-60.882243837540116],
    [23.415100097656136,-121.77137681547234,-22.81560435956287],[23.415100097656136,-22.740871105847514,-22.81560435956287]],
    textBox: {
      hasMoved: false,
     /* worldBoundingBox: {
        topLeft: [23.415100097656136,-72.25612396065992,15.251035118414336],
        topRight: [23.415100097656136,-72.25612396065992,-60.882243837540116],
        bottomLeft: [23.415100097656136,-121.77137681547234,-22.81560435956287],
        bottomRight: [23.415100097656136,-22.740871105847514,-22.81560435956287]
      }*/
    }
    
  }
}
  // Line Example
  const lineData = {
    start: { x: 100, y: 200 },
    end: { x: 150, y: 250 },
  };
  
  // Closed Path Example
  const closedPathData = {
    points: [{ x: 100, y: 100 }, { x: 150, y: 120 }, { x: 130, y: 180 }],
    isClosed: true,
  };

  const source = MeasurementService.getSource(
    "Cornerstone3DTools",
    "0.1"
  );
  const mappings = MeasurementService.getSourceMappings(
    "Cornerstone3DTools",
    "0.1"  
  );
  const matchingMapping = mappings.find(m => m.annotationType === "EllipticalROI");

  /*



  const newAnnotationUID = measurementService.addRawMeasurement(
    source,
    annotationType,
    { annotation },
    matchingMapping.toMeasurementSchema,
    dataSource
  );

  */

  const dataSource = extensionManager.getActiveDataSource()[0];
  
  const displaySet = displaySetService.getDisplaySetsForSeries('1.3.6.1.4.1.14519.5.2.1.3023.4024.211827887399040258667895649501')[0];
  console.log(displaySet);

    const rawMeasurementData = {
        annotationUID: "UUID ELLIPSE",
        data: ellipseData,
        metadata: {
          toolName: 'EllipticalROI',
          volumeId:uid,
          referencedImageId: '1.3.6.1.4.1.14519.5.2.1.3023.4024.132599067175649997415524181333',
          //FrameOfReferenceUID:'1.3.6.1.4.1.14519.5.2.1.3023.4024.132599067175649997415524181333',
          /*patientID: 'TCGA-QQ-A8VH',
          studyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.215308722288168917637555384485',
          seriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.3023.4024.211827887399040258667895649501',
          sopInstanceUid: '1.3.6.1.4.1.14519.5.2.1.3023.4024.132599067175649997415524181333',
          frameIndex: 0,*/
        },
       
      };
      
     // measurementService.addRawMeasurement(source, rawMeasurementData);
    console.log('Updating existing annotations... END')

    try {
        MeasurementService.addRawMeasurement(source,"EllipticalROI",{annotation:rawMeasurementData}, matchingMapping.toMeasurementSchema,dataSource);
        console.log("Annotation successfully added.");
      } catch (error) {
        console.error("Failed to add annotation:", error);
      }
}