import actions from "~/state/actions";
import makeLevel from "~/utils/makeLevel";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import { createInitialState } from "~state/initialState";
import processColonists from "~state/processors/processColonists";
import processImmigration from "~state/processors/processImmigration";
import WrappedState from "~types/WrappedState";

function newGame(
  state: WrappedState,
  action: ReturnType<typeof actions.newGame>,
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
  processImmigration(state);
  processColonists(state);
}

registerHandler(newGame, actions.newGame);
