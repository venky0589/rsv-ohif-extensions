// TODO: Pull in IWebClientApi from @ohif/core
// TODO: Use constructor to create an instance of IWebClientApi
// TODO: Use existing DICOMWeb configuration (previously, appConfig, to configure instance)

import { createRsvDicomJSONApi } from './datasource/RsvDicomJsonDataSource';

/**
 *
 */
function getDataSourcesModule() {
  return [
    {
      name: 'rsvdicomjson',
      type: 'jsonApi',
      createDataSource: createRsvDicomJSONApi,
    }
  ];
}

export default getDataSourcesModule;
