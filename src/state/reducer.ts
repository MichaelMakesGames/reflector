import { getType } from "typesafe-actions";
import { Action, RawState } from "../types";
import actions from "./actions";
import { createInitialState } from "./initialState";
import { processTutorials } from "../lib/tutorials";
import wrapState from "./wrapState";
import Audio from "../lib/audio/Audio";
import Renderer from "../renderer/Renderer";
import DummyAudio from "../lib/audio/DummyAudio";
import { save } from "../lib/gameSave";
import Settings from "../types/Settings";

const GAME_OVER_ALLOW_LIST: string[] = [
  getType(actions.newGame),
  getType(actions.undoTurn),
  getType(actions.continueVictory),
];

const AUTO_MOVE_ALLOW_LIST: string[] = [
  getType(actions.autoMove),
  getType(actions.setCursorPos),
];

export function makeReducer(
  renderer: Renderer,
  audio: Audio | DummyAudio,
  settings: Settings
) {
  return function reducer(
    state: RawState = createInitialState({
      completedTutorials: [],
      mapType: "standard",
    }),
    action: Action
  ): RawState {
    const wrappedState = wrapState(state, renderer, audio, settings, save);

    if (state.gameOver && !GAME_OVER_ALLOW_LIST.includes(action.type)) {
      return state;
    }

    if (state.isAutoMoving && !AUTO_MOVE_ALLOW_LIST.includes(action.type)) {
      wrappedState.act.cancelAutoMove();
      return wrappedState.raw;
    }

    wrappedState.handle(action);

    processTutorials(
      wrapState(state, renderer, audio, settings, () => {}),
      wrappedState,
      action
    );

    return { ...wrappedState.raw, entities: { ...wrappedState.raw.entities } };
  };
}
