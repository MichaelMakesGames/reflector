import React, { useEffect, useContext } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useSelector } from "react-redux";
import selectors from "~state/selectors";

const NotyfContext = React.createContext(
  new Notyf({
    position: { x: "right", y: "top" },
    duration: 5000,
  }),
);

export default function Toasts() {
  const messageLog = useSelector(selectors.messageLog);
  const thisTurn = useSelector(selectors.turn);
  const lastTurn = thisTurn - 1;
  const thisTurnMessages = messageLog[thisTurn] || [];
  const lastTurnMessages = messageLog[lastTurn] || [];
  return (
    <>
      {thisTurnMessages.map(({ message, type }, i) => (
        <Toast
          // eslint-disable-next-line react/no-array-index-key
          key={`${thisTurn}_${i}`}
          message={message}
          type={type || "error"}
        />
      ))}
      {lastTurnMessages.map(({ message, type }, i) => (
        <Toast
          // eslint-disable-next-line react/no-array-index-key
          key={`${lastTurn}_${i}`}
          message={message}
          type={type || "error"}
        />
      ))}
    </>
  );
}

export function Toast({ message, type }: { message: string; type: string }) {
  const notyf = useContext(NotyfContext);
  useEffect(() => {
    const notification = notyf.open({
      type,
      message,
    });
    return () => notyf.dismiss(notification);
  });
  return null;
}
