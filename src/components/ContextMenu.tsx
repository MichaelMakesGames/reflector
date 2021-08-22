/* global document */
import Tippy from "@tippyjs/react";
import React, { ReactElement, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import renderer from "../renderer";
import selectors from "../state/selectors";
import { Pos } from "../types";
import { getActionsAvailableAtPos, noFocusOnClick } from "../lib/controls";

interface Props {
  pos: Pos | null;
  onClose: () => void;
  children: ReactElement;
}

export default function ContextMenu({ pos, onClose, children }: Props) {
  const dispatch = useDispatch();
  const state = useSelector(selectors.state);

  const posRef = useRef<Pos | null>(pos);
  if (pos) {
    posRef.current = pos;
  }
  const actionControls = posRef.current
    ? getActionsAvailableAtPos(state, posRef.current)
    : [];
  return (
    <Tippy
      interactive
      visible={Boolean(pos)}
      onClickOutside={onClose}
      placement="right-start"
      getReferenceClientRect={() =>
        renderer.getClientRectFromPos(posRef.current || { x: 0, y: 0 })
      }
      offset={[0, 0]}
      appendTo={document.body}
      content={
        <div>
          <ul className="flex flex-col">
            {actionControls.length === 0 && <li>No actions available</li>}
            {actionControls.map((a) => (
              <li key={a.label}>
                <button
                  className="w-full text-left"
                  type="button"
                  onClick={noFocusOnClick(() => {
                    const actions = Array.isArray(a.action)
                      ? a.action
                      : [a.action];
                    actions.forEach((action) => dispatch(action));
                    onClose();
                  })}
                >
                  {a.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      {children}
    </Tippy>
  );
}
