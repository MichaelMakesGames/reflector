import { createAction } from "typesafe-actions";
import { BUILDING_RANGE } from "../../constants";
import { Entity, Pos, RawState } from "../../types";
import { createEntityFromTemplate } from "../../lib/entities";
import colors from "../../colors";
import { ResourceCode } from "../../data/resources";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import { findValidPositions } from "../../lib/building";
import { areConditionsMet } from "../../lib/conditions";
import { arePositionsEqual, getAdjacentPositions } from "../../lib/geometry";
import { TemplateName } from "../../types/TemplateName";

const blueprintSelect = createAction("BLUEPRINT_SELECT")<TemplateName>();
export default blueprintSelect;

function blueprintSelectHandler(
  state: WrappedState,
  action: ReturnType<typeof blueprintSelect>
): void {
  const player = state.select.player();
  if (!player) return;

  const previousBlueprint = state.select.blueprint();
  if (previousBlueprint) {
    state.act.blueprintCancel();
  }

  const targetPos = state.select.cursorPos() || player.pos;
  const blueprintTemplate = action.payload;
  const blueprint = createEntityFromTemplate(blueprintTemplate, {
    pos: targetPos,
  });

  if (!blueprint.blueprint) {
    console.error(
      `Blueprint created from template ${blueprintTemplate} is missing blueprint component`
    );
    return;
  }

  const canPlace = (gameState: RawState, pos: Pos) =>
    areConditionsMet(
      state,
      { ...blueprint, pos },
      ...(blueprint.blueprint
        ? blueprint.blueprint.validityConditions.map(
            (validityCondition) => validityCondition.condition
          )
        : [])
    );
  const validPositions = findValidPositions(
    state,
    [{ pos: player.pos, range: BUILDING_RANGE }],
    canPlace
  );

  const targetPosIsValid = validPositions.some((p) =>
    arePositionsEqual(p, targetPos)
  );
  state.act.addEntity({
    ...blueprint,
    display: blueprint.display && {
      ...blueprint.display,
      color: targetPosIsValid ? colors.secondary : colors.invalid,
    },
  });
  for (const pos of validPositions) {
    const warning = checkForPlacementWarning(state, pos, blueprint);
    if (warning) {
      state.act.addEntity(
        createEntityFromTemplate("UI_VALID_WITH_WARNING", { pos, warning })
      );
    } else {
      state.act.addEntity(createEntityFromTemplate("UI_VALID", { pos }));
    }
  }

  // clear automove path
  state.act.setAutoMovePath([]);

  state.act.bordersUpdate();
}

registerHandler(blueprintSelectHandler, blueprintSelect);

function checkForPlacementWarning(
  state: WrappedState,
  pos: Pos,
  blueprint: Entity
) {
  return checkForWindmillWarning(state, pos, blueprint);
}

function checkForWindmillWarning(
  state: WrappedState,
  pos: Pos,
  blueprint: Entity
) {
  const builds = createEntityFromTemplate(
    blueprint.blueprint ? blueprint.blueprint.builds : "NONE"
  );
  if (!builds.blocking || !builds.blocking.windmill) return null;

  for (const adjacent of getAdjacentPositions(pos)) {
    if (
      state.select
        .entitiesAtPosition(adjacent)
        .some(
          (e) =>
            e.production &&
            e.production.resource === ResourceCode.Power &&
            e.production.conditions.some(
              (c) => c === "doesNotHaveTallNeighbors"
            )
        )
    ) {
      return {
        text: "Building here will block a windmill from producing power.",
      };
    }
  }

  return null;
}
