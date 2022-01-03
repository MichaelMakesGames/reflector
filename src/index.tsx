/* global document */
import "notyf/notyf.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import Modal from "react-modal";
import { Provider } from "react-redux";
import "./assets/style.css";
import Game from "./ui/Game";
import store from "./state/store";
import messages from "./messages";

const app = (
  <IntlProvider messages={messages} locale="en" defaultLocale="en">
    <Provider store={store}>
      <Game />
    </Provider>
  </IntlProvider>
);

const target = document.getElementById("root");

if (target) {
  Modal.setAppElement(target);
  ReactDOM.render(app, target);
}
