import React from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../state/actions";
import selectors from "../state/selectors";
import Modal from "./Modal";
import HotkeyButton from "./HotkeyButton";
import { ControlCode } from "../types/ControlCode";
import { HotkeyGroup } from "./HotkeysProvider";

export default function GameOver() {
  const dispatch = useDispatch();
  const gameOver = useSelector(selectors.gameOver);
  const victory = useSelector(selectors.victory);
  const player = useSelector(selectors.player);
  const morale = useSelector(selectors.morale);
  const population = useSelector(selectors.population);

  if (!gameOver) return null;

  return (
    <Modal isOpen>
      <h2 className="text-xl">{victory ? "Victory!" : "Defeat"}</h2>
      {!player && (
        <p>You died. Don&apos;t let an enemy attack your character.</p>
      )}
      {morale <= 0 && (
        <p>
          You ran out of morale. Every time a colonist dies, you lose morale.
        </p>
      )}
      {population === 0 && (
        <p>All of your colonists died. Keep them defended!</p>
      )}
      <div className="mt-1">
        <HotkeyButton
          label="New Game"
          controlCode={ControlCode.Menu1}
          hotkeyGroup={HotkeyGroup.GameOver}
          callback={() => dispatch(actions.newGame())}
        />
        {!victory && (
          <HotkeyButton
            label="Undo Last Turn"
            className="ml-2"
            controlCode={ControlCode.Menu2}
            hotkeyGroup={HotkeyGroup.GameOver}
            callback={() => dispatch(actions.undoTurn())}
          />
        )}
        {victory && (
          <HotkeyButton
            label="Continue Playing"
            className="ml-2"
            controlCode={ControlCode.Menu2}
            hotkeyGroup={HotkeyGroup.GameOver}
            callback={() => dispatch(actions.continueVictory())}
          />
        )}
      </div>
    </Modal>
  );
}
