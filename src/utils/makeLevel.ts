import * as actions from "../state/actions";
import { PLAYER_ID } from "../constants";
import { addEntity } from "../state/handlers/addEntity";
import { removeEntities } from "../state/handlers/removeEntities";
import { updateEntity } from "../state/handlers/updateEntity";
import { generateMap } from "./mapgen";
import * as selectors from "../state/selectors";
import { GameState } from "../types";

export function makeLevel(state: GameState): GameState {
  const lastLevelEntity = selectors
    .entityList(state)
    .filter(e => e.level && e.level.current)[0];
  if (!lastLevelEntity || !lastLevelEntity.level) return state;
  const lastLevel = lastLevelEntity.level;
  const nextLevelEntity = selectors
    .entityList(state)
    .filter(e => e.level && e.level.depth === lastLevel.depth + 1)[0];
  if (!nextLevelEntity || !nextLevelEntity.level) return state;
  const nextLevel = nextLevelEntity.level;

  state = updateEntity(
    state,
    actions.updateEntity({
      id: lastLevelEntity.id,
      level: { ...lastLevel, current: false },
    }),
  );
  state = updateEntity(
    state,
    actions.updateEntity({
      id: nextLevelEntity.id,
      level: { ...nextLevel, current: true },
    }),
  );

  state = removeEntities(
    state,
    actions.removeEntities({
      entityIds: selectors
        .entityList(state)
        .filter(e => e.pos && e.id !== PLAYER_ID)
        .map(e => e.id),
    }),
  );

  for (let entity of generateMap(nextLevel)) {
    state = addEntity(state, actions.addEntity({ entity }));
  }
  return state;
}
