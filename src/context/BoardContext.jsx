import { createContext, useContext, useEffect, useReducer } from 'react';
import { SEED_BOARD } from '../data/seed';
import { loadBoard, saveBoard } from '../utils/storage';
import { v4 as uuid } from 'uuid';

const BoardContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const { columnId, task } = action.payload;
      const id = uuid();
      return {
        ...state,
        tasks: { ...state.tasks, [id]: { ...task, id } },
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            taskIds: [id, ...state.columns[columnId].taskIds],
          },
        },
      };
    }
    case 'UPDATE_TASK': {
      const { taskId, updates, columnId, prevColumnId } = action.payload;
      let columns = state.columns;
      if (columnId && prevColumnId && columnId !== prevColumnId) {
        const prevTaskIds = columns[prevColumnId].taskIds.filter((id) => id !== taskId);
        const nextTaskIds = [taskId, ...columns[columnId].taskIds];
        columns = {
          ...columns,
          [prevColumnId]: { ...columns[prevColumnId], taskIds: prevTaskIds },
          [columnId]: { ...columns[columnId], taskIds: nextTaskIds },
        };
      }
      return {
        ...state,
        columns,
        tasks: { ...state.tasks, [taskId]: { ...state.tasks[taskId], ...updates } },
      };
    }
    case 'DELETE_TASK': {
      const { taskId, columnId } = action.payload;
      const tasks = { ...state.tasks };
      delete tasks[taskId];
      return {
        ...state,
        tasks,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            taskIds: state.columns[columnId].taskIds.filter((id) => id !== taskId),
          },
        },
      };
    }
    case 'MOVE_TASK': {
      const { source, destination, taskId } = action.payload;
      if (!destination) return state;
      if (source.columnId === destination.columnId && source.index === destination.index) {
        return state;
      }
      const startCol = state.columns[source.columnId];
      const endCol = state.columns[destination.columnId];

      const startTaskIds = Array.from(startCol.taskIds);
      startTaskIds.splice(source.index, 1);

      if (startCol === endCol) {
        startTaskIds.splice(destination.index, 0, taskId);
        return {
          ...state,
          columns: {
            ...state.columns,
            [startCol.id]: { ...startCol, taskIds: startTaskIds },
          },
        };
      }

      const endTaskIds = Array.from(endCol.taskIds);
      endTaskIds.splice(destination.index, 0, taskId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [startCol.id]: { ...startCol, taskIds: startTaskIds },
          [endCol.id]: { ...endCol, taskIds: endTaskIds },
        },
      };
    }
    case 'ADD_COLUMN': {
      const id = `col-${uuid()}`;
      return {
        ...state,
        columnOrder: [...state.columnOrder, id],
        columns: { ...state.columns, [id]: { id, title: action.payload.title, taskIds: [] } },
      };
    }
    case 'TOGGLE_CHECKLIST_ITEM': {
      const { taskId, itemId } = action.payload;
      const task = state.tasks[taskId];
      const checklist = task.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c));
      return { ...state, tasks: { ...state.tasks, [taskId]: { ...task, checklist } } };
    }
    case 'ADD_CHECKLIST_ITEM': {
      const { taskId, text } = action.payload;
      const task = state.tasks[taskId];
      const item = { id: uuid(), text, done: false };
      return {
        ...state,
        tasks: { ...state.tasks, [taskId]: { ...task, checklist: [...task.checklist, item] } },
      };
    }
    case 'RESET_BOARD': {
      return SEED_BOARD;
    }
    default:
      return state;
  }
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadBoard(SEED_BOARD));

  useEffect(() => {
    saveBoard(state);
  }, [state]);

  return <BoardContext.Provider value={{ state, dispatch }}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
}
