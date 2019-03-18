import * as actions from "./actions";
import { PLAYER_ID } from "./constants";
import { addEntity } from "./handlers/addEntity";
import { removeEntities } from "./handlers/removeEntities";
import { generateMap } from "./mapgen";
import * as selectors from "./selectors";
import { GameState } from "./types";

export default function makeLevel(state: GameState): GameState {
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

  state = addEntity(
    state,
    actions.addEntity({
      entity: { ...lastLevelEntity, level: { ...lastLevel, current: false } },
    }),
  );
  state = addEntity(
    state,
    actions.addEntity({
      entity: { ...nextLevelEntity, level: { ...nextLevel, current: true } },
    }),
  );

  state = removeEntities(
    state,
    actions.removeEntities({
      entityIds: selectors
        .entityList(state)
        .filter(e => e.position && e.id !== PLAYER_ID)
        .map(e => e.id),
    }),
  );

  for (let entity of generateMap(nextLevel)) {
    state = addEntity(state, actions.addEntity({ entity }));
  }
  return state;
}
