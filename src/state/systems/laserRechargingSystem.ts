import WrappedState from "../../types/WrappedState";

export default function laserRechargingSystem(state: WrappedState): void {
  const laserState = state.select.laserState();
  if (laserState === "FIRING") {
    state.setRaw({
      ...state.raw,
      laserState: "RECHARGING",
    });
  } else if (laserState === "RECHARGING") {
    state.setRaw({
      ...state.raw,
      laserState: "READY",
    });
  }
}
