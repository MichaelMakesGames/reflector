import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);
// const store = createStore(reducer, composeWithDevTools());

export default store;
