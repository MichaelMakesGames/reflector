/* global document */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app, getPosFromMouse, zoomOut, zoomTo } from "~/renderer";
import { DOWN, LEFT, PLAYER_ID, RIGHT, UP } from "~constants";
import { SettingsContext } from "~contexts";
import { useControl } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { Pos, RawState } from "~types";
import { ControlCode } from "~types/ControlCode";
import { isDndFocused } from "~utils/controls";
import { arePositionsEqual } from "~utils/geometry";
import ContextMenu from "./ContextMenu";

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
  const isCursorInProjectorRange = useSelector((state: RawState) =>
    selectors.isInProjectorRange(state, cursorPos),
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
    controlCode: ControlCode.Up,
    callback: moveUp,
    enabled: moveEnabled,
  });
  useControl({
    controlCode: ControlCode.Down,
    callback: moveDown,
    enabled: moveEnabled,
  });
  useControl({
    controlCode: ControlCode.Left,
    callback: moveLeft,
    enabled: moveEnabled,
  });
  useControl({
    controlCode: ControlCode.Right,
    callback: moveRight,
    enabled: moveEnabled,
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

  const cursorModifiers =
    settings.unmodifiedBuilding && isPlacing
      ? ["", settings.cursorModifierKey]
      : [settings.cursorModifierKey];
  useControl({
    controlCode: ControlCode.Up,
    callback: moveCursorUp,
    modifiers: cursorModifiers,
  });
  useControl({
    controlCode: ControlCode.Down,
    callback: moveCursorDown,
    modifiers: cursorModifiers,
  });
  useControl({
    controlCode: ControlCode.Left,
    callback: moveCursorLeft,
    modifiers: cursorModifiers,
  });
  useControl({
    controlCode: ControlCode.Right,
    callback: moveCursorRight,
    modifiers: cursorModifiers,
  });
  useControl({
    controlCode: ControlCode.Back,
    callback: () => {
      setContextMenuPos(null);
      dispatch(actions.setCursorPos(null));
    },
  });
  useControl({
    controlCode: ControlCode.Wait,
    callback: () => {
      dispatch(actions.playerTookTurn());
    },
  });
  useControl({
    controlCode: ControlCode.Undo,
    callback: () => dispatch(actions.undoTurn()),
    allowOnGameOver: true,
  });
  useControl({
    controlCode: ControlCode.ClearAllReflectors,
    callback: () => dispatch(actions.clearReflectors()),
  });

  const performDefaultAction = (pos: Pos | null) => {
    if (pos) {
      if (isPlacing) {
        dispatch(actions.finishPlacement({ placeAnother: true }));
      } else {
        dispatch(actions.cycleReflector(pos));
      }
    }
  };
  useControl({
    controlCode: ControlCode.QuickAction,
    callback: () => performDefaultAction(cursorPos),
  });

  return (
    <section
      className={`relative ${isCursorInProjectorRange ? "cursor-pointer" : ""}`}
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
          if (!contextMenuPos) {
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
            setContextMenuPos(mousePos);
          } else {
            setContextMenuPos(null);
          }
        }}
        onClick={(e) => {
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
        }}
      />
      {contextMenuPos ? (
        <ContextMenu
          pos={contextMenuPos}
          onClose={() => setContextMenuPos(null)}
        />
      ) : null}
    </section>
  );
}
