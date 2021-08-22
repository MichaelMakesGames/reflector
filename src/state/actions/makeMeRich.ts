import { createAction } from "typesafe-actions";
import { ResourceCode } from "../../data/resources";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const makeMeRich = createAction("MAKE_ME_RICH")();
export default makeMeRich;

function makeMeRichHandler(state: WrappedState) {
  for (const resource of Object.keys(state.select.resources())) {
    state.act.modifyResource({
      resource: resource as ResourceCode,
      amount: 1000,
      reason: "I'm rich!",
    });
  }
}

registerHandler(makeMeRichHandler, makeMeRich);
