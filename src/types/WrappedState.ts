import type { Tuple, Object } from "ts-toolbelt";
import type { RawState } from "./RawState";
import type selectors from "../state/selectors";
import type actions from "../state/actions";
import type { Action } from "./Action";
import type { Entity } from "./Entity";
import Renderer from "../renderer/Renderer";
import Audio from "../lib/audio/Audio";
import DummyAudio from "../lib/audio/DummyAudio";

type SelectBase = {
  [K in keyof typeof selectors]: (
    ...args: Tuple.Tail<Parameters<typeof selectors[K]>>
  ) => ReturnType<typeof selectors[K]>;
};

interface Select extends Omit<SelectBase, "entitiesWithComps"> {
  entitiesWithComps: <C extends keyof Entity>(
    ...comps: C[]
  ) => Object.Required<Entity, C>[];
}

type Act = {
  [K in keyof typeof actions]: (
    ...args: Parameters<typeof actions[K]>
  ) => WrappedState;
};

export default interface WrappedState {
  raw: RawState;
  setRaw: (state: RawState) => WrappedState;
  select: Select;
  act: Act;
  actions: typeof actions;
  handle: (action: Action) => WrappedState;
  renderer: Renderer;
  audio: Audio | DummyAudio;
  save: (state: RawState) => void;
}
