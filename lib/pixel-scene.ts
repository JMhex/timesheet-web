// lib/pixel-scene.ts
// Pure canvas drawing for the login page: a static wizard-tower scene and a
// pipe-smoking wizard whose smoke rises as random numbers (1–12).

type Ctx = CanvasRenderingContext2D

const rect = (ctx: Ctx, x: number, y: number, w: number, h: number, c: string) => {
  ctx.fillStyle = c
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

// Deterministic random, so the stars and trees land in the same place on every load.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

/* ------------------------------------------------------------------ */
/*  Wizard-tower scene                                                 */
/* ------------------------------------------------------------------ */

export const SCENE_W = 320
export const SCENE_H = 180

// Bresenham line, so clock hands stay pixel-perfect
const line = (ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string) => {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1)
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1
  let err = dx + dy
  while (true) {
    rect(ctx, x0, y0, 1, 1, c)
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 >= dy) { err += dy; x0 += sx }
    if (e2 <= dx) { err += dx; y0 += sy }
  }
}

// The moon doubles as a clock showing the viewer's local time
function drawMoonClock(ctx: Ctx, now: Date) {
  const mx = 100, my = 30, mr = 13

  // Face
  for (let dy = -mr; dy <= mr; dy++)
    for (let dx = -mr; dx <= mr; dx++)
      if (dx * dx + dy * dy <= mr * mr + mr) rect(ctx, mx + dx, my + dy, 1, 1, "#f3ead0")
  // Faint craters, kept away from the centre
  rect(ctx, mx - 8, my - 6, 2, 2, "#e4dabd")
  rect(ctx, mx + 6, my + 6, 3, 2, "#e4dabd")
  rect(ctx, mx - 7, my + 7, 2, 1, "#e4dabd")

  // Hour marks: 12 / 3 / 6 / 9 are longer
  for (let h = 0; h < 12; h++) {
    const a = (h / 12) * Math.PI * 2 - Math.PI / 2
    const outer = mr - 1
    const inner = h % 3 === 0 ? mr - 3 : mr - 1
    line(ctx, mx + Math.cos(a) * inner, my + Math.sin(a) * inner,
              mx + Math.cos(a) * outer, my + Math.sin(a) * outer, "#8a7a5a")
  }

  const s = now.getSeconds()
  const m = now.getMinutes() + s / 60
  const h = (now.getHours() % 12) + m / 60
  const hand = (turns: number, len: number, c: string) => {
    const a = turns * Math.PI * 2 - Math.PI / 2
    line(ctx, mx, my, mx + Math.cos(a) * len, my + Math.sin(a) * len, c)
  }
  hand(h / 12, 6, "#3b2a55")
  hand(m / 60, 9, "#3b2a55")
  hand(s / 60, 10, "#c0392b") // jumps once per second
  rect(ctx, mx, my, 1, 1, "#c9a227")
}

