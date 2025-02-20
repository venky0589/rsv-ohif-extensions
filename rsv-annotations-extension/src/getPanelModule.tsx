import React from 'react';
import MeasurementPanel from "./panels/MeasurementPanel";
import ResultViewerPanel from "./panels/ResultViewerPanel";
import SeriesPanel from "./panels/SeriesPanel";
import WrappedStudiesPanel from "./panels/RPanelStudyBrowser";
import WrappedStudyPanelBrowser from './panels/WrappedStudyPanelBrowser';
import NewStudyBrowser from './panels/NewStudyBrowser';
import { Icons } from '@ohif/ui-next';
import LesionTable from './components/LesionTable';
import LesionTracker from './components/LesionTracker';

const getPanelModule = ({ commandsManager, extensionManager, servicesManager }) => {


    Icons.addIcon('key-timepoints', (props) => {
        return (<div className="w-[140px] text-xs">Key Time Points</div>);
    });
    Icons.addIcon('all-timepoints', (props) => {
        return (<div className="w-[140px] text-xs">ALL Time Points</div>);
    });
    Icons.addIcon('lesion-table', (props) => {
        return (<div className="w-[140px] text-xs">LESION TABLE</div>);
    });
    return [
        {
            name: 'MeasurementPanel',
            component: MeasurementPanel,
            location: 'right',
        },
        {
            name: 'SeriesPanel',
            iconName: 'key-timepoints',
            iconLabel: 'SeriesPanel',
            label: 'Key Time Points',
            location: 'left',
            component: props => (
                <WrappedStudyPanelBrowser commandsManager={commandsManager} extensionManager={extensionManager} servicesManager={servicesManager} keyTimePoints={['timepoint1', "timePoint2"]} />
            ),
        },
        {
            name: 'NewStudyBrowser',
            iconName: 'all-timepoints',
            iconLabel: 'NewStudyBrowser',
            label: 'All Time Points',
            location: 'left',
            component: props => (
                <WrappedStudyPanelBrowser commandsManager={commandsManager} extensionManager={extensionManager} servicesManager={servicesManager} />
            ),
        },
        {
            name: 'LesionTable',
            component: props => (
                <LesionTracker commandsManager={commandsManager} extensionManager={extensionManager} servicesManager={servicesManager} />
            ),
            iconName: 'lesion-table',
            iconLabel: 'Lesion Table',
            label: 'All Time Points',
            location: 'right',
        },
    ];
};

export default getPanelModule;
