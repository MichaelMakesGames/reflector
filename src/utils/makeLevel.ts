import actions from "~/state/actions";
import { PLAYER_ID } from "~/constants";
import generateMap from "./generateMap";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction from "~state/handleAction";

export default function makeLevel(state: GameState): GameState {
  let newState = state;

  newState = handleAction(
    newState,
    actions.removeEntities({
      entityIds: selectors
        .entityList(newState)
        .filter(e => e.pos && e.id !== PLAYER_ID)
        .map(e => e.id),
    }),
  );

  for (const entity of generateMap()) {
    newState = handleAction(newState, actions.addEntity({ entity }));
  }
  return newState;
}