export function drawCastleScene(ctx: Ctx, now: Date = new Date()) {
  const W = SCENE_W
  const H = SCENE_H
  const rand = seeded(7)

  // Dusk sky in banded steps
  const sky = ["#140c2b", "#1b1038", "#241546", "#301a55", "#43215f", "#5c2a66", "#7a3567", "#9a4664"]
  const bandH = 130 / sky.length
  sky.forEach((c, i) => rect(ctx, 0, Math.floor(i * bandH), W, Math.ceil(bandH) + 1, c))
  rect(ctx, 0, 130, W, H - 130, sky[sky.length - 1])

  // Stars
  for (let i = 0; i < 90; i++) {
    const x = Math.floor(rand() * W)
    const y = Math.floor(rand() * 70)
    rect(ctx, x, y, 1, 1, rand() > 0.8 ? "#ffffff" : "#b9b2e6")
  }
  // A couple of cross-shaped bright stars
  for (const [x, y] of [[40, 18], [150, 10], [300, 50]]) {
    rect(ctx, x, y - 1, 1, 3, "#fff6d8")
    rect(ctx, x - 1, y, 3, 1, "#fff6d8")
  }

  drawMoonClock(ctx, now)

  // Distant mountain range
  for (let x = 0; x < W; x++) {
    const h = 104 - Math.abs(Math.sin(x / 23) * 18) - Math.abs(Math.sin(x / 9 + 1) * 6)
    rect(ctx, x, Math.floor(h), 1, H, "#2b1e4d")
    // snow caps
    if (h < 86) rect(ctx, x, Math.floor(h), 1, 2, "#8a7fb8")
  }
  for (let x = 0; x < W; x++) {
    const h = 116 - Math.abs(Math.sin(x / 31 + 2) * 12)
    rect(ctx, x, Math.floor(h), 1, H, "#221a40")
  }

  // Hill the tower sits on
  const hillTop = (x: number) => 126 + Math.pow((x - 236) / 70, 2) * 22
  for (let x = 0; x < W; x++) rect(ctx, x, Math.floor(hillTop(x)), 1, H, "#1f2c45")

  drawWizardTower(ctx)

  // Foreground hills (darker), lower-left is where the wizard stands
  for (let x = 0; x < W; x++) {
    const h = 150 + Math.sin(x / 40) * 8 + Math.sin(x / 13) * 2
    rect(ctx, x, Math.floor(h), 1, H, "#18301f")
    rect(ctx, x, Math.floor(h), 1, 1, "#2a4a2c")
  }
  rect(ctx, 0, 168, W, H - 168, "#10221a")

  // Pine trees
  const pine = (x: number, base: number, size: number, c: string) => {
    for (let i = 0; i < size; i++) {
      const w = Math.floor(((i % Math.ceil(size / 3)) + 1 + i / 3))
      rect(ctx, x - w, base - size + i, w * 2 + 1, 1, c)
    }
    rect(ctx, x, base, 1, 3, "#0b1510")
  }
  for (let i = 0; i < 18; i++) {
    const x = Math.floor(rand() * W)
    if (x > 200 && x < 275) continue // keep the tower clear
    pine(x, 150 + Math.floor(rand() * 10), 10 + Math.floor(rand() * 8), "#0f2218")
  }
  for (const x of [8, 22, 300, 312]) pine(x, 172, 22, "#0b1912")

  // Fireflies
  for (let i = 0; i < 14; i++) {
    rect(ctx, Math.floor(rand() * W), 140 + Math.floor(rand() * 35), 1, 1, "#e9f27a")
  }
}

