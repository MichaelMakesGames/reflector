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
    state.act.addEntity(
      createEntityFromTemplate("PATH_PREVIEW", { pos, pathPreview: { index } }),
    );
  });
}

registerHandler(setAutoMovePath, actions.setAutoMovePath);
