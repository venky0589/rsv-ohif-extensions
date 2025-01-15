import React, { useEffect, useState, useCallback } from 'react';
import { useImageViewer, useViewportGrid } from '@ohif/ui';
import { useNavigate } from 'react-router-dom';

import { DicomMetadataStore } from '@ohif/core';
import getStudiesForPatientByMRN from './getStudiesForPatientByMRN';

const NewStudyBrowser = ({ commandsManager, extensionManager, servicesManager }) => {

    const { displaySetService } = servicesManager.services;
    const dataSource = extensionManager.getDataSources()[0];
    const { StudyInstanceUIDs } = useImageViewer();
    const [{ activeViewportId, viewports, isHangingProtocolLayout }, viewportGridService] = useViewportGrid();
    const [hasLoadedViewports, setHasLoadedViewports] = useState(false);

    const navigate = useNavigate();

    const [timepoints, setTimepoints] = useState([]);

    useEffect(() => {
        if (!hasLoadedViewports) {
            if (activeViewportId) {
                // Once there is an active viewport id, it means the layout is ready
                // so wait a bit of time to allow the viewports preferential loading
                // which improves user experience of responsiveness significantly on slower
                // systems.
                window.setTimeout(() => setHasLoadedViewports(true), 250);
            }

            return;
        }

        const currentDisplaySets = displaySetService.activeDisplaySets;
        console.log(currentDisplaySets);
        currentDisplaySets.forEach(displaySet => {
            console.log("TEST", displaySet.instance?.ClinicalTrialTimePointDescription);
        });


    }, [dataSource, StudyInstanceUIDs, activeViewportId, hasLoadedViewports])




    return (<div className="text-red-500">New Study Browser</div>)

};
export default NewStudyBrowser;