import * as selectors from "~/state/selectors";
import { GameState } from "~/types";

export default function processGameOver(state: GameState): GameState {
  let newState = state;
  const entities = selectors.entityList(newState);
  const player = selectors.player(newState);
  const currentLevel = entities.filter(e => e.level && e.level.current)[0];
  if (player && player.hitPoints.current <= 0) {
    newState = {
      ...newState,
      gameOver: true,
      messageLog: [...newState.messageLog, "You died. Refresh to try again."],
    };
  } else if (
    currentLevel.level &&
    currentLevel.level.final &&
    entities.filter(e => e.factory).length === 0
  ) {
    newState = {
      ...newState,
      gameOver: true,
      messageLog: [
        ...newState.messageLog,
        "You destroyed all enemy factories. You win!",
      ],
    };
  }
  return newState;
}
