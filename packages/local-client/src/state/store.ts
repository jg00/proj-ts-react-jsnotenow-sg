import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { persistMiddleware } from "./middleware/persist-middleware";

export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleware, thunk)
);

/*
// 2 Manual Testing
// import { ActionType } from "./action-types";

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: "code",
  },
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: "text",
  },
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: "code",
  },
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: "text",
  },
});

// Example of how we could get an id
// const id = store.getState().cells.order[0];
// console.log(store.getState());
*/

/*
1 Ref only regarding produce(() => {}, initialState) second argment so TS does not think we are allowing a value of undefined.
const state = store.getState();
state.cells.data;
for manually getting all state out of your store. Here note that TS is also seeing "undefined" because of the way we wrote our reducer using immer
and becuase we are returning nothing and just "return" statement for each case TS thinks we are returning nothing.
state.cells.data may sometimes be undefined.
So one solution is to write code to show state is actually not undefined or just
return state for every reducer switch case statement ie add the line "return state".
or add as a second argument to produce(()=> {}, initialState)
*/
