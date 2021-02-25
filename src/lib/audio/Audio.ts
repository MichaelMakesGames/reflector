import { Howl } from "howler";
// @ts-ignore
import audio from "../../assets/audio/*.webm"; // eslint-disable-line import/no-unresolved

export default class Audio {
  private sounds: Record<string, Howl> = {};

  private currentMusic: null | Howl = null;

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

  loop(sound: string) {
    this.sounds[sound].loop(true);
    if (!this.sounds[sound].playing()) {
      this.play(sound);
    }
  }

  stop(sound: string) {
    this.sounds[sound].stop();
  }

  playMusic(song: "night" | "day") {
    if (this.currentMusic) {
      this.currentMusic.fade(1, 0, 1000);
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
      intro.volume(1);
      const loop = this.sounds[`${song}_loop`];
      loop.volume(1);
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
