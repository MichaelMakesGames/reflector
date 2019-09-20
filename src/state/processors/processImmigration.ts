import { GameState, Pos, MakeRequired, Entity } from "~/types";
import * as selectors from "~/state/selectors";
import * as actions from "~/state/actions";
import { updateEntity } from "~state/handlers/updateEntity";
import { choose } from "~utils/rng";
import { array } from "prop-types";
import { getPositionsWithinRange } from "~utils/geometry";
import { addEntity } from "~state/handlers/addEntity";
import { createEntityFromTemplate } from "~utils/entities";
import { BASE_IMMIGRATION_RATE, MAP_HEIGHT, MAP_WIDTH } from "~constants";

export default function processImmigration(state: GameState): GameState {
  let newState = state;

  newState = {
    ...newState,
    turnsUntilNextImmigrant: newState.turnsUntilNextImmigrant - 1,
  };

  if (newState.turnsUntilNextImmigrant <= 0) {
    const houses = selectors.entitiesWithComps(newState, "housing", "pos");

    const availableHouse = findAvailableHouse(houses);
    if (availableHouse) {
      newState = updateEntity(
        newState,
        actions.updateEntity({
          ...availableHouse,
          housing: {
            ...availableHouse.housing,
            occupancy: availableHouse.housing.occupancy + 1,
          },
        }),
      );
    }

    let pos = findNewHousePosition(state, houses);
    if (!pos) {
      console.warn("no position for new immigrant found");
    } else {
      newState = addEntity(
        newState,
        actions.addEntity({
          entity: createEntityFromTemplate("TENT", { pos }),
        }),
      );
    }

    newState = {
      ...newState,
      turnsUntilNextImmigrant: BASE_IMMIGRATION_RATE,
    };
  }

  return newState;
}

function findAvailableHouse(houses: MakeRequired<Entity, "housing">[]) {
  return houses.find(house => house.housing.occupancy < house.housing.capacity);
}

function findNewHousePosition(
  state: GameState,
  houses: MakeRequired<Entity, "housing" | "pos">[],
): Pos {
  const positions = houses
    .reduce<Pos[]>((acc, house) => {
      acc.push(...getPositionsWithinRange(house.pos, 3));
      return acc;
    }, [])
    .filter(pos => !selectors.isPositionBlocked(state, pos))
    .filter(
      pos =>
        pos.x >= 0 && pos.x < MAP_WIDTH && pos.y >= 0 && pos.y < MAP_HEIGHT,
    );
  return choose(positions);
}
