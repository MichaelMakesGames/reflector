import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import { Entity, Pos } from "../../types";
import { createEntityFromTemplate } from "../../lib/entities";

const farmGrowthUpdateTile = createAction("farmGrowthUpdateTile")<Pos>();
export default farmGrowthUpdateTile;

function farmGrowthUpdateTileHandler(
  state: WrappedState,
  action: ReturnType<typeof farmGrowthUpdateTile>
): void {
  const entitiesAtPosition = state.select.entitiesAtPosition(action.payload);
  const farm = entitiesAtPosition.find((e) => e.template === "BUILDING_FARM");
  if (!farm) return;
  let growth: Entity | undefined = entitiesAtPosition.find(
    (e) => e.template === "BUILDING_FARM_GROWTH"
  );
  if (!growth) {
    growth = createEntityFromTemplate("BUILDING_FARM_GROWTH", {
      pos: action.payload,
    });
    state.act.addEntity(growth);
  }
  if (!growth || !growth.display) return;
  const newTile = getGrowthTile(farm);
  if (newTile !== growth.display.tile) {
    state.act.updateEntity({
      id: growth.id,
      display: {
        ...growth.display,
        tile: newTile,
      },
    });
  }
}

function getGrowthTile(farm: Entity) {
  const progress =
    (farm.jobProvider?.workContributed ?? 0) /
    (farm.jobProvider?.workRequired ?? 1);
  if (progress === 0) {
    return "blank";
  } else if (progress < 0.25) {
    return "farm_growth_1";
  } else if (progress < 0.5) {
    return "farm_growth_2";
  } else if (progress < 0.75) {
    return "farm_growth_3";
  } else {
    return "farm";
  }
}

registerHandler(farmGrowthUpdateTileHandler, farmGrowthUpdateTile);
