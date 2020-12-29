/* global document */
import Tippy from "@tippyjs/react";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { SettingsContext } from "~contexts";
import { useBoolean } from "~hooks";
import actions from "~state/actions";
import { ControlCode } from "~types/ControlCode";
import { noFocusOnClick } from "~utils/controls";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Kbd from "./Kbd";
import KeyboardControls from "./KeyboardControls";

export default function Menu() {
  const [isOpen, open, close, toggle] = useBoolean(false);
  const [controlsIsOpen, openControls, closeControls] = useBoolean(false);
  const dispatch = useDispatch();
  const settings = useContext(SettingsContext);
  const menuShortcuts = settings.keyboardShortcuts[ControlCode.Menu];

  useControl({
    code: ControlCode.Menu,
    callback: open,
    group: HotkeyGroup.Main,
  });

  useControl({
    code: ControlCode.Menu,
    callback: close,
    group: HotkeyGroup.Menu,
    disabled: !isOpen,
  });

  useControl({
    code: ControlCode.Back,
    callback: close,
    group: HotkeyGroup.Menu,
    disabled: !isOpen,
  });

  useControl({
    code: ControlCode.Help,
    callback: openControls,
    group: HotkeyGroup.Main,
    allowedGroups: [HotkeyGroup.Intro, HotkeyGroup.GameOver, HotkeyGroup.Menu],
  });

  return (
    <Tippy
      visible={isOpen}
      arrow={false}
      interactive
      onClickOutside={close}
      placement="bottom-end"
      content={
        isOpen ? (
          <ul>
            <MenuOption
              index={0}
              label="New Game"
              callback={() => dispatch(actions.newGame())}
              closeMenu={close}
            />
            <MenuOption
              index={1}
              label="Toggle Fullscreen"
              callback={() => {
                if (document.fullscreen) {
                  document.exitFullscreen();
                } else {
                  document.body.requestFullscreen();
                }
              }}
              closeMenu={close}
            />
            <MenuOption
              index={2}
              label="Controls"
              callback={openControls}
              closeMenu={close}
            />
          </ul>
        ) : null
      }
    >
      <button onClick={noFocusOnClick(toggle)} type="button">
        <Kbd light>{menuShortcuts[0]}</Kbd> Menu
        {controlsIsOpen && <KeyboardControls onClose={closeControls} />}
      </button>
    </Tippy>
  );
}

function MenuOption({
  callback,
  closeMenu,
  index,
  label,
}: {
  callback: () => void;
  closeMenu: () => void;
  index: number;
  label: string;
}) {
  const controlCode = [
    ControlCode.Menu1,
    ControlCode.Menu2,
    ControlCode.Menu3,
    ControlCode.Menu4,
    ControlCode.Menu5,
    ControlCode.Menu6,
    ControlCode.Menu7,
    ControlCode.Menu8,
    ControlCode.Menu9,
    ControlCode.Menu0,
  ][index];

  useControl({
    code: controlCode,
    group: HotkeyGroup.Menu,
    callback: () => {
      closeMenu();
      callback();
    },
  });

  const settings = useContext(SettingsContext);
  const shortcuts = settings.keyboardShortcuts[controlCode];

  return (
    <li className="mb-1 last:mb-0">
      <button
        type="button"
        onClick={noFocusOnClick(() => {
          closeMenu();
          callback();
        })}
      >
        <Kbd light>{shortcuts[0]}</Kbd> {label}
      </button>
    </li>
  );
}
