import { Action, GameState } from "../types";
import * as selectors from "./selectors";
import * as actions from "./actions";
import { getType } from "typesafe-actions";
import { PLAYER_ID } from "../constants";
import { getPosKey } from "./utils";

const initialState: GameState = {
  entities: {},
  entitiesByPosition: {}
};

export default function reducer(
  state: GameState = initialState,
  action: Action
): GameState {
  switch (action.type) {
    case getType(actions.addEntity): {
      const { entity } = action.payload;
      const prev = selectors.entity(state, action.payload.entity.id);
      let { entitiesByPosition } = state;
      if (prev && prev.position) {
        const key = getPosKey(prev.position);
        entitiesByPosition = {
          ...entitiesByPosition,
          [key]: entitiesByPosition[key].filter(id => id !== prev.id)
        };
      }
      if (entity.position) {
        const key = getPosKey(entity.position);
        entitiesByPosition = {
          ...entitiesByPosition,
          [key]: [...(entitiesByPosition[key] || []), entity.id]
        };
      }
      return {
        ...state,
        entitiesByPosition,
        entities: {
          ...state.entities,
          [entity.id]: entity
        }
      };
    }

    case getType(actions.removeEntity): {
      const prev = selectors.entity(state, action.payload.entityId);
      let { entitiesByPosition } = state;
      if (prev.position) {
        const key = getPosKey(prev.position);
        entitiesByPosition = {
          ...entitiesByPosition,
          [key]: entitiesByPosition[key].filter(id => id !== prev.id)
        };
      }
      return {
        ...state,
        entitiesByPosition,
        entities: selectors
          .entityList(state)
          .filter(entity => entity.id !== prev.id)
          .reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
      };
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

    // case getType(actions.playerTookTurn): {
    //   for (let entity of Object.values(state.entities)) {
    //     if (entity.position) {
    //       const key = getPosKey(entity.position);
    //       console.assert(state.entitiesByPosition[key].includes(entity.id));
    //     }
    //   }
    //   return state;
    // }

    default: {
      return state;
    }
  }
}
