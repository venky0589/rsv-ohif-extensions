import RecistLayout from "./layouts/RecistLayout";


const getLayoutTemplateModule = ({ servicesManager, extensionManager, commandsManager, hotkeysManager }) => {

    function RecistViewerLayoutWithServices(props) {
        console.trace("GetLayoutTemplateModule.....");
        return RecistLayout({
            servicesManager,
            extensionManager,
            commandsManager,
            hotkeysManager,
            ...props,
        });
    }
    return [
        {
            name: 'rsvRecistLayout',
            id: 'rsvRecistLayout',
            component: RecistViewerLayoutWithServices,
        },]
};

export default getLayoutTemplateModule;