function drawWizardTower(ctx: Ctx) {
  const stone = "#3d3566"
  const light = "#544b8e"
  const dark = "#2a244c"
  const mortar = "#332c5a"
  const roof = "#4b2a86"
  const roofLight = "#6a44b0"
  const roofDark = "#341d63"
  const glow = "#8ff0ff"
  const warm = "#ffcf5a"
  const gold = "#f2c94c"

  const CX = 236 // tower centre line

  // Main shaft: slightly tapered, with brick courses
  const shaftTop = 66, shaftBase = 128
  for (let y = shaftTop; y < shaftBase; y++) {
    const half = Math.round(10 + ((y - shaftTop) / (shaftBase - shaftTop)) * 4)
    rect(ctx, CX - half, y, half * 2, 1, stone)
    rect(ctx, CX - half, y, 2, 1, light)
    rect(ctx, CX + half - 3, y, 3, 1, dark)
    if (y % 5 === 0) rect(ctx, CX - half + 2, y, half * 2 - 5, 1, mortar)
    if (y % 5 !== 0) {
      const off = Math.floor(y / 5) % 2 === 0 ? 0 : 3
      for (let x = CX - half + 4 + off; x < CX + half - 4; x += 6) rect(ctx, x, y, 1, 1, mortar)
    }
  }

  // Side turret clinging to the shaft
  rect(ctx, CX + 12, 92, 8, 26, stone)
  rect(ctx, CX + 18, 92, 2, 26, dark)
  for (let i = 0; i <= 10; i++) {
    const w = Math.round((i / 10) * 5)
    rect(ctx, CX + 16 - w, 82 + i, w * 2 + 1, 1, i < 2 ? roofLight : roof)
  }
  rect(ctx, CX + 15, 100, 2, 3, warm)

  // Balcony ring with corbels
  rect(ctx, CX - 15, 62, 30, 4, dark)
  rect(ctx, CX - 15, 62, 30, 1, light)
  for (let x = CX - 13; x < CX + 13; x += 4) rect(ctx, x, 66, 2, 3, dark)
  for (let x = CX - 15; x <= CX + 14; x += 3) rect(ctx, x, 59, 1, 3, light) // railing posts
  rect(ctx, CX - 15, 58, 30, 1, light)

  // Upper chamber (overhangs the shaft)
  rect(ctx, CX - 12, 38, 24, 21, stone)
  rect(ctx, CX - 12, 38, 2, 21, light)
  rect(ctx, CX + 9, 38, 3, 21, dark)
  // Round glowing window
  const wx = CX, wy = 47
  for (let dy = -4; dy <= 4; dy++)
    for (let dx = -4; dx <= 4; dx++)
      if (dx * dx + dy * dy <= 18) rect(ctx, wx + dx, wy + dy, 1, 1, dx * dx + dy * dy <= 6 ? "#e6fdff" : glow)
  rect(ctx, wx, wy - 4, 1, 9, dark)
  rect(ctx, wx - 4, wy, 9, 1, dark)

  // Crooked pointed roof, tip bending right
  const roofBase = 38, roofH = 28
  for (let i = 0; i <= roofH; i++) {
    const t = i / roofH // 0 at tip, 1 at base
    const half = Math.round(t * 16)
    const bend = Math.round(Math.pow(1 - t, 2.2) * 10)
    const x0 = CX - half + bend
    const y = roofBase - roofH + i
    rect(ctx, x0, y, half * 2 + 1, 1, roof)
    rect(ctx, x0, y, Math.max(1, Math.floor(half / 3)), 1, roofLight)
    rect(ctx, x0 + half * 2 - Math.floor(half / 4), y, Math.max(1, Math.floor(half / 4)), 1, roofDark)
  }
  // Roof trim
  rect(ctx, CX - 17, roofBase, 35, 2, roofDark)
  // Little stars painted on the roof
  for (const [x, y] of [[CX - 6, 26], [CX + 4, 31], [CX + 1, 18]]) rect(ctx, x, y, 1, 1, gold)

  // Crescent-moon finial on the bent tip
  const fx = CX + 10, fy = 5
  rect(ctx, fx, fy + 2, 1, 3, gold)
  rect(ctx, fx - 1, fy, 3, 1, gold)
  rect(ctx, fx - 2, fy - 2, 1, 2, gold)
  rect(ctx, fx + 2, fy - 2, 1, 2, gold)

  // Spiral of lit windows up the shaft
  for (const [x, y] of [[-6, 74], [3, 86], [-4, 98], [5, 108]]) {
    rect(ctx, CX + x, y + 1, 3, 4, warm)
    rect(ctx, CX + x + 1, y, 1, 1, warm)
  }

  // Arched door and steps
  rect(ctx, CX - 4, 116, 8, 12, "#1a1030")
  rect(ctx, CX - 3, 115, 6, 1, "#1a1030")
  rect(ctx, CX + 2, 122, 1, 1, gold)
  rect(ctx, CX - 6, 128, 12, 1, light)
  rect(ctx, CX - 8, 129, 16, 1, stone)

  // Magic sparkles around the top
  for (const [x, y] of [[CX - 20, 30], [CX + 20, 22], [CX - 16, 12], [CX + 24, 44], [CX - 24, 50]]) {
    rect(ctx, x, y, 1, 1, glow)
    rect(ctx, x - 1, y, 1, 1, "#4fb8c8")
    rect(ctx, x + 1, y, 1, 1, "#4fb8c8")
    rect(ctx, x, y - 1, 1, 1, "#4fb8c8")
    rect(ctx, x, y + 1, 1, 1, "#4fb8c8")
  }
}

/* ------------------------------------------------------------------ */
/*  Wizard with number smoke                                           */
/* ------------------------------------------------------------------ */

export const WIZ_W = 48
export const WIZ_H = 72

