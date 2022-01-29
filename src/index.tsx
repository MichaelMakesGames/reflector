/* global document */
import "notyf/notyf.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import Modal from "react-modal";
import { Provider } from "react-redux";
import "./assets/style.css";
import messages from "./messages";
import store from "./state/store";
import GameProvider from "./ui/GameProvider";
import HotkeysProvider from "./ui/HotkeysProvider";
import pages from "./ui/pages";
import Router from "./ui/Router";
import SettingsProvider from "./ui/SettingsProvider";

const app = (
  <IntlProvider messages={messages} locale="en" defaultLocale="en">
    <Provider store={store}>
      <SettingsProvider>
        <GameProvider redux={false}>
          <HotkeysProvider>
            <Router defaultPage="MainMenu" pages={pages} />
          </HotkeysProvider>
        </GameProvider>
      </SettingsProvider>
    </Provider>
  </IntlProvider>
);

const target = document.getElementById("root");

if (target) {
  Modal.setAppElement(target);
  ReactDOM.render(app, target);
}
