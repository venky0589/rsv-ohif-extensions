import React, { useState, useEffect } from 'react';
import RecistMeasurementTable from './RecistMeasurementTable';

const TimepointView = ({ servicesManager }) => {
    const [timepoints, setTimepoints] = useState([]);

    useEffect(() => {
        const measurementService = servicesManager.getService('MeasurementService');
        const timepoints = measurementService.getTimepoints();
        setTimepoints(timepoints);
    }, [servicesManager]);

    return (
        <div className="timepoints-view">
            <h2>RECIST Timepoints</h2>
            {timepoints.map((timepoint, index) => (
                <RecistMeasurementTable key={index} timepoint={timepoint} />
            ))}
        </div>
    );
};

export default TimepointView;
