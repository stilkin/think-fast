#!/usr/bin/env node
/**
 * Generates the two game sounds as 16-bit PCM mono WAV files under
 * assets/sounds/ — run once at authoring time, the output is committed:
 *
 *   node scripts/gen-sounds.mjs
 *
 * tick.wav  ~40 ms  sharp wooden click (decaying square + noise burst)
 * chime.wav ~700 ms two-note landing ding (G5 -> C6, sine with harmonics)
 *
 * Pure Node, no dependencies.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SAMPLE_RATE = 44100
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds')

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2)
  for (let i = 0; i < samples.length; i++) {
    const clipped = Math.max(-1, Math.min(1, samples[i]))
    data.writeInt16LE(Math.round(clipped * 32767), i * 2)
  }
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + data.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16) // PCM chunk size
  header.writeUInt16LE(1, 20) // PCM format
  header.writeUInt16LE(1, 22) // mono
  header.writeUInt32LE(SAMPLE_RATE, 24)
  header.writeUInt32LE(SAMPLE_RATE * 2, 28) // byte rate
  header.writeUInt16LE(2, 32) // block align
  header.writeUInt16LE(16, 34) // bits per sample
  header.write('data', 36)
  header.writeUInt32LE(data.length, 40)
  return Buffer.concat([header, data])
}

const seconds = (ms) => Math.floor((ms / 1000) * SAMPLE_RATE)

// Deterministic pseudo-noise so the click is reproducible.
let noiseSeed = 0x9e3779b9
function noise() {
  noiseSeed ^= noiseSeed << 13
  noiseSeed ^= noiseSeed >>> 17
  noiseSeed ^= noiseSeed << 5
  return ((noiseSeed >>> 0) / 0xffffffff) * 2 - 1
}

function tick() {
  const n = seconds(40)
  const out = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE
    const env = Math.exp(-t * 260)
    const square = Math.sign(Math.sin(2 * Math.PI * 1900 * t)) * 0.5
    out[i] = (square + noise() * 0.6) * env * 0.55
  }
  return out
}

function chime() {
  const n = seconds(700)
  const out = new Float64Array(n)
  const notes = [
    { freq: 784.0, start: 0, gain: 0.42 }, // G5
    { freq: 1046.5, start: 0.22, gain: 0.5 }, // C6
  ]
  for (const { freq, start, gain } of notes) {
    const begin = seconds(start * 1000)
    for (let i = begin; i < n; i++) {
      const t = (i - begin) / SAMPLE_RATE
      const env = Math.exp(-t * 5.5)
      const tone = Math.sin(2 * Math.PI * freq * t) + 0.35 * Math.sin(2 * Math.PI * freq * 2 * t)
      out[i] += tone * env * gain * 0.5
    }
  }
  return out
}

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(join(OUT_DIR, 'tick.wav'), wav(tick()))
writeFileSync(join(OUT_DIR, 'chime.wav'), wav(chime()))
console.log(`wrote ${OUT_DIR}/tick.wav and chime.wav`)
