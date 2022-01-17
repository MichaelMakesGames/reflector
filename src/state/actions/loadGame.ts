import { createAction } from "typesafe-actions";
import colors from "../../colors";
import { VERSION } from "../../constants";
import { resetEntitiesByCompAndPos } from "../../lib/entities";
import { RawState } from "../../types";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";
import { cosmeticSystems } from "../systems";

const loadGame = createAction("LOAD_GAME")<{
  state: RawState;
}>();
export default loadGame;

function loadGameHandler(
  state: WrappedState,
  action: ReturnType<typeof loadGame>
): void {
  const { state: loadedState } = action.payload;
  state.setRaw({
    ...loadedState,
    version: VERSION,
  });
  resetEntitiesByCompAndPos(state);
  state.act.setCursorPos(null);
  state.renderer.clear();
  state.select
    .entitiesWithComps("pos", "display")
    .forEach((entity) => state.renderer.addEntity(entity));

  state.audio.stopAll({ stopMusic: false });
  const musicName = state.select.isNight() ? "night" : "day";
  if (state.audio.currentMusicName !== musicName) {
    state.audio.playMusic(musicName);
  }
  if (state.select.entitiesWithComps("laser").length > 0) {
    state.audio.loop("laser_active", { volume: 0.5 });
  }

  cosmeticSystems.forEach((system) => system(state));
  if (state.select.isNight()) {
    state.renderer.setBackgroundColor(colors.backgroundNight);
  } else {
    state.renderer.setBackgroundColor(colors.backgroundDay);
  }
}

registerHandler(loadGameHandler, loadGame);
