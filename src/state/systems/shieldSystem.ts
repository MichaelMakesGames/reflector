import WrappedState from "../../types/WrappedState";

export default function shieldSystem(state: WrappedState): void {
  state.select
    .entitiesWithComps("shieldGenerator", "powered")
    .filter((e) => !e.powered.hasPower)
    .map((e) => e.id)
    .forEach((id) => state.act.shieldDischarge(id));
  state.select
    .entitiesWithComps("shieldGenerator")
    .map((e) => e.id)
    .forEach((id) => state.act.shieldCharge(id));
}
