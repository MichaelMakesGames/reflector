import classNames from "classnames";
import React from "react";
import { useBoolean } from "../hooks";
import { noFocusOnClick } from "../lib/controls";
import { ControlCode } from "../types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string }[];
  label: React.ReactNode;
}

export default function MenuOptionSelector({
  value,
  onChange,
  options,
  label,
}: Props) {
  const [isFocused, focus, blur] = useBoolean(false);

  const selectNext = () => {
    const optionIndex = options.findIndex((option) => option.id === value);
    if (optionIndex === -1) {
      onChange(options[0].id);
    } else if (optionIndex < options.length - 1) {
      onChange(options[optionIndex + 1].id);
    }
  };

  const selectPrevious = () => {
    const optionIndex = options.findIndex((option) => option.id === value);
    if (optionIndex === -1) {
      onChange(options[options.length - 1].id);
    } else if (optionIndex > 0) {
      onChange(options[optionIndex - 1].id);
    }
  };

  useControl({
    code: ControlCode.Right,
    group: HotkeyGroup.Menu,
    callback: selectNext,
    disabled: !isFocused,
  });

  useControl({
    code: ControlCode.Left,
    group: HotkeyGroup.Menu,
    callback: selectPrevious,
    disabled: !isFocused,
  });

  const option = options.find((o) => o.id === value);
  const isFirstOption = option === options[0];
  const isLastOption = option === options[options.length - 1];

  return (
    <div
      data-menu-control
      tabIndex={-1}
      onFocus={focus}
      onBlur={blur}
      className="btn border-black text-xl mt-3 focus:outline-none focus:border-red focus:ring focus:ring-red"
    >
      <div className="w-2/5 inline-block">{label}</div>
      <div className="w-3/5 inline-flex">
        <button
          type="button"
          disabled={isFirstOption}
          className={classNames({
            "opacity-50": isFirstOption,
            "cursor-not-allowed": isFirstOption,
          })}
          onClick={noFocusOnClick(selectPrevious)}
        >
          ◀
        </button>
        <div className="flex-grow text-center">{option?.name}</div>
        <button
          type="button"
          disabled={isLastOption}
          className={classNames({
            "opacity-50": isLastOption,
            "cursor-not-allowed": isLastOption,
          })}
          onClick={noFocusOnClick(selectNext)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
