import * as actions from "~/state/actions";
import { PLAYER_ID } from "~/constants";
import { addEntity } from "~/state/handlers/addEntity";
import { removeEntities } from "~/state/handlers/removeEntities";
import { updateEntity } from "~/state/handlers/updateEntity";
import generateMap from "./generateMap";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";

export default function makeLevel(state: GameState): GameState {
  let newState = state;
  const lastLevelEntity = selectors
    .entityList(newState)
    .filter(e => e.level && e.level.current)[0];
  if (!lastLevelEntity || !lastLevelEntity.level) return newState;
  const lastLevel = lastLevelEntity.level;
  const nextLevelEntity = selectors
    .entityList(newState)
    .filter(e => e.level && e.level.depth === lastLevel.depth + 1)[0];
  if (!nextLevelEntity || !nextLevelEntity.level) return newState;
  const nextLevel = nextLevelEntity.level;

  newState = updateEntity(
    newState,
    actions.updateEntity({
      id: lastLevelEntity.id,
      level: { ...lastLevel, current: false },
    }),
  );
  newState = updateEntity(
    newState,
    actions.updateEntity({
      id: nextLevelEntity.id,
      level: { ...nextLevel, current: true },
    }),
  );

  newState = removeEntities(
    newState,
    actions.removeEntities({
      entityIds: selectors
        .entityList(newState)
        .filter(e => e.pos && e.id !== PLAYER_ID)
        .map(e => e.id),
    }),
  );

  for (const entity of generateMap(nextLevel)) {
    newState = addEntity(newState, actions.addEntity({ entity }));
  }
  return newState;
}
