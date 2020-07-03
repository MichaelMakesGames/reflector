import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CANCEL_KEYS } from "~constants";
import buildingCategories, { BuildingCategory } from "~data/buildingCategories";
import buildings from "~data/buildings";
import { useShortcuts } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import ResourceAmount from "./ResourceAmount";

export default function BuildMenu() {
  const dispatch = useDispatch();
  const cursorPos = useSelector(selectors.cursorPos);
  const [category, setCategory] = useState<BuildingCategory | null>(null);
  const categoryBuildings = category
    ? buildings.filter((b) => b.category === category.code)
    : [];
  const placingTarget = useSelector(selectors.placingTarget);

  const cancel = () => {
    setCategory(null);
    dispatch(actions.cancelPlacement());
  };
  const rotate = () => {
    if (placingTarget && placingTarget.rotatable) {
      dispatch(actions.rotateEntity(placingTarget));
    }
  };

  useShortcuts(
    Object.fromEntries([
      ...CANCEL_KEYS.map((key) => [key, cancel]),
      ...(placingTarget && placingTarget.rotatable ? [["r", rotate]] : []),
      ...(category
        ? categoryBuildings.map((b, i) => [
            (i + 1).toString(),
            () =>
              dispatch(
                actions.activatePlacement({
                  ...b,
                  pos: cursorPos || undefined,
                  takesTurn: true,
                }),
              ),
          ])
        : buildingCategories.map((c, i) => [
            (i + 1).toString(),
            () => setCategory(c),
          ])),
    ]),
  );

  const showCategory: boolean = !category;
  const showBuildings: boolean = Boolean(category && !placingTarget);

  const buttonStyle: React.CSSProperties = { margin: "-1px -1px -1px 0" };
  const buttonClassName =
    "font-normal border border-gray hover:border-white hover:z-10 px-2 py-1 flex flex-row items-center";
  return (
    <section className="border-t border-b border-gray flex flex-row">
      {placingTarget && placingTarget.description ? (
        <h2 className="text-xl px-2">
          Buidling {placingTarget.description.name}
        </h2>
      ) : null}
      {category ? (
        <button
          type="button"
          onClick={cancel}
          style={buttonStyle}
          className={buttonClassName}
        >
          <kbd className="bg-darkGray px-1 rounded mr-1">{CANCEL_KEYS[0]}</kbd>
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
          <button
            key={b.template}
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
        ))}
      {showCategory &&
        buildingCategories.map((c, i) => (
          <button
            key={c.code}
            type="button"
            onClick={() => setCategory(c)}
            style={buttonStyle}
            className={buttonClassName}
          >
            <kbd className="bg-darkGray px-1 rounded mr-1">{i + 1}</kbd>
            {c.label}
          </button>
        ))}
    </section>
  );
}
