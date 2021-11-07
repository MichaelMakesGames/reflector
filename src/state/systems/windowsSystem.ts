import { areConditionsMet } from "../../lib/conditions";
import { createEntityFromTemplate } from "../../lib/entities";
import WrappedState from "../../types/WrappedState";

export default function windowsSystem(state: WrappedState): void {
  state.select.entitiesWithComps("pos", "windowed").forEach((windowed) => {
    const existingWindow = state.select
      .entitiesAtPosition(windowed.pos)
      .find((e) => e.window);

    const newWindowTile = windowed.windowed.windowConditions.find(
      ({ condition }) => areConditionsMet(state, windowed, condition)
    )?.tile;

    if (existingWindow && !newWindowTile) {
      state.act.removeEntity(existingWindow.id);
    } else if (
      existingWindow &&
      newWindowTile &&
      existingWindow.display &&
      existingWindow.display.tile !== newWindowTile
    ) {
      state.act.updateEntity({
        id: existingWindow.id,
        display: {
          ...existingWindow.display,
          tile: newWindowTile,
        },
      });
    } else if (!existingWindow && newWindowTile) {
      let window = createEntityFromTemplate("UI_WINDOW", { pos: windowed.pos });
      if (window.display) {
        window = {
          ...window,
          display: {
            ...window.display,
            tile: newWindowTile,
          },
        };
      }
      state.act.addEntity(window);
    }
  });
}
