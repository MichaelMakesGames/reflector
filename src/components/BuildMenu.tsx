/* global document */
import Tippy from "@tippyjs/react";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SettingsContext } from "~contexts";
import buildingCategories, { BuildingCategory } from "~data/buildingCategories";
import buildings from "~data/buildings";
import { useControl } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { ControlCode } from "~types/ControlCode";
import ResourceAmount from "./ResourceAmount";
import { createEntityFromTemplate } from "~utils/entities";

export default function BuildMenu() {
  const dispatch = useDispatch();
  const settings = useContext(SettingsContext);
  const cursorPos = useSelector(selectors.cursorPos);
  const [category, setCategory] = useState<BuildingCategory | null>(null);
  const categoryBuildings = category
    ? buildings.filter((b) => b.category === category.code)
    : [];
  const placingTarget = useSelector(selectors.placingTarget);
  const isWeaponActive = useSelector(selectors.isWeaponActive);

  const cancel = () => {
    setCategory(null);
    dispatch(actions.cancelPlacement());
  };
  const rotate = () => {
    if (placingTarget && placingTarget.rotatable) {
      dispatch(actions.rotateEntity(placingTarget));
    }
  };

  useEffect(() => {
    if (placingTarget) {
      const listener = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        cancel();
      };
      document.addEventListener("contextmenu", listener, true);
      return () => document.removeEventListener("contextmenu", listener, true);
    } else {
      return () => {};
    }
  });

  // cancel build when laser activated
  useEffect(() => {
    if (isWeaponActive) {
      cancel();
    }
  }, [isWeaponActive]);

  useControl({ controlCode: ControlCode.Back, callback: cancel });
  useControl({
    controlCode: ControlCode.RotateBuilding,
    callback: rotate,
    enabled: Boolean(placingTarget && placingTarget.rotatable),
  });
  const makeBuildingCallback = (n: number) => () => {
    if (isWeaponActive) {
      // cancel laser when initiating build
      dispatch(actions.deactivateWeapon());
    }
    if (categoryBuildings.length) {
      dispatch(
        actions.activatePlacement({
          ...categoryBuildings[n - 1],
          pos: cursorPos || undefined,
          takesTurn: true,
        }),
      );
    } else {
      setCategory(buildingCategories[n - 1]);
    }
  };
  useControl({
    controlCode: ControlCode.Building1,
    callback: makeBuildingCallback(1),
    enabled: !placingTarget,
  });
  useControl({
    controlCode: ControlCode.Building2,
    callback: makeBuildingCallback(2),
    enabled: !placingTarget,
  });
  useControl({
    controlCode: ControlCode.Building3,
    callback: makeBuildingCallback(3),
    enabled: !placingTarget,
  });
  useControl({
    controlCode: ControlCode.Building4,
    callback: makeBuildingCallback(4),
    enabled: !placingTarget,
  });
  useControl({
    controlCode: ControlCode.Building5,
    callback: makeBuildingCallback(5),
    enabled: !placingTarget,
  });
  useControl({
    controlCode: ControlCode.Building6,
    callback: makeBuildingCallback(6),
    enabled: !placingTarget,
  });
  useControl({
    controlCode: ControlCode.Building7,
    callback: makeBuildingCallback(7),
    enabled: !placingTarget,
  });
  useControl({
    controlCode: ControlCode.Building8,
    callback: makeBuildingCallback(8),
    enabled: !placingTarget,
  });
  useControl({
    controlCode: ControlCode.Building9,
    callback: makeBuildingCallback(9),
    enabled: !placingTarget,
  });
  useControl({
    controlCode: ControlCode.Building0,
    callback: makeBuildingCallback(0),
    enabled: !placingTarget,
  });

  const showCategory: boolean = !category;
  const showBuildings: boolean = Boolean(category && !placingTarget);

  const buttonStyle: React.CSSProperties = { margin: "-1px -1px -1px 0" };
  const buttonClassName =
    "font-normal border border-gray hover:border-white hover:z-10 px-2 py-1 flex flex-row items-center";
  return (
    <section className="border-t border-b border-gray flex flex-row">
      {placingTarget ? (
        <h2 className="text-xl px-2">
          Building{" "}
          {
            (createEntityFromTemplate(placingTarget.template).description || {})
              .name
          }
        </h2>
      ) : null}
      {category ? (
        <button
          type="button"
          onClick={cancel}
          style={buttonStyle}
          className={buttonClassName}
        >
          <kbd className="bg-darkGray px-1 rounded mr-1">
            {settings.keyboardShortcuts[ControlCode.Back][0]}
          </kbd>
          Cancel
        </button>
      ) : (
        <h2 className="text-xl px-2">Build</h2>
      )}
      {placingTarget && placingTarget.rotatable ? (
        <button
          type="button"
          onClick={rotate}
          style={buttonStyle}
          className={buttonClassName}
        >
          <kbd className="bg-darkGray px-1 rounded mr-1">r</kbd>
          Rotate
        </button>
      ) : null}
      {showBuildings &&
        categoryBuildings.map((b, i) => (
          <Tippy
            key={b.template}
            placement="top"
            content={
              (
                createEntityFromTemplate(b.template).description || {
                  description: "No description",
                }
              ).description
            }
          >
            <button
              type="button"
              onClick={() =>
                dispatch(
                  actions.activatePlacement({
                    ...b,
                    pos: cursorPos || undefined,
                    takesTurn: true,
                  }),
                )
              }
              style={buttonStyle}
              className={buttonClassName}
            >
              <kbd className="bg-darkGray px-1 rounded mr-1">{i + 1}</kbd>
              {b.label}
              <ResourceAmount
                className="ml-1"
                resourceCode={b.cost.resource}
                amount={b.cost.amount}
              />
            </button>
          </Tippy>
        ))}
      {showCategory &&
        buildingCategories.map((c, i) => (
          <Tippy key={c.code} placement="top" content={c.description}>
            <button
              type="button"
              onClick={() => setCategory(c)}
              style={buttonStyle}
              className={buttonClassName}
            >
              <kbd className="bg-darkGray px-1 rounded mr-1">{i + 1}</kbd>
              {c.label}
            </button>
          </Tippy>
        ))}
    </section>
  );
}
