import React, { useEffect, useState, useCallback } from 'react';

import getStudiesForPatientByMRN from "./getStudiesForPatientByMRN";
import requestDisplaySetCreationForStudy from './requestDisplaySetCreationForStudy';
import RPanelStudyBrowser from './RPanelStudyBrowser';
import getImageSrcFromImageId from './getImageSrcFromImageId';

const WrappedStudyPanelBrowser = ({ commandsManager, extensionManager, servicesManager, keyTimePoints }) => {
    const dataSource = extensionManager.getDataSources()[0];
    const _getStudiesForPatientByMRN = getStudiesForPatientByMRN.bind(null, dataSource);
    const _getImageSrcFromImageId = useCallback(
        _createGetImageSrcFromImageIdFn(extensionManager),
        []
    );
    const _requestDisplaySetCreationForStudy = requestDisplaySetCreationForStudy.bind(
        null,
        dataSource
    );

    return (
        <RPanelStudyBrowser
            servicesManager={servicesManager}
            dataSource={dataSource}
            getImageSrc={_getImageSrcFromImageId}
            getStudiesForPatientByMRN={_getStudiesForPatientByMRN}
            requestDisplaySetCreationForStudy={_requestDisplaySetCreationForStudy}
            keyTimePoints={keyTimePoints}
        />
    );

};

function _createGetImageSrcFromImageIdFn(extensionManager) {
    const utilities = extensionManager.getModuleEntry(
        '@ohif/extension-cornerstone.utilityModule.common'
    );

    try {
        const { cornerstone } = utilities.exports.getCornerstoneLibraries();
        return getImageSrcFromImageId.bind(null, cornerstone);
    } catch (ex) {
        throw new Error('Required command not found');
    }
}

export default WrappedStudyPanelBrowser;

