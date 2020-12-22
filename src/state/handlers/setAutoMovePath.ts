import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";

function setAutoMovePath(
  state: WrappedState,
  action: ReturnType<typeof actions.setAutoMovePath>,
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

registerHandler(setAutoMovePath, actions.setAutoMovePath);
