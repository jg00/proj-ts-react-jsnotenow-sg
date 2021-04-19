import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState | void => {
    switch (action.type) {
      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;

        return state;
      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;

        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((accumulator, cell) => {
          accumulator[cell.id] = cell;
          return accumulator;
        }, {} as CellsState["data"]);

        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;

        return state;
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;

        state.data[id].content = content;

        return state; // Note not strictly necessary but just so TS knows our state should not be "undefined" add this "return state" statemet.
      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);

        return state;
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;

        return state;
      case ActionType.INSERT_CELL_AFTER:
        // New cell
        const cell: Cell = {
          type: action.payload.type,
          content: "",
          id: randomId(),
        };

        // Add to data {}
        state.data[cell.id] = cell;

        // If existing cell id provided then add new cell before
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );

        if (foundIndex < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(foundIndex + 1, 0, cell.id);
        }

        return state;
      default:
        return state;
    }
  },
  initialState
);

const randomId = (): string => {
  return Math.random().toString(36).substr(2, 5); // base36 ie 0-9, a-Z
};

export default reducer;

/* 
// 1 Reference
{
  loading: false,
  error: null,
  data: {
    'alkj2s2e': {
      id: 'alkj2s2e',
      type: 'code',
      content: 'const a = 1;'
    },

    'jaja11': {
      id: 'jaja11',
      type: 'text',
      content: 'Documentation for this'
    }
  }
}
*/

/* 2 Before us of immer
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          [id]: {
            ...state.data[id],
            content,
          },
        },
      };
    case ActionType.DELETE_CELL:
      return state;
    case ActionType.MOVE_CELL:
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      return state;
    default:
      return state;
  }
}

export default reducer;

*/
