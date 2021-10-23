import WrappedState from "../../types/WrappedState";

export default function bordersSystem(state: WrappedState): void {
  state.act.bordersUpdate();
}
