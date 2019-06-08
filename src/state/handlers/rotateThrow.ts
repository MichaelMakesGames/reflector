import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { updateEntity } from "./updateEntity";

export function rotateThrow(
  state: GameState,
  action: ReturnType<typeof actions.rotateThrow>,
): GameState {
  let entity = selectors.throwingTarget(state);
  if (!entity) return state;
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
  state = updateEntity(state, actions.updateEntity(entity));
  return state;
}
