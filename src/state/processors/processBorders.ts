import { Pos } from "types/Entity";
import { DOWN, LEFT, RIGHT, UP } from "~constants";
import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~utils/conditions";
import { createEntityFromTemplate } from "~utils/entities";
import {
  getPositionsWithinRange,
  getPositionToDirection,
  getPosKey,
} from "~utils/geometry";

export default function processBorders(state: WrappedState): void {
  const borders = state.select.entitiesWithComps("border");
  state.act.removeEntities(borders.map((e) => e.id));

  const positionsInRange: Record<string, Pos> = {};
  const projectors = state.select
    .entitiesWithComps("pos", "projector")
    .filter((e) => areConditionsMet(state, e, e.projector.condition));
  for (const entity of projectors) {
    positionsInRange[getPosKey(entity.pos)] = entity.pos;
    for (const pos of getPositionsWithinRange(
      entity.pos,
      entity.projector.range,
    )) {
      positionsInRange[getPosKey(pos)] = pos;
    }
  }

  for (const pos of Object.values(positionsInRange)) {
    const posToNorth = getPositionToDirection(pos, UP);
    const posToSouth = getPositionToDirection(pos, DOWN);
    const posToEast = getPositionToDirection(pos, RIGHT);
    const posToWest = getPositionToDirection(pos, LEFT);

    const posToNorthIsInRange = Object.keys(positionsInRange).includes(
      getPosKey(posToNorth),
    );
    const posToSouthIsInRange = Object.keys(positionsInRange).includes(
      getPosKey(posToSouth),
    );
    const posToEastIsInRange = Object.keys(positionsInRange).includes(
      getPosKey(posToEast),
    );
    const posToWestIsInRange = Object.keys(positionsInRange).includes(
      getPosKey(posToWest),
    );

    if (!posToNorthIsInRange) {
      state.act.addEntity(createEntityFromTemplate("BORDER_NORTH", { pos }));
    }
    if (!posToSouthIsInRange) {
      state.act.addEntity(createEntityFromTemplate("BORDER_SOUTH", { pos }));
    }
    if (!posToEastIsInRange) {
      state.act.addEntity(createEntityFromTemplate("BORDER_EAST", { pos }));
    }
    if (!posToWestIsInRange) {
      state.act.addEntity(createEntityFromTemplate("BORDER_WEST", { pos }));
    }
  }
}
