
import { DicomMetadataStore } from '@ohif/core';


export const getFrameOfReference = (ServicesManager, seriesInstanceUID, sopInstanceUID) => {

  const { DisplaySetService } = ServicesManager.services;

  // Assuming you have a `seriesInstanceUID`
  const displaySets = DisplaySetService.getDisplaySetsForSeries(seriesInstanceUID);

  // If you have `sopInstanceUID`, you can iterate through instances
  const instanceObj = displaySets.map(ds => {
    const index = ds.instances.findIndex(instance => Reflect.get(instance, "SOPInstanceUID") === sopInstanceUID);

    return index !== -1 ? { instance: ds.instances[index], index } : null;
    //const instances = ds.instances.filter(instance => Reflect.get(instance, "SOPInstanceUID") === sopInstanceUID);
    //return instances.length > 0 ? instances[0] : null;
  }).filter(instance => instance !== null);
  const forUID = Reflect.get(instanceObj[0].instance, "FrameOfReferenceUID");
  const imageId = Reflect.get(instanceObj[0].instance, "imageId")
  console.log("Frame of reference:", forUID);

  return { "FrameOfReferenceUID": forUID, "ImageId": imageId, "instance": instanceObj[0].instance, sliceIndex: instanceObj[0].index };
}

export const findViewPortsForSeriesInstanceUID = (ServicesManager, seriesInstanceUID) => {
  const { DisplaySetService } = ServicesManager.services;

  // Assuming you have a `seriesInstanceUID`
  const displaySets = DisplaySetService.getDisplaySetsForSeries(seriesInstanceUID);

  return findViewPort(ServicesManager, displaySets[0]);

};

const findViewPort = (servicesManager, displaySet) => {
  const { viewportGridService } = servicesManager.services;

  // Get the current state of the viewport grid
  const gridState = viewportGridService.getState();

  // Find the viewport displaying the desired display set
  let viewportEntry: any = null;
  for (const viewport of gridState.viewports.values()) {
    if (viewport.displaySetInstanceUIDs.includes(displaySet.displaySetInstanceUID)) {
      viewportEntry = viewport;
      break; // Exit early once found
    }
  }

  if (viewportEntry) {
    const viewportId = viewportEntry.viewportId;
    // Proceed to retrieve camera settings for this viewportId

    console.log("Viewport ID:", viewportId);
  }

  return viewportEntry;

}




const getFrameOfReferenceUID = (sopInstanceUID) => {
  const { metadataProvider } = DicomMetadataStore;

  // Retrieve the metadata for the given SOPInstanceUID
  const instance = metadataProvider.get('instance', sopInstanceUID);

  if (instance && instance.FrameOfReferenceUID) {
    return instance.FrameOfReferenceUID;
  }

  // Return null if the FrameOfReferenceUID was not found
  return null;
};

