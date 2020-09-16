import WrappedState from "~types/WrappedState";

export default function processBuilding(state: WrappedState) {
  const placingTarget = state.select.placingTarget();
  if (placingTarget) {
    state.act.activatePlacement({
      template: placingTarget.template,
      takesTurn: placingTarget.placing.takesTurn,
      cost: placingTarget.placing.cost,
      validitySelector: placingTarget.placing.validitySelector,
      pos: placingTarget.pos,
    });
  }
}
