import * as actions from "~/state/actions";
import { PLAYER_ID } from "~/constants";
import { addEntity } from "~/state/handlers/addEntity";
import { removeEntities } from "~/state/handlers/removeEntities";
import generateMap from "./generateMap";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";

export default function makeLevel(state: GameState): GameState {
  let newState = state;

  newState = removeEntities(
    newState,
    actions.removeEntities({
      entityIds: selectors
        .entityList(newState)
        .filter(e => e.pos && e.id !== PLAYER_ID)
        .map(e => e.id),
    }),
  );

  for (const entity of generateMap()) {
    newState = addEntity(newState, actions.addEntity({ entity }));
  }
  return newState;
}
