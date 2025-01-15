import React from 'react';
import './SeriesPanel.css'; // Import CSS for styling
import { useImageViewer, useViewportGrid } from '@ohif/ui';

const SeriesPanel = () => {
    const { StudyInstanceUIDs } = useImageViewer();

    return (
        <div className="series-panel">
            <h3>Series List {StudyInstanceUIDs}</h3>
            <p>Thumbnail list of series for the RECIST workflow.</p>
        </div>
    );
};

export default SeriesPanel;
