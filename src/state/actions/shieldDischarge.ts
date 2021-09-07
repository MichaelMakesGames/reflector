import { createAction } from "typesafe-actions";
import { createEntityFromTemplate } from "../../lib/entities";
import { TemplateName } from "../../types/TemplateName";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";

const shieldDischarge = createAction("shieldDischarge")<string>();
export default shieldDischarge;

function shieldDischargeHandler(
  state: WrappedState,
  action: ReturnType<typeof shieldDischarge>
): void {
  const entity = state.select.entityById(action.payload);
  if (
    entity &&
    entity.shieldGenerator &&
    entity.powered &&
    entity.powered.hasPower
  ) {
    const currentStrength = entity.shieldGenerator.strength;
    if (currentStrength > 0) {
      const newStrength = currentStrength - 1;
      state.act.updateEntity({
        id: entity.id,
        shieldGenerator: {
          ...entity.shieldGenerator,
          strength: newStrength,
        },
      });
      if (newStrength === 0) {
        state.act.removeEntities(
          state.select
            .entitiesWithComps("shield")
            .filter((e) => e.shield.generator === action.payload)
            .map((e) => e.id)
        );
      } else {
        const displayedShield = state.select
          .entitiesWithComps("shield", "display", "pos")
          .find((e) => e.shield.generator === action.payload);
        if (displayedShield) {
          const newDisplay = createEntityFromTemplate(
            `UI_SHIELD_${newStrength}` as TemplateName
          ).display;
          state.act.updateEntity({
            id: displayedShield.id,
            display: newDisplay,
          });
        }
      }
    }
  } else {
    // generator destroyed or removed or unpowered, clean up shields
    if (entity && entity.shieldGenerator) {
      state.act.updateEntity({
        id: entity.id,
        shieldGenerator: {
          ...entity.shieldGenerator,
          strength: 0,
        },
      });
    }
    state.act.removeEntities(
      state.select
        .entitiesWithComps("shield")
        .filter((e) => e.shield.generator === action.payload)
        .map((e) => e.id)
    );
  }
}

registerHandler(shieldDischargeHandler, shieldDischarge);
