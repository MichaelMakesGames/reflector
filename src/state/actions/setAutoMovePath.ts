import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import { Pos } from "../../types";
import WrappedState from "../../types/WrappedState";
import { createEntityFromTemplate } from "../../lib/entities";
import { TemplateName } from "../../types/TemplateName";

const setAutoMovePath = createAction("SET_AUTO_MOVE_PATH")<Pos[]>();
export default setAutoMovePath;

function setAutoMovePathHandler(
  state: WrappedState,
  action: ReturnType<typeof setAutoMovePath>
): void {
  const pathPreviews = state.select.entitiesWithComps("pathPreview", "pos");
  state.act.removeEntities(pathPreviews.map((e) => e.id));

  action.payload.forEach((pos, index) => {
    const template: TemplateName =
      index === 0 || !state.select.areEnemiesPresent()
        ? "UI_PATH"
        : "UI_PATH_DEEMPHASIZED";
    state.act.addEntity(
      createEntityFromTemplate(template, { pos, pathPreview: { index } })
    );
  });
}

registerHandler(setAutoMovePathHandler, setAutoMovePath);
