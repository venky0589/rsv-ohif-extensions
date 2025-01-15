import React from 'react';
import { useToolbar } from '@ohif/core';

export function Toolbar({ servicesManager, buttonSection = 'primary' }) {
    const { toolbarButtons, onInteraction } = useToolbar({
        servicesManager,
        buttonSection,
    });

    if (!toolbarButtons.length) {
        console.log("No Tool bar buttons found");
        return null;
    }

    return (
        <>
            {toolbarButtons.map(toolDef => {
                if (!toolDef) {
                    return null;
                }

                const { id, Component, componentProps } = toolDef;
                const tool = (
                    <Component
                        key={id}
                        id={id}
                        onInteraction={onInteraction}
                        servicesManager={servicesManager}
                        {...componentProps}
                    />
                );

                return <div key={id}>{tool}</div>;
            })}
        </>
    );
}
