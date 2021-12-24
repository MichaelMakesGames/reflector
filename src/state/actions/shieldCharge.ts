import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import { ResourceCode } from "../../data/resources";
import { getAdjacentPositions } from "../../lib/geometry";
import { createEntityFromTemplate } from "../../lib/entities";
import { TemplateName } from "../../types/TemplateName";
import colors from "../../colors";

const shieldCharge = createAction("shieldCharge")<string>();
export default shieldCharge;

function shieldChargeHandler(
  state: WrappedState,
  action: ReturnType<typeof shieldCharge>
): void {
  const entity = state.select.entityById(action.payload);
  if (
    entity &&
    entity.pos &&
    entity.shieldGenerator &&
    entity.shieldGenerator.strength < 3 &&
    entity.powered &&
    entity.powered.hasPower &&
    state.select.canAffordToPay(ResourceCode.Power, entity.powered.powerNeeded)
  ) {
    state.act.modifyResource({
      resource: ResourceCode.Power,
      amount: -entity.powered.powerNeeded,
      reason: "Shield Generator",
    });
    const newStrength = entity.shieldGenerator.strength + 1;
    state.act.updateEntity({
      id: entity.id,
      shieldGenerator: {
        ...entity.shieldGenerator,
        strength: newStrength,
      },
    });
    state.renderer.flash(entity.pos, colors.secondary);
    state.audio.playAtPos("power_on", entity.pos);
    if (newStrength === 1) {
      for (const pos of getAdjacentPositions(entity.pos, false)) {
        state.act.addEntity(
          createEntityFromTemplate("SHIELD", {
            pos,
            shield: { generator: entity.id },
          })
        );
      }
      state.act.addEntity(
        createEntityFromTemplate("SHIELD", {
          pos: entity.pos,
          shield: { generator: entity.id },
          display: createEntityFromTemplate("UI_SHIELD_1").display,
        })
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
}

registerHandler(shieldChargeHandler, shieldCharge);
