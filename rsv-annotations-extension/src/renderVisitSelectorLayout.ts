const fixedLayout = [[1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [4, 3], [4, 4]];

const renderVisitSelectorLayout = ({ servicesManager, extensionManager, commandsManager }) => {
    console.log("ON SETUP ROUTE COMPLETE");
    try {
        const { displaySetService, viewportGridService } = servicesManager.services;
        const dataSource = extensionManager.getDataSources()[0];

        const { visitOrder, taskTimepoints, currentTimepoint } = dataSource.store.visitInfo();
        viewportGridService.reset();
        //const { StudyInstanceUIDs } = useImageViewer();
        //const [{ activeViewportId, viewports, isHangingProtocolLayout }, viewportGridService] = useViewportGrid();



        console.log("DataSource Store", dataSource.store);
        //setDisplaySets(getDisplaySetsForViewport(activeViewportId));
        const currentDisplaySets = displaySetService.activeDisplaySets;

        // const timepointAndDisplaySetsmap = currentDisplaySets.reduce((acc, current) => {

        //   const timePoint = current.instance.ClinicalTrialTimePointDescription;
        //   let displaySetArray = acc[timePoint];
        //   if (!displaySetArray) {
        //     displaySetArray = [];
        //     acc[timePoint] = displaySetArray;
        //   }
        //   displaySetArray.push(current);

        // }, {});

        const timepointAndDisplaySetsmap = currentDisplaySets.reduce((map, current) => {
            const timePoint = current.instance.ClinicalTrialTimePointDescription;
            // If the map doesn't have the key, initialize it with an empty array
            if (!map.has(timePoint)) {
                map.set(timePoint, []);
            }
            // Add the current item to the array for this key
            map.get(timePoint).push(current);
            return map;
        }, new Map());

        console.log("T D MAP", timepointAndDisplaySetsmap);


        const findOrCreateViewport = (position, positionId, options) => {
            console.log("Find Or Create View Port", position, positionId, options);

            const taskVisitsExcludeCurrent = taskTimepoints.filter(t => t != currentTimepoint);
            const viewportOptions = {
                viewportId: positionId,
                viewportType: 'stack',
                initialImageOptions: {
                    preset: 'middle',
                },
                syncGroups: [
                    {
                        type: 'scroll',
                        id: 'scrollSyncGroup',
                        source: true,
                        target: true,
                    },
                ],
                presentationIds: []
            };
            var visitkey = "NONE";

            if (positionId.indexOf("sl-") == -1) {
                visitkey = currentTimepoint;
            } else if (position <= taskVisitsExcludeCurrent.length) {
                visitkey = taskVisitsExcludeCurrent[position];
            }

            const dataset = timepointAndDisplaySetsmap.get(visitkey);
            const displaySetInstanceUIDs = dataset ? dataset.map(ds => ds.displaySetInstanceUID) : [];
            const displaySetOptions = [];
            return {
                displaySetInstanceUIDs,
                viewportOptions,
                displaySetOptions
            }
        };

        const getLayoutOption = (cols, rows, col, row, id) => {
            const width = 1 / cols;
            const height = 1 / rows;

            return {
                width,
                height,
                x: col * width,
                y: row * height,
                positionId: id,
                sublayout: true
            };
        };

        const prepareGridLayout = (visits, visitmap) => {

            const visitCount = visits.length;

            let layoutrow = 0;
            let layoutcol = 0;

            for (var i = 0; i < fixedLayout.length; i++) {
                const layout = fixedLayout[i];
                if ((layout[0] * layout[1]) >= (visitCount - 1)) {
                    layoutrow = layout[0];
                    layoutcol = layout[1];
                    break;
                }
            }

            const layoutOptions: any = [];


            for (var i = 0; i < layoutrow; i++) {
                for (var j = 0; j < layoutcol; j++) {
                    layoutOptions.push(getLayoutOption(layoutcol * 2, layoutrow, j, i, `sl-${i}-${j}`));

                }
            }

            layoutOptions.push(getLayoutOption(2, 1, 1, 0, `${layoutcol}-0`));

            /*w = 1 / numCols;
            h = 1 / numRows;
            xPos = col * w;
            yPos = row * h;*/

            // const layoutOptions = [getLayoutOption(4, 2, 0, 0, 'sl-0-0'), getLayoutOption(4, 2, 0, 1, 'sl-1-0'), getLayoutOption(4, 2, 1, 0, 'sl-2-0'), getLayoutOption(4, 2, 1, 1, 'sl-3-0'), getLayoutOption(2, 1, 1, 0, '4-0')];
            viewportGridService.setLayout({
                numRows: 1,
                numCols: layoutcol * layoutrow + 1,
                activeViewportId: `${layoutcol}-0`,
                layoutOptions,
                findOrCreateViewport,
                isHangingProtocolLayout: true,
            });

            console.log("CurrentStudy Display Sets", currentDisplaySets);
        }


        prepareGridLayout(taskTimepoints, timepointAndDisplaySetsmap);


    } catch (e) {
        console.log("Exception OnSetupRouteComplete", e);
    }

};
export default renderVisitSelectorLayout;