import React from 'react';

const Component = React.lazy(() => {
  return import(/* webpackPrefetch: true */ './viewports/RecistReferenceViewport');
});

const RecistReferenceViewport = props => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </React.Suspense>
  );
};

function getViewportModule({ servicesManager, commandsManager, extensionManager }) {
  const ExtendedRecistReferenceViewport = props => {
    return (
      <RecistReferenceViewport
        servicesManager={servicesManager}
        commandsManager={commandsManager}
        extensionManager={extensionManager}
        {...props}
      />
    );
  };

  return [
    {
      name: 'recist-reference-viewport',
      component: ExtendedRecistReferenceViewport,
    },
  ];
}

export default getViewportModule;
