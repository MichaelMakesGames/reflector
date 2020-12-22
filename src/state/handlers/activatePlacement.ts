import { BUILDING_RANGE } from "~/constants";
import actions from "~/state/actions";
import selectors from "~/state/selectors";
import { RawState, Pos, Entity } from "~/types";
import { createEntityFromTemplate } from "~/utils/entities";
import { registerHandler } from "~state/handleAction";
import { findValidPositions } from "~utils/building";
import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~utils/conditions";
import { arePositionsEqual, getAdjacentPositions } from "~utils/geometry";
import colors from "~colors";
import { ResourceCode } from "~data/resources";

function activatePlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.activatePlacement>,
): void {
  const player = state.select.player();
  if (!player) return;

  const placingTarget = state.select.placingTarget();
  if (placingTarget) {
    state.act.cancelPlacement();
  }

  const { cost, template, validitySelector, invalidMessage } = action.payload;

  const entityToPlace = createEntityFromTemplate(template, {
    placing: { cost, validitySelector, invalidMessage },
  });

  const canPlace = (gameState: RawState, pos: Pos) => {
    // don't allow multiple buildings in same pos
    if (
      entityToPlace.building &&
      selectors
        .entitiesAtPosition(gameState, pos)
        .some((e) => e.building && e.id !== entityToPlace.id)
    ) {
      return false;
    }

    // check for building-specific placement restrictions
    if (validitySelector && (selectors as any)[validitySelector]) {
      return Boolean((selectors as any)[validitySelector](gameState, pos));
    } else {
      return true;
    }
  };

  const projectors = state.select.entitiesWithComps("projector", "pos");
  const validPositions = entityToPlace.reflector
    ? findValidPositions(
        state,
        projectors
          .filter((projector) =>
            areConditionsMet(state, projector, projector.projector.condition),
          )
          .map((projector) => ({
            pos: projector.pos,
            range: projector.projector.range,
          })),
        canPlace,
        true,
      )
    : findValidPositions(
        state,
        [{ pos: player.pos, range: BUILDING_RANGE }],
        canPlace,
        false,
      );

  const targetPos = action.payload.pos || player.pos;
  const targetPosIsValid = validPositions.some((p) =>
    arePositionsEqual(p, targetPos),
  );
  state.act.addEntity({
    id: entityToPlace.id,
    template: entityToPlace.template,
    parentTemplate: entityToPlace.parentTemplate,
    placing: entityToPlace.placing,
    rotatable: entityToPlace.rotatable,
    pos: targetPos,
    display: entityToPlace.display && {
      ...entityToPlace.display,
      color: targetPosIsValid ? colors.secondary : colors.invalid,
    },
  });
  for (const pos of validPositions) {
    const warning = checkForPlacementWarning(state, pos, entityToPlace);
    if (warning) {
      state.act.addEntity(
        createEntityFromTemplate("VALID_WITH_WARNING_MARKER", { pos, warning }),
      );
    } else {
      state.act.addEntity(createEntityFromTemplate("VALID_MARKER", { pos }));
    }
  }

  // clear automove path
  state.act.setAutoMovePath([]);
}

registerHandler(activatePlacement, actions.activatePlacement);

function checkForPlacementWarning(
  state: WrappedState,
  pos: Pos,
  entityToPlace: Entity,
) {
  return checkForWindmillWarning(state, pos, entityToPlace);
}

function checkForWindmillWarning(
  state: WrappedState,
  pos: Pos,
  entityToPlace: Entity,
) {
  if (!entityToPlace.blocking || !entityToPlace.blocking.windmill) return null;

  for (const adjacent of getAdjacentPositions(pos)) {
    if (
      state.select
        .entitiesAtPosition(adjacent)
        .some(
          (e) =>
            e.production &&
            e.production.resource === ResourceCode.Power &&
            e.production.conditions.some(
              (c) => c === "doesNotHaveTallNeighbors",
            ),
        )
    ) {
      return {
        text: "Building here will block a windmill from producing power.",
      };
    }
  }

  return null;
}
