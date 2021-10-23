import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const bordersRemove = createAction("bordersRemove")();
export default bordersRemove;

function bordersRemoveHandler(
  state: WrappedState,
  action: ReturnType<typeof bordersRemove>
): void {
  state.act.removeEntities(
    state.select.entitiesWithComps("border").map((e) => e.id)
  );
}

registerHandler(bordersRemoveHandler, bordersRemove);
