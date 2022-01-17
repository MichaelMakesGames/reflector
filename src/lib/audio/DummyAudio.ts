/* eslint-disable class-methods-use-this */
import { Pos } from "../../types";
import { DEFAULT_OPTIONS, SoundOptions } from "./Audio";

export default class DummyAudio {
  public currentMusicName = "";

  load() {}

  play(soundName: string, options: SoundOptions = DEFAULT_OPTIONS) {}

  playAtPos(
    soundName: string,
    pos: Pos,
    options: SoundOptions = DEFAULT_OPTIONS
  ) {}

  setListenerPos(pos: Pos) {}

  loop(soundName: string, options: SoundOptions = DEFAULT_OPTIONS) {}

  static makePositionalLoopKey(soundName: string, pos: Pos) {}

  loopAtPos(
    soundName: string,
    pos: Pos,
    options: SoundOptions = DEFAULT_OPTIONS
  ) {}

  stopAtPos(soundName: string, pos: Pos) {}

  stop(sound: string) {}

  stopAll({ stopMusic = false }) {}

  playMusic(song: "night" | "day") {}
}
