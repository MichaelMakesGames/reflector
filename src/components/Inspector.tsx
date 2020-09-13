import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SettingsContext } from "~contexts";
import { useControl } from "~hooks";
import selectors from "~state/selectors";
import { Entity, HasDescription, RawState, HasColonist } from "~types";
import { ActionControl, getActionsAvailableAtPos } from "~utils/controls";
import colonistStatuses from "~data/colonistStatuses";

export default function Inspector() {
  const entitiesAtCursor = useSelector(selectors.entitiesAtCursor);
  const entitiesWithDescription =
    entitiesAtCursor &&
    (entitiesAtCursor.filter((e) => e.description) as (Entity &
      HasDescription)[]).sort((a, b) => {
      const aSortValue = a.display ? a.display.priority : Infinity;
      const bSortValue = b.display ? b.display.priority : Infinity;
      return bSortValue - aSortValue;
    });
  const cursorPos = useSelector(selectors.cursorPos);
  const state = useSelector(selectors.state);
  const actions = cursorPos ? getActionsAvailableAtPos(state, cursorPos) : [];

  return (
    <section className="p-2 border-b border-gray">
      <h2 className="text-xl">
        {cursorPos
          ? `Location ${cursorPos.x}, ${cursorPos.y}`
          : "No location selected"}
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
      {cursorPos && (
        <>
          <h2 className="text-xl mt-2">Available Actions</h2>
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
  useControl(
    action.controlCode,
    () => {
      const actions = Array.isArray(action.action)
        ? action.action
        : [action.action];
      actions.forEach((a) => dispatch(a));
    },
    !action.doNotRegisterShortcut,
  );
  return (
    <button type="button" className="font-normal">
      <kbd className="font-mono bg-darkGray rounded p-1 mr-1">
        {settings.keyboardShortcuts[action.controlCode][0]}
      </kbd>
      {action.label}
    </button>
  );
}

function InspectorEntity({ entity }: { entity: Entity & HasDescription }) {
  const residence = useSelector(
    entity.colonist
      ? (state: RawState) => selectors.residence(state, entity as HasColonist)
      : selectors.nothing,
  );
  const employment = useSelector(
    entity.colonist
      ? (state: RawState) => selectors.employment(state, entity as HasColonist)
      : selectors.nothing,
  );
  return (
    <li>
      <div>
        {entity.description.name}
        {entity.colonist && (
          <span className="text-lightGray text-sm">
            {" - "}
            {colonistStatuses[entity.colonist.status].label}
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
