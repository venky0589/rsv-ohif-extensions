import { getFrameOfReference } from './collectViewPortInformation';
import getAnnotation from './renderAnnotations';
import getUtilityModule from './getUtilityModule';
import { id } from './id';
import getLayoutTemplateModule from './getLayoutTemplateModule';
import getPanelModule from './getPanelModule';
import getHangingProtocolModule from './getHangingProtocolModule';
import getDataSourcesModule from './getDataSourcesModule';
import getCommandsModule from './getCommandsModule';
const annotationData = {
  "invalidated": false,
  "highlighted": true,
  "metadata": {
    "toolName": "RectangleROI",
    "FrameOfReferenceUID": "1.3.6.1.4.1.14519.5.2.1.3023.4024.231311529795221040217906484458",
    "referencedImageId": "wadors:https://d14fa38qiwhyfd.cloudfront.net/dicomweb/studies/1.3.6.1.4.1.14519.5.2.1.3023.4024.215308722288168917637555384485/series/1.3.6.1.4.1.14519.5.2.1.3023.4024.126142523607420892414949226445/instances/1.3.6.1.4.1.14519.5.2.1.3023.4024.876783478503756781748490295111/frames/1",
    //"sliceIndex": 4
  },
  "data": {
    "label": "TEST",
    "handles": {
      "points": [
        [
          -48.23927486024694,
          -18.188322941702758,
          -20.76192704224752
        ],
        [
          13.432089521437854,
          -18.188322941702758,
          -20.76192704224752
        ],
        [
          -48.23927486024694,
          15.950319249229373,
          -20.23571995329263
        ],
        [
          13.432089521437854,
          15.950319249229373,
          -20.23571995329263
        ]
      ],
      "textBox": {

      },
      "activeHandleIndex": null
    },
    "cachedStats": {
    }
  },
  "annotationUID": "ea45a45c-0731-47d4-9438-d2a53ffea4ff",
  "isLocked": false,
  "isVisible": true
};
const annotationData2 = {
  "invalidated": false,
  "highlighted": true,
  "metadata": {
    "toolName": "RectangleROI",
    "FrameOfReferenceUID": "1.3.6.1.4.1.14519.5.2.1.3023.4024.231311529795221040217906484458",
    "referencedImageId": "wadors:https://d14fa38qiwhyfd.cloudfront.net/dicomweb/studies/1.3.6.1.4.1.14519.5.2.1.3023.4024.215308722288168917637555384485/series/1.3.6.1.4.1.14519.5.2.1.3023.4024.126142523607420892414949226445/instances/1.3.6.1.4.1.14519.5.2.1.3023.4024.876783478503756781748490295111/frames/1",
    //"sliceIndex": 4
  },
  "data": {
    "label": "TEST",
    "handles": {
      "points": [
        [
          -48.23927486024694,
          -18.188322941702758,
          -20.76192704224752
        ],
        [
          13.432089521437854,
          -18.188322941702758,
          -20.76192704224752
        ],
        [
          -48.23927486024694,
          15.950319249229373,
          -20.23571995329263
        ],
        [
          13.432089521437854,
          15.950319249229373,
          -20.23571995329263
        ]
      ],
      "textBox": {

      },
      "activeHandleIndex": null
    },
    "cachedStats": {
    }
  },
  "annotationUID": "ea45a45c-0731-47d4-9438-d2a53ffea4ff",
  "isLocked": false,
  "isVisible": true
};
const rsvAnnotationsExtension = {
  id: id,

  onModeEnter({ servicesManager, extensionManager, commandsManager }) {

  },
  getUtilityModule,
  getLayoutTemplateModule,
  getPanelModule,
  getHangingProtocolModule,
  getDataSourcesModule,
  getCommandsModule

};



export default rsvAnnotationsExtension;