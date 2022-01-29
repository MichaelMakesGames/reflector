import Audio from "../lib/audio/Audio";
import DummyAudio from "../lib/audio/DummyAudio";
import Renderer from "../renderer/Renderer";
import { Action, RawState } from "../types";
import WrappedState from "../types/WrappedState";
import actions from "./actions";
import handleAction from "./handleAction";
import selectors from "./selectors";
import defaultRenderer from "../renderer";
import defaultAudio from "../lib/audio";
import { save as defaultSave } from "../lib/gameSave";
import Settings from "../types/Settings";
import defaultSettings from "../data/defaultSettings";

export default function wrapState(
  state: RawState,
  renderer: Renderer = defaultRenderer,
  audio: Audio | DummyAudio = defaultAudio,
  settings: Settings = defaultSettings,
  save: (state: RawState) => void = defaultSave
): WrappedState {
  const wrappedState: any = {
    raw: state,
    select: {},
    act: {},
    actions,
    renderer,
    audio,
    settings,
    save,
  };
  wrappedState.setRaw = (newState: RawState) => {
    wrappedState.raw = newState;
    return wrappedState;
  };
  wrappedState.handle = (action: Action) => {
    handleAction(wrappedState, action);
    return wrappedState;
  };
  for (const [key, actionCreator] of Object.entries(actions)) {
    wrappedState.act[key] = (...args: any[]) =>
      wrappedState.handle((actionCreator as any)(...args));
  }
  for (const [key, selector] of Object.entries(selectors)) {
    wrappedState.select[key] = (...args: any[]) =>
      (selector as any)(wrappedState.raw, ...args);
  }
  return wrappedState;
}
