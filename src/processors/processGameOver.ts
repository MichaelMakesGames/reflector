import * as selectors from "../selectors";
import { GameState } from "../types";

export default function processGameOver(state: GameState): GameState {
  const entities = selectors.entityList(state);
  const player = selectors.player(state);
  const currentLevel = entities.filter(e => e.level && e.level.current)[0];
  if (player && player.hitPoints && player.hitPoints.current <= 0) {
    state = {
      ...state,
      gameOver: true,
      messageLog: [...state.messageLog, "You died. Refresh to try again."],
    };
  } else if (
    currentLevel.level &&
    currentLevel.level.final &&
    entities.filter(e => e.factory).length === 0
  ) {
    state = {
      ...state,
      gameOver: true,
      messageLog: [
        ...state.messageLog,
        "You destroyed all enemy factories. You win!",
      ],
    };
  }
  return state;
}
