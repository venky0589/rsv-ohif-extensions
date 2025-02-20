import { DicomMetadataStore, IWebApiDataSource } from '@ohif/core';
import OHIF from '@ohif/core';
import qs from 'query-string';

const metadataProvider = OHIF.classes.MetadataProvider;

const mappings = {
    studyInstanceUid: 'StudyInstanceUID',
    patientId: 'PatientID',
};

let _store = {
    urls: [],
    studyInstanceUIDMap: new Map(), // map of urls to array of study instance UIDs
    // {
    //   url: url1
    //   studies: [Study1, Study2], // if multiple studies
    // }
    // {
    //   url: url2
    //   studies: [Study1],
    // }
    // }
    annotationmap: [],
    visitInfo: {}
};

function wrapSequences(obj) {
    return Object.keys(obj).reduce(
        (acc, key) => {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Recursively wrap sequences for nested objects
                acc[key] = wrapSequences(obj[key]);
            } else {
                acc[key] = obj[key];
            }
            if (key.endsWith('Sequence')) {
                acc[key] = OHIF.utils.addAccessors(acc[key]);
            }
            return acc;
        },
        Array.isArray(obj) ? [] : {}
    );
}
const getMetaDataByURL = url => {
    return _store.urls.find(metaData => metaData.url === url);
};

const findStudies = (key, value) => {
    let studies = [];
    _store.urls.map(metaData => {
        metaData.studies.map(aStudy => {
            if (aStudy[key] === value) {
                studies.push(aStudy);
            }
        });
    });
    return studies;
};

const _getDirectURL = (dicomJsonConfig, params) => {
    console.log("GetDirect URL Not implemented");
};

