/* global document */
import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app, getPosFromMouse, zoomOut, zoomTo } from "~/renderer";
import { DOWN, LEFT, PLAYER_ID, RIGHT, UP } from "~constants";
import { ControlCode } from "~types/ControlCode";
import { useControl } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { Pos } from "~types";
import { isDndFocused } from "~utils/controls";
import { arePositionsEqual } from "~utils/geometry";
import ContextMenu from "./ContextMenu";
import { SettingsContext } from "~contexts";

export default function GameMap() {
  useEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      map.appendChild(app.view);
    }
  }, []);

  const dispatch = useDispatch();
  const settings = useContext(SettingsContext);
  const cursorPos = useSelector(selectors.cursorPos);
  const [contextMenuPos, setContextMenuPos] = useState<Pos | null>(null);
  const isWeaponActive = useSelector(selectors.isWeaponActive);
  const isPlacing = useSelector(selectors.isPlacing);
  const playerPos = useSelector(selectors.playerPos);

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
  const moveEnabled = !isWeaponActive && !isPlacing;
  useControl(ControlCode.Up, moveUp, moveEnabled);
  useControl(ControlCode.Down, moveDown, moveEnabled);
  useControl(ControlCode.Left, moveLeft, moveEnabled);
  useControl(ControlCode.Right, moveRight, moveEnabled);

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
  useControl(ControlCode.Up, moveCursorUp, true, cursorModifiers);
  useControl(ControlCode.Down, moveCursorDown, true, cursorModifiers);
  useControl(ControlCode.Left, moveCursorLeft, true, cursorModifiers);
  useControl(ControlCode.Right, moveCursorRight, true, cursorModifiers);
  useControl(ControlCode.Back, () => {
    setContextMenuPos(null);
    dispatch(actions.setCursorPos(null));
  });
  useControl(ControlCode.Wait, () => {
    dispatch(actions.playerWillTakeTurn());
    dispatch(actions.playerTookTurn());
  });
  useControl(ControlCode.Undo, () => dispatch(actions.undoTurn()));

  const performDefaultAction = (pos: Pos | null) => {
    if (pos) {
      if (isPlacing) {
        dispatch(actions.finishPlacement({ placeAnother: true }));
      } else {
        dispatch(actions.cycleReflector(pos));
      }
    }
  };
  useControl(ControlCode.QuickAction, () => performDefaultAction(cursorPos));

  return (
    <section className="relative">
      {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        id="map"
        onMouseMove={(e) => {
          const pos = getPosFromMouse(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY,
          );
          if (
            !cursorPos ||
            (!arePositionsEqual(cursorPos, pos) && !contextMenuPos)
          ) {
            dispatch(actions.setCursorPos(pos));
          }
        }}
        onMouseOut={() => {
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
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          const mousePos = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          };
          const gamePos = getPosFromMouse(mousePos.x, mousePos.y);
          if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
            dispatch(actions.setCursorPos(gamePos));
          }
          setContextMenuPos(mousePos);
        }}
        onClick={(e) => {
          const mousePos = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          };
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
