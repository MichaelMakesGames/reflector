import React from "react";
import { useBoolean } from "../hooks";
import { ControlCode } from "../types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: React.ReactNode;
}

export default function MenuSlider({
  value,
  onChange,
  min,
  max,
  step,
  label,
}: Props) {
  const [isFocused, focus, blur] = useBoolean(false);

  const increase = () => {
    onChange(Math.min(value + step, max));
  };

  const decrease = () => {
    onChange(Math.max(value - step, min));
  };

  useControl({
    code: ControlCode.Right,
    group: HotkeyGroup.Menu,
    callback: increase,
    disabled: !isFocused,
  });

  useControl({
    code: ControlCode.Left,
    group: HotkeyGroup.Menu,
    callback: decrease,
    disabled: !isFocused,
  });

  return (
    <div
      data-menu-control
      tabIndex={-1}
      onFocus={focus}
      onBlur={blur}
      className="btn inline-flex border-black text-xl mt-3 focus:outline-none focus:border-red focus:ring focus:ring-red"
    >
      <div className="w-2/5 inline-block">{label}</div>
      <input
        className="w-3/5"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
