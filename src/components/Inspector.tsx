import { Required } from "Object/_api";
import React, { useCallback, useContext, useMemo } from "react";
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
import { createEntityFromTemplate } from "~utils/entities";
import { getHumanReadablePosition } from "~utils/geometry";
import Warning from "./Warning";
import ResourceAmount from "./ResourceAmount";

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
  const actions = useMemo(
    () => (cursorPos ? getActionsAvailableAtPos(state, cursorPos) : []),
    [state, cursorPos],
  );
  const quickAction = getQuickAction(state, cursorPos);
  const warnings = entitiesAtCursor
    ? entitiesAtCursor.filter((e) => e.warning)
    : [];

  const blueprint = useSelector(selectors.placingTarget);
  const blueprintDescription = createEntityFromTemplate(
    blueprint ? blueprint.template : "NONE",
  ).description;

  return (
    <section className="p-2" data-section="INSPECTOR">
      {cursorPos ? (
        <h2 className="text-sm text-lightGray">
          {getHumanReadablePosition(cursorPos)}
          {quickAction ? " - Click or press space to" : " - No quick action"}
        </h2>
      ) : (
        <h2 className="text-xl">Move cursor over a location to see details</h2>
      )}

      {quickAction && <div className="text-2xl">{quickAction.label}</div>}

      {cursorPos && blueprintDescription && (
        <div className="text-sm text-lightGray">
          {blueprintDescription.description}
          {blueprint &&
            blueprint.placing &&
            blueprint.placing.cost &&
            blueprint.placing.cost.amount && (
              <div className="mt-1">
                Costs{" "}
                <ResourceAmount
                  resourceCode={blueprint.placing.cost.resource}
                  amount={blueprint.placing.cost.amount}
                />
              </div>
            )}
        </div>
      )}

      {warnings.map((e) => (
        <p key={e.id} className="text-red">
          <Warning className="bg-red" /> {e.warning && e.warning.text}
        </p>
      ))}

      {cursorPos && (
        <div className="mt-3">
          <h3 className="text-lg">Contents</h3>
          <ul className="ml-3">
            {entitiesWithDescription && entitiesWithDescription.length ? (
              entitiesWithDescription.map((e) => (
                <InspectorEntity entity={e} key={e.id} />
              ))
            ) : (
              <li>Nothing here</li>
            )}
          </ul>
        </div>
      )}

      {cursorPos && (
        <div className="mt-3">
          <h3 className="text-lg">Other Actions</h3>
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
        </div>
      )}
    </section>
  );
}

function InspectorAction({ action }: { action: ActionControl }) {
  const settings = useContext(SettingsContext);
  const dispatch = useDispatch();
  const callback = useCallback(() => dispatch(action.action), [action]);
  useControl({
    code: action.code,
    group: HotkeyGroup.Main,
    callback,
    disabled: action.doNotRegisterShortcut,
  });
  return (
    <button type="button" className="font-normal">
      {settings.keyboardShortcuts[action.code].map((key, index) => (
        <React.Fragment key={key}>
          {index !== 0 ? (
            <span className="text-lightGray text-xs mr-1">or</span>
          ) : null}
          <kbd className="font-mono bg-darkGray rounded p-1 mr-1">{key}</kbd>
        </React.Fragment>
      ))}
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
        {entity.description && entity.description.shortDescription && (
          <span className="text-lightGray text-sm">
            {" - "}
            {entity.description.shortDescription}
          </span>
        )}
      </div>
      {employment && (
        <div className="ml-3 text-lightGray text-sm">
          Works at{" "}
          {employment.description ? `${employment.description.name} at` : ""}{" "}
          {getHumanReadablePosition(employment.pos)}
        </div>
      )}
      {entity.colonist && !employment && (
        <div className="ml-3 text-lightGray text-sm">Unemployed</div>
      )}
      {residence && (
        <div className="ml-3 text-lightGray text-sm">
          Lives at {getHumanReadablePosition(residence.pos)}
        </div>
      )}
      {entity.colonist && !residence && (
        <div className="ml-3 text-lightGray text-sm">Homeless</div>
      )}
    </li>
  );
}
