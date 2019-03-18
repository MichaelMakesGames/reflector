import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../types";
import { getDistance } from "../utils";
import { addEntity } from "./addEntity";
import { removeEntities } from "./removeEntities";

export function executeThrow(
  state: GameState,
  action: ReturnType<typeof actions.executeThrow>,
): GameState {
  state = removeEntities(
    state,
    actions.removeEntities({
      entityIds: selectors
        .entityList(state)
        .filter(e => e.fov)
        .map(e => e.id),
    }),
  );
  const entity = selectors.throwingTarget(state);
  if (!entity || !entity.position || !entity.throwing) return state;

  const player = selectors.player(state);
  if (!player || !player.position || !player.inventory) return state;

  const { inventory } = player;
  if (entity.reflector && !inventory.reflectors) return state;
  if (entity.splitter && !inventory.splitters) return state;

  const { position } = entity;
  const distance = getDistance(position, player.position);
  if (distance > entity.throwing.range) return state;

  const entitiesAtPosition = selectors.entitiesAtPosition(state, position);
  if (entitiesAtPosition.some(e => e.id !== entity.id && !!e.blocking))
    return state;

  state = addEntity(
    state,
    actions.addEntity({
      entity: {
        ...entity,
        throwing: undefined,
      },
    }),
  );

  state = addEntity(
    state,
    actions.addEntity({
      entity: {
        ...player,
        inventory: {
          splitters: entity.splitter
            ? inventory.splitters - 1
            : inventory.splitters,
          reflectors: entity.reflector
            ? inventory.reflectors - 1
            : inventory.reflectors,
        },
      },
    }),
  );
  return state;
}
