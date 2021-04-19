import { combineReducers } from "redux";
import cellsReducer from "./cellsReducer";
import bundlesReducer from "./bundlesReducer";

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export default reducers;

// For applying types to react-redux to instruct it of the type of data that is inside of our redux store.
// Also for action creators that need access to state ex: saveCells()
export type RootState = ReturnType<typeof reducers>;
