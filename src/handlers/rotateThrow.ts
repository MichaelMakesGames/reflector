import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../types";
import { addEntity } from "./addEntity";

export function rotateThrow(
  state: GameState,
  action: ReturnType<typeof actions.rotateThrow>,
): GameState {
  let entity = selectors.throwingTarget(state);
  if (!entity) return state;
  if (entity.reflector && entity.glyph) {
    entity = {
      ...entity,
      reflector: { type: entity.reflector.type === "\\" ? "/" : "\\" },
      glyph: {
        ...entity.glyph,
        glyph: entity.glyph.glyph === "\\" ? "/" : "\\",
      },
    };
  }
  if (entity.splitter && entity.glyph) {
    entity = {
      ...entity,
      splitter: {
        type: entity.splitter.type === "horizontal" ? "vertical" : "horizontal",
      },
      glyph: { ...entity.glyph, glyph: entity.glyph.glyph === "⬍" ? "⬌" : "⬍" },
    };
  }
  state = addEntity(state, actions.addEntity({ entity }));
  return state;
}
