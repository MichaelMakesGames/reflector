/* global document */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "./GameProvider";
// @ts-ignore
import cursorImages from "../assets/tiles/cursor_*.png";
import {
  DOWN,
  LEFT,
  MAP_HEIGHT,
  MAP_WIDTH,
  PLAYER_ID,
  RIGHT,
  UP,
} from "../constants";
import { useInterval } from "../hooks";
import { getQuickAction, noFocusOnClick } from "../lib/controls";
import { arePositionsEqual } from "../lib/geometry";
import renderer from "../renderer";
import actions from "../state/actions";
import selectors from "../state/selectors";
import { Pos } from "../types";
import { ControlCode } from "../types/ControlCode";
import ContextMenu from "./ContextMenu";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import MapTooltip from "./MapTooltip";
import { useSettings } from "./SettingsProvider";
import { RouterPageProps } from "./Router";

export default function GameMap({ navigateTo }: RouterPageProps) {
  useEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      renderer.appendView(map);
      renderer.setAppSize(window.innerWidth, window.innerHeight);
    }
  }, []);

  useEffect(() => {
    const resizeListener = () =>
      renderer.setAppSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  const dispatch = useDispatch();
  const [settings] = useSettings();
  const cursorPos = useSelector(selectors.cursorPos);
  const [contextMenuPos, setContextMenuPos] = useState<Pos | null>(null);
  const isWeaponActive = useSelector(selectors.isWeaponActive);
  const hasActiveBlueprint = useSelector(selectors.hasActiveBlueprint);
  const playerPos = useSelector(selectors.playerPos);
  const state = useSelector(selectors.state);
  const mousePosRef = useRef<Pos | null>(null);

  useEffect(() => setContextMenuPos(null), [playerPos]);

  const moveUp = () => {
    dispatch(actions.move({ entityId: PLAYER_ID, ...UP }));
  };
  const moveRight = () => {
    dispatch(actions.move({ entityId: PLAYER_ID, ...RIGHT }));
  };
  const moveDown = () => {
    dispatch(actions.move({ entityId: PLAYER_ID, ...DOWN }));
  };
  const moveLeft = () => {
    dispatch(actions.move({ entityId: PLAYER_ID, ...LEFT }));
  };
  const moveEnabled =
    !isWeaponActive && (!settings.unmodifiedBuilding || !hasActiveBlueprint);
  useControl({
    code: ControlCode.Up,
    group: HotkeyGroup.Main,
    callback: moveUp,
    disabled: !moveEnabled,
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
  });
  useControl({
    code: ControlCode.Down,
    group: HotkeyGroup.Main,
    callback: moveDown,
    disabled: !moveEnabled,
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
  });
  useControl({
    code: ControlCode.Left,
    group: HotkeyGroup.Main,
    callback: moveLeft,
    disabled: !moveEnabled,
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
  });
  useControl({
    code: ControlCode.Right,
    group: HotkeyGroup.Main,
    callback: moveRight,
    disabled: !moveEnabled,
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
  });

  const moveCursorUp = () => {
    dispatch(actions.moveCursor({ ...UP }));
  };
  const moveCursorRight = () => {
    dispatch(actions.moveCursor({ ...RIGHT }));
  };
  const moveCursorDown = () => {
    dispatch(actions.moveCursor({ ...DOWN }));
  };
  const moveCursorLeft = () => {
    dispatch(actions.moveCursor({ ...LEFT }));
  };

  useControl({
    code: ControlCode.Up,
    group: HotkeyGroup.Main,
    callback: moveCursorUp,
    [settings.cursorModifierKey]: true,
  });
  useControl({
    code: ControlCode.Down,
    group: HotkeyGroup.Main,
    callback: moveCursorDown,
    [settings.cursorModifierKey]: true,
  });
  useControl({
    code: ControlCode.Left,
    group: HotkeyGroup.Main,
    callback: moveCursorLeft,
    [settings.cursorModifierKey]: true,
  });
  useControl({
    code: ControlCode.Right,
    group: HotkeyGroup.Main,
    callback: moveCursorRight,
    [settings.cursorModifierKey]: true,
  });

  useControl({
    code: ControlCode.Up,
    group: HotkeyGroup.Main,
    callback: moveCursorUp,
    disabled: !(hasActiveBlueprint && settings.unmodifiedBuilding),
  });
  useControl({
    code: ControlCode.Down,
    group: HotkeyGroup.Main,
    callback: moveCursorDown,
    disabled: !(hasActiveBlueprint && settings.unmodifiedBuilding),
  });
  useControl({
    code: ControlCode.Left,
    group: HotkeyGroup.Main,
    callback: moveCursorLeft,
    disabled: !(hasActiveBlueprint && settings.unmodifiedBuilding),
  });
  useControl({
    code: ControlCode.Right,
    group: HotkeyGroup.Main,
    callback: moveCursorRight,
    disabled: !(hasActiveBlueprint && settings.unmodifiedBuilding),
  });

  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Main,
    callback: () => {
      // try to detect if using mouse for cursor. If so, don't clear cursor
      if (
        cursorPos &&
        (!mousePosRef.current ||
          !arePositionsEqual(
            renderer.getPosFromMouse(
              mousePosRef.current.x,
              mousePosRef.current.y
            ),
            cursorPos
          ))
      ) {
        setContextMenuPos(null);
        if (cursorPos) dispatch(actions.setCursorPos(null));
      } else if (contextMenuPos) {
        setContextMenuPos(null);
      } else {
        navigateTo("MainMenu");
      }
    },
    disabled: isWeaponActive || hasActiveBlueprint,
  });

  useControl({
    code: ControlCode.ZoomIn,
    group: HotkeyGroup.Main,
    callback: () => renderer.zoomIn(),
  });
  useControl({
    code: ControlCode.ZoomOut,
    group: HotkeyGroup.Main,
    callback: () => renderer.zoomOut(),
  });

  const performDefaultAction = (pos: Pos | null, modified?: boolean) => {
    const quickAction = getQuickAction(state, pos, modified);
    if (quickAction) {
      dispatch(quickAction.action);
    }
  };
  useControl({
    code: ControlCode.QuickAction,
    shift: false,
    group: HotkeyGroup.Main,
    callback: () => performDefaultAction(cursorPos),
  });
  useControl({
    code: ControlCode.QuickAction,
    shift: true,
    group: HotkeyGroup.Main,
    callback: () => performDefaultAction(cursorPos, true),
  });

  const autoMove = useCallback(() => {
    if (state.isAutoMoving) {
      dispatch(actions.autoMove());
    }
  }, [state.isAutoMoving]);
  useInterval(autoMove, 150);

  const onMouseMoveOrEnter = (e: React.MouseEvent) => {
    const mousePos = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
    mousePosRef.current = mousePos;
    const pos = renderer.getPosFromMouse(mousePos.x, mousePos.y);
    if (!cursorPos || (!arePositionsEqual(cursorPos, pos) && !contextMenuPos)) {
      dispatch(actions.setCursorPos(pos));
    }
  };

  const quickAction = getQuickAction(state, cursorPos);

  return (
    <ContextMenu pos={contextMenuPos} onClose={() => setContextMenuPos(null)}>
      <MapTooltip>
        <section
          className="relative w-full h-full"
          style={
            quickAction
              ? { cursor: `url(${cursorImages[quickAction.cursor]}), pointer` }
              : undefined
          }
        >
          {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div
            className="w-full h-full"
            id="map"
            onMouseMove={onMouseMoveOrEnter}
            onMouseEnter={onMouseMoveOrEnter}
            onMouseOut={() => {
              mousePosRef.current = null;
              if (!contextMenuPos && cursorPos) {
                dispatch(actions.setCursorPos(null));
              }
            }}
            onWheel={(e) => {
              if (e.nativeEvent.deltaY > 0) {
                renderer.zoomOut();
              } else if (e.nativeEvent.deltaY < 0) {
                renderer.zoomIn();
              }
              if (mousePosRef.current) {
                const gamePos = renderer.getPosFromMouse(
                  mousePosRef.current.x,
                  mousePosRef.current.y
                );
                if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
                  dispatch(actions.setCursorPos(gamePos));
                }
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              if (state.isAutoMoving) dispatch(actions.cancelAutoMove());
              const mousePos = {
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
              };
              mousePosRef.current = mousePos;
              const gamePos = renderer.getPosFromMouse(mousePos.x, mousePos.y);
              if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
                dispatch(actions.setCursorPos(gamePos));
              }
              if (!contextMenuPos) {
                setContextMenuPos(gamePos);
              } else {
                setContextMenuPos(null);
              }
            }}
            onClick={noFocusOnClick((e) => {
              if (contextMenuPos) {
                setContextMenuPos(null);
                return;
              }
              const mousePos = {
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
              };
              mousePosRef.current = mousePos;
              const gamePos = renderer.getPosFromMouse(mousePos.x, mousePos.y);
              if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
                dispatch(actions.setCursorPos(gamePos));
              }
              performDefaultAction(gamePos, e.shiftKey);
            })}
          />
        </section>
      </MapTooltip>
    </ContextMenu>
  );
}
