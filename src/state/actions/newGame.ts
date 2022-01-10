import { createAction } from "typesafe-actions";
import makeLevel from "../../lib/makeLevel";
import { registerHandler } from "../handleAction";
import { createInitialState } from "../initialState";
import colonistsSystem from "../systems/colonistsSystem";
import WrappedState from "../../types/WrappedState";

const newGame = createAction("NEW_GAME")<{ mapType: string }>();
export default newGame;

function newGameHandler(
  state: WrappedState,
  action: ReturnType<typeof newGame>
): void {
  state.setRaw(
    createInitialState({
      completedTutorials: state.select.completedTutorials(),
      mapType: action.payload.mapType,
    })
  );
  state.renderer.clear();
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
  colonistsSystem(state);
}

registerHandler(newGameHandler, newGame);
