import useOutsideClickRef from "@rooks/use-outside-click-ref";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import selectors from "~state/selectors";
import { Pos } from "~types";
import { getActionsAvailableAtPos } from "~utils/controls";

interface Props {
  pos: Pos;
  onClose: () => void;
}

export default function ContextMenu({ pos, onClose }: Props) {
  const dispatch = useDispatch();
  const cursorPos = useSelector(selectors.cursorPos);
  const state = useSelector(selectors.state);
  const [ref] = useOutsideClickRef<HTMLDivElement>(onClose);
  const actionControls = cursorPos
    ? getActionsAvailableAtPos(state, cursorPos)
    : [];
  return (
    <div
      ref={ref}
      className="absolute bg-black border border-b-0 border-gray"
      style={{
        left: `calc(${pos.x}px + 1rem)`,
        top: `calc(${pos.y}px - 1rem)`,
      }}
    >
      <div
        className="absolute"
        style={{
          width: 0,
          height: 0,
          borderTop: "1rem solid transparent",
          borderBottom: "1rem solid transparent",
          borderRight: "1rem solid",
          borderRightColor: "inherit",
          top: 0,
          left: "-1rem",
        }}
      />
      <ul className="flex flex-col">
        {actionControls.length === 0 && (
          <li className="border-b border-gray py-1 px-2">
            No actions available
          </li>
        )}
        {actionControls.map((a) => (
          <li key={a.label}>
            <button
              className="border-b border-gray py-1 px-2 w-full text-left"
              type="button"
              onClick={() => {
                const actions = Array.isArray(a.action) ? a.action : [a.action];
                actions.forEach((action) => dispatch(action));
                onClose();
              }}
            >
              {a.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
