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
  const isPlacingTarget = entity === state.select.placingTarget();
  state.act.removeEntity(entity.id);
  let newEntity = {
    ...entity,
    ...createEntityFromTemplate(entity.rotatable.rotatesTo),
  };
  if (isPlacingTarget && newEntity.display && entity.display) {
    newEntity = {
      ...newEntity,
      display: {
        ...newEntity.display,
        color: entity.display.color,
      },
    };
  }
  state.act.addEntity(newEntity);

  if (entity.reflector && entity.pos) {
    retargetLaserOnReflectorChange(state, entity.pos);
  }
}

registerHandler(rotateEntity, actions.rotateEntity);
