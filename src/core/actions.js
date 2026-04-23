import { state } from "./state.js";
import { history } from "./history.js";

/**
 * Логика добавления полигона
 * 
 * @param {{ id: number, points: [{x: number, y: number}], color: string }} polygon
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
 * @param {{ id: number, points: [{x: number, y: number}], color: string }} polygon
 */
export const selectPolygon = (polygon) => {
    const previousSelectedId = state.selectedId;
    const nextSelectedId = polygon ? polygon.id : null;

    if (previousSelectedId === nextSelectedId) {
        return;
    }

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
 * @param {{ id: number, points: [{x: number, y: number}], color: string }} polygon
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
 * @param {{ polygons: [{ id: number, points: [{x: number, y: number}] }], selectedId: number }} stateBeforeDelete
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

/**
 * Сохраняет итоговое перемещение полигона в историю.
 *
 * @param {number|string} polygonId
 * @param {Array<{ x: number, y: number }>} previousPoints
 * @param {Array<{ x: number, y: number }>} nextPoints
 */
export const commitPolygonMove = (polygonId, previousPoints, nextPoints) => {
    history.execute({
        redo: () => {
            state.polygons = state.polygons.map((polygon) =>
                polygon.id === polygonId
                    ? { ...polygon, points: nextPoints.map((point) => ({ ...point })) }
                    : polygon
            );
            state.notify();
        },
        undo: () => {
            state.polygons = state.polygons.map((polygon) =>
                polygon.id === polygonId
                    ? { ...polygon, points: previousPoints.map((point) => ({ ...point })) }
                    : polygon
            );
            state.notify();
        }
    });
}

/**
 * 
 * @param {number|string} polygonId 
 * @param {string} color - Цвет в формате HSL
 */
export const changePolygonColor = (polygonId, color) => {
    history.execute({
        redo: () => {
            state.polygons = state.polygons.map((polygon) =>
                polygon.id === polygonId
                    ? { ...polygon, color }
                    : polygon
            );
            state.notify();
        },
        undo: () => {
            state.polygons = state.polygons.map((polygon) =>
                polygon.id === polygonId
                    ? { ...polygon, color: polygon.color }
                    : polygon
            );
            state.notify();
        }
    });
}