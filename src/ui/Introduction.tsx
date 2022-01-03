import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useBoolean } from "../hooks";
import { useControl, HotkeyGroup } from "./HotkeysProvider";
import selectors from "../state/selectors";
import Modal from "./Modal";
import { ControlCode } from "../types/ControlCode";
import Kbd from "./Kbd";
import HotkeyButton from "./HotkeyButton";

export default function Introduction() {
  const [isOpen, open, close] = useBoolean(false);
  const turn = useSelector(selectors.turn);
  const player = useSelector(selectors.player);
  useEffect(() => {
    if (player && turn === 0) {
      open();
    }
  }, [Boolean(player), turn]);

  useControl({
    code: ControlCode.QuickAction,
    group: HotkeyGroup.Intro,
    callback: close,
    disabled: !isOpen,
  });

  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Intro,
    callback: close,
    disabled: !isOpen,
  });

  if (!isOpen) return null;

  return (
    <Modal isOpen onRequestClose={close}>
      <h2 className="text-2xl">Welcome to Reflector: Laser Defense</h2>
      <p className="my-2">
        You have been tasked with establishing a colony on an alien planet.
        Build your base, protect your colonists, and survive 10 days to win!
      </p>
      <p className="my-2">Good luck!</p>
      <p className="my-2 text-sm text-lightGray">
        Press <Kbd>?</Kbd> to view full keyboard controls.
      </p>
      <HotkeyButton
        label="Start Game"
        className="mt-2"
        controlCode={ControlCode.Menu1}
        callback={close}
        hotkeyGroup={HotkeyGroup.Intro}
      />
    </Modal>
  );
}
