import React from "react";
import { useMappedState } from "redux-react-hook";
import * as selectors from "../selectors";

export default function Inventory() {
  const messages = useMappedState(selectors.messageLog);
  return (
    <div className="box message-log">
      <div className="box__label">Log</div>
      <div className="messages">
        {messages
          .map((m, i) => (
            <div key={i} className="message">
              {m}
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
}
