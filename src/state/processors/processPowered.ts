import WrappedState from "~types/WrappedState";

export default function processPowered(state: WrappedState): void {
  const poweredEntities = state.select.entitiesWithComps("powered");
  poweredEntities.forEach(entity => {
    if (state.select.canAffordToPay("POWER", entity.powered.powerNeeded)) {
      state.act.modifyResource({
        resource: "POWER",
        amount: -entity.powered.powerNeeded,
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
