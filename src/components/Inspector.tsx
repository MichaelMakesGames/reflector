import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SettingsContext } from "~contexts";
import { useControl } from "~hooks";
import selectors from "~state/selectors";
import { Entity, HasDescription } from "~types";
import { ActionControl, getActionsAvailableAtPos } from "~utils/controls";
import colonistStatuses from "~data/colonistStatuses";

export default function Inspector() {
  const entitiesAtCursor = useSelector(selectors.entitiesAtCursor);
  const entitiesWithDescription =
    entitiesAtCursor &&
    (entitiesAtCursor.filter((e) => e.description) as (Entity &
      HasDescription)[]);
  const cursorPos = useSelector(selectors.cursorPos);
  const state = useSelector(selectors.state);
  const actions = cursorPos ? getActionsAvailableAtPos(state, cursorPos) : [];

  return (
    <section className="p-2 border-b border-gray">
      <h2 className="text-xl">Inspector</h2>
      <ul className="ml-3">
        {entitiesWithDescription && entitiesWithDescription.length ? (
          entitiesWithDescription.map((e) => (
            <InspectorEntity entity={e} key={e.id} />
          ))
        ) : (
          <li>Nothing here</li>
        )}
      </ul>
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
  return (
    <li>
      <div>{entity.description.name}</div>
      {entity.colonist && (
        <div className="ml-3 text-lightGray text-sm">
          {colonistStatuses[entity.colonist.status].label}
        </div>
      )}
    </li>
  );
}
