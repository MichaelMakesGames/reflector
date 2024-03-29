import React from "react";
import audio from "../lib/audio";
import { noFocusOnClick } from "../lib/controls";
import { ControlCode } from "../types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Kbd from "./Kbd";
import { useSettings } from "./SettingsProvider";

interface Props {
  label: string;
  className?: string;
  callback: () => void;
  controlCode: ControlCode;
  hotkeyGroup: HotkeyGroup;
  disabled?: boolean;
  disabledIsCosmeticOnly?: boolean;
  style?: React.CSSProperties;
}
export default function HotkeyButton({
  label,
  className,
  callback,
  controlCode,
  hotkeyGroup,
  disabled,
  disabledIsCosmeticOnly,
  style,
}: Props) {
  const wrappedCallback = () => {
    if (disabled) {
      audio.play("ui_unsuccessful_invalid");
    } else {
      callback();
    }
  };

  useControl({
    code: controlCode,
    group: hotkeyGroup,
    disabled: disabled && !disabledIsCosmeticOnly,
    callback: wrappedCallback,

    // set ctrl, alt, and meta to false, but leave shift undefined so hotkeys like "?" can still work
    ctrl: false,
    alt: false,
    meta: false,
  });
  const [settings] = useSettings();
  return (
    <button
      className={`btn ${disabled ? "disabled" : ""} ${className || ""}`}
      type="button"
      style={style || {}}
      onClick={noFocusOnClick(wrappedCallback)}
      // disabled={disabled && !disabledIsCosmeticOnly}
      data-control-code={controlCode}
    >
      <Kbd>{settings.keybindings[controlCode][0]}</Kbd> {label}
    </button>
  );
}
