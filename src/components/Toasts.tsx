import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import React, { useContext, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import selectors from "~state/selectors";

const NotyfContext = React.createContext(
  new Notyf({
    position: { x: "right", y: "top" },
    duration: 5000,
    dismissible: true,
  }),
);

export default function Toasts() {
  const notyf = useContext(NotyfContext);
  const messageLog = useSelector(selectors.messageLog);
  const thisTurn = useSelector(selectors.turn);
  const lastTurn = thisTurn - 1;
  const thisTurnMessages = messageLog[thisTurn] || [];
  const lastTurnMessages = messageLog[lastTurn] || [];
  const toastedRef = useRef<Set<string>>(new Set());
  const toasted = toastedRef.current;

  useEffect(() => {
    thisTurnMessages.forEach(({ message, type }, i) => {
      const id = `${thisTurn}_${i}`;
      if (!toasted.has(id)) {
        toasted.add(id);
        notyf.open({
          type: type || "error",
          message,
        });
      }
    });

    lastTurnMessages.forEach(({ message, type }, i) => {
      const id = `${lastTurn}_${i}`;
      if (!toasted.has(id)) {
        toasted.add(id);
        notyf.open({
          type: type || "error",
          message,
        });
      }
    });
  });

  return null;
}
