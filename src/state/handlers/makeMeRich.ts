import WrappedState from "~types/WrappedState";
import { registerHandler } from "~state/handleAction";
import actions from "~state/actions";

function makeMeRich(state: WrappedState) {
  for (const resource of Object.keys(state.select.resources())) {
    state.act.modifyResource({ resource: resource as Resource, amount: 1000 });
  }
}

registerHandler(makeMeRich, actions.makeMeRich);
