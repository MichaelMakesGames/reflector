import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";

function rotateThrow(
  state: WrappedState,
  action: ReturnType<typeof actions.rotatePlacement>,
): void {
  const entity = state.select.placingTarget();
  if (!entity || !entity.rotatable) return;
  state.act.removeEntity({ entityId: entity.id });
  state.act.addEntity({
    entity: {
      ...entity,
      ...createEntityFromTemplate(entity.rotatable.rotatesTo),
    },
  });
}

registerHandler(rotateThrow, actions.rotatePlacement);
