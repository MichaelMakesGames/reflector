import { Required } from "Object/_api";
import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import { Entity, Pos } from "~types";
import WrappedState from "~types/WrappedState";
import { canPlaceReflector } from "~lib/building";
import { createEntityFromTemplate } from "~lib/entities";

const cycleReflector = createStandardAction("CYCLE_REFLECTOR")<Pos>();
export default cycleReflector;

function cycleReflectorHandler(
  state: WrappedState,
  action: ReturnType<typeof cycleReflector>,
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

registerHandler(cycleReflectorHandler, cycleReflector);
