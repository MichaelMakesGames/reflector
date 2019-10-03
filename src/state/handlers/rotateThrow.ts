import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function rotateThrow(
  state: GameState,
  action: ReturnType<typeof actions.rotateThrow>,
): GameState {
  let newState = state;
  let entity = selectors.throwingTarget(newState);
  if (!entity) return newState;
  if (entity.reflector && entity.display) {
    entity = {
      ...entity,
      reflector: { type: entity.reflector.type === "\\" ? "/" : "\\" },
      display: {
        ...entity.display,
        tile:
          entity.display.tile === "reflector_1" ? "reflector_2" : "reflector_1",
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
        tile:
          entity.display.tile === "splitter_1" ? "splitter_2" : "splitter_1",
        glyph: entity.display.glyph === "⬍" ? "⬌" : "⬍",
      },
    };
  }
  newState = handleAction(newState, actions.updateEntity(entity));
  return newState;
}

registerHandler(rotateThrow, actions.rotateThrow);