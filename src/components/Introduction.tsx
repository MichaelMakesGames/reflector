import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useBoolean, useControl } from "~hooks";
import selectors from "~state/selectors";
import Modal from "./Modal";
import { ControlCode } from "~types/ControlCode";
import Kbd from "./Kbd";

export default function Introduction() {
  const [isOpen, open, close] = useBoolean(false);
  const turn = useSelector(selectors.turn);
  const player = useSelector(selectors.player);
  useEffect(() => {
    if (player && turn === 1) {
      open();
    }
  }, [Boolean(player), turn]);

  useControl(ControlCode.QuickAction, close);
  useControl(ControlCode.Back, close);

  if (!isOpen) return null;

  return (
    <Modal isOpen onRequestClose={close}>
      <h2 className="text-2xl">Welcome to Reflector: Laser Defense</h2>
      <p className="my-2">Survive 10 days to win!</p>
      <p className="my-2">
        Enemies attack at night, colonists work during the day.
      </p>
      <p className="my-2">
        Press <Kbd>wasd</Kbd> or arrow keys to move.
      </p>
      <p className="my-2">
        Press <Kbd>f</Kbd> to activate laser, <Kbd>wasd</Kbd> to aim, then{" "}
        <Kbd>f</Kbd> again to fire.
      </p>
      <p className="my-2">
        Press <Kbd>?</Kbd> to view full controls.
      </p>
      <p className="my-2">Good luck!</p>
      <button type="button" className="btn mt-2" onClick={close}>
        Start Game
      </button>
    </Modal>
  );
}
