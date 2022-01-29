import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension/logOnlyInProduction";
import defaultSettings from "../data/defaultSettings";
import audio from "../lib/audio";
import renderer from "../renderer";
import { makeReducer } from "./reducer";

const reducer = makeReducer(renderer, audio, defaultSettings);
const store = createStore(reducer, devToolsEnhancer({}));

export default store;
