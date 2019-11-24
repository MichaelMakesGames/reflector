import { Tuple, Object } from "ts-toolbelt";
import { RawState } from "./RawState";
import selectors from "~state/selectors";
import actions from "~state/actions";
import { Action } from "./Action";
import { Entity } from "./Entity";

type SelectBase = {
  [K in keyof typeof selectors]: (
    ...args: Tuple.Tail<Parameters<typeof selectors[K]>>
  ) => ReturnType<typeof selectors[K]>;
};

interface Select extends SelectBase {
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
  handle: (action: Action) => WrappedState;
}
