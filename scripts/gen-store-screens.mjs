/**
 * Renders the App Store screenshots from the web export — the same
 * headless-Chromium rig as gen-icons.mjs (Node http server + playwright-core +
 * system Chromium), pointed at the real app instead of an SVG shell.
 *
 * Targets Apple's required sets exactly:
 *   iPhone Dynamic Island medium: 393x852 CSS px @ deviceScaleFactor 3 -> 1179x2556
 *   iPad 13":                    1032x1376 CSS px @ deviceScaleFactor 2 -> 2064x2752
 *
 * Prerequisite: a current web export in dist/ (pnpm exec expo export -p web).
 * Scenes are driven through the real UI (taps, spins) with storage seeded via
 * init scripts, so every shot is the app as a player sees it.
 */
import { mkdir, readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const DIST = 'dist'
const OUT = 'assets/store-listing/ios'
const CHROMIUM = '/usr/bin/chromium-browser' // same binary the web tests use

/** deviceScaleFactor does the heavy lifting: CSS viewport x scale = exact Apple pixels */
const DEVICES = [
  { name: 'iphone', width: 393, height: 852, scale: 3 },
  { name: 'ipad', width: 1032, height: 1376, scale: 2 },
]

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.wasm': 'application/wasm',
}

/** Serves the static export; SPA fallback maps /game -> game.html. */
function serveDist(root) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
      let file = normalize(join(root, urlPath))
      if (urlPath.endsWith('/')) file = join(file, 'index.html')
      let data
      try {
        data = await readFile(file)
      } catch {
        data = await readFile(`${file}.html`) // static-export route fallback
      }
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end('not found')
    }
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

/** Storage the app reads on boot (GameState keys; values exactly as persisted). */
const seed = { lang: 'en', timerEnabled: true, timerSeconds: 20 }

async function newPage(browser, device, seedStorage) {
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    deviceScaleFactor: device.scale,
  })
  if (seedStorage) {
    await context.addInitScript(
      ([s]) => {
        localStorage.setItem('tf.lang', s.lang)
        localStorage.setItem('tf.timer.enabled', String(s.timerEnabled))
        localStorage.setItem('tf.timer.seconds', String(s.timerSeconds))
      },
      [seed],
    )
  }
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400) // settle animations
  return { context, page }
}

const shot = (page, name) => page.screenshot({ path: join(OUT, name) })

/** Fresh round: category card + pristine wheel ("Tap the wheel!" hint). */
async function sceneRound(browser, device) {
  const { context, page } = await newPage(browser, device, true)
  await page.getByText('SPIN').waitFor({ timeout: 10_000 }) // wheel hub = game screen is live
  await page.waitForTimeout(600)
  await shot(page, `${device.name}-02-round.png`)
  return { context, page }
}

export async function generate() {
  await stat(join(DIST, 'index.html')) // fail loudly if the export is missing
  await mkdir(OUT, { recursive: true })

  const server = await serveDist(DIST)
  const { port } = server.address()
  BASE = `http://127.0.0.1:${port}`

  const browser = await chromium.launch({ executablePath: CHROMIUM })

  try {
    for (const device of DEVICES) {
      // 1 — language screen (no storage seeded)
      {
        const { context, page } = await newPage(browser, device, false)
        await page.getByText('English').waitFor({ timeout: 10_000 })
        await shot(page, `${device.name}-01-language.png`)
        await context.close()
      }

      // 2 — fresh round, then 3 — mid-spin on the same page
      {
        const { context, page } = await sceneRound(browser, device)
        await page.getByLabel('SPIN').click()
        await page.waitForTimeout(1600) // mid-deceleration
        await shot(page, `${device.name}-03-spinning.png`)
        await page.waitForTimeout(4200) // spin (~4s) + spring settle; timer runs on landing
        await shot(page, `${device.name}-04-landed.png`)
        await context.close()
      }

      // 5 — settings (gear from the game header)
      {
        const { context, page } = await newPage(browser, device, true)
        await page.getByText('SPIN').waitFor({ timeout: 10_000 })
        await page.getByLabel('Settings').click()
        await page.getByText('Kids mode').waitFor({ timeout: 10_000 })
        await page.waitForTimeout(400)
        await shot(page, `${device.name}-05-settings.png`)
        await context.close()
      }
      console.log(`${device.name}: 5 screenshots -> ${OUT}`)
    }
  } finally {
    await browser.close()
    server.close()
  }
}

let BASE = '' // set in generate() once the server is up

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