// 22 x 29 sprite. "." = transparent.
const WIZARD = [
  ".........HH...........",
  "........HHH...........",
  "........HHHH..........",
  ".......HHhHH..........",
  ".......HHhHHH.........",
  "......HHHhHSH.........",
  "......HHhHHHHH........",
  ".....HHHhHHHHH........",
  ".....HHhHHHHSHH.......",
  "....HHHhHHHHHHHH......",
  "..BBBBBBBBBBBBBBBB....",
  "......wFFFFFFF........",
  "......FFFFEFFF....pOp.",
  "......FFFFFFFFF...ppp.",
  ".....WWWWWWWWPPPPPppp.",
  ".....WWWWWWWWWW.......",
  "....RWWWWWWWWWWR......",
  "...RRRWWWWWWWWRRR.....",
  "..RRRRRWWWWWWRRRR.....",
  "..RRRRRRWWWWRRRRR.....",
  "..RRRRRRRWWRRRRRR.....",
  "..KKKKKKKKKKKKKKK.....",
  "..RRRRRRRSRRRRRRR.....",
  ".rRRRRRRRRRRRRRRRr....",
  ".rRRRRRRRRRRRRRRRr....",
  "rrRRRRRRRRRRRRRRRrr...",
  "rrRRRRRRRRRRRRRRRrr...",
  "rrrrrrrrrrrrrrrrrrr...",
  "...DDDD.....DDDD......",
]

const PALETTE: Record<string, string> = {
  H: "#3b2a7a", // hat
  h: "#5440a8", // hat highlight
  S: "#f2c94c", // stars / buckle
  B: "#2a1d5c", // brim
  F: "#f0c39b", // face
  w: "#d6d6e0", // hair
  E: "#1a1a2e", // eye
  W: "#eeeef5", // beard
  P: "#7a4a26", // pipe stem
  p: "#5a3418", // pipe bowl
  O: "#ff8a2a", // ember
  R: "#2f4fa8", // robe
  r: "#22397a", // robe shadow
  K: "#5a3418", // belt
  D: "#2a1a10", // boots
}

const SPRITE_X = 0
const SPRITE_Y = WIZ_H - WIZARD.length
// Top of the pipe bowl, where smoke starts
const PIPE_X = SPRITE_X + 19
const PIPE_Y = SPRITE_Y + 11

// 3 x 5 pixel digits
const DIGITS: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "001", "001", "001"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
}

function drawNumber(ctx: Ctx, n: number, x: number, y: number) {
  const s = String(n)
  s.split("").forEach((d, i) => {
    DIGITS[d].forEach((row, ry) => {
      for (let rx = 0; rx < 3; rx++) {
        if (row[rx] === "1") rect(ctx, x + i * 4 + rx, y + ry, 1, 1, "#e8e4f4")
      }
    })
  })
}

function drawWizard(ctx: Ctx) {
  WIZARD.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = PALETTE[row[x]]
      if (c) rect(ctx, SPRITE_X + x, SPRITE_Y + y, 1, 1, c)
    }
  })
}

type Puff = { n: number; born: number; drift: number }

// Starts the smoke animation. Returns a function that stops it.
export function startWizard(ctx: Ctx, reducedMotion = false): () => void {
  const puffs: Puff[] = []
  const LIFE = 4200 // ms a number stays visible
  const EVERY = 1100 // ms between puffs
  let lastPuff = -Infinity
  let raf = 0

  const frame = (now: number) => {
    ctx.clearRect(0, 0, WIZ_W, WIZ_H)
    drawWizard(ctx)

    if (now - lastPuff > EVERY) {
      puffs.push({ n: 1 + Math.floor(Math.random() * 12), born: now, drift: Math.random() * 6 - 1 })
      lastPuff = now
    }
    while (puffs.length && now - puffs[0].born > LIFE) puffs.shift()

    for (const p of puffs) {
      const t = (now - p.born) / LIFE // 0 → 1
      const y = PIPE_Y - 6 - t * (PIPE_Y - 4)
      const x = PIPE_X - 2 + t * (8 + p.drift) + Math.sin(t * 6 + p.n) * 2
      // Stepped fade keeps the pixel-art look
      ctx.globalAlpha = t < 0.1 ? 0.5 : t > 0.75 ? Math.round((1 - t) * 8) / 2 : 1
      drawNumber(ctx, p.n, x, y)
      ctx.globalAlpha = 1
    }

    if (!reducedMotion) raf = requestAnimationFrame(frame)
  }

  if (reducedMotion) {
    // One still frame with a single number above the pipe
    ctx.clearRect(0, 0, WIZ_W, WIZ_H)
    drawWizard(ctx)
    drawNumber(ctx, 12, PIPE_X - 2, PIPE_Y - 14)
    return () => {}
  }

  raf = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(raf)
}

// Exposed for tests / debugging
export const _sprite = WIZARD
