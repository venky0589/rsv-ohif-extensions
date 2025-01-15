import React from 'react';
import { ViewportGrid } from '@ohif/ui';
import TimepointView from './TimepointView';

const RecistLayout1 = ({ servicesManager, extensionManager, viewportGridData }) => {
  const { displaySets } = viewportGridData;

  return (
    <div className="recist-layout" style={{ display: 'flex', height: '100%' }}>
      {/* Viewer Section */}
      <div
        className="viewer-section"
        style={{ flex: 2, borderRight: '1px solid #ddd' }}
      >
        <ViewportGrid numRows={1} numCols={1}>
          {displaySets.map((displaySet, index) => (
            <div key={index} data-viewport-id={index}>
              {/* Insert a viewer (e.g., CornerstoneViewport or custom) */}
              <p>{`Viewport for: ${displaySet.seriesDescription}`}</p>
            </div>
          ))}
        </ViewportGrid>
      </div>

      {/* Timepoints Section */}
      <div
        className="timepoints-section"
        style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}
      >
        <TimepointView servicesManager={servicesManager} />
      </div>
    </div>
  );
};

export default RecistLayout1;
