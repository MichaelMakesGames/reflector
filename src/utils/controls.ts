import { RawState, Pos, Action } from "~types";
import selectors from "~state/selectors";
import actions from "~state/actions";
import { PLAYER_ID } from "~constants";

type Results = { label: string; action: Action }[];

export function getActionsAvailableAtPos(state: RawState, pos: Pos): Results {
  const results: Results = [];
  addMoveAction(state, pos, results);
  results.push({ label: "Make Me Rich", action: actions.makeMeRich() });
  return results;
}

function addMoveAction(state: RawState, pos: Pos, results: Results) {
  const player = selectors.player(state);
  if (player) {
    const playerPos = player.pos;
    if (Math.abs(playerPos.x - pos.x) + Math.abs(playerPos.y - pos.y) === 1) {
      results.push({
        label: "Move",
        action: actions.move({
          entityId: PLAYER_ID,
          dx: pos.x - playerPos.x,
          dy: pos.y - playerPos.y,
        }),
      });
    }
  }
}
