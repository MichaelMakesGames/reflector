import actions from "~/state/actions";
import selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function rotateThrow(
  state: GameState,
  action: ReturnType<typeof actions.rotatePlacement>,
): GameState {
  let newState = state;
  let entity = selectors.placingTarget(newState);
  if (!entity) return newState;
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
  newState = handleAction(newState, actions.updateEntity(entity));
  return newState;
}

registerHandler(rotateThrow, actions.rotatePlacement);
