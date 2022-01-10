import { PLAYER_ID } from "../constants";
import WrappedState from "../types/WrappedState";
import generateMap from "./generateMap";

export default function makeLevel(state: WrappedState): WrappedState {
  state.act.removeEntities(
    state.select
      .entityList()
      .filter((e) => e.pos && e.id !== PLAYER_ID)
      .map((e) => e.id)
  );
  for (const entity of generateMap(state.raw.mapType)) {
    state.act.addEntity(entity);
  }
  return state;
}
