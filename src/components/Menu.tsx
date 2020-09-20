/* global document */
import Tippy from "@tippyjs/react";
import React from "react";
import { useDispatch } from "react-redux";
import { useBoolean } from "~hooks";
import actions from "~state/actions";
import KeyboardControls from "./KeyboardControls";

export default function Menu() {
  const [isOpen, _, close, toggle] = useBoolean(false);
  const [controlsIsOpen, openControls, closeControls] = useBoolean(false);
  const dispatch = useDispatch();
  return (
    <Tippy
      visible={isOpen}
      arrow={false}
      interactive
      onClickOutside={close}
      placement="bottom-end"
      content={
        <ul>
          <li>
            <button
              type="button"
              onClick={() => {
                close();
                dispatch(actions.undoTurn());
              }}
            >
              Undo Turn
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                close();
                dispatch(actions.newGame());
              }}
            >
              Restart Game
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                close();
                if (document.fullscreen) {
                  document.exitFullscreen();
                } else {
                  document.body.requestFullscreen();
                }
              }}
            >
              Toggle Fullscreen
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                close();
                openControls();
              }}
            >
              Controls
            </button>
            {controlsIsOpen && <KeyboardControls onClose={closeControls} />}
          </li>
        </ul>
      }
    >
      <button onClick={toggle} type="button">
        Menu
      </button>
    </Tippy>
  );
}
