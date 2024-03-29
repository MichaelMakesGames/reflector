import { createAction } from "typesafe-actions";
import { DOWN, LEFT, RIGHT, UP } from "../../constants";
import { areConditionsMet } from "../../lib/conditions";
import { createEntityFromTemplate } from "../../lib/entities";
import {
  getPositionsWithinRange,
  getPositionToDirection,
  getPosKey,
} from "../../lib/geometry";
import { Pos } from "../../types";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";

const bordersDraw = createAction("bordersDraw")();
export default bordersDraw;

function bordersDrawHandler(
  state: WrappedState,
  action: ReturnType<typeof bordersDraw>
): void {
  const positionsInRange: Record<string, Pos> = {};
  const projectors = state.select
    .entitiesWithComps("pos", "projector")
    .filter((e) => areConditionsMet(state, e, e.projector.condition));
  for (const entity of projectors) {
    positionsInRange[getPosKey(entity.pos)] = entity.pos;
    for (const pos of getPositionsWithinRange(
      entity.pos,
      entity.projector.range
    )) {
      positionsInRange[getPosKey(pos)] = pos;
    }
  }

  const posKeys = new Set(Object.keys(positionsInRange));
  for (const pos of Object.values(positionsInRange)) {
    const posToNorth = getPositionToDirection(pos, UP);
    const posToSouth = getPositionToDirection(pos, DOWN);
    const posToEast = getPositionToDirection(pos, RIGHT);
    const posToWest = getPositionToDirection(pos, LEFT);

    const posToNorthIsInRange = posKeys.has(getPosKey(posToNorth));
    const posToSouthIsInRange = posKeys.has(getPosKey(posToSouth));
    const posToEastIsInRange = posKeys.has(getPosKey(posToEast));
    const posToWestIsInRange = posKeys.has(getPosKey(posToWest));

    if (!posToNorthIsInRange) {
      state.act.addEntity(createEntityFromTemplate("UI_BORDER_NORTH", { pos }));
    }
    if (!posToSouthIsInRange) {
      state.act.addEntity(createEntityFromTemplate("UI_BORDER_SOUTH", { pos }));
    }
    if (!posToEastIsInRange) {
      state.act.addEntity(createEntityFromTemplate("UI_BORDER_EAST", { pos }));
    }
    if (!posToWestIsInRange) {
      state.act.addEntity(createEntityFromTemplate("UI_BORDER_WEST", { pos }));
    }
  }
}

registerHandler(bordersDrawHandler, bordersDraw);
