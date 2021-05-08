import { Howl, Howler } from "howler";
import { getPosKey } from "~lib/geometry";
import { Pos } from "~types";
// @ts-ignore
import audio from "../../assets/audio/*.webm"; // eslint-disable-line import/no-unresolved

const ROLLOFF_FACTOR = 0.5;
export default class Audio {
  private sounds: Record<string, Howl> = {};

  private currentMusic: null | Howl = null;

  private howler = Howler;

  private positionalLoops: Record<string, number> = {};

  private listenerPos: Pos = { x: 0, y: 0 };

  load() {
    Object.entries(audio as Record<string, string>).forEach(([file, url]) => {
      this.sounds[removeFileExtension(file)] = new Howl({
        src: [url.startsWith("/") ? `.${url}` : url],
      });
    });
  }

  play(sound: string) {
    this.sounds[sound].play();
  }

  playAtPos(soundName: string, pos: Pos) {
    const sound = this.sounds[soundName];
    const id = sound.play();

    sound.pos(pos.x, pos.y, 0, id);
    sound.pannerAttr(
      {
        rolloffFactor: ROLLOFF_FACTOR,
        refDistance: 1,
        maxDistance: 9999,
        distanceModel: "inverse",
        panningModel: "HRTF",
      },
      id,
    );
  }

  setListenerPos(pos: Pos) {
    this.listenerPos = pos;
    this.howler.pos(pos.x, pos.y, 0);
  }

  loop(sound: string) {
    this.sounds[sound].loop(true);
    if (!this.sounds[sound].playing()) {
      this.play(sound);
    }
  }

  static makePositionalLoopKey(soundName: string, pos: Pos) {
    return `${soundName}_${getPosKey(pos)}`;
  }

  loopAtPos(soundName: string, pos: Pos) {
    const key = Audio.makePositionalLoopKey(soundName, pos);
    if (!this.positionalLoops[key]) {
      const sound = this.sounds[soundName];
      const id = sound.play();
      this.positionalLoops[key] = id;
      sound.loop(true, id);
      sound.pos(pos.x, pos.y, 0, id);
      sound.pannerAttr(
        {
          rolloffFactor: ROLLOFF_FACTOR,
          refDistance: 1,
          maxDistance: 9999,
          distanceModel: "inverse",
          panningModel: "HRTF",
        },
        id,
      );
    }
  }

  stopAtPos(soundName: string, pos: Pos) {
    const key = Audio.makePositionalLoopKey(soundName, pos);
    if (this.positionalLoops[key]) {
      const sound = this.sounds[soundName];
      const id = this.positionalLoops[key];
      sound.stop(id);
      delete this.positionalLoops[key];
    }
  }

  stop(sound: string) {
    this.sounds[sound].stop();
  }

  playMusic(song: "night" | "day") {
    const MUSIC_VOLUME = 0.25;
    if (this.currentMusic) {
      this.currentMusic.fade(MUSIC_VOLUME, 0, 1000);
      this.currentMusic.off();
      this.currentMusic.on("fade", () => {
        if (this.currentMusic) {
          this.currentMusic.stop();
          this.currentMusic = null;
        }
        this.playMusic(song);
      });
    } else {
      const intro = this.sounds[`${song}_intro`];
      intro.volume(MUSIC_VOLUME);
      const loop = this.sounds[`${song}_loop`];
      loop.volume(MUSIC_VOLUME);
      intro.play();
      this.currentMusic = intro;
      intro.once("end", () => {
        this.currentMusic = loop;
        loop.loop(true);
        loop.play();
      });
    }
  }
}

function removeFileExtension(file: string) {
  const dotIndex = file.indexOf(".");
  if (dotIndex === -1) return file;
  return file.substring(0, dotIndex);
}
