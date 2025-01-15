import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Header as ViewerHeader, SidePanel as Panel, ViewportGrid } from '@ohif/ui';
import { LoadingIndicatorProgress, InvestigationalUseDialog, useViewportGrid } from '@ohif/ui';

import './RecistLayout.css';
import { useAppConfig } from '@state';
import RecistViewerHeader from '../components/RecistViewerHeader';
import SidePanelWithServices from '../components/SidePanelWithServices';
import ViewPortNavigation from '../components/ViewPortNavigation';

function RecistLayout(props) {

    const {
        extensionManager,
        servicesManager,
        hotkeysManager,
        commandsManager,
        viewports,
        leftPanels = [],
        rightPanels = [],
        bottomPanels = [],
        leftPanelClosed = false,
        rightPanelClosed = false,
        gridConfig = { rows: 1, columns: 2 },
        ViewportGridComp
    } = props;

    const [appConfig] = useAppConfig();

    const { panelService, hangingProtocolService, displaySetService, viewportGridService, viewportActionCornersService } = servicesManager.services;
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(appConfig.showLoadingIndicator);

    const hasPanels = useCallback(
        (side): boolean => !!panelService.getPanels(side).length,
        [panelService]
    );

    const [hasRightPanels, setHasRightPanels] = useState(hasPanels('right'));
    const [hasLeftPanels, setHasLeftPanels] = useState(hasPanels('left'));
    const [leftPanelClosedState, setLeftPanelClosed] = useState(leftPanelClosed);
    const [rightPanelClosedState, setRightPanelClosed] = useState(rightPanelClosed);
    const [{ activeViewportId, viewports: latestViewPorts, isHangingProtocolLayout }, viewportGridServiceApi] = useViewportGrid();

    /**
    * Set body classes (tailwindcss) that don't allow vertical
    * or horizontal overflow (no scrolling). Also guarantee window
    * is sized to our viewport.
    */
    useEffect(() => {
        document.body.classList.add('bg-black');
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('bg-black');
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    const getComponent = id => {
        const entry = extensionManager.getModuleEntry(id);

        if (!entry || !entry.component) {
            throw new Error(
                `${id} is not valid for an extension module or no component found from extension ${id}. Please verify your configuration or ensure that the extension is properly registered. It's also possible that your mode is utilizing a module from an extension that hasn't been included in its dependencies (add the extension to the "extensionDependencies" array in your mode's index.js file). Check the reference string to the extension in your Mode configuration`
            );
        }

        return { entry, content: entry.component };
    };

    useEffect(() => {
        const { unsubscribe } = hangingProtocolService.subscribe(
            hangingProtocolService.EVENTS.PROTOCOL_CHANGED,

            // Todo: right now to set the loading indicator to false, we need to wait for the
            // hangingProtocolService to finish applying the viewport matching to each viewport,
            // however, this might not be the only approach to set the loading indicator to false. we need to explore this further.
            () => {
                setShowLoadingIndicator(false);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [hangingProtocolService]);

    // const _getComp = (viewPortId) => {
    //     return (
    //         <ViewPortNavigation servicesManager={servicesManager} extensionManager={extensionManager} commandsManager={commandsManager} viewPortId={viewPortId} />
    //     );
    // }

    // const handleGridStateChange = () => {
    //     viewportGridService.getState().viewports.forEach(viewPort => {
    //         const viewPortId = viewPort.viewportId;
    //         viewportActionCornersService.addComponent({
    //             viewportId: viewPortId,
    //             id: 'view-port-navigation',
    //             component: _getComp(viewPortId),
    //             location: viewportActionCornersService.LOCATIONS.topRight,
    //         });
    //     })

    // };

    // useEffect(() => {
    //     const viewportGridStateChangedSubscription = viewportGridService.subscribe(
    //         viewportGridService.EVENTS.GRID_STATE_CHANGED, handleGridStateChange
    //     );
    //     return () => {
    //         viewportGridStateChangedSubscription && viewportGridStateChangedSubscription.unsubscribe();
    //     };
    // }, [viewportGridService, viewportActionCornersService]);


    const getViewportComponentData = viewportComponent => {
        const { entry } = getComponent(viewportComponent.namespace);

        return {
            component: entry.component,
            displaySetsToDisplay: viewportComponent.displaySetsToDisplay,
        };
    };

    useEffect(() => {
        const { unsubscribe } = panelService.subscribe(
            panelService.EVENTS.PANELS_CHANGED,
            ({ options }) => {
                setHasLeftPanels(hasPanels('left'));
                setHasRightPanels(hasPanels('right'));
                if (options?.leftPanelClosed !== undefined) {
                    setLeftPanelClosed(options.leftPanelClosed);
                }
                if (options?.rightPanelClosed !== undefined) {
                    setRightPanelClosed(options.rightPanelClosed);
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, [panelService, hasPanels]);

    const viewportComponents = viewports.map(getViewportComponentData);
    // Fetch registered panels dynamically
    //const leftPanelsToRender = panelService.getPanels('left') || leftPanels;
    // const rightPanelsToRender = panelService.getPanels('right') || rightPanels;
    //const bottomPanelsToRender = panelService.getPanels('bottom') || bottomPanels;

    console.log(ViewerHeader, Panel, ViewportGrid, "THESE ARE IMPORTED", viewportComponents);

    console.log("ViewportGridComp:::::::", ViewportGridComp);
    /*
     <div className="recist-layout">
            <ViewerHeader extensionManager={extensionManager} servicesManager={servicesManager} />
            <div className="content-wrapper">
                {leftPanelsToRender.length > 0 && (
                    <Panel
                        className="left-panel"
                        isOpen={true}
                        location="left"
                        servicesManager={servicesManager}
                    >
                        {leftPanelsToRender.map((panel) => (
                            <panel.component key={panel.name} servicesManager={servicesManager} />
                        ))}
                    </Panel>
                )}
                <ViewportGrid
                    rows={gridConfig.rows}
                    columns={gridConfig.columns}
                    viewports={viewports}
                    className="viewport-grid"
                />
                {rightPanelsToRender.length > 0 && (
                    <Panel
                        className="right-panel"
                        isOpen={true}
                        location="right"
                        servicesManager={servicesManager}
                    >
                        {rightPanelsToRender.map((panel) => (
                            <panel.component key={panel.name} servicesManager={servicesManager} />
                        ))}
                    </Panel>
                )}
            </div>
            {bottomPanelsToRender.length > 0 && (
                <div className="bottom-panel">
                    {bottomPanelsToRender.map((panel) => (
                        <panel.component key={panel.name} servicesManager={servicesManager} />
                    ))}
                </div>
            )}
        </div>
    */
    return (<div className="recist-layout">
        <RecistViewerHeader extensionManager={extensionManager} servicesManager={servicesManager} appConfig={appConfig} hotkeysManager={hotkeysManager} />
        <div
            className="relative flex w-full flex-row flex-nowrap items-stretch overflow-hidden bg-black"
            style={{ height: 'calc(100vh - 52px' }}
        >
            <React.Fragment>
                {showLoadingIndicator && <LoadingIndicatorProgress className="h-full w-full bg-black" />}
                {/* LEFT SIDEPANELS */}
                {hasLeftPanels ? (
                    <SidePanelWithServices
                        side="left"
                        activeTabIndex={leftPanelClosedState ? null : 0}
                        servicesManager={servicesManager}
                    />
                ) : null}
                {/* TOOLBAR + GRID */}
                <div className="flex h-full flex-1 flex-col">
                    <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden bg-black">
                        <ViewportGridComp
                            servicesManager={servicesManager}
                            viewportComponents={viewportComponents}
                            commandsManager={commandsManager}
                        />

                    </div>
                </div>
                {hasRightPanels ? (
                    <SidePanelWithServices
                        side="right"
                        activeTabIndex={rightPanelClosedState ? null : 0}
                        servicesManager={servicesManager}
                    />
                ) : null}
            </React.Fragment>
        </div>
    </div>

    );
}

RecistLayout.propTypes = {
    extensionManager: PropTypes.object.isRequired,
    servicesManager: PropTypes.object.isRequired,
    viewports: PropTypes.array.isRequired,
    leftPanels: PropTypes.array,
    rightPanels: PropTypes.array,
    bottomPanels: PropTypes.array,
    gridConfig: PropTypes.shape({
        rows: PropTypes.number,
        columns: PropTypes.number,
    }),
};

export default RecistLayout;

