export const state = {
  polygons: [],
  selectedId: null,

  listeners: new Set(),

  subscribe(fn){
    this.listeners.add(fn);
  },

  notify() {
    this.listeners.forEach((fn) => fn());
  }
};
