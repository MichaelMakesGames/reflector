/* global document */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "@babel/polyfill";
import Modal from "react-modal";
import store from "./state/store";
import Game from "./components/Game";

import "./assets/style.css";

const app = (
  <Provider store={store}>
    <Game />
  </Provider>
);

const target = document.getElementById("root");

if (target) {
  Modal.setAppElement(target);
  ReactDOM.render(app, target);
}
