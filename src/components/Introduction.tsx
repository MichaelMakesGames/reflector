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
      <p className="my-2">
        Your assignment is simple: build a colony and survive 10 days.
      </p>
      <p className="my-2">
        This is a hostile acquisition. The local lifeforms are nocturnal, so
        they&apos;ll attack at night.
      </p>
      <p className="my-2">
        Defense is up to you alone. Use reflectors, splitters, and projectors to
        get the most out of your Laser Defense system.
      </p>
      <p className="my-2">
        Colonists will work during the day, and we&apos;ll send more each
        morning. Keep them safe and fed to maintain morale.
      </p>
      <h3 className="text-2xl my-2">Basic Controls</h3>
      <p className="my-2">
        <Kbd>wasd</Kbd> or arrow keys to move
      </p>
      <p className="my-2">
        <Kbd>f</Kbd> to activate laser, <Kbd>wasd</Kbd> to aim, then{" "}
        <Kbd>f</Kbd> again to fire.
      </p>
      <p className="my-2">
        Number keys to select building category then select building, then click
        in map to place.
      </p>
      <p className="my-2">
        You can see the full controls in the menu at the top right or by
        pressing <Kbd>?</Kbd>.
      </p>
      <button type="button" className="btn mt-2" onClick={close}>
        Start Game
      </button>
    </Modal>
  );
}
