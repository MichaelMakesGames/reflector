import React from "react";
import { useSelector } from "react-redux";
import * as selectors from "~/state/selectors";

export default function MessageLog() {
  const messages = useSelector(selectors.messageLog);
  const inspected = useSelector(selectors.inspectedEntities);
  if (inspected) {
    return (
      <div className="box message-log">
        <div className="box__label">Inspection</div>
        <div className="messages">
          {inspected.map(e => (
            <div key={e.id} className="message">
              {`${e.description.name}: ${e.description.description}`}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="box message-log">
      <div className="box__label">Log</div>
      <div className="messages">
        {messages
          .map((m, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="message">
              {m}
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
}
