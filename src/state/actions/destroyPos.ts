import { createAction } from "typesafe-actions";
import colors from "../../colors";
import { Pos } from "../../types";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";

const destroyPos = createAction("destroyPos")<{ target: Pos; from: Pos }>();
export default destroyPos;

function destroyPosHandler(
  state: WrappedState,
  action: ReturnType<typeof destroyPos>
): void {
  const entitiesAtTarget = state.select.entitiesAtPosition(
    action.payload.target
  );
  const entitiesAtFrom = state.select.entitiesAtPosition(action.payload.from);

  const shieldEntity = entitiesAtTarget.find((e) => e.shield);
  const shield = shieldEntity && shieldEntity.shield;
  if (
    shield &&
    !entitiesAtFrom.some(
      (e) => e.shield && e.shield.generator === shield.generator
    )
  ) {
    state.act.shieldDischarge(shield.generator);
    state.renderer.flash(action.payload.target, colors.secondary);
    state.audio.playAtPos("power_off", action.payload.target, { volume: 2 });
  } else {
    entitiesAtTarget
      .filter((e) => e.destructible)
      .forEach(({ id }) => state.act.destroy(id));
  }
}

registerHandler(destroyPosHandler, destroyPos);
