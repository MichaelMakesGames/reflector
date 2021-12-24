import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension/logOnlyInProduction";
import audio from "../lib/audio";
import renderer from "../renderer";
import { makeReducer } from "./reducer";

const reducer = makeReducer(renderer, audio);
const store = createStore(reducer, devToolsEnhancer({}));

export default store;
