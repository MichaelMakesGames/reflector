import { Required } from "ts-toolbelt/out/Object/Required";
import effects from "../../data/effects";
import { createEntityFromTemplate } from "../../lib/entities";
import { Entity } from "../../types";
import WrappedState from "../../types/WrappedState";

export default function absorberSystem(state: WrappedState): void {
  // fire absorbers
  state.select
    .entitiesWithComps("absorber")
    .filter((e) => e.absorber.aimingDirection)
    .forEach((entity) => state.act.fireWeapon({ source: entity.id }));

  // reset fired absorbers
  state.select
    .entitiesWithComps("absorber")
    .filter((e) => e.absorber.aimingDirection)
    .forEach((absorber) => {
      state.act.updateEntity({
        id: absorber.id,
        absorber: { aimingDirection: null, charged: false },
      });
      effects.CLEAR_UI_ABSORBER_CHARGE(state, undefined, absorber);
    });

  // create charge indicators
  state.select.entitiesWithComps("pos", "absorber").forEach((entity) => {
    createChargeIndicatorIfNeeded(state, entity);
  });
}

function createChargeIndicatorIfNeeded(
  state: WrappedState,
  entity: Required<Entity, "pos" | "absorber">
) {
  if (
    entity.absorber.charged &&
    !state.select
      .entitiesAtPosition(entity.pos)
      .some((e) => e.template === "UI_ABSORBER_CHARGE")
  ) {
    state.act.addEntity(
      createEntityFromTemplate("UI_ABSORBER_CHARGE", { pos: entity.pos })
    );
  }
}
