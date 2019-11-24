import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function rotateThrow(
  state: WrappedState,
  action: ReturnType<typeof actions.rotatePlacement>,
): void {
  let entity = state.select.placingTarget();
  if (!entity) return;
  if (entity.reflector && entity.display) {
    entity = {
      ...entity,
      reflector: { type: entity.reflector.type === "\\" ? "/" : "\\" },
      display: {
        ...entity.display,
        rotation: Number(!entity.display.rotation) * 90,
        glyph: entity.display.glyph === "\\" ? "/" : "\\",
      },
    };
  }
  if (entity.splitter && entity.display) {
    entity = {
      ...entity,
      splitter: {
        type: entity.splitter.type === "horizontal" ? "vertical" : "horizontal",
      },
      display: {
        ...entity.display,
        rotation: Number(!entity.display.rotation) * 90,
        glyph: entity.display.glyph === "⬍" ? "⬌" : "⬍",
      },
    };
  }
  state.act.updateEntity(entity);
}

registerHandler(rotateThrow, actions.rotatePlacement);
