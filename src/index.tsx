import React from "react";
import ReactDOM from "react-dom";
import { StoreContext } from "redux-react-hook";
import "@babel/polyfill";

import store from "./store";
import Game from "./components/Game";

const app = (
  <StoreContext.Provider value={store}>
    <Game />
  </StoreContext.Provider>
);

const target = document.getElementById("root");

ReactDOM.render(app, target);
