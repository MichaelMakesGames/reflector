import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const removeEntity = createAction("REMOVE_ENTITY")<string>();
export default removeEntity;

function removeEntityHandler(
  state: WrappedState,
  action: ReturnType<typeof removeEntity>
): void {
  state.act.removeEntities([action.payload]);
}

registerHandler(removeEntityHandler, removeEntity);
