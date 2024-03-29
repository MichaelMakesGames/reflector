import { Howl, Howler } from "howler";
// @ts-ignore
import audio from "url:../../assets/audio/*.webm"; // eslint-disable-line import/no-unresolved
import { getPosKey } from "../geometry";
import { Pos } from "../../types";

export interface SoundOptions {
  rollOff?: number;
  volume?: number;
}

export const DEFAULT_OPTIONS: Required<SoundOptions> = {
  rollOff: 0.5,
  volume: 1,
};

const MUSIC_BASE_VOLUME = 0.15;
const SFX_BASE_VOLUME = 0.25;
export default class Audio {
  private sounds: Record<string, Howl> = {};

  private currentMusic: null | Howl = null;

  public currentMusicName: null | string = null;

  private howler = Howler;

  private positionalLoops: Record<string, [number, SoundOptions]> = {};

  private listenerPos: Pos = { x: 0, y: 0 };

  private musicVolume: number = 1;

  private sfxVolume: number = 1;

  load() {
    Object.entries(audio as Record<string, string>).forEach(([file, url]) => {
      this.sounds[removeFileExtension(file)] = new Howl({
        src: [url.startsWith("/") ? `.${url}` : url],
      });
    });
  }

  setMusicVolume(value: number) {
    this.musicVolume = value;
    if (this.currentMusic) {
      this.currentMusic.volume(MUSIC_BASE_VOLUME * value);
    }
  }

  setSfxVolume(value: number) {
    this.sfxVolume = value;
    Object.entries(this.positionalLoops).forEach(([loopKey, [id, options]]) => {
      const [soundName, pos] = Audio.parsePositionalLoopKey(loopKey);
      this.stopAtPos(soundName, pos);
      this.loopAtPos(soundName, pos, options);
    });
  }

  play(soundName: string, options: SoundOptions = DEFAULT_OPTIONS) {
    delay(10).then(() => {
      const sound = this.sounds[soundName];
      const id = sound.play();
      const volume =
        (options.volume || DEFAULT_OPTIONS.volume) *
        this.sfxVolume *
        SFX_BASE_VOLUME;
      sound.volume(volume, id);
    });
  }

  playAtPos(
    soundName: string,
    pos: Pos,
    options: SoundOptions = DEFAULT_OPTIONS
  ) {
    delay(10).then(() => {
      const sound = this.sounds[soundName];
      const id = sound.play();

      const volume =
        (options.volume || DEFAULT_OPTIONS.volume) *
        this.sfxVolume *
        SFX_BASE_VOLUME;
      sound.volume(volume, id);

      sound.pos(pos.x, pos.y, 0, id);
      sound.pannerAttr(
        {
          rolloffFactor: options.rollOff || DEFAULT_OPTIONS.rollOff,
          refDistance: 1,
          maxDistance: 9999,
          distanceModel: "inverse",
          panningModel: "equalpower",
        },
        id
      );
    });
  }

  setListenerPos(pos: Pos) {
    this.listenerPos = pos;
    this.howler.pos(pos.x, pos.y, 0);
  }

  loop(soundName: string, options: SoundOptions = DEFAULT_OPTIONS) {
    this.sounds[soundName].loop(true);
    if (!this.sounds[soundName].playing()) {
      this.play(soundName, options);
    }
  }

  static makePositionalLoopKey(soundName: string, pos: Pos) {
    return `${soundName}_${getPosKey(pos)}`;
  }

  static parsePositionalLoopKey(key: string): [string, Pos] {
    const [soundName, posKey] = key.split("_");
    const [x, y] = posKey.split(",").map(parseFloat);
    return [soundName, { x, y }];
  }

  loopAtPos(
    soundName: string,
    pos: Pos,
    options: SoundOptions = DEFAULT_OPTIONS
  ) {
    delay(10).then(() => {
      const key = Audio.makePositionalLoopKey(soundName, pos);
      if (!this.positionalLoops[key]) {
        const sound = this.sounds[soundName];
        const id = sound.play();
        this.positionalLoops[key] = [id, options];
        const volume =
          (options.volume || DEFAULT_OPTIONS.volume) *
          this.sfxVolume *
          SFX_BASE_VOLUME;
        sound.volume(volume, id);
        sound.loop(true, id);
        sound.pos(pos.x, pos.y, 0, id);
        sound.pannerAttr(
          {
            rolloffFactor: options.rollOff || DEFAULT_OPTIONS.rollOff,
            refDistance: 1,
            maxDistance: 9999,
            distanceModel: "inverse",
            panningModel: "equalpower",
          },
          id
        );
      }
    });
  }

