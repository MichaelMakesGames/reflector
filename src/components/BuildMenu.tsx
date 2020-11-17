/* global document */
import Tippy from "@tippyjs/react";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HotkeyGroup, useControl } from "~components/HotkeysProvider";
import { SettingsContext } from "~contexts";
import buildingCategories, { BuildingCategory } from "~data/buildingCategories";
import buildings from "~data/buildings";
import { useBoolean } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { ControlCode } from "~types/ControlCode";
import { createEntityFromTemplate } from "~utils/entities";
import Kbd from "./Kbd";
import ResourceAmount from "./ResourceAmount";

const buttonStyle: React.CSSProperties = { margin: "-1px -1px -1px 0" };
const buttonClassName =
  "font-normal border border-gray hover:border-white hover:z-10 px-2 py-1 flex flex-row items-center";

export default function BuildMenu() {
  const dispatch = useDispatch();
  const placingTarget = useSelector(selectors.placingTarget);
  const isWeaponActive = useSelector(selectors.isWeaponActive);
  const settings = useContext(SettingsContext);

  const cancel = () => {
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

  useControl({
    code: ControlCode.Back,
    callback: cancel,
    group: HotkeyGroup.Main,
  });
  useControl({
    code: ControlCode.RotateBuilding,
    group: HotkeyGroup.Main,
    callback: rotate,
    disabled: !(placingTarget && placingTarget.rotatable),
  });
  const makeBuildingCallback = (n: number) => () => {
    if (isWeaponActive) {
      // cancel laser when initiating build
      dispatch(actions.deactivateWeapon());
    }
  };
  useControl({
    code: ControlCode.Menu1,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(1),
    disabled: Boolean(placingTarget),
  });
  useControl({
    code: ControlCode.Menu2,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(2),
    disabled: Boolean(placingTarget),
  });
  useControl({
    code: ControlCode.Menu3,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(3),
    disabled: Boolean(placingTarget),
  });
  useControl({
    code: ControlCode.Menu4,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(4),
    disabled: Boolean(placingTarget),
  });
  useControl({
    code: ControlCode.Menu5,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(5),
    disabled: Boolean(placingTarget),
  });
  useControl({
    code: ControlCode.Menu6,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(6),
    disabled: Boolean(placingTarget),
  });
  useControl({
    code: ControlCode.Menu7,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(7),
    disabled: Boolean(placingTarget),
  });
  useControl({
    code: ControlCode.Menu8,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(8),
    disabled: Boolean(placingTarget),
  });
  useControl({
    code: ControlCode.Menu9,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(9),
    disabled: Boolean(placingTarget),
  });
  useControl({
    code: ControlCode.Menu0,
    group: HotkeyGroup.Main,
    callback: makeBuildingCallback(0),
    disabled: Boolean(placingTarget),
  });

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
      {!placingTarget && <h2 className="text-xl px-2">Build</h2>}
      {placingTarget && placingTarget.rotatable ? (
        <button
          type="button"
          onClick={rotate}
          style={buttonStyle}
          className={buttonClassName}
        >
          <kbd className="bg-darkGray px-1 rounded mr-1">
            {settings.keyboardShortcuts[ControlCode.RotateBuilding][0]}
          </kbd>
          Rotate
        </button>
      ) : null}
      {placingTarget ? (
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
      ) : null}
      {!placingTarget &&
        buildingCategories.map((c, i) => (
          <BuildingCategoryMenu key={c.code} category={c} index={i} />
        ))}
    </section>
  );
}

function BuildingCategoryMenu({
  category,
  index,
}: {
  category: BuildingCategory;
  index: number;
}) {
  const settings = useContext(SettingsContext);
  const dispatch = useDispatch();
  const [isOpen, open, close, toggle] = useBoolean(false);
  const cursorPos = useSelector(selectors.cursorPos);

  const deactivateWeaponAndToggle = () => {
    dispatch(actions.deactivateWeapon());
    toggle();
  };

  const deactivateWeaponAndOpen = () => {
    dispatch(actions.deactivateWeapon());
    open();
  };

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
    callback: deactivateWeaponAndOpen,
    group: HotkeyGroup.Main,
  });

  useControl({
    code: ControlCode.Back,
    callback: close,
    group: HotkeyGroup.BuildingSelection,
    disabled: !isOpen,
  });

  const buildingsInCategory = buildings.filter(
    (b) => b.category === category.code,
  );

  return (
    <Tippy
      placement="top"
      visible={isOpen}
      onClickOutside={close}
      arrow={false}
      interactive
      content={
        isOpen ? (
          <div>
            {buildingsInCategory.map((building, i) => (
              <BuildingButton
                key={building.template}
                building={building}
                index={i}
                onClick={() => {
                  close();
                  dispatch(
                    actions.activatePlacement({
                      ...building,
                      pos: cursorPos || undefined,
                    }),
                  );
                }}
              />
            ))}
            <button style={{ marginTop: 1 }} type="button" onClick={close}>
              <Kbd light>{settings.keyboardShortcuts[ControlCode.Back][0]}</Kbd>{" "}
              Close
            </button>
          </div>
        ) : null
      }
    >
      <Tippy placement="top" content={category.description} disabled={isOpen}>
        <button
          type="button"
          onClick={deactivateWeaponAndToggle}
          style={buttonStyle}
          className={buttonClassName}
        >
          <Kbd className="text-xs mr-1 pt-0">
            {settings.keyboardShortcuts[controlCode][0]}
          </Kbd>
          {category.label}
        </button>
      </Tippy>
    </Tippy>
  );
}

function BuildingButton({
  building,
  index,
  onClick,
}: {
  building: typeof buildings[number];
  index: number;
  onClick: () => void;
}) {
  const settings = useContext(SettingsContext);
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
    callback: onClick,
    group: HotkeyGroup.BuildingSelection,
  });

  const buildingEntity = createEntityFromTemplate(building.template);
  return (
    <Tippy
      placement="right"
      offset={[0, 15]}
      content={
        buildingEntity.description ? buildingEntity.description.description : ""
      }
    >
      <button
        type="button"
        className="flex flex-no-wrap items-baseline w-full text-left mb-1"
        onClick={onClick}
      >
        <Kbd light>{settings.keyboardShortcuts[controlCode][0]}</Kbd>
        <span className="flex-1 ml-1 mr-2 inline-block">{` ${building.label}`}</span>
        <ResourceAmount
          resourceCode={building.cost.resource}
          amount={building.cost.amount}
        />
      </button>
    </Tippy>
  );
}
