import React from "react";
import { useDispatch, useSelector } from "./GameProvider";
import actions from "../state/actions";
import selectors from "../state/selectors";
import Modal from "./Modal";
import HotkeyButton from "./HotkeyButton";
import { ControlCode } from "../types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import { load } from "../lib/gameSave";
import { MAX_TURNS_TO_SAVE } from "../constants";
import Kbd from "./Kbd";

export default function GameOver({
  navigateTo,
}: {
  navigateTo: (page: string) => void;
}) {
  const dispatch = useDispatch();
  const gameOver = useSelector(selectors.gameOver);
  const victory = useSelector(selectors.victory);
  const player = useSelector(selectors.player);
  const morale = useSelector(selectors.morale);
  const population = useSelector(selectors.population);
  const turn = useSelector(selectors.turn);

  useControl({
    code: ControlCode.Undo,
    group: HotkeyGroup.GameOver,
    callback: () =>
      load(`save-${turn - 1}`)
        .catch(() => null)
        .then((state) => dispatch(actions.undoTurn(state ?? null))),
    disabled: !gameOver,
  });

  if (!gameOver) return null;

  return (
    <Modal isOpen>
      <h2 className="text-xl">{victory ? "Victory!" : "Defeat"}</h2>
      {victory && (
        <p>
          Congratulations, you survived 10 days! You can keep on playing against
          increasingly difficult waves.
        </p>
      )}
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
      {!victory && (
        <p>
          Hint: you can press <Kbd>Ctrl+Z</Kbd> to undo your turn, up to{" "}
          {MAX_TURNS_TO_SAVE} times
        </p>
      )}
      <div className="mt-1">
        <HotkeyButton
          label="New Game"
          controlCode={ControlCode.Menu1}
          hotkeyGroup={HotkeyGroup.GameOver}
          callback={() => navigateTo("NewGame")}
        />
        {!victory && (
          <HotkeyButton
            label="Undo Last Turn"
            className="ml-2"
            controlCode={ControlCode.Menu2}
            hotkeyGroup={HotkeyGroup.GameOver}
            callback={() =>
              load(`save-${turn - 1}`)
                .catch(() => null)
                .then((state) => dispatch(actions.undoTurn(state ?? null)))
            }
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
