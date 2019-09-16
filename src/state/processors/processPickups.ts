import * as actions from "../actions";
import { activateEquip } from "../handlers/activateEquip";
import { removeEntity } from "../handlers/removeEntity";
import { updateEntity } from "../handlers/updateEntity";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { arePositionsEqual } from "../../utils/geometry";

export default function processPickups(state: GameState): GameState {
  let newState = state;
  const player = selectors.player(newState);
  for (const entity of selectors.entitiesWithComps(newState, "pickup", "pos")) {
    if (player && arePositionsEqual(player.pos, entity.pos)) {
      if (entity.pickup.effect === "NONE") {
        newState = removeEntity(
          newState,
          actions.removeEntity({ entityId: entity.id }),
        );
      }
      if (entity.pickup.effect === "PICKUP") {
        newState = removeEntity(
          newState,
          actions.removeEntity({ entityId: entity.id }),
        );
        newState = updateEntity(
          newState,
          actions.updateEntity({
            id: player.id,
            inventory: {
              reflectors:
                player.inventory.reflectors + (entity.reflector ? 1 : 0),
              splitters: player.inventory.splitters + (entity.splitter ? 1 : 0),
            },
          }),
        );
      }
      if (entity.pickup.effect === "HEAL") {
        newState = removeEntity(
          newState,
          actions.removeEntity({ entityId: entity.id }),
        );
        if (player.hitPoints.current < player.hitPoints.max) {
          newState = updateEntity(
            newState,
            actions.updateEntity({
              id: player.id,
              hitPoints: {
                ...player.hitPoints,
                current: player.hitPoints.current + 1,
              },
            }),
          );
          newState = {
            ...newState,
            messageLog: [...newState.messageLog, "You heal 1."],
          };
        }
      }
      if (entity.pickup.effect === "RECHARGE") {
        newState = removeEntity(
          newState,
          actions.removeEntity({ entityId: entity.id }),
        );
        newState = {
          ...newState,
          messageLog: [...newState.messageLog, "All weapons ready."],
        };
        for (const weapon of selectors.weapons(newState)) {
          if (weapon.weapon && weapon.weapon.readyIn) {
            newState = updateEntity(
              newState,
              actions.updateEntity({
                id: weapon.id,
                weapon: { ...weapon.weapon, readyIn: 0 },
              }),
            );
          }
        }
      }
      if (entity.pickup.effect === "EQUIP") {
        if (entity.weapon) {
          newState = activateEquip(newState, actions.activateEquip({ entity }));
        }
      }
    }
  }
  return newState;
}
