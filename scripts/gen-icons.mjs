#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs'
/**
 * Rasterizes the Think Fast icon + splash sources into every PNG the app ships
 * (app-identity spec; design D3). Run from the repo root:
 *
 *   node scripts/gen-icons.mjs
 *
 * Sources:  assets/icon-sources/*.svg  (text set in Titan One, bundled TTF)
 * Outputs:  assets/images/*.png        (sizes per design D4)
 *
 * Mechanism: the snap-confined system Chromium can neither read file:// pages
 * nor write files on this machine, so this script serves everything over an
 * embedded HTTP server and rasterizes via playwright-core driving that
 * Chromium over CDP — the Node process writes the PNGs. Font filenames are
 * resolved from assets/fonts/ at runtime; never hardcode them.
 */
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { chromium } from 'playwright-core'

const ROOT = join(import.meta.dirname, '..')
const SOURCES = join(ROOT, 'assets/icon-sources')
const FONTS = join(ROOT, 'assets/fonts')
const OUT = join(ROOT, 'assets/images')

const fontFile = (name) => {
  const hit = readdirSync(FONTS).find((f) => f.startsWith(name) && f.endsWith('.ttf'))
  if (!hit) throw new Error(`font not found in assets/fonts: ${name}`)
  return hit
}

// [output, source svg, width, height, transparent]
const TARGETS = [
  ['icon.png', 'icon.svg', 1024, 1024, false],
  ['play-icon.png', 'icon.svg', 512, 512, false],
  ['favicon.png', 'icon.svg', 48, 48, false],
  ['android-icon-foreground.png', 'adaptive-foreground.svg', 1024, 1024, true],
  ['android-icon-monochrome.png', 'monochrome.svg', 1024, 1024, true],
  ['splash-icon.png', 'splash-wordmark.svg', 1280, 512, true],
]

const TYPES = { '.ttf': 'font/ttf' }
const TITAN = fontFile('titan-one')
const shells = new Map()
for (const [, src, w, h] of TARGETS) {
  const svg = readFileSync(join(SOURCES, src), 'utf8')
  shells.set(
    `${src}@${w}x${h}`,
    `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:TitanOne;src:url('/fonts/${TITAN}')}
html,body{margin:0;padding:0;overflow:hidden}
svg{display:block;width:${w}px;height:${h}px}
</style>${svg}`,
  )
}

const server = createServer((req, res) => {
  const key = req.url.slice(1)
  if (shells.has(key))
    return res.writeHead(200, { 'content-type': 'text/html' }).end(shells.get(key))
  if (key.startsWith('fonts/')) {
    try {
      const buf = readFileSync(join(FONTS, decodeURIComponent(key.slice(6))))
      return res
        .writeHead(200, { 'content-type': TYPES[extname(key)] ?? 'application/octet-stream' })
        .end(buf)
    } catch {
      /* fall through */
    }
  }
  res.writeHead(404).end()
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})
let failed = false
for (const [out, src, w, h, transparent] of TARGETS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(`http://127.0.0.1:${port}/${src}@${w}x${h}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  if (!(await page.evaluate(() => document.fonts.check('400 100px TitanOne')))) {
    console.error(`FAIL ${out}: TitanOne did not load`)
    failed = true
  }
  await page.waitForTimeout(50)
  await page.screenshot({ path: join(OUT, out), omitBackground: transparent })
  await page.close()
  const kb = (statSync(join(OUT, out)).size / 1024).toFixed(1)
  console.log(`wrote ${out}  ${w}x${h}  ${kb} KB${transparent ? '  (transparent)' : ''}`)
}
await browser.close()
server.close()
if (failed) process.exit(1)
console.log('done: 6 assets in assets/images/')
