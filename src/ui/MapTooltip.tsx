/* global document */
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "./GameProvider";
import { TILE_SIZE } from "../constants";
import { useBoolean } from "../hooks";
import renderer from "../renderer";
import selectors from "../state/selectors";
import { Pos } from "../types";
import Demo from "./Demo";
import { LazyTippy } from "./LazyTippy";
import Warning from "./Warning";
import { CursorContext, useEntitiesAtCursor } from "./CursorProvider";

interface Props {
  children: ReactElement;
}

const MapTooltip = React.forwardRef(({ children }: Props) => {
  const [isOpen, open, close] = useBoolean(false);

  const entitiesAtCursor = useEntitiesAtCursor();
  const entity =
    entitiesAtCursor &&
    entitiesAtCursor
      .sort((a, b) => (b.display?.priority ?? 0) - (a.display?.priority ?? 0))
      .find((e) => e.demo || e.description);
  const hasActiveBlueprint = useSelector(selectors.hasActiveBlueprint);
  const isWeaponActive = useSelector(selectors.isWeaponActive);

  const posRef = useRef<Pos | null | undefined>(entity?.pos);
  if (entity?.pos) {
    posRef.current = entity?.pos;
  }

  const warnings = entitiesAtCursor
    ? entitiesAtCursor.filter((e) => e.warning)
    : [];

  useEffect(() => {
    const listener = () => {
      if (document.pointerLockElement) close();
    };
    document.addEventListener("pointerlockchange", listener);
    return () => document.removeEventListener("pointerlockchange", listener);
  });

  const [counter, setCounter] = useState(0);
  const rerender = useMemo(() => () => setCounter((prev) => prev + 1), []);
  useEffect(() => {
    if (isOpen) {
      const listener = () => {
        if (isOpen) rerender();
      };
      renderer.onViewportChanged(listener);
      return () => renderer.offViewportChanged(listener);
    } else {
      return undefined;
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      ((entity && !hasActiveBlueprint) || warnings.length) &&
      !isWeaponActive
    ) {
      close();
      const timeoutId = setTimeout(open, 750);
      return () => clearTimeout(timeoutId);
    } else {
      close();
      return () => {};
    }
  }, [entity, isWeaponActive, warnings.map((e) => e.warning?.text).join(",")]);

  return (
    <LazyTippy
      visible={isOpen}
      placement="top"
      getReferenceClientRect={() =>
        renderer.getClientRectFromPos(posRef.current || { x: 0, y: 0 })
      }
      offset={[0, 0]}
      appendTo={document.body}
      content={
        <div
          style={{
            width: entity?.demo ? entity.demo.width * TILE_SIZE : undefined,
          }}
        >
          {!hasActiveBlueprint && (
            <>
              <div>
                <strong>{entity?.description?.name}</strong>{" "}
              </div>
              <div>{entity?.description?.shortDescription}</div>
              {entity?.demo && <Demo demoComp={entity.demo} />}
            </>
          )}

          {warnings.map((e) => (
            <div key={e.id} className="text-yellow text-sm">
              <Warning className="bg-yellow" /> {e.warning && e.warning.text}
            </div>
          ))}
        </div>
      }
    >
      {children}
    </LazyTippy>
  );
});

export default MapTooltip;
