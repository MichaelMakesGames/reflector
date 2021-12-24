import React, { useCallback, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Required } from "ts-toolbelt/out/Object/Required";
import { SettingsContext } from "../contexts";
import colonistStatuses, { ColonistStatusCode } from "../data/colonistStatuses";
import resources, { ResourceCode } from "../data/resources";
import { areConditionsMet } from "../lib/conditions";
import {
  ActionControl,
  getActionsAvailableAtPos,
  getQuickAction,
} from "../lib/controls";
import { getHumanReadablePosition } from "../lib/geometry";
import selectors from "../state/selectors";
import wrapState from "../state/wrapState";
import { Entity, RawState } from "../types";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import ResourceAmount from "./ResourceAmount";
import Warning from "./Warning";

export default function Inspector() {
  const entitiesAtCursor = useSelector(selectors.entitiesAtCursor);
  const entitiesWithDescription =
    entitiesAtCursor &&
    (
      entitiesAtCursor.filter((e) => e.description) as Required<
        Entity,
        "description"
      >[]
    ).sort((a, b) => {
      const aSortValue = a.display ? a.display.priority : Infinity;
      const bSortValue = b.display ? b.display.priority : Infinity;
      return bSortValue - aSortValue;
    });
  const cursorPos = useSelector(selectors.cursorPos);
  const state = useSelector(selectors.state);
  const actions = useMemo(
    () => (cursorPos ? getActionsAvailableAtPos(state, cursorPos) : []),
    [state, cursorPos]
  );
  const quickAction = getQuickAction(state, cursorPos);
  const warnings = entitiesAtCursor
    ? entitiesAtCursor.filter((e) => e.warning)
    : [];

  const blueprint = useSelector(selectors.blueprint);
  const blueprintDescription = blueprint ? blueprint.description : null;
  const blueprintFailedConditions =
    blueprint && blueprint.blueprint
      ? blueprint.blueprint.validityConditions.filter(
          (vc) => !areConditionsMet(wrapState(state), blueprint, vc.condition)
        )
      : [];

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
            blueprint.blueprint &&
            blueprint.blueprint.cost &&
            blueprint.blueprint.cost.amount && (
              <div className="mt-1">
                Costs{" "}
                <ResourceAmount
                  resourceCode={blueprint.blueprint.cost.resource}
                  amount={blueprint.blueprint.cost.amount}
                />
              </div>
            )}
        </div>
      )}

      {entitiesAtCursor?.some?.(
        (e) => e.reflector && e.reflector.outOfRange
      ) && (
        <div className="text-yellow text-sm">
          <Warning className="bg-yellow" /> Reflector out of range
        </div>
      )}

      {warnings.map((e) => (
        <div key={e.id} className="text-yellow text-sm">
          <Warning className="bg-yellow" /> {e.warning && e.warning.text}
        </div>
      ))}

      {blueprintFailedConditions.length > 0 && (
        <div className="text-red text-sm">
          <Warning className="bg-red" />{" "}
          {blueprintFailedConditions[0].invalidMessage}
        </div>
      )}

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
      : selectors.nothing
  );
  const employment = useSelector(
    entity.colonist
      ? (state: RawState) =>
          selectors.employment(state, entity as Required<Entity, "colonist">)
      : selectors.nothing
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
          <>
            <span className="text-lightGray text-sm">
              {` - ${entity.jobProvider.numberEmployed}/${entity.jobProvider.maxNumberEmployed} jobs filled`}
            </span>
            <div className="ml-3 text-lightGray text-sm">
              Producing{" "}
              <ResourceAmount
                resourceCode={
                  Object.keys(entity.jobProvider.produces)[0] as ResourceCode
                }
                amount={Object.values(entity.jobProvider.produces)[0] as number}
              />
              : {entity.jobProvider.workContributed}/
              {entity.jobProvider.workRequired} work
            </div>
          </>
        )}
        {entity.reflector && entity.reflector.outOfRange && (
          <span className="text-lightGray text-sm">{" - out of range"}</span>
        )}
        {entity.absorber && (
          <span className="text-lightGray text-sm">
            {entity.absorber.charged ? " - charged" : " - uncharged"}
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
        {entity.shieldGenerator &&
          entity.powered &&
          entity.powered.hasPower && (
            <span className="text-lightGray text-sm">
              {` ${entity.shieldGenerator.strength}/3`}
            </span>
          )}
        {entity.production && (
          <span className="text-lightGray text-sm">
            {entity.production.producedLastTurn ? " - Active" : " - Inactive"}
          </span>
        )}
        {entity.temperature && (
          <div className="ml-3 text-lightGray text-sm">
            Temperature:{" "}
            <span
              className={`${
                ["normal", "critical"].includes(entity.temperature.status)
                  ? ""
                  : "text-yellow"
              } ${
                entity.temperature.status === "critical"
                  ? "text-red font-bold animate-pulse"
                  : ""
              }`}
            >
              {entity.temperature.status}
            </span>
          </div>
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