  stopAtPos(soundName: string, pos: Pos) {
    const key = Audio.makePositionalLoopKey(soundName, pos);
    if (this.positionalLoops[key]) {
      const sound = this.sounds[soundName];
      const [id] = this.positionalLoops[key];
      sound.stop(id);
      delete this.positionalLoops[key];
    }
  }

  stop(sound: string) {
    this.sounds[sound].stop();
  }

  stopAll({ stopMusic = false }) {
    Object.values(this.sounds)
      .filter((sound) => stopMusic || sound !== this.currentMusic)
      .forEach((sound) => sound.stop());
    Object.entries(this.positionalLoops).forEach(([key]) =>
      this.stopAtPos(...Audio.parsePositionalLoopKey(key))
    );
  }

  playMusic(musicName: "night" | "day") {
    if (this.currentMusicName === musicName) return; // already playing

    const volume = MUSIC_BASE_VOLUME * this.musicVolume;
    if (this.currentMusic) {
      this.currentMusic.fade(volume, 0, 1000);
      this.currentMusic.off();
      this.currentMusic.on("fade", () => {
        if (this.currentMusic) {
          this.currentMusic.stop();
          this.currentMusic = null;
          this.currentMusicName = null;
        }
        this.playMusic(musicName);
      });
    } else {
      const intro = this.sounds[`${musicName}_intro`];
      intro.volume(volume);
      const loop = this.sounds[`${musicName}_loop`];
      loop.volume(volume);
      intro.play();
      this.currentMusic = intro;
      this.currentMusicName = musicName;
      intro.off("end");
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

/* eslint-disable no-underscore-dangle, prefer-spread, func-names, object-shorthand */
// Overwrite Howl.volume to allow setting volume > 1
Howl.prototype.volume = function volume(...args: number[]) {
  const self: any = this;
  let vol;
  let id;

  // Determine the values based on arguments.
  if (args.length === 0) {
    // Return the value of the groups' volume.
    return self._volume;
  } else if (
    args.length === 1 ||
    (args.length === 2 && typeof args[1] === "undefined")
  ) {
    // First check if this is an ID, and if not, assume it is a new volume.
    const ids = self._getSoundIds();
    const index = ids.indexOf(args[0]);
    if (index >= 0) {
      id = args[0];
    } else {
      vol = args[0];
    }
  } else if (args.length >= 2) {
    vol = args[0];
    id = args[1];
  }

  // Update the volume or return the current volume.
  let sound;
  if (typeof vol !== "undefined" && vol >= 0) {
    // THIS IS THE MODIFIED LINE TO ALLOW vol > 1
    // If the sound hasn't loaded, add it to the load queue to change volume when capable.
    if (self._state !== "loaded" || self._playLock) {
      self._queue.push({
        event: "volume",
        action: function () {
          self.volume.apply(self, args);
        },
      });

      return self;
    }

    // Set the group volume.
    if (typeof id === "undefined") {
      self._volume = vol;
    }

    // Update one or all volumes.
    id = self._getSoundIds(id);
    for (let i = 0; i < id.length; i++) {
      // Get the sound.
      sound = self._soundById(id[i]);

      if (sound) {
        sound._volume = vol;

        // Stop currently running fades.
        if (!args[2]) {
          self._stopFade(id[i]);
        }

        if (self._webAudio && sound._node && !sound._muted) {
          sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
        } else if (sound._node && !sound._muted) {
          sound._node.volume = vol * Howler.volume();
        }

        self._emit("volume", sound._id);
      }
    }
  } else {
    sound = id ? self._soundById(id) : self._sounds[0];
    return sound ? sound._volume : 0;
  }

  return self;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 10));
}
