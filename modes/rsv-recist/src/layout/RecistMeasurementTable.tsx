import React from 'react';

const RecistMeasurementTable = ({ timepoint }) => {
    return (
        <div className="recist-measurement-table">
            <h3>{timepoint.description}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Lesion</th>
                        <th>Location</th>
                        <th>Baseline (mm)</th>
                        <th>Follow-Up (mm)</th>
                        <th>Change (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {timepoint.measurements.map((measurement, index) => (
                        <tr key={index}>
                            <td>{measurement.lesionId}</td>
                            <td>{measurement.location}</td>
                            <td>{measurement.baseline || '-'}</td>
                            <td>{measurement.followUp || '-'}</td>
                            <td>{measurement.change ? `${measurement.change.toFixed(2)}%` : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecistMeasurementTable;
