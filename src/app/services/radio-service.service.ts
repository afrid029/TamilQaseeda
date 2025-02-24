import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class RadioServiceService {
  private player: Howl | null = null;
  private url : string = 'https://sonic-ca.instainternet.com/assunnahtamil/stream'

  constructor() {}

  playStream() {
    if (this.player) {
      this.player.unload();
    }
    this.player = new Howl({
      src: [this.url],
      html5: true,
      format: ['mp3', 'aac'],
            onend: () => {
              console.log('Stream ended');
            },
            onloaderror: (id, error) => {
              console.error('Load error', error);
            },
            onplayerror: (id, error) => {
              console.error('Play error', error);
            }
    });
    this.player.play();
  }

  stopStream() {
    if (this.player) {
      this.player.stop();
    }
  }


}
