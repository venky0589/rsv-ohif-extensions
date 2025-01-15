import { create } from 'zustand';

const PRESENTATION_TYPE_ID = 'timePointToggleViewportGridId';

type TimePointToggleViewportGridState = {
    timePointToggleViewportGridStore: any | null;
    setTimePointToggleViewportGridStore: (key: string, value: any) => void;
    clearTimePointToggleViewportGridStore: () => void;
    type: string;
};

/**
 * Creates the Toggle View Port store.
 */
const createTimePointToggleViewportGridStore = (set): TimePointToggleViewportGridState => ({
    timePointToggleViewportGridStore: {},
    type: PRESENTATION_TYPE_ID,

    /**
     * Sets the toggle hanging protocol for a given key.
     */
    setTimePointToggleViewportGridStore: (key, value) =>
        set(
            state => ({
                timePointToggleViewportGridStore: {
                    ...state.timePointToggleViewportGridStore,
                    [key]: value,
                },
            }),
            false,
            'setTimePointToggleViewportGridStore'
        ),

    /**
     * Clears all toggle hanging protocols.
     */
    clearTimePointToggleViewportGridStore: () =>
        set({ timePointToggleViewportGridStore: {} }, false, 'clearTimePointToggleViewportGridStore'),
});

/**
 * Zustand store for managing toggle hanging protocols.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
export const useTimePointToggleViewportGridStore = create<TimePointToggleViewportGridState>()(createTimePointToggleViewportGridStore);

