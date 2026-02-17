// Sound effects placeholder - you can replace with actual sound files later
import { Howl } from 'howler';

// Create silent sound objects that will work even without audio files
export const sounds = {
  streak: new Howl({
    src: ['data:audio/wav;base64,U3R1ZmZUd2Vha2Vy'],
    volume: 0,
    preload: true
  }),
  impact: new Howl({
    src: ['data:audio/wav;base64,U3R1ZmZUd2Vha2Vy'],
    volume: 0,
    preload: true
  }),
  reveal: new Howl({
    src: ['data:audio/wav;base64,U3R1ZmZUd2Vha2Vy'],
    volume: 0,
    preload: true
  })
};

// To add real sounds later:
// 1. Download sound effects from sites like freesound.org
// 2. Place them in /public/sounds/
// 3. Update the src paths: ['/sounds/streak.mp3']