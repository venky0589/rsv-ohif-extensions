import { hotkeys, DicomMetadataStore, ViewportGridService } from '@ohif/core';
import { initToolGroups, toolbarButtons, moreTools } from '@ohif/mode-longitudinal';
import { id } from './id';
import RecistLayout from './layout';
import { useViewportGrid } from '@ohif/ui-next';
import { useImageViewer } from '@ohif/ui';






const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  thumbnailList: '@ohif/extension-default.panelModule.seriesList',
  wsiSopClassHandler:
    '@ohif/extension-cornerstone.sopClassHandlerModule.DicomMicroscopySopClassHandler',
};

const rsv = {
  layout: 'rsv-annotations-extension.layoutTemplateModule.rsvRecistLayout',
  hp: 'rsv-annotations-extension.hangingProtocolModule.recist-workflow-protocol',
  seriesList: 'rsv-annotations-extension.panelModule.SeriesPanel',
  newStudyBrowser: 'rsv-annotations-extension.panelModule.NewStudyBrowser',
  LesionTable: 'rsv-annotations-extension.panelModule.LesionTable',
  viewport: 'rsv-annotations-extension.viewportModule.recist-reference-viewport'
};
const cornerstone = {
  measurements: '@ohif/extension-cornerstone.panelModule.panelMeasurement',
  segmentation: '@ohif/extension-cornerstone.panelModule.panelSegmentation',
};

const tracked = {
  measurements: '@ohif/extension-measurement-tracking.panelModule.trackedMeasurements',
  thumbnailList: '@ohif/extension-measurement-tracking.panelModule.seriesList',
  viewport: '@ohif/extension-measurement-tracking.viewportModule.cornerstone-tracked',
};

const dicomsr = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr',
  sopClassHandler3D: '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr-3d',
  viewport: '@ohif/extension-cornerstone-dicom-sr.viewportModule.dicom-sr',
};

const dicomvideo = {
  sopClassHandler: '@ohif/extension-dicom-video.sopClassHandlerModule.dicom-video',
  viewport: '@ohif/extension-dicom-video.viewportModule.dicom-video',
};

const dicompdf = {
  sopClassHandler: '@ohif/extension-dicom-pdf.sopClassHandlerModule.dicom-pdf',
  viewport: '@ohif/extension-dicom-pdf.viewportModule.dicom-pdf',
};

const dicomSeg = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-seg.sopClassHandlerModule.dicom-seg',
  viewport: '@ohif/extension-cornerstone-dicom-seg.viewportModule.dicom-seg',
};

const dicomPmap = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-pmap.sopClassHandlerModule.dicom-pmap',
  viewport: '@ohif/extension-cornerstone-dicom-pmap.viewportModule.dicom-pmap',
};

const dicomRT = {
  viewport: '@ohif/extension-cornerstone-dicom-rt.viewportModule.dicom-rt',
  sopClassHandler: '@ohif/extension-cornerstone-dicom-rt.sopClassHandlerModule.dicom-rt',
};
/**
 * Just two dependencies to be able to render a viewport with panels in order
 * to make sure that the mode is working.
 */
const extensionDependencies = {
  // Can derive the versions at least process.env.from npm_package_version
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  '@ohif/extension-measurement-tracking': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-sr': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-seg': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-pmap': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-rt': '^3.0.0',
  '@ohif/extension-dicom-pdf': '^3.0.1',
  '@ohif/extension-dicom-video': '^3.0.1',
};

/*
const segmentation = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-seg.sopClassHandlerModule.dicom-seg',
  viewport: '@ohif/extension-cornerstone-dicom-seg.viewportModule.dicom-seg',
};*/


