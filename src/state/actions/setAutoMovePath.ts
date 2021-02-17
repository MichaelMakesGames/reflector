import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import { Pos } from "~types";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~lib/entities";

const setAutoMovePath = createStandardAction("SET_AUTO_MOVE_PATH")<Pos[]>();
export default setAutoMovePath;

function setAutoMovePathHandler(
  state: WrappedState,
  action: ReturnType<typeof setAutoMovePath>,
): void {
  const pathPreviews = state.select.entitiesWithComps("pathPreview", "pos");
  state.act.removeEntities(pathPreviews.map((e) => e.id));

  action.payload.forEach((pos, index) => {
    const template: TemplateName =
      index === 0 || !state.select.areEnemiesPresent()
        ? "PATH_PREVIEW"
        : "PATH_PREVIEW_DEEMPHASIZED";
    state.act.addEntity(
      createEntityFromTemplate(template, { pos, pathPreview: { index } }),
    );
  });
}

registerHandler(setAutoMovePathHandler, setAutoMovePath);
