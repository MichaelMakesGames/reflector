import { Required } from "Object/_api";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HotkeyGroup, useControl } from "~components/HotkeysProvider";
import { SettingsContext } from "~contexts";
import colonistStatuses, { ColonistStatusCode } from "~data/colonistStatuses";
import resources from "~data/resources";
import selectors from "~state/selectors";
import { Entity, RawState } from "~types";
import {
  ActionControl,
  getActionsAvailableAtPos,
  getQuickAction,
} from "~utils/controls";
import Warning from "./Warning";

export default function Inspector() {
  const entitiesAtCursor = useSelector(selectors.entitiesAtCursor);
  const entitiesWithDescription =
    entitiesAtCursor &&
    (entitiesAtCursor.filter((e) => e.description) as Required<
      Entity,
      "description"
    >[]).sort((a, b) => {
      const aSortValue = a.display ? a.display.priority : Infinity;
      const bSortValue = b.display ? b.display.priority : Infinity;
      return bSortValue - aSortValue;
    });
  const cursorPos = useSelector(selectors.cursorPos);
  const state = useSelector(selectors.state);
  const actions = cursorPos ? getActionsAvailableAtPos(state, cursorPos) : [];
  const quickAction = getQuickAction(state, cursorPos);
  const warnings = entitiesAtCursor
    ? entitiesAtCursor.filter((e) => e.warning)
    : [];

  return (
    <section className="p-2">
      {warnings.map((e) => (
        <p key={e.id} className="text-red">
          <Warning className="bg-red" /> {e.warning?.text}
        </p>
      ))}
      <h2 className="text-xl">
        {cursorPos
          ? `Location ${cursorPos.x}, ${cursorPos.y}`
          : "Move cursor over a location to see details"}
      </h2>
      {cursorPos && (
        <ul className="ml-3">
          {entitiesWithDescription && entitiesWithDescription.length ? (
            entitiesWithDescription.map((e) => (
              <InspectorEntity entity={e} key={e.id} />
            ))
          ) : (
            <li>Nothing here</li>
          )}
        </ul>
      )}
      {quickAction && (
        <>
          <h2 className="text-xl mt-2">Quick Action: {quickAction.label}</h2>
          <div className="text-lightGray text-sm mb-2">
            (Click or press space)
          </div>
        </>
      )}
      {cursorPos && (
        <>
          <h2 className="text-xl mt-2">Other Actions</h2>
          {actions.length > 0 && (
            <div className="text-lightGray text-sm mb-2">
              Right click map or use shortcuts
            </div>
          )}
          <ul className="ml-3">
            {actions.length === 0 && <li>None</li>}
            {actions.map((action) => (
              <li key={action.label} className="mb-1">
                <InspectorAction action={action} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function InspectorAction({ action }: { action: ActionControl }) {
  const settings = useContext(SettingsContext);
  const dispatch = useDispatch();
  useControl({
    code: action.code,
    group: HotkeyGroup.Main,
    callback: () => {
      const actions = Array.isArray(action.action)
        ? action.action
        : [action.action];
      actions.forEach((a) => dispatch(a));
    },
    disabled: action.doNotRegisterShortcut,
  });
  return (
    <button type="button" className="font-normal">
      <kbd className="font-mono bg-darkGray rounded p-1 mr-1">
        {settings.keyboardShortcuts[action.code][0]}
      </kbd>
      {action.label}
    </button>
  );
}

function InspectorEntity({
  entity,
}: {
  entity: Required<Entity, "description">;
}) {
  const residence = useSelector(
    entity.colonist
      ? (state: RawState) =>
          selectors.residence(state, entity as Required<Entity, "colonist">)
      : selectors.nothing,
  );
  const employment = useSelector(
    entity.colonist
      ? (state: RawState) =>
          selectors.employment(state, entity as Required<Entity, "colonist">)
      : selectors.nothing,
  );
  return (
    <li>
      <div>
        {entity.description.name}
        {entity.colonist && (
          <span className="text-lightGray text-sm">
            {" - "}
            {entity.colonist.status === ColonistStatusCode.MissingResources
              ? `Not enough ${entity.colonist.missingResources
                  .map((resourceCode) => resources[resourceCode].label)
                  .join(", ")}`
              : colonistStatuses[entity.colonist.status].label}
          </span>
        )}
        {entity.jobProvider && (
          <span className="text-lightGray text-sm">
            {` - ${entity.jobProvider.numberEmployed}/${entity.jobProvider.maxNumberEmployed} jobs filled`}
          </span>
        )}
        {entity.housing && (
          <span className="text-lightGray text-sm">
            {` - ${entity.housing.occupancy}/${entity.housing.capacity} units filled`}
          </span>
        )}
        {entity.powered && (
          <span className="text-lightGray text-sm">
            {entity.powered.hasPower ? " - Powered" : " - No power"}
          </span>
        )}
        {entity.production && (
          <span className="text-lightGray text-sm">
            {entity.production.producedLastTurn ? " - Active" : " - Inactive"}
          </span>
        )}
      </div>
      {employment && (
        <div className="ml-3 text-lightGray text-sm">
          Works at{" "}
          {employment.description ? `${employment.description.name} at` : ""}{" "}
          {employment.pos.x}, {employment.pos.y}
        </div>
      )}
      {entity.colonist && !employment && (
        <div className="ml-3 text-lightGray text-sm">Unemployed</div>
      )}
      {residence && (
        <div className="ml-3 text-lightGray text-sm">
          Lives at {residence.pos.x}, {residence.pos.y}
        </div>
      )}
      {entity.colonist && !residence && (
        <div className="ml-3 text-lightGray text-sm">Homeless</div>
      )}
    </li>
  );
}
