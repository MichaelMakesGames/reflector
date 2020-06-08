import WrappedState from "~types/WrappedState";
import { ResourceCode } from "~data/resources";

export default function processPowered(state: WrappedState): void {
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
          ...entity,
          powered: {
            ...entity.powered,
            hasPower: true,
          },
        });
      }
    } else if (entity.powered.hasPower) {
      state.act.updateEntity({
        ...entity,
        powered: {
          ...entity.powered,
          hasPower: false,
        },
      });
    }
  });
}
