import { state } from "./state.js";
import { history } from "./history.js";

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