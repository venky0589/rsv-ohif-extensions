import renderAnnotations from "./renderAnnotations";
import getAnnotation from "./renderAnnotations";
import renderVisitSelectorLayout from "./renderVisitSelectorLayout";

const getUtilityModule = ({ servicesManager }) => {
    return [
        {
            name: 'rsv-util',
            export: {
                renderAnnotations
            }
        },
        {
            name: 'renderVisitSelectorLayout',
            exports: {
                renderVisitSelectorLayout
            }
        }

    ];
};

export default getUtilityModule;