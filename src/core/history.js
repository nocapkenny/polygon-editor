import { state } from "./state.js";

export const history = {
  undoStack: [],
  redoStack: [],

  execute(command) {
    command.redo();
    this.undoStack.push(command);
    this.redoStack = [];
  },

  undo() {
    const cmd = this.undoStack.pop();
    if (!cmd) return;

    cmd.undo();
    this.redoStack.push(cmd);
    state.notify();
  },

  redo() {
    const cmd = this.redoStack.pop();
    if (!cmd) return;

    cmd.redo();
    this.undoStack.push(cmd);
    state.notify();
  }
};