import { createStandardAction } from "typesafe-actions";
import colors from "~colors";
import { VERSION } from "~constants";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import animationToggleSystem from "~state/systems/animationToggleSystem";
import bordersSystem from "~state/systems/bordersSystem";
import emitterSystem from "~state/systems/emitterSystem";
import { RawState } from "~types";
import WrappedState from "~types/WrappedState";
import { resetEntitiesByCompAndPos } from "~lib/entities";
import audio from "~lib/audio";

const loadGame = createStandardAction("LOAD_GAME")<{
  state: RawState;
}>();
export default loadGame;

function loadGameHandler(
  state: WrappedState,
  action: ReturnType<typeof loadGame>,
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
  emitterSystem(state);
  animationToggleSystem(state);
  bordersSystem(state);
  if (state.select.isNight()) {
    renderer.setBackgroundColor(colors.backgroundNight);
  } else {
    renderer.setBackgroundColor(colors.backgroundDay);
  }

  audio.playMusic(state.select.isNight() ? "night" : "day");
}

registerHandler(loadGameHandler, loadGame);
