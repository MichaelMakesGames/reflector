import { GameState, MakeRequired, Entity } from "~types";
import selectors from "~state/selectors";
import actions from "~state/actions";
import handleAction from "~state/handleAction";

export default function processMigration(prevState: GameState): GameState {
  let state = prevState;

  let houses = selectors.entitiesWithComps(state, "housing");
  let availableDesirableHouse = getAvailableDesirableHouse(houses);
  let occupiedUndesirableHouse = getOccupiedUndesirableHouse(houses);
  while (availableDesirableHouse && occupiedUndesirableHouse) {
    // move out of undesirable house
    if (
      occupiedUndesirableHouse.housing.removeOnVacancy &&
      occupiedUndesirableHouse.housing.occupancy === 1
    ) {
      // remove if removeOnVacancy
      state = handleAction(
        state,
        actions.removeEntity({ entityId: occupiedUndesirableHouse.id }),
      );
    } else {
      // otherwise update with new occupancy
      state = handleAction(
        state,
        actions.updateEntity({
          ...occupiedUndesirableHouse,
          housing: {
            ...occupiedUndesirableHouse.housing,
            occupancy: occupiedUndesirableHouse.housing.occupancy - 1,
          },
        }),
      );
    }

    // move in to available house
    state = handleAction(
      state,
      actions.updateEntity({
        ...availableDesirableHouse,
        housing: {
          ...availableDesirableHouse.housing,
          occupancy: availableDesirableHouse.housing.occupancy + 1,
        },
      }),
    );

    // prep for next round of migration
    houses = selectors.entitiesWithComps(state, "housing");
    availableDesirableHouse = getAvailableDesirableHouse(houses);
    occupiedUndesirableHouse = getOccupiedUndesirableHouse(houses);
  }

  return state;
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
