
import { DicomMetadataStore } from '@ohif/core';





export const getFrameOfReference=(ServicesManager,seriesInstanceUID,sopInstanceUID)=>{

const { DisplaySetService } = ServicesManager.services;

// Assuming you have a `seriesInstanceUID`
const displaySets = DisplaySetService.getDisplaySetsForSeries(seriesInstanceUID);

// If you have `sopInstanceUID`, you can iterate through instances
const instances = displaySets.map(ds => {
  const instances = ds.instances.filter(instance => Reflect.get(instance, "SOPInstanceUID") === sopInstanceUID);
  return instances.length > 0 ? instances[0] : null;
}).filter(instance => instance !== null);
const forUID=Reflect.get(instances[0],"FrameOfReferenceUID")
const imageId=Reflect.get(instances[0],"imageId")
console.log("Frame of reference:",forUID);

return {"FrameOfReferenceUID":forUID,"ImageId":imageId,"instance":instances[0]};
}


const findViewPort=(servicesManager,displaySet)=>{
    const { viewportGridService } = servicesManager.services;

    // Get the current state of the viewport grid
    const gridState = viewportGridService.getState();
    
    // Find the viewport displaying the desired display set
    const viewportEntry = gridState.viewports.find(viewport => {
      return viewport.displaySetInstanceUIDs.includes(displaySet.displaySetInstanceUID);
    });
    
    if (viewportEntry) {
      const viewportId = viewportEntry.viewportId;
      // Proceed to retrieve camera settings for this viewportId

      console.log("Viewport ID:",viewportId);
    }

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

