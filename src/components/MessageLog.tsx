import React from "react";
import { useMappedState } from "redux-react-hook";
import * as selectors from "../state/selectors";

export default function Inventory() {
  const messages = useMappedState(selectors.messageLog);
  return (
    <div className="box message-log">
      <div className="box__label">Log</div>
      <div className="messages">
        {messages
          .map(m => (
            <div key={m} className="message">
              {m}
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
}
