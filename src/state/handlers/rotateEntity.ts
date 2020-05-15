import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";

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
}

registerHandler(rotateEntity, actions.rotateEntity);
