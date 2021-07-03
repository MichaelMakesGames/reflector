import WrappedState from "~types/WrappedState";
import { Entity } from "~types";
import { getPositionToDirection } from "~lib/geometry";
import { UP, RIGHT, DOWN, LEFT } from "~constants";
import { EffectId } from "~types/EffectId";

export type Effect = (
  state: WrappedState,
  actor?: Entity,
  target?: Entity,
) => void;

const effects: Record<EffectId, Effect> = {
  ON_ROAD_BUILD: (state, actor, target) => {
    if (!target || !target.pos) return;
    state.act.roadUpdateTile(target.pos);
    state.act.roadUpdateTile(getPositionToDirection(target.pos, UP));
    state.act.roadUpdateTile(getPositionToDirection(target.pos, RIGHT));
    state.act.roadUpdateTile(getPositionToDirection(target.pos, DOWN));
    state.act.roadUpdateTile(getPositionToDirection(target.pos, LEFT));
  },
};

export default effects;
