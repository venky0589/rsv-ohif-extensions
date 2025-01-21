import React, { useState, useEffect, useCallback } from 'react';
import { useViewportGrid } from '@ohif/ui-next';
import ViewPortNavigation from '../components/ViewPortNavigation';


function RecistReferenceViewport(props) {

    const [showNavigator, setShowNavigator] = useState(false);
    const { displaySets, viewportId, servicesManager, extensionManager, commandsManager } = props;
    const {
        measurementService,
        cornerstoneViewportService,
        viewportGridService,
        viewportActionCornersService,
    } = servicesManager.services;

    const [viewportGridState, viewportGridServiceAPI] =
        useViewportGrid();
    const _getComp = (viewPortId) => {
        return (
            <ViewPortNavigation servicesManager={servicesManager} extensionManager={extensionManager} commandsManager={commandsManager} viewPortId={viewPortId} />
        );
    }
    useEffect(() => {
        console.log("Recist Reference ViewPort", viewportGridState);
        viewportActionCornersService.addComponent({
            viewportId: viewportId,
            id: 'view-port-navigation',
            component: _getComp(viewportId,),
            location: viewportActionCornersService.LOCATIONS.topRight,
        });
    }, []);

    useEffect(() => {
        return () => {
            console.log("ViewPort Unloading.......");
        };

    }, []);



    const getRecistReferenceViewport = () => {
        const { component: Component } = extensionManager.getModuleEntry(
            '@ohif/extension-measurement-tracking.viewportModule.cornerstone-tracked'
        );

        console.log("Tracked ViewPort", Component);
        return (
            <Component
                {...props}
            />
        );
    };

    return (
        <React.Fragment>
            {getRecistReferenceViewport()}
        </React.Fragment>
    )

};
export default RecistReferenceViewport;