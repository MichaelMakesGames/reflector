/* global document */
import React, { ReactElement, useRef } from "react";
import { useDispatch, useSelector } from "./GameProvider";
import renderer from "../renderer";
import selectors from "../state/selectors";
import { Pos } from "../types";
import { getActionsAvailableAtPos, noFocusOnClick } from "../lib/controls";
import { LazyTippy } from "./LazyTippy";

interface Props {
  pos: Pos | null;
  onClose: () => void;
  children: ReactElement;
}

export default function ContextMenu({ pos, onClose, children }: Props) {
  const posRef = useRef<Pos | null>(pos);
  if (pos) {
    posRef.current = pos;
  }

  return (
    <LazyTippy
      interactive
      visible={Boolean(pos)}
      onClickOutside={onClose}
      placement="right-start"
      getReferenceClientRect={() =>
        renderer.getClientRectFromPos(posRef.current || { x: 0, y: 0 })
      }
      offset={[0, 0]}
      appendTo={document.body}
      content={<ContextMenuContent pos={posRef.current} onClose={onClose} />}
    >
      {children}
    </LazyTippy>
  );
}

function ContextMenuContent({
  pos,
  onClose,
}: {
  pos: Pos | null;
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const state = useSelector(selectors.state);
  if (!pos) return null;
  const actionControls = pos ? getActionsAvailableAtPos(state, pos) : [];
  return (
    <div>
      <ul className="flex flex-col">
        {actionControls.length === 0 && <li>No actions available</li>}
        {actionControls.map((a) => (
          <li key={a.label}>
            <button
              className="w-full text-left"
              type="button"
              onClick={noFocusOnClick(() => {
                if (a.action) dispatch(a.action);
                if (a.callback) a.callback();
                onClose();
              })}
            >
              {a.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
