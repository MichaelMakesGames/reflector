import { createStandardAction } from "typesafe-actions";
import makeLevel from "~lib/makeLevel";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import { createInitialState } from "~state/initialState";
import colonistsSystem from "~state/systems/colonistsSystem";
import immigrationSystem from "~state/systems/immigrationSystem";
import WrappedState from "~types/WrappedState";

const newGame = createStandardAction("NEW_GAME")();
export default newGame;

function newGameHandler(
  state: WrappedState,
  action: ReturnType<typeof newGame>,
): void {
  state.setRaw(
    createInitialState({
      completedTutorials: state.select.completedTutorials(),
    }),
  );
  renderer.clear();
  makeLevel(state);
  state.act.loadGame({ state: state.raw });
  state.setRaw({
    ...state.raw,
    startOfThisTurn: {
      ...state.raw,
      startOfThisTurn: null,
      startOfLastTurn: null,
    },
  });
  immigrationSystem(state);
  colonistsSystem(state);
}

registerHandler(newGameHandler, newGame);
