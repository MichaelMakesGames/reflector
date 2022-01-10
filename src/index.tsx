/* global document */
import "notyf/notyf.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import Modal from "react-modal";
import { Provider } from "react-redux";
import "./assets/style.css";
import store from "./state/store";
import messages from "./messages";
import Router from "./ui/Router";
import HotkeysProvider from "./ui/HotkeysProvider";
import pages from "./ui/pages";
import SettingsProvider from "./ui/SettingsProvider";

const app = (
  <IntlProvider messages={messages} locale="en" defaultLocale="en">
    <Provider store={store}>
      <SettingsProvider>
        <HotkeysProvider>
          <Router defaultPage="MainMenu" pages={pages} />
        </HotkeysProvider>
      </SettingsProvider>
    </Provider>
  </IntlProvider>
);

const target = document.getElementById("root");

if (target) {
  Modal.setAppElement(target);
  ReactDOM.render(app, target);
}
