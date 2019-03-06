import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { GameState, Action } from "./types";
import handleAction from "./actionHandlers/handleAction";

const initialState: GameState = {
  entities: {},
  entitiesByPosition: {}
};

function reducer(state: GameState = initialState, action: Action): GameState {
  return handleAction(state, action);
}
const store = createStore(reducer);
// const store = createStore(reducer, composeWithDevTools());

export default store;
