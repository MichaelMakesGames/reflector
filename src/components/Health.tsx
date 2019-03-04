import React from "react";
import { useMappedState } from "redux-react-hook";
import * as selectors from "../redux/selectors";

export default function() {
  const player = useMappedState(selectors.player);
  if (!player) return null;
  const hp = player.hitPoints;
  if (!hp) return null;
  return <div>{`HP: ${hp.current}/${hp.max}`}</div>;
}
