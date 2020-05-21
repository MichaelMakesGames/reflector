import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";
import { retargetLaserOnReflectorChange } from "~utils/lasers";

function rotateEntity(
  state: WrappedState,
  action: ReturnType<typeof actions.rotateEntity>,
): void {
  const entity = action.payload;
  if (!entity.rotatable) return;
  state.act.removeEntity(entity.id);
  state.act.addEntity({
    ...entity,
    ...createEntityFromTemplate(entity.rotatable.rotatesTo),
  });
  if (entity.reflector && entity.pos) {
    retargetLaserOnReflectorChange(state, entity.pos);
  }
}

registerHandler(rotateEntity, actions.rotateEntity);
