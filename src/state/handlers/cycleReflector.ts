import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { Entity, HasReflector } from "~types";
import { createEntityFromTemplate } from "~utils/entities";
import { areConditionsMet } from "~utils/conditions";
import { findValidPositions } from "~utils/building";
import selectors from "~state/selectors";
import { arePositionsEqual } from "~utils/geometry";
import { registerHandler } from "~state/handleAction";

function cycleReflector(
  state: WrappedState,
  action: ReturnType<typeof actions.cycleReflector>,
): void {
  const pos = action.payload;
  const entitiesAtPos = state.select.entitiesAtPosition(pos);
  const reflectorAtPos = entitiesAtPos.find((e) =>
    Boolean(e.reflector),
  ) as Entity & HasReflector;
  if (reflectorAtPos) {
    if (reflectorAtPos.reflector.type === "/") {
      state.act.rotateEntity(reflectorAtPos);
    } else {
      state.act.removeEntity(reflectorAtPos.id);
    }
  } else {
    const player = state.select.player();
    if (!player) return;
    const validPositions = findValidPositions(
      state,
      [
        {
          pos: player.pos,
          range: player.projector ? player.projector.range : 0,
        },
        ...state.select
          .entitiesWithComps("projector", "pos")
          .filter((e) => areConditionsMet(state, e, e.projector.condition))
          .map((e) => ({
            pos: e.pos,
            range: e.projector.range,
          })),
      ],
      selectors.canPlaceReflector,
      true,
    );
    if (validPositions.some((validPos) => arePositionsEqual(pos, validPos))) {
      state.act.addEntity(
        createEntityFromTemplate("REFLECTOR_UP_RIGHT", { pos }),
      );
    }
  }
}

registerHandler(cycleReflector, actions.cycleReflector);
