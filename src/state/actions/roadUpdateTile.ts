import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { Pos } from "~types";
import { getPositionToDirection } from "~lib/geometry";
import { UP, RIGHT, DOWN, LEFT } from "~constants";

const roadUpdateTile = createStandardAction("roadUpdateTile")<Pos>();
export default roadUpdateTile;

function roadUpdateTileHandler(
  state: WrappedState,
  action: ReturnType<typeof roadUpdateTile>,
): void {
  const pos = action.payload;
  const road = state.select.entitiesAtPosition(pos).find((e) => e.road);
  if (!road || !road.display) return;
  const tileNumber =
    1 * Number(state.select.hasRoad(getPositionToDirection(pos, UP))) +
    2 * Number(state.select.hasRoad(getPositionToDirection(pos, RIGHT))) +
    4 * Number(state.select.hasRoad(getPositionToDirection(pos, DOWN))) +
    8 * Number(state.select.hasRoad(getPositionToDirection(pos, LEFT)));
  state.act.updateEntity({
    id: road.id,
    display: { ...road.display, tile: `road_${tileNumber}` },
  });
}

registerHandler(roadUpdateTileHandler, roadUpdateTile);
