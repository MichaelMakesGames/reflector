import { createAction } from "typesafe-actions";
import colors from "../../colors";
import { VERSION } from "../../constants";
import audio from "../../lib/audio";
import { resetEntitiesByCompAndPos } from "../../lib/entities";
import renderer from "../../renderer";
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
  renderer.clear();
  state.select
    .entitiesWithComps("pos", "display")
    .forEach((entity) => renderer.addEntity(entity));
  cosmeticSystems.forEach((system) => system(state));
  if (state.select.isNight()) {
    renderer.setBackgroundColor(colors.backgroundNight);
  } else {
    renderer.setBackgroundColor(colors.backgroundDay);
  }

  audio.stopAll();
  audio.playMusic(state.select.isNight() ? "night" : "day");
  if (state.select.entitiesWithComps("laser").length > 0) {
    audio.loop("laser_active", { volume: 0.5 });
  }
}

registerHandler(loadGameHandler, loadGame);
