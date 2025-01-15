import React, { useEffect, useCallback, useRef } from 'react';

const RecistLayout = (props) => {
    const { extensionManager, viewports, ViewportGridComp, servicesManager, hotkeysManager, appConfig } = props;




    const getComponent = id => {
        const entry = extensionManager.getModuleEntry(id);

        if (!entry || !entry.component) {
            throw new Error(
                `${id} is not valid for an extension module or no component found from extension ${id}. Please verify your configuration or ensure that the extension is properly registered. It's also possible that your mode is utilizing a module from an extension that hasn't been included in its dependencies (add the extension to the "extensionDependencies" array in your mode's index.js file). Check the reference string to the extension in your Mode configuration`
            );
        }

        return { entry, content: entry.component };
    };


    const getViewportComponentData = viewportComponent => {
        const { entry } = getComponent(viewportComponent.namespace);

        return {
            component: entry.component,
            displaySetsToDisplay: viewportComponent.displaySetsToDisplay,
        };
    };

    const viewportComponents = viewports.map(getViewportComponentData);



    console.log("Recist Layout Component ******************************************************************", props)
    return (<div>

        <div
            className="relative flex w-full flex-row flex-nowrap items-stretch overflow-hidden bg-black"
            style={{ height: 'calc(100vh - 52px' }}
        >
            <ViewportGridComp extensionManager={extensionManager} servicesManager={servicesManager} viewportComponents={viewportComponents} />
        </div>
    </div>)
};

export default RecistLayout;
