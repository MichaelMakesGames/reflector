import { Entity, MakeRequired } from "~types";
import WrappedState from "~types/WrappedState";

export default function processMigration(state: WrappedState): void {
  let houses = state.select.entitiesWithComps("housing");
  let availableDesirableHouse = getAvailableDesirableHouse(houses);
  let occupiedUndesirableHouse = getOccupiedUndesirableHouse(houses);
  while (availableDesirableHouse && occupiedUndesirableHouse) {
    // move out of undesirable house
    if (
      occupiedUndesirableHouse.housing.removeOnVacancy &&
      occupiedUndesirableHouse.housing.occupancy === 1
    ) {
      // remove if removeOnVacancy
      state.act.removeEntity({ entityId: occupiedUndesirableHouse.id });
    } else {
      // otherwise update with new occupancy
      state.act.updateEntity({
        ...occupiedUndesirableHouse,
        housing: {
          ...occupiedUndesirableHouse.housing,
          occupancy: occupiedUndesirableHouse.housing.occupancy - 1,
        },
      });
    }

    // move in to available house
    state.act.updateEntity({
      ...availableDesirableHouse,
      housing: {
        ...availableDesirableHouse.housing,
        occupancy: availableDesirableHouse.housing.occupancy + 1,
      },
    });

    // prep for next round of migration
    houses = state.select.entitiesWithComps("housing");
    availableDesirableHouse = getAvailableDesirableHouse(houses);
    occupiedUndesirableHouse = getOccupiedUndesirableHouse(houses);
  }
}

function getAvailableDesirableHouse(
  houses: MakeRequired<Entity, "housing">[],
): MakeRequired<Entity, "housing"> | null {
  const minDesirability = Math.min(
    ...houses.map(house => house.housing.desirability),
  );
  return (
    houses.find(
      house =>
        house.housing.desirability > minDesirability &&
        house.housing.occupancy < house.housing.capacity,
    ) || null
  );
}

function getOccupiedUndesirableHouse(
  houses: MakeRequired<Entity, "housing">[],
): MakeRequired<Entity, "housing"> | null {
  const maxDesirability = Math.max(
    ...houses.map(house => house.housing.desirability),
  );
  return (
    houses.find(
      house =>
        house.housing.desirability < maxDesirability &&
        house.housing.occupancy > 0,
    ) || null
  );
}
