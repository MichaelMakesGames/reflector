import WrappedState from "~types/WrappedState";
import { Entity } from "~types";

const conditions: Record<
  ConditionName,
  (state: WrappedState, entity: Entity) => boolean
> = {
  isPowered: (state, entity) =>
    Boolean(entity.powered && entity.powered.hasPower),
};

export function areConditionsMet(
  state: WrappedState,
  entity: Entity,
  ...conditionNames: (ConditionName | null)[]
) {
  return conditionNames.every(name => !name || conditions[name](state, entity));
}
