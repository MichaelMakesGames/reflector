import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import { Entity } from "../../types";
import WrappedState from "../../types/WrappedState";
import { createEntityFromTemplate } from "../../lib/entities";
import { retargetLaserOnReflectorChange } from "../../lib/lasers";

const rotateEntity = createAction("ROTATE_ENTITY")<Entity>();
export default rotateEntity;

function rotateEntityHandler(
  state: WrappedState,
  action: ReturnType<typeof rotateEntity>
): void {
  const entity = action.payload;
  if (!entity.rotatable) return;
  state.act.removeEntity(entity.id);
  const newEntity = {
    ...entity,
    ...createEntityFromTemplate(entity.rotatable.rotatesTo),
  };
  state.act.addEntity(newEntity);
  if (entity.reflector && entity.pos) {
    retargetLaserOnReflectorChange(state, entity.pos);
  }
}

registerHandler(rotateEntityHandler, rotateEntity);