function modeFactory({ modeConfiguration }) {
  return {
    /**
     * Mode ID, which should be unique among modes used by the viewer. This ID
     * is used to identify the mode in the viewer's state.
     */
    id,
    routeName: 'recist',
    /**
     * Mode name, which is displayed in the viewer's UI in the workList, for the
     * user to select the mode.
     */
    displayName: 'Recist Mode',
    /**
     * Runs when the Mode Route is mounted to the DOM. Usually used to initialize
     * Services and other resources.
     */
    onModeEnter: ({ servicesManager, extensionManager, commandsManager }: withAppTypes) => {
      const { measurementService, toolbarService, toolGroupService, hangingProtocolService, customizationService, viewportGridService } = servicesManager.services;

      measurementService.clearMeasurements();

      // Init Default and SR ToolGroups
      initToolGroups(extensionManager, toolGroupService, commandsManager);

      console.log("ToolBar Buttons", toolbarButtons);
      console.log("More Tools:", moreTools);
      toolbarService.addButtons([...toolbarButtons, ...moreTools]);
      toolbarService.createButtonSection('primary', [
        'MeasurementTools',
        'Zoom',
        'WindowLevel',
        'Pan',
        'Capture',
        'Layout',
        'Crosshairs',
        'MoreTools',
      ]);

      // Code to add custom attributes to Hanging Protocol Service
      const getClinicalTrialTimePointDescription = metaData => {
        return metaData.ClinicalTrialTimePointDescription || null;
      };

      hangingProtocolService.addCustomAttribute(
        'instance',
        'ClinicalTrialTimePointDescription',
        metaData => getClinicalTrialTimePointDescription(metaData)
      );

      const visitItem = {
        id: 'VisitNameOverlay',
        customizationType: 'ohif.overlayItem',
        label: 'Vist:',
        title: 'VisitName Name',
        color: 'yellow',
        condition: ({ instance }) => instance && instance.ClinicalTrialTimePointDescription,
        attribute: 'VisitName',
        contentF: ({ instance, formatters: { formatPN } }) => `${formatPN(instance.ClinicalTrialTimePointDescription)}`,
      };
      const studyDateItem = {
        id: 'StudyDate',
        customizationType: 'ohif.overlayItem',
        label: '',
        title: 'Study date',
        condition: ({ referenceInstance }) => referenceInstance?.StudyDate,
        contentF: ({ referenceInstance, formatters: { formatDate } }) =>
          formatDate(referenceInstance.StudyDate),
      };

      const seriesDescriptionItem = {
        id: 'SeriesDescription',
        customizationType: 'ohif.overlayItem',
        label: '',
        title: 'Series description',
        condition: ({ referenceInstance }) => {
          return referenceInstance && referenceInstance.SeriesDescription;
        },
        contentF: ({ referenceInstance }) => referenceInstance.SeriesDescription,
      };

      const topLeftItems = {
        id: 'cornerstoneOverlayTopLeft',
        items: [studyDateItem, seriesDescriptionItem, visitItem],
      };


      customizationService.addModeCustomizations([
        {
          id: 'cornerstoneViewportClickCommands',
          doubleClick: {
            commandName: 'toggleOneUp',
            commandOptions: {},
          },
          shiftdoubleClick: {
            commandName: 'viewPortDoubleClick',
            commandOptions: {},
          },

        }, topLeftItems
      ]);


    },
    onModeExit: ({ servicesManager }: withAppTypes) => {
      const {
        toolGroupService,
        syncGroupService,
        segmentationService,
        cornerstoneViewportService,
        uiDialogService,
        uiModalService,
      } = servicesManager.services;

      uiDialogService.dismissAll();
      uiModalService.hide();
      toolGroupService.destroy();
      syncGroupService.destroy();
      segmentationService.destroy();
      cornerstoneViewportService.destroy();
    },
    onSetupRouteComplete: ({ servicesManager, extensionManager, commandsManager }) => {

      setTimeout(() => {
        const utilityModule = extensionManager.getModuleEntry(
          'rsv-annotations-extension.utilityModule.renderVisitSelectorLayout'
        );
        const { renderVisitSelectorLayout } = utilityModule.exports;

        renderVisitSelectorLayout({ servicesManager, extensionManager, commandsManager });
      }, 100);
    },
    /** */
    validationTags: {
      study: [],
      series: [],
    },
    /**
     * A boolean return value that indicates whether the mode is valid for the
     * modalities of the selected studies. For instance a PET/CT mode should be
     */
    isValidMode: ({ modalities }) => {
      return { valid: true };
    },
    /**
     * Mode Routes are used to define the mode's behavior. A list of Mode Route
     * that includes the mode's path and the layout to be used. The layout will
     * include the components that are used in the layout. For instance, if the
     * default layoutTemplate is used (id: '@ohif/extension-default.layoutTemplateModule.viewerLayout')
     * it will include the leftPanels, rightPanels, and viewports. However, if
     * you define another layoutTemplate that includes a Footer for instance,
     * you should provide the Footer component here too. Note: We use Strings
     * to reference the component's ID as they are registered in the internal
     * ExtensionManager. The template for the string is:
     * `${extensionId}.{moduleType}.${componentId}`.
     */
    routes: [
      {
        path: 'recist',
        layoutTemplate: ({ location, servicesManager }) => {
          return {
            id: rsv.layout,
            props: {
              //  leftPanels: [tracked.thumbnailList],
              leftPanels: [rsv.newStudyBrowser, rsv.seriesList],
              // rightPanels: [cornerstone.segmentation, tracked.measurements],
              rightPanels: [cornerstone.segmentation, cornerstone.measurements, rsv.LesionTable],
              rightPanelClosed: false,
              leftPanelClosed: true,
              viewports: [
                {
                  namespace: rsv.viewport,
                  displaySetsToDisplay: [
                    ohif.sopClassHandler,
                  ],
                }
              ],
            },
            /*props: {
              leftPanels: [ohif.leftPanel],
              rightPanels: [ohif.rightPanel],
              viewports: [

              ],
            },*/
          };
        },
        displayName: 'RECIST Viewer',
        init: async ({ servicesManager, studyInstanceUIDs, dataSource }) => {


          //TODO: Sample method to initialize the route.
          //Below are the parameters
          /*{
            servicesManager,
            extensionManager,
            hotkeysManager,
            studyInstanceUIDs,
            dataSource,
            filters,
          },
          hangingProtocolIdToUse,
          stageIndexToUse*/
          //Use cases
          //Use Case 1: Fetching Metadata
          //Use Case 2: Preloading Display Sets
          //Use Case 3: Dynamic Routing
          //Use Case 4: Custom Initialization

          /*const { displaySetService, viewportGridService } = servicesManager.services;

          // Preload display sets
          const displaySets = displaySetService.getActiveDisplaySets();
          console.log(displaySets);
          viewportGridService.setDisplaySetsForViewport({ viewportIndex: 0, displaySetInstanceUID: displaySets[0].displaySetInstanceUID });

          console.log('Display sets preloaded:', displaySets);*/


        },
      },
    ],
    /** List of extensions that are used by the mode */
    extensions: extensionDependencies,
    /** HangingProtocol used by the mode */
    // hangingProtocol: [''],
    //hangingProtocol: rsv.hp,
    /** SopClassHandlers used by the mode */
    sopClassHandlers: [ohif.sopClassHandler],
    /** hotkeys for mode */
    hotkeys: [...hotkeys.defaults.hotkeyBindings],
  };
}

const mode = {
  id,
  modeFactory,
  extensionDependencies,
};

export default mode;
