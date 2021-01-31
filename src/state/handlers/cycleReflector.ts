import { Required } from "Object/_api";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import { Entity } from "~types";
import WrappedState from "~types/WrappedState";
import { canPlaceReflector } from "~utils/building";
import { createEntityFromTemplate } from "~utils/entities";

function cycleReflector(
  state: WrappedState,
  action: ReturnType<typeof actions.cycleReflector>,
): void {
  const pos = action.payload;
  const entitiesAtPos = state.select.entitiesAtPosition(pos);
  const reflectorAtPos = entitiesAtPos.find((e) =>
    Boolean(e.reflector),
  ) as Required<Entity, "reflector">;
  if (reflectorAtPos) {
    if (reflectorAtPos.reflector.type === "/") {
      state.act.rotateEntity(reflectorAtPos);
    } else {
      state.act.removeEntity(reflectorAtPos.id);
    }
  } else {
    const player = state.select.player();
    if (!player) return;
    if (canPlaceReflector(state, pos)) {
      state.act.addEntity(
        createEntityFromTemplate("REFLECTOR_UP_RIGHT", { pos }),
      );
    }
  }
}

registerHandler(cycleReflector, actions.cycleReflector);
