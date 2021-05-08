import WrappedState from "~types/WrappedState";
import { ResourceCode } from "~data/resources";
import audio from "~lib/audio";

export default function poweredSystem(state: WrappedState): void {
  const poweredEntities = state.select.entitiesWithComps("powered");
  poweredEntities.forEach((entity) => {
    if (
      state.select.canAffordToPay(
        ResourceCode.Power,
        entity.powered.powerNeeded,
      )
    ) {
      state.act.modifyResource({
        resource: ResourceCode.Power,
        amount: -entity.powered.powerNeeded,
        reason: entity.powered.resourceChangeReason,
      });
      if (!entity.powered.hasPower) {
        state.act.updateEntity({
          id: entity.id,
          powered: {
            ...entity.powered,
            hasPower: true,
          },
        });
        if (entity.pos) {
          audio.playAtPos("power_on", entity.pos);
        }
      }
    } else if (entity.powered.hasPower) {
      state.act.updateEntity({
        id: entity.id,
        powered: {
          ...entity.powered,
          hasPower: false,
        },
      });
      if (entity.pos) {
        audio.playAtPos("power_off", entity.pos);
      }
    }
  });
}