function createRsvDicomJSONApi(dicomJsonConfig) {
    const implementation = {
        initialize: async ({ query, url }) => {
            if (!url) {
                url = query.get('url');
            }
            let metaData = getMetaDataByURL(url);

            // if we have already cached the data from this specific url
            // We are only handling one StudyInstanceUID to run; however,
            // all studies for patientID will be put in the correct tab
            if (metaData) {
                return metaData.studies.map(aStudy => {
                    return aStudy.StudyInstanceUID;
                });
            }

            const response = await fetch(url);
            const data = await response.json();

            let StudyInstanceUID;
            let SeriesInstanceUID;

            //TODO: Get the below visitInformation from taskjson file.
            const visitOrder = ["1_Screening", "2_Treatment_01", "2_Treatment_02", "2_Treatment_03", "2_Treatment_04", "2_Treatment_05", "2_Treatment_06", "2_Treatment_07", "2_Treatment_08"];
            const taskTimepoints = ["1_Screening", "2_Treatment_01", "2_Treatment_02", "2_Treatment_04", "2_Treatment_05", "2_Treatment_06"];
            const currentTimepoint = "2_Treatment_04";

            const visit_info = { visitOrder, taskTimepoints, currentTimepoint };

            const visit_to_studydate_map = {};

            data.studies.forEach(study => {
                StudyInstanceUID = study.StudyInstanceUID;

                study.series.forEach(series => {
                    SeriesInstanceUID = series.SeriesInstanceUID;

                    series.instances.forEach(instance => {
                        const { metadata: naturalizedDicom } = instance;
                        const imageId = instance.url;///getImageId({ instance, config: dicomJsonConfig });

                        const { query } = qs.parseUrl(instance.url);

                        visit_to_studydate_map[naturalizedDicom.ClinicalTrialTimePointDescription] = naturalizedDicom.StudyDate;

                        // Add imageId specific mapping to this data as the URL isn't necessarliy WADO-URI.
                        metadataProvider.addImageIdToUIDs(imageId, {
                            StudyInstanceUID,
                            SeriesInstanceUID,
                            SOPInstanceUID: naturalizedDicom.SOPInstanceUID,
                            frameNumber: query.frame ? parseInt(query.frame) : undefined,
                        });
                    });
                });
            });

            _store.urls.push({
                url,
                studies: [...data.studies],
            });
            _store.studyInstanceUIDMap.set(
                url,
                data.studies.map(study => study.StudyInstanceUID)
            );

            _store.annotationmap = [];
            _store.visitInfo = { ...visit_info, visit_to_studydate_map: visit_to_studydate_map };

            return data.studies;
        },
        query: {
            studies: {
                mapParams: () => { },
                search: async param => {
                    const [key, value] = Object.entries(param)[0];
                    const mappedParam = mappings[key];

                    // todo: should fetch from dicomMetadataStore
                    const studies = findStudies(mappedParam, value);

                    return studies.map(aStudy => {
                        return {
                            accession: aStudy.AccessionNumber,
                            date: aStudy.StudyDate,
                            description: aStudy.StudyDescription,
                            instances: aStudy.NumInstances,
                            modalities: aStudy.Modalities,
                            mrn: aStudy.PatientID,
                            patientName: aStudy.PatientName,
                            studyInstanceUid: aStudy.StudyInstanceUID,
                            NumInstances: aStudy.NumInstances,
                            time: aStudy.StudyTime,
                        };
                    });
                },
                processResults: () => {
                    console.warn(' DICOMJson QUERY processResults not implemented');
                },
            },
            series: {
                // mapParams: mapParams.bind(),
                search: () => {
                    console.warn(' DICOMJson QUERY SERIES SEARCH not implemented');
                },
            },
            instances: {
                search: () => {
                    console.warn(' DICOMJson QUERY instances SEARCH not implemented');
                },
            },
        },
        retrieve: {
            /**
             * Generates a URL that can be used for direct retrieve of the bulkdata
             *
             * @param {object} params
             * @param {string} params.tag is the tag name of the URL to retrieve
             * @param {string} params.defaultPath path for the pixel data url
             * @param {object} params.instance is the instance object that the tag is in
             * @param {string} params.defaultType is the mime type of the response
             * @param {string} params.singlepart is the type of the part to retrieve
             * @param {string} params.fetchPart unknown?
             * @returns an absolute URL to the resource, if the absolute URL can be retrieved as singlepart,
             *    or is already retrieved, or a promise to a URL for such use if a BulkDataURI
             */
            directURL: params => {
                return _getDirectURL(dicomJsonConfig, params);
            },
            series: {
                metadata: async ({ filters, StudyInstanceUID, madeInClient = false, customSort } = {}) => {
                    if (!StudyInstanceUID) {
                        throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
                    }

                    const study = findStudies('StudyInstanceUID', StudyInstanceUID)[0];
                    let series;

                    if (customSort) {
                        series = customSort(study.series);
                    } else {
                        series = study.series;
                    }

                    const seriesKeys = [
                        'SeriesInstanceUID',
                        'SeriesInstanceUIDs',
                        'seriesInstanceUID',
                        'seriesInstanceUIDs',
                    ];
                    const seriesFilter = seriesKeys.find(key => filters[key]);
                    if (seriesFilter) {
                        const seriesUIDs = filters[seriesFilter];
                        series = series.filter(s => seriesUIDs.includes(s.SeriesInstanceUID));
                    }

                    const seriesSummaryMetadata = series.map(series => {
                        const seriesSummary = {
                            StudyInstanceUID: study.StudyInstanceUID,
                            ...series,
                        };
                        delete seriesSummary.instances;
                        return seriesSummary;
                    });

                    // Async load series, store as retrieved
                    function storeInstances(naturalizedInstances) {
                        DicomMetadataStore.addInstances(naturalizedInstances, madeInClient);
                    }

                    DicomMetadataStore.addSeriesMetadata(seriesSummaryMetadata, madeInClient);

                    function setSuccessFlag() {
                        const study = DicomMetadataStore.getStudy(StudyInstanceUID, madeInClient);
                        study.isLoaded = true;
                    }

                    const numberOfSeries = series.length;
                    series.forEach((series, index) => {
                        const instances = series.instances.map(instance => {
                            // for instance.metadata if the key ends with sequence then
                            // we need to add a proxy to the first item in the sequence
                            // so that we can access the value of the sequence
                            // by using sequenceName.value
                            const modifiedMetadata = wrapSequences(instance.metadata);

                            const obj = {
                                ...modifiedMetadata,
                                url: instance.url,
                                imageId: instance.url,//getImageId({ instance, config: dicomJsonConfig }),
                                ...series,
                                ...study,
                            };
                            delete obj.instances;
                            delete obj.series;
                            return obj;
                        });
                        storeInstances(instances);
                        if (index === numberOfSeries - 1) {
                            setSuccessFlag();
                        }
                    });
                },
            },
        },
        store: {
            dicom: () => {
                console.warn(' DICOMJson store dicom not implemented');
            },
            annotations: () => {
                return _store.annotationmap;
            },
            visitInfo: () => {
                return _store.visitInfo;
            }

        },
        getImageIdsForDisplaySet(displaySet) {
            const images = displaySet.images;
            const imageIds = [];

            if (!images) {
                return imageIds;
            }

            const { StudyInstanceUID, SeriesInstanceUID } = displaySet;
            const study = findStudies('StudyInstanceUID', StudyInstanceUID)[0];
            const series = study.series.find(s => s.SeriesInstanceUID === SeriesInstanceUID) || [];

            const instanceMap = new Map();
            series.instances.forEach(instance => {
                if (instance?.metadata?.SOPInstanceUID) {
                    const { metadata, url } = instance;
                    const existingInstances = instanceMap.get(metadata.SOPInstanceUID) || [];
                    existingInstances.push({ ...metadata, url });
                    instanceMap.set(metadata.SOPInstanceUID, existingInstances);
                }
            });

            displaySet.images.forEach(instance => {
                const NumberOfFrames = instance.NumberOfFrames || 1;
                const instances = instanceMap.get(instance.SOPInstanceUID) || [instance];
                for (let i = 0; i < NumberOfFrames; i++) {
                    const imageId = instance.url;
                    // const imageId = getImageId({
                    //     instance: instances[Math.min(i, instances.length - 1)],
                    //     frame: NumberOfFrames > 1 ? i : undefined,
                    //     config: dicomJsonConfig,
                    // });
                    imageIds.push(imageId);
                }
            });

            return imageIds;
        },
        getImageIdsForInstance({ instance, frame }) {
            const imageIds = instance.url;//getImageId({ instance, frame });
            return imageIds;
        },
        getStudyInstanceUIDs: ({ params, query }) => {
            const url = query.get('url');
            return _store.studyInstanceUIDMap.get(url);
        },
    };
    return IWebApiDataSource.create(implementation);
}

export { createRsvDicomJSONApi };
