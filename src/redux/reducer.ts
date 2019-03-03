import { Action, GameState } from "../types";
import * as selectors from "./selectors";
import * as actions from "./actions";
import { getType } from "typesafe-actions";
import { PLAYER_ID } from "../constants";

const initialState: GameState = {
  entities: {}
};

export default function reducer(
  state: GameState = initialState,
  action: Action
): GameState {
  switch (action.type) {
    case getType(actions.addEntity): {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.entity.id]: action.payload.entity
        }
      };
    }

    case getType(actions.removeEntity): {
      return {
        ...state,
        entities: selectors
          .entityList(state)
          .filter(entity => entity.id !== action.payload.entityId)
          .reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
      };
    }

    case getType(actions.move): {
      const entity = selectors.entity(state, action.payload.entityId);
      const { position, actor } = entity;
      if (actor && !actor.ready) {
        console.warn(
          `Unready entity ${action.payload.entityId} tried to act ${
            action.type
          }`
        );
        return state;
      }
      if (!position) {
        console.warn(
          `Entity with no position ${action.payload.entityId} tried to act ${
            action.type
          }`
        );
        return state;
      }
      const newPosition = {
        x: position.x + action.payload.dx,
        y: position.y + action.payload.dy
      };
      const entitiesAtNewPosition = selectors.entitiesAtPosition(
        state,
        newPosition
      );
      if (entitiesAtNewPosition.some(entity => !!entity.blocking)) {
        return state;
      }
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.entityId]: {
            ...entity,
            position: newPosition,
            actor: { ready: false }
          }
        }
      };
    }

    case getType(actions.ready): {
      const { entityId } = action.payload;
      const entity = selectors.entity(state, entityId);
      const { actor } = entity;
      if (actor) {
        return {
          ...state,
          entities: {
            ...state.entities,
            [entityId]: {
              ...entity,
              actor: { ready: true }
            }
          }
        };
      }
      return state;
    }

    case getType(actions.activateWeapon): {
      const weaponInSlot = selectors.weaponInSlot(state, action.payload.slot);
      if (!weaponInSlot) return state;
      const entity = weaponInSlot;
      const { weapon } = entity;
      if (!weapon) return state;
      return {
        ...state,
        entities: {
          ...state.entities,
          [entity.id]: {
            ...entity,
            weapon: {
              ...weapon,
              active: !weapon.active && !weapon.readyIn
            }
          }
        }
      };
    }

    case getType(actions.fireWeapon): {
      const player = selectors.entity(state, PLAYER_ID);
      return {
        ...state,
        entities: {
          ...state.entities,
          [PLAYER_ID]: {
            ...player,
            actor: { ready: false }
          }
        }
      };
    }

    default: {
      return state;
    }
  }
}
