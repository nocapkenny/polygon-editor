import { state } from "./state.js";
import { history } from "./history.js";

/**
 * Логика добавления полигона
 * 
 * @param {Object} polygon - { id: number, points: [{x: number, y: number}], color: string }
 */
export const addPolygon = (polygon) => {
    history.execute({
        redo: () => {
            state.polygons.push(polygon);
            state.notify();
        },
        undo: () => {
            state.polygons = state.polygons.filter((p) => p.id !== polygon.id);
            if(state.selectedId === polygon.id) state.selectedId = null
        }
    })
}


/**
 * Логика выбора полигона
 * 
 * @param {Object} polygon - { id: number, points: [{x: number, y: number}], color: string }
 */
export const selectPolygon = (polygon) => {
    const previousSelectedId = state.selectedId;
    const nextSelectedId = polygon ? polygon.id : null;

    history.execute({
        redo: () => {
            state.selectedId = nextSelectedId;
            state.notify();
        },
        undo: () => {
            state.selectedId = previousSelectedId;
            state.notify();
        }
    })
}

/**
 * Логика удаления выбранного полигона
 * 
 * @param {Object} polygon - { id: number, points: [{x: number, y: number}], color: string }
 */
export const deleteSelectedPolygon = (polygon) => {
    history.execute({
        redo: () => {
            state.polygons = state.polygons.filter((p) => p.id !== polygon.id);
            state.selectedId = null;
            state.notify();
        },
        undo: () => {
            state.polygons.push(polygon);
            state.selectedId = polygon.id;
            state.notify();
        }
    })
}

/**
 * Логика удаления всех полигонов
 * 
 * @param {Object} stateBeforeDelete - { polygons: [{ id: number, points: [{x: number, y: number}] }], selectedId: number }
 */
export const deletePolygons = (stateBeforeDelete) => {
    history.execute({
        redo: () => {
            state.polygons = [];
            state.selectedId = null;
            state.notify();
        },
        undo: () => {
            state.polygons = [...stateBeforeDelete.polygons];
            state.selectedId = stateBeforeDelete.selectedId;
            state.notify();
        }
    })
}
