import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Object } from "ts-toolbelt";
import { CURSOR_ID } from "../constants";
import { getPathWithoutCosts } from "../lib/ai";
import { createEntityFromTemplate } from "../lib/entities";
import {
  arePathsEqual,
  arePositionsEqual,
  getDistance,
  getPosKey,
} from "../lib/geometry";
import renderer from "../renderer";
import actions from "../state/actions";
import selectors from "../state/selectors";
import wrapState from "../state/wrapState";
import { Entity, Pos } from "../types";
import { useDispatch, useSelector } from "./GameProvider";
import { useSettings } from "./SettingsProvider";

export const CursorContext = React.createContext<
  [null | Pos, React.Dispatch<React.SetStateAction<null | Pos>>]
>([null, () => {}]);

const cursorTemplate = {
  ...(createEntityFromTemplate("UI_CURSOR") as Object.Required<
    Entity,
    "display"
  >),
  id: CURSOR_ID,
};

export default function CursorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useState<null | Pos>(null);

  useEffect(() => {
    if (value[0]) {
      renderer.addOrUpdateEntity({ ...cursorTemplate, pos: value[0] });
    } else {
      renderer.removeEntity(CURSOR_ID);
    }
  }, [value[0]]);

  return (
    <CursorContext.Provider value={value}>
      {children}
      <RelatedPositionsHighlighter />
      <BlueprintMover />
      <AutoMovePathSetter />
    </CursorContext.Provider>
  );
}

const EMPTY: Object.Required<Entity, "pos">[] = [];
export function useEntitiesAtCursor() {
  const [cursorPos] = useContext(CursorContext);
  return useSelector((state) =>
    cursorPos ? selectors.entitiesAtPosition(state, cursorPos) : EMPTY
  );
}

function RelatedPositionsHighlighter() {
  const entitiesAtCursor = useEntitiesAtCursor();
  const highlightedPosKeysRef = useRef<Set<string>>(new Set());
  const gameState = useSelector(selectors.state);

  useEffect(
    () => () =>
      highlightedPosKeysRef.current.forEach((posKey) =>
        renderer.removeEntity(`UI_HIGHLIGHT_${posKey}`)
      ),
    []
  );

  useEffect(() => {
    const newHighlightedPositions: Pos[] = [];
    (entitiesAtCursor || []).forEach((entity) => {
      if (entity.colonist) {
        const residence = selectors.residence(
          gameState,
          entity as Object.Required<Entity, "colonist">
        );
        const employment = selectors.employment(
          gameState,
          entity as Object.Required<Entity, "colonist">
        );
        if (residence) newHighlightedPositions.push(residence.pos);
        if (employment) newHighlightedPositions.push(employment.pos);
      }
      if (entity.jobProvider) {
        const employees = selectors.employees(gameState, entity);
        newHighlightedPositions.push(...employees.map((e) => e.pos));
      }
      if (entity.housing) {
        const residents = selectors.residents(gameState, entity);
        newHighlightedPositions.push(...residents.map((e) => e.pos));
      }
    });

    // add new highlights
    const newHighlightedPosKeys: Set<string> = new Set();
    newHighlightedPositions.forEach((pos) => {
      const posKey = getPosKey(pos);
      if (!newHighlightedPosKeys.has(posKey)) {
        newHighlightedPosKeys.add(posKey);
        if (!highlightedPosKeysRef.current.has(posKey)) {
          const entity = {
            ...createEntityFromTemplate("UI_HIGHLIGHT", { pos }),
            id: `UI_HIGHLIGHT_${posKey}`,
          };
          renderer.addEntity(
            entity as Object.Required<Entity, "display" | "pos">
          );
        }
      }
    });
    // remove old highlights
    highlightedPosKeysRef.current.forEach((posKey) => {
      if (!newHighlightedPosKeys.has(posKey)) {
        renderer.removeEntity(`UI_HIGHLIGHT_${posKey}`);
      }
    });
    // update highlightedPosKeys for next time
    highlightedPosKeysRef.current = newHighlightedPosKeys;
  });

  return null;
}

function BlueprintMover() {
  const [cursorPos] = useContext(CursorContext);
  const blueprint = useSelector(selectors.blueprint);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (
      blueprint &&
      cursorPos &&
      !arePositionsEqual(cursorPos, blueprint.pos)
    ) {
      dispatch(actions.blueprintMove({ to: cursorPos }));
    }
  });
  return null;
}

function AutoMovePathSetter() {
  const [settings] = useSettings();
  const [cursorPos] = useContext(CursorContext);
  const dispatch = useDispatch();
  const state = useSelector(selectors.state);
  const player = useSelector(selectors.player);
  const playerPos = useSelector(selectors.playerPos);
  const isAutoMoving = useSelector(selectors.isAutoMoving);
  const autoMovePath = useSelector(selectors.autoMovePath);
  useEffect(() => {
    if (isAutoMoving) return;

    if (cursorPos && player && playerPos) {
      if (
        settings.clickToMove === "ALWAYS" ||
        (settings.clickToMove === "ADJACENT" &&
          getDistance(cursorPos, playerPos, true) === 1)
      ) {
        const path = getPathWithoutCosts(
          playerPos,
          cursorPos,
          player,
          wrapState(state)
        );
        if (path) {
          if (!arePathsEqual(path, autoMovePath)) {
            dispatch(actions.setAutoMovePath(path));
          }
          // exit here so we don't clear the path below
          return;
        }
      }
    }

    // no valid path, so clear existing path
    if (autoMovePath.length) {
      dispatch(actions.setAutoMovePath([]));
    }
  });
  return null;
}
