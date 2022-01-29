import React, { useContext, useMemo, useReducer } from "react";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import audio from "../lib/audio";
import renderer from "../renderer";
import { createInitialState } from "../state/initialState";
import { makeReducer } from "../state/reducer";
import { Action, RawState } from "../types";
import { useSettings } from "./SettingsProvider";

const initialState = createInitialState({
  completedTutorials: [],
  mapType: "standard",
});

const DispatchContext = React.createContext<(action: Action) => void>(() => {});
const StateContext = React.createContext<RawState>(initialState);

export default function GameProvider({
  children,
  redux,
}: {
  children: React.ReactNode;
  redux: boolean;
}) {
  const [settings] = useSettings();
  const reducer = useMemo(
    () => makeReducer(renderer, audio, settings),
    [settings]
  );
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useReduxDispatch();
  const reduxState = useReduxSelector(identity) as RawState;
  return (
    <DispatchContext.Provider value={redux ? reduxDispatch : dispatch}>
      <StateContext.Provider value={redux ? reduxState : state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

function identity<T>(value: T): T {
  return value;
}

export function useDispatch() {
  return useContext(DispatchContext);
}

export function useSelector<T>(selector: (state: RawState) => T) {
  return selector(useContext(StateContext));
}
