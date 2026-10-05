import { type AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio'

/**
 * Tiny facade over expo-audio so the wheel never touches the audio module
 * directly (design D4). All sounds are generated WAVs committed under
 * assets/sounds/ — no network, no licensing.
 */

let tickPlayer: AudioPlayer | null = null
let chimePlayer: AudioPlayer | null = null
let tockPlayer: AudioPlayer | null = null
let buzzerPlayer: AudioPlayer | null = null
let muted = false

/** Call once at startup (after the first user gesture is fine too). */
export function initSound(): void {
  if (tickPlayer) return
  try {
    tickPlayer = createAudioPlayer(require('../../assets/sounds/tick.wav'))
    chimePlayer = createAudioPlayer(require('../../assets/sounds/chime.wav'))
    tockPlayer = createAudioPlayer(require('../../assets/sounds/tock.wav'))
    buzzerPlayer = createAudioPlayer(require('../../assets/sounds/buzzer.wav'))
    // A party game must be heard even with the iOS silent switch on.
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {})
  } catch {
    tickPlayer = null
    chimePlayer = null
    tockPlayer = null
    buzzerPlayer = null
  }
}

export function setMuted(value: boolean): void {
  muted = value
}

export function isMuted(): boolean {
  return muted
}

/** Short click as a segment passes the pointer. Fire-and-forget. */
export function playTick(): void {
  if (muted || !tickPlayer) return
  void tickPlayer.seekTo(0).then(() => tickPlayer?.play())
}

/** Two-note landing chime. */
export function playChime(): void {
  if (muted || !chimePlayer) return
  void chimePlayer.seekTo(0).then(() => chimePlayer?.play())
}

/** Soft clock tick — one per second in the timer's final five. */
export function playTock(): void {
  if (muted || !tockPlayer) return
  void tockPlayer.seekTo(0).then(() => tockPlayer?.play())
}

/** Low double honk — the countdown expired. */
export function playBuzzer(): void {
  if (muted || !buzzerPlayer) return
  void buzzerPlayer.seekTo(0).then(() => buzzerPlayer?.play())
}
