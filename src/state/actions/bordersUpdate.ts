import { createAction } from "typesafe-actions";
import { areConditionsMet } from "../../lib/conditions";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";

const bordersUpdate = createAction("bordersUpdate")();
export default bordersUpdate;

function bordersUpdateHandler(
  state: WrappedState,
  action: ReturnType<typeof bordersUpdate>
): void {
  const hasBorders = state.select.entitiesWithComps("border").length > 0;
  const shouldDrawBorders = Boolean(
    state.select.blueprint()?.blueprint?.showBorders ||
      state.select.entitiesWithComps("laser").length
  );
  if (shouldDrawBorders) {
    const bordersKey = state.select
      .entitiesWithComps("projector", "pos")
      .filter((e) => areConditionsMet(state, e, e.projector.condition))
      .map((e) => `${e.pos.x},${e.pos.y},${e.projector.range}`)
      .sort()
      .join("-");
    if (bordersKey !== state.raw.bordersKey) {
      state.setRaw({ ...state.raw, bordersKey });
      state.act.bordersRemove();
      state.act.bordersDraw();
    }
  } else if (hasBorders) {
    state.setRaw({ ...state.raw, bordersKey: null });
    state.act.bordersRemove();
  }
}

registerHandler(bordersUpdateHandler, bordersUpdate);
