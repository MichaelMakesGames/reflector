/* global document */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { app, getPosFromMouse, zoomOut, zoomTo } from "~/renderer";
import {
  DOWN,
  LEFT,
  PLAYER_ID,
  RIGHT,
  UP,
  MAP_WIDTH,
  MAP_HEIGHT,
} from "~constants";
import { SettingsContext } from "~contexts";
import { useControl, HotkeyGroup } from "~components/HotkeysProvider";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { Pos, RawState } from "~types";
import { ControlCode } from "~types/ControlCode";
import { getQuickAction, isDndFocused, noFocusOnClick } from "~utils/controls";
import { arePositionsEqual } from "~utils/geometry";
import ContextMenu from "./ContextMenu";
import { useInterval } from "~hooks";

export default function GameMap() {
  useEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      map.appendChild(app.view);
      app.view.id = "map";
    }
  }, []);

  const dispatch = useDispatch();
  const settings = useContext(SettingsContext);
  const cursorPos = useSelector(selectors.cursorPos);
  const [contextMenuPos, setContextMenuPos] = useState<Pos | null>(null);
  const isWeaponActive = useSelector(selectors.isWeaponActive);
  const isPlacing = useSelector(selectors.isPlacing);
  const playerPos = useSelector(selectors.playerPos);
  const state = useSelector(selectors.state);
  const isCursorInProjectorRange = useSelector((s: RawState) =>
    selectors.isInProjectorRange(s, cursorPos),
  );
  const mousePosRef = useRef<Pos | null>(null);

  useEffect(() => setContextMenuPos(null), [playerPos]);

  const moveUp = () => {
    if (!isDndFocused()) {
      dispatch(actions.move({ entityId: PLAYER_ID, ...UP }));
    }
  };
  const moveRight = () => {
    if (!isDndFocused()) {
      dispatch(actions.move({ entityId: PLAYER_ID, ...RIGHT }));
    }
  };
  const moveDown = () => {
    if (!isDndFocused()) {
      dispatch(actions.move({ entityId: PLAYER_ID, ...DOWN }));
    }
  };
  const moveLeft = () => {
    if (!isDndFocused()) {
      dispatch(actions.move({ entityId: PLAYER_ID, ...LEFT }));
    }
  };
  const moveEnabled =
    !isWeaponActive && (!settings.unmodifiedBuilding || !isPlacing);
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
    if (!isDndFocused()) {
      dispatch(actions.moveCursor({ ...UP }));
    }
  };
  const moveCursorRight = () => {
    if (!isDndFocused()) {
      dispatch(actions.moveCursor({ ...RIGHT }));
    }
  };
  const moveCursorDown = () => {
    if (!isDndFocused()) {
      dispatch(actions.moveCursor({ ...DOWN }));
    }
  };
  const moveCursorLeft = () => {
    if (!isDndFocused()) {
      dispatch(actions.moveCursor({ ...LEFT }));
    }
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
    disabled: !(isPlacing && settings.unmodifiedBuilding),
  });
  useControl({
    code: ControlCode.Down,
    group: HotkeyGroup.Main,
    callback: moveCursorDown,
    disabled: !(isPlacing && settings.unmodifiedBuilding),
  });
  useControl({
    code: ControlCode.Left,
    group: HotkeyGroup.Main,
    callback: moveCursorLeft,
    disabled: !(isPlacing && settings.unmodifiedBuilding),
  });
  useControl({
    code: ControlCode.Right,
    group: HotkeyGroup.Main,
    callback: moveCursorRight,
    disabled: !(isPlacing && settings.unmodifiedBuilding),
  });

  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Main,
    callback: () => {
      setContextMenuPos(null);
      if (cursorPos) dispatch(actions.setCursorPos(null));
    },
  });
  useControl({
    code: ControlCode.Undo,
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.undoTurn()),
  });
  useControl({
    code: ControlCode.ClearAllReflectors,
    group: HotkeyGroup.Main,
    callback: () => dispatch(actions.clearReflectors()),
  });

  useControl({
    code: ControlCode.ZoomIn,
    group: HotkeyGroup.Main,
    callback: () =>
      zoomTo(playerPos || { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 }),
  });
  useControl({
    code: ControlCode.ZoomOut,
    group: HotkeyGroup.Main,
    callback: zoomOut,
  });

  const performDefaultAction = (pos: Pos | null) => {
    const quickAction = getQuickAction(state, pos);
    if (quickAction) {
      dispatch(quickAction.action);
    }
  };
  useControl({
    code: ControlCode.QuickAction,
    group: HotkeyGroup.Main,
    callback: () => performDefaultAction(cursorPos),
  });

  const autoMove = useCallback(() => {
    if (state.isAutoMoving) {
      dispatch(actions.autoMove());
    }
  }, [state.isAutoMoving]);
  useInterval(autoMove, 150);

  return (
    <ContextMenu pos={contextMenuPos} onClose={() => setContextMenuPos(null)}>
      <section
        className={`relative ${
          isCursorInProjectorRange ? "cursor-pointer" : ""
        }`}
      >
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div
          className="w-full h-full"
          id="map"
          onMouseMove={(e) => {
            const mousePos = {
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            };
            mousePosRef.current = mousePos;
            const pos = getPosFromMouse(mousePos.x, mousePos.y);
            if (
              !cursorPos ||
              (!arePositionsEqual(cursorPos, pos) && !contextMenuPos)
            ) {
              dispatch(actions.setCursorPos(pos));
            }
          }}
          onMouseOut={() => {
            mousePosRef.current = null;
            if (!contextMenuPos && cursorPos) {
              dispatch(actions.setCursorPos(null));
            }
          }}
          onWheel={(e) => {
            if (e.nativeEvent.deltaY > 0) {
              zoomOut();
            } else if (e.nativeEvent.deltaY < 0 && playerPos) {
              zoomTo(playerPos);
            }
            if (mousePosRef.current) {
              const gamePos = getPosFromMouse(
                mousePosRef.current.x,
                mousePosRef.current.y,
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
            const gamePos = getPosFromMouse(mousePos.x, mousePos.y);
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
            const gamePos = getPosFromMouse(mousePos.x, mousePos.y);
            if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
              dispatch(actions.setCursorPos(gamePos));
            }
            performDefaultAction(gamePos);
          })}
        />
      </section>
    </ContextMenu>
  );
}
