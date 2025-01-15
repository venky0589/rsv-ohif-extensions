import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { UserPreferences, AboutModal, useModal } from '@ohif/ui';
import { Header, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@ohif/ui-next';
import i18n from '@ohif/i18n';
import { hotkeys } from '@ohif/core';
import { Toolbar } from './ToolBar';
import SeriesListMenu from './SeriesListMenu';
import getImageSrcFromImageId from '../panels/getImageSrcFromImageId';
import SeriesPopUpMenu from './SeriesPopUpMenu';
const { availableLanguages, defaultLanguage, currentLanguage } = i18n;

const RecistViewerHeader = ({
    hotkeysManager,
    extensionManager,
    servicesManager,
    appConfig,
}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const { viewportGridService, displaySetService } = servicesManager.services;

    const [currentDisplaySets, setCurrentStudyDisplaySets] = useState([]);

    const dataSource = extensionManager.getDataSources()[0];

    const _getImageSrcFromImageId = useCallback(
        _createGetImageSrcFromImageIdFn(),
        []
    );
    function _createGetImageSrcFromImageIdFn() {
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


    const onClickReturnButton = () => {
        const { pathname } = location;
        const dataSourceIdx = pathname.indexOf('/', 1);
        const query = new URLSearchParams(window.location.search);
        const configUrl = query.get('configUrl');

        const dataSourceName = pathname.substring(dataSourceIdx + 1);
        const existingDataSource = extensionManager.getDataSources(dataSourceName);

        const searchQuery = new URLSearchParams();
        if (dataSourceIdx !== -1 && existingDataSource) {
            searchQuery.append('datasources', pathname.substring(dataSourceIdx + 1));
        }

        if (configUrl) {
            searchQuery.append('configUrl', configUrl);
        }

        navigate({
            pathname: '/',
            search: decodeURIComponent(searchQuery.toString()),
        });
    };

    const { t } = useTranslation();
    const { show, hide } = useModal();
    const { hotkeyDefinitions, hotkeyDefaults } = hotkeysManager;
    const versionNumber = process.env.VERSION_NUMBER;
    const commitHash = process.env.COMMIT_HASH;

    const menuOptions = [
        {
            title: t('Header:About'),
            icon: 'info',
            onClick: () =>
                show({
                    content: AboutModal,
                    title: t('AboutModal:About OHIF Viewer'),
                    contentProps: { versionNumber, commitHash },
                    containerDimensions: 'max-w-4xl max-h-4xl',
                }),
        },
        {
            title: t('Header:Preferences'),
            icon: 'settings',
            onClick: () =>
                show({
                    title: t('UserPreferencesModal:User preferences'),
                    content: UserPreferences,
                    containerDimensions: 'w-[70%] max-w-[900px]',
                    contentProps: {
                        hotkeyDefaults: hotkeysManager.getValidHotkeyDefinitions(hotkeyDefaults),
                        hotkeyDefinitions,
                        currentLanguage: currentLanguage(),
                        availableLanguages,
                        defaultLanguage,
                        onCancel: () => {
                            hotkeys.stopRecord();
                            hotkeys.unpause();
                            hide();
                        },
                        onSubmit: ({ hotkeyDefinitions, language }) => {
                            if (language.value !== currentLanguage().value) {
                                i18n.changeLanguage(language.value);
                            }
                            hotkeysManager.setHotkeys(hotkeyDefinitions);
                            hide();
                        },
                        onReset: () => hotkeysManager.restoreDefaultBindings(),
                        hotkeysModule: hotkeys,
                    },
                }),
        },
    ];

    if (appConfig.oidc) {
        menuOptions.push({
            title: t('Header:Logout'),
            icon: 'power-off',
            onClick: async () => {
                navigate(`/logout?redirect_uri=${encodeURIComponent(window.location.href)}`);
            },
        });
    }

    const renderToolBar = () => {
        console.log(DropdownMenu);
        return (<div className="flex"><Toolbar
            servicesManager={servicesManager}
            buttonSection="primary"
        />
            <Toolbar
                servicesManager={servicesManager}
                buttonSection="secondary"
            /></div>);

    };

    const renderPatientInfo = () => {
        return (<div> PatientInfo2 </div>)
    };


    return (
        <Header
            menuOptions={menuOptions}
            isReturnEnabled={!!appConfig.showStudyList}
            onClickReturnButton={onClickReturnButton}
            WhiteLabeling={appConfig.whiteLabeling}
            Secondary={
                renderToolBar()
            }
            PatientInfo={
                renderPatientInfo()
            }
        >
            {/* <div className="relative flex justify-center gap-[4px] divide-x">
               
                <SeriesPopUpMenu servicesManager={servicesManager} viewPortId={'ctTP1'} dataSource={dataSource} getImageSrc={_getImageSrcFromImageId} />
                <div className="w-[40px] bg-red-500"></div>
                <SeriesPopUpMenu servicesManager={servicesManager} viewPortId={'ctTP2'} dataSource={dataSource} getImageSrc={_getImageSrcFromImageId} />
            </div> */}
            {/* <div className="relative flex flex-wrap justify-center items-center w-full lg:w-auto lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
                <div className="flex items-center space-x-4">
                    <SeriesPopUpMenu servicesManager={servicesManager} viewPortId={'ctTP1'} dataSource={dataSource} getImageSrc={_getImageSrcFromImageId} />
                    <SeriesPopUpMenu servicesManager={servicesManager} viewPortId={'ctTP2'} dataSource={dataSource} getImageSrc={_getImageSrcFromImageId} />
                </div>
            </div> */}
        </Header >
    );
};

export default RecistViewerHeader;