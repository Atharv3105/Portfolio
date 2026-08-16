import { useState, useEffect, useRef, useCallback } from "react"
import * as THREE from "three"

// ─── Data ──────────────────────────────────────────────────────────────────

const TYPED_ROLES = [
  "MERN Stack Engineer",
  "Backend Architect",
  "TypeScript Developer",
  "DSA Problem Solver",
]

interface SkillBar { name: string; pct: number }
const SKILL_BARS: SkillBar[] = [
  { name: "React / Next.js", pct: 90 },
  { name: "Node.js / Express", pct: 88 },
  { name: "Java / TypeScript", pct: 85 },
  { name: "MongoDB / MySQL", pct: 82 },
  { name: "Docker / Microservices", pct: 75 },
  { name: "Python / FastAPI", pct: 78 },
]

const SKILL_TAGS = [
  "JavaScript (ES6+)", "TypeScript", "Java", "Python", "C++", "SQL",
  "React.js", "Next.js", "Node.js", "Express.js", "FastAPI", "Socket.io",
  "MongoDB", "MySQL", "Redis", "Docker", "Git", "Vite",
  "Groq API", "Gemini AI", "FAISS", "WebSockets", "REST APIs",
]

interface Project {
  title: string
  sub: string
  desc: string
  stack: string[]
  impact: string
  link?: string
  color: string
}

const PROJECTS: Project[] = [
  {
    title: "Communaudle-Pulse",
    sub: "Live Event Platform",
    desc: "Scaled to 10,000+ concurrent attendees. AI-generated quizzes with instant grading. WebSocket state via Zustand delivering 60fps leaderboard animations every 3 seconds.",
    stack: ["Next.js", "TypeScript", "Redis", "WebSocket", "Zustand"],
    impact: "10,000+ concurrent users · 100% moderation reduction",
    color: "#7c3aed",
  },
  {
    title: "Intelligent Code Review",
    sub: "AI Platform",
    desc: "Microservices with Node.js API gateway + FastAPI workers. FAISS plagiarism detection over 500K+ submissions. Groq LLM integration for automated senior-level reviews.",
    stack: ["React", "Node.js", "FastAPI", "Docker", "Groq", "FAISS"],
    impact: "50+ concurrent submissions · 60% review time saved",
    link: "https://intelligent-code-review-frontend.vercel.app",
    color: "#34bfff",
  },
  {
    title: "HajeriApp",
    sub: "AI Attendance System",
    desc: "128-D facial embedding matching across 3 role-based portals. Reduced attendance time from 20 minutes to 60 seconds. Offline-first React Native app with 15+ screens.",
    stack: ["React Native", "Node.js", "FaceAPI.js", "TensorFlow.js", "PostgreSQL"],
    impact: "80% faster attendance · 128-D face embeddings",
    color: "#22c55e",
  },
  {
    title: "Doctor Appointment",
    sub: "MyERN Stack",
    desc: "Automated medical scheduling for 300+ daily slots. Gemini AI navigation cut search-to-booking time by 20%. MySQL algorithm with zero double-booking conflicts.",
    stack: ["MongoDB", "Express.js", "React", "Node.js", "MySQL", "Gemini AI"],
    impact: "300+ daily slots · 100% conflict elimination",
    color: "#FF923E",
  },
  {
    title: "Full-Stack Job Board",
    sub: "MERN · Multer",
    desc: "200+ test-user staging with 5-stage candidate pipeline. 99.5% uptime on decoupled Vite + React / REST API deployment. Non-blocking emails reduced API latency by 35%.",
    stack: ["MongoDB", "Express", "React", "Node.js", "Multer", "Netlify"],
    impact: "99.5% uptime · 95% fewer invalid errors",
    link: "https://jobboard-app.netlify.app",
    color: "#f59e0b",
  },
]

interface AchievementItem {
  id: string
  icon: string
  year: string
  title: string
  event: string
  category: "Hackathon" | "Global Challenge" | "Hiring Hackathon"
  status: string
  statusColor: string
  tagline: string
  desc: string
  highlights: string[]
  techStack: string[]
  link?: string
  badge?: string
}

const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "sih-2025",
    icon: "🏆",
    year: "2025",
    title: "Smart India Hackathon (SIH 2025)",
    event: "Ministry of Education & JNEC",
    category: "Hackathon",
    status: "National Nominee",
    statusColor: "#FF923E",
    tagline: "Gamified Rural Education Platform (SIH25048)",
    desc: "Nominated to represent JNEC nationally among thousands of team entries. Engineered an offline-first gamified learning prototype tailored for rural school education.",
    highlights: [
      "Selected at Institutional Level to represent JNEC Nationally",
      "Gamified Learning Modules for low-bandwidth environments",
      "Interactive Quiz Engine & Progress Tracking Architecture",
    ],
    techStack: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
  },
  {
    id: "adobe-2025",
    icon: "🎯",
    year: "2025",
    title: "Adobe India Hackathon",
    event: "Adobe Systems India",
    category: "Hiring Hackathon",
    status: "National Contestant",
    statusColor: "#FF3366",
    tagline: "National Engineering & Hiring Challenge",
    desc: "Participated in the National Level hiring Hackathon hosted by Adobe India, solving complex algorithmic challenges and building high-performance web components.",
    highlights: [
      "Nationwide Competitive Coding Benchmark",
      "Algorithmic Data Optimization & High-throughput UI",
      "Built under strict time-bounded hackathon constraints",
    ],
    techStack: ["Java", "Data Structures", "React", "REST APIs"],
  },
  {
    id: "vit-2026",
    icon: "⚡",
    year: "2026",
    title: "VIT Code Apex 2026",
    event: "VIT University National Contest",
    category: "Hackathon",
    status: "Semi-Finalist",
    statusColor: "#00E5FF",
    tagline: "Commudle-Pulse Live Event Platform",
    desc: "Qualified as Semi-Finalist by engineering 'Commudle-Pulse', a real-time event analytics and interactive audience engagement platform constructed ground-up live during the competition.",
    highlights: [
      "Semi-Finalist Top 5% ranking position",
      "Real-time WebSocket Live Polls & Q&A Stream",
      "Live Audience Engagement Engine & Host Control Dashboard",
    ],
    techStack: ["React", "WebSockets", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    id: "google-2026",
    icon: "🌍",
    year: "2026",
    title: "Google Solutions Challenge",
    event: "Google Developer Student Clubs",
    category: "Global Challenge",
    status: "Project Shipped",
    statusColor: "#10B981",
    tagline: "ReliefSync — NGO Smart Resource Allocation",
    desc: "Developed ReliefSync, an AI-assisted smart resource distribution prototype empowering NGOs during emergency relief, directly aligned with UN Sustainable Development Goals.",
    highlights: [
      "Smart NGO Resource Allocation Matching Engine",
      "Interactive Real-Time Map & Supply Chain Tracker",
      "Live Deployed Firebase & React Web Application",
    ],
    techStack: ["React", "Firebase", "Tailwind CSS", "Google Maps API"],
    link: "https://reliefsynnc.web.app",
    badge: "Live Prototype",
  },
]

// ─── Hooks ─────────────────────────────────────────────────────────────────

function useTypewriter(words: string[], speed = 70, pause = 2000) {
  const [display, setDisplay] = useState("")
  const wordIdx = useRef(0)
  const charIdx = useRef(0)
  const deleting = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function tick() {
      const word = words[wordIdx.current]
      if (!deleting.current && charIdx.current < word.length) {
        charIdx.current++
        setDisplay(word.slice(0, charIdx.current))
        timer.current = setTimeout(tick, speed)
      } else if (!deleting.current) {
        deleting.current = true
        timer.current = setTimeout(tick, pause)
      } else if (deleting.current && charIdx.current > 0) {
        charIdx.current--
        setDisplay(word.slice(0, charIdx.current))
        timer.current = setTimeout(tick, speed / 2)
      } else {
        deleting.current = false
        wordIdx.current = (wordIdx.current + 1) % words.length
        timer.current = setTimeout(tick, 200)
      }
    }
    timer.current = setTimeout(tick, 800)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [])

  return display
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible] as const
}

// ─── Custom Cursor ─────────────────────────────────────────────────────────

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener("mousemove", onMove)

    let frame: number
    function loop() {
      frame = requestAnimationFrame(loop)
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.1
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`
        ringRef.current.style.top = `${ringPos.current.y}px`
      }
    }
    loop()

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

// ─── Three.js Canvas ────────────────────────────────────────────────────────

// ─── Code lines shown on the terminal screen ───────────────────────────────
const TERMINAL_CODE = [
  "import express, { Request, Response } from 'express';",
  "import { Server } from 'socket.io';",
  "import Redis from 'ioredis';",
  "",
  "const app = express();",
  "const redis = new Redis({ host: 'localhost' });",
  "",
  "// WebSocket real-time event handler",
  "io.on('connection', (socket) => {",
  "  socket.on('submit:code', async (payload) => {",
  "    const { code, language, roomId } = payload;",
  "    const jobId = await queue.add({ code, language });",
  "    socket.emit('job:queued', { jobId });",
  "  });",
  "});",
  "",
  "// Docker sandbox execution",
  "async function runSandbox(code: string, lang: string) {",
  "  const container = await docker.createContainer({",
  "    Image: `runner-${lang}:alpine`,",
  "    HostConfig: { Memory: 64 * 1024 * 1024 },",
  "  });",
  "  await container.start();",
  "  return container.id;",
  "}",
  "",
  "// FAISS similarity search (500K+ vectors)",
  "const index = new faiss.IndexFlatIP(384);",
  "const { distances, labels } = index.search(vec, 5);",
  "",
  "// Redis cache with TTL",
  "async function getOrCache<T>(key: string, fn: () => Promise<T>) {",
  "  const hit = await redis.get(key);",
  "  if (hit) return JSON.parse(hit) as T;",
  "  const data = await fn();",
  "  await redis.setex(key, 3600, JSON.stringify(data));",
  "  return data;",
  "}",
  "",
  "// React component with live leaderboard",
  "const Leaderboard: React.FC = () => {",
  "  const [scores, setScores] = useState<Score[]>([]);",
  "",
  "  useEffect(() => {",
  "    socket.on('leaderboard:update', setScores);",
  "    return () => void socket.off('leaderboard:update');",
  "  }, []);",
  "",
  "  return <ScoreList data={scores} />;",
  "};",
  "",
  "// 128-D face embedding matcher",
  "async function matchFace(embedding: Float32Array) {",
  "  const result = await model.findNearest({",
  "    vector: embedding,",
  "    dimensions: 128,",
  "    threshold: 0.6,",
  "  });",
  "  return result.userId;",
  "}",
  "",
  "// MySQL slot scheduling — zero conflicts",
  "const slots = await db.query(",
  "  `SELECT * FROM appointments",
  "   WHERE doctor_id = ? AND date = ?",
  "   FOR UPDATE`,",
  "  [doctorId, date]",
  ");",
]

type Seg = { text: string; color: string }

function tokenizeLine(line: string): Seg[] {
  if (!line.trim()) return []
  const KEYWORDS = new Set([
    "const","let","var","async","await","import","from","export","default",
    "function","class","return","new","type","interface","extends","implements",
    "if","else","for","while","of","in","true","false","null","undefined","void",
    "this","super","Promise","string","number","boolean","SELECT","WHERE","FROM",
    "UPDATE","AND",
  ])
  const result: Seg[] = []
  // Full-line comment
  if (line.trim().startsWith("//")) {
    const idx = line.indexOf("//")
    if (idx > 0) result.push({ text: line.slice(0, idx), color: "" })
    result.push({ text: line.slice(idx), color: "#4a7c59" })
    return result
  }
  let i = 0
  while (i < line.length) {
    const ch = line[i]
    // String / template literal
    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1
      while (j < line.length && line[j] !== ch) {
        if (line[j] === "\\" ) j++
        j++
      }
      result.push({ text: line.slice(i, j + 1), color: "#FF923E" })
      i = j + 1
      continue
    }
    // Word (identifier / keyword)
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i + 1
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++
      const word = line.slice(i, j)
      let color: string
      if (KEYWORDS.has(word)) color = "#34bfff"
      else if (/^[A-Z]/.test(word)) color = "#7dd3fc"
      else if (j < line.length && line[j] === "(") color = "#ffe082"
      else color = "#d4e8f0"
      result.push({ text: word, color })
      i = j
      continue
    }
    // Number
    if (/[0-9]/.test(ch)) {
      let j = i + 1
      while (j < line.length && /[0-9.]/.test(line[j])) j++
      result.push({ text: line.slice(i, j), color: "#c792ea" })
      i = j
      continue
    }
    // Punctuation / operator
    result.push({ text: ch, color: "#5a7a94" })
    i++
  }
  return result
}

const TOKENIZED_CODE = TERMINAL_CODE.map(tokenizeLine)

function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // ── Scene ────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x04091f)
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 7
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // ── Star field ───────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(3500 * 3)
    for (let i = 0; i < 3500 * 3; i++) starPos[i] = (Math.random() - 0.5) * 50
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3))
    const stars = new THREE.Points(starGeo,
      new THREE.PointsMaterial({ color: 0x34bfff, size: 0.016, transparent: true, opacity: 0.45 }))
    scene.add(stars)

    // ── Canvas texture for the terminal screen ───────────────────
    const CW = 960, CH = 560
    const codeCvs = document.createElement("canvas")
    codeCvs.width = CW
    codeCvs.height = CH
    const ctx = codeCvs.getContext("2d")!
    const FONT_SZ = 12
    const LINE_H = 20

    let scrollOff = 0
    let tick = 0

    function drawCode() {
      // Background
      ctx.fillStyle = "#060f1e"
      ctx.fillRect(0, 0, CW, CH)

      // Line-number gutter background
      ctx.fillStyle = "#040c18"
      ctx.fillRect(0, 0, 50, CH)

      ctx.font = `${FONT_SZ}px "Courier New", monospace`
      ctx.textBaseline = "top"

      const startLine = Math.floor(scrollOff / LINE_H)
      const yOff = scrollOff % LINE_H
      const visible = Math.ceil(CH / LINE_H) + 2

      for (let i = 0; i < visible; i++) {
        const li = (startLine + i) % TERMINAL_CODE.length
        const y = i * LINE_H - yOff + 4

        // Line number
        ctx.fillStyle = "#2a3f55"
        ctx.fillText(String(li + 1).padStart(3, " "), 6, y)

        // Code segments
        let x = 58
        for (const seg of TOKENIZED_CODE[li]) {
          if (!seg.color) {
            x += ctx.measureText(seg.text).width
            continue
          }
          ctx.fillStyle = seg.color
          ctx.fillText(seg.text, x, y)
          x += ctx.measureText(seg.text).width
        }
      }

      // Blinking cursor on an active-looking line
      if (Math.floor(tick / 28) % 2 === 0) {
        const cursorRow = Math.floor(visible * 0.62)
        const cy = cursorRow * LINE_H - yOff + FONT_SZ + 4
        ctx.fillStyle = "#34bfff"
        ctx.fillRect(58, cy, 7, 2)
      }

      // CRT scanlines
      ctx.fillStyle = "rgba(0,0,0,0.065)"
      for (let sy = 0; sy < CH; sy += 3) ctx.fillRect(0, sy, CW, 1)

      // Gutter separator
      ctx.fillStyle = "rgba(52,191,255,0.12)"
      ctx.fillRect(50, 0, 1, CH)

      // Top fade
      const tg = ctx.createLinearGradient(0, 0, 0, 48)
      tg.addColorStop(0, "rgba(6,15,30,1)")
      tg.addColorStop(1, "rgba(6,15,30,0)")
      ctx.fillStyle = tg
      ctx.fillRect(0, 0, CW, 48)

      // Bottom fade
      const bg2 = ctx.createLinearGradient(0, CH - 48, 0, CH)
      bg2.addColorStop(0, "rgba(6,15,30,0)")
      bg2.addColorStop(1, "rgba(6,15,30,1)")
      ctx.fillStyle = bg2
      ctx.fillRect(0, CH - 48, CW, 48)

      // Vignette
      const vig = ctx.createRadialGradient(CW / 2, CH / 2, CH * 0.28, CW / 2, CH / 2, CH * 0.72)
      vig.addColorStop(0, "rgba(0,0,0,0)")
      vig.addColorStop(1, "rgba(0,0,0,0.38)")
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, CW, CH)
    }

    const codeTex = new THREE.CanvasTexture(codeCvs)
    codeTex.minFilter = THREE.LinearFilter

    // ── Monitor group ────────────────────────────────────────────
    const mon = new THREE.Group()
    mon.position.set(2.5, 0.2, 0)
    mon.rotation.y = -0.28
    scene.add(mon)

    // Screen plane
    const scrMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.65, 2.28),
      new THREE.MeshBasicMaterial({ map: codeTex })
    )
    scrMesh.position.z = 0.072
    mon.add(scrMesh)

    // Screen glow (additive, slightly larger)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x0055aa,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.95, 2.6), glowMat)
    glowMesh.position.z = 0.065
    mon.add(glowMesh)

    // Bezel body
    mon.add(new THREE.Mesh(
      new THREE.BoxGeometry(3.9, 2.55, 0.12),
      new THREE.MeshBasicMaterial({ color: 0x0b1220 })
    ))

    // Bezel glowing edges
    mon.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.9, 2.55, 0.12)),
      new THREE.LineBasicMaterial({ color: 0x34bfff, transparent: true, opacity: 0.2 })
    ))

    // Title bar strip at top of screen
    const barMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.65, 0.16),
      new THREE.MeshBasicMaterial({ color: 0x0d1f35 })
    )
    barMesh.position.set(0, 1.06, 0.075)
    mon.add(barMesh)

    // Three traffic-light dots in the title bar
    const dotColors = [0xff5f56, 0xffbd2e, 0x27c93f]
    dotColors.forEach((c, i) => {
      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(0.04, 12),
        new THREE.MeshBasicMaterial({ color: c })
      )
      dot.position.set(-1.64 + i * 0.14, 1.06, 0.078)
      mon.add(dot)
    })

    // Stand neck
    const neckMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.72, 0.09),
      new THREE.MeshBasicMaterial({ color: 0x0b1220 })
    )
    neckMesh.position.set(0, -1.635, 0)
    mon.add(neckMesh)

    // Stand base
    const baseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.07, 0.42),
      new THREE.MeshBasicMaterial({ color: 0x0b1220 })
    )
    baseMesh.position.set(0, -2.01, 0)
    mon.add(baseMesh)
    const baseEdgeLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.1, 0.07, 0.42)),
      new THREE.LineBasicMaterial({ color: 0x34bfff, transparent: true, opacity: 0.15 })
    )
    baseEdgeLines.position.set(0, -2.01, 0)
    mon.add(baseEdgeLines)

    // Power LED
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), ledMat)
    led.position.set(1.72, -1.14, 0.075)
    mon.add(led)

    // ── Floating code particles around the monitor ───────────────
    const floatPos = new Float32Array(140 * 3)
    for (let i = 0; i < 140; i++) {
      floatPos[i * 3] = (Math.random() - 0.5) * 7
      floatPos[i * 3 + 1] = (Math.random() - 0.5) * 5
      floatPos[i * 3 + 2] = (Math.random() - 0.5) * 2.5 - 0.5
    }
    const floatGeo = new THREE.BufferGeometry()
    floatGeo.setAttribute("position", new THREE.BufferAttribute(floatPos, 3))
    const floatParticles = new THREE.Points(floatGeo,
      new THREE.PointsMaterial({ color: 0x34bfff, size: 0.028, transparent: true, opacity: 0.3 }))
    floatParticles.position.set(2.5, 0, 0)
    scene.add(floatParticles)

    // ── Event listeners ──────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener("mousemove", onMouse)
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    // ── Animation loop ───────────────────────────────────────────
    let frame: number
    let t = 0
    function animate() {
      frame = requestAnimationFrame(animate)
      t += 0.004
      tick++

      // Scroll code texture
      scrollOff += 0.32
      drawCode()
      codeTex.needsUpdate = true

      // Monitor gentle float
      mon.position.y = 0.2 + Math.sin(t * 0.65) * 0.075

      // Mouse-reactive tilt
      mon.rotation.y = -0.28 + mouse.current.x * 0.065
      mon.rotation.x = 0.04 + mouse.current.y * 0.04

      // Screen glow pulse
      glowMat.opacity = 0.045 + Math.sin(t * 1.6) * 0.012

      // LED heartbeat
      ledMat.color.setHex(Math.sin(t * 2.4) > 0.7 ? 0x00ff88 : 0x007744)

      // Camera drift follows mouse
      camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.022
      camera.position.y += (mouse.current.y * 0.22 - camera.position.y) * 0.022
      camera.lookAt(0, 0, 0)

      stars.rotation.y = t * 0.008 + mouse.current.x * 0.022
      stars.rotation.x = mouse.current.y * 0.018

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("mousemove", onMouse)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} />
}

// ─── Navbar ────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Hackathons & Achievements", href: "#achievements" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1.25rem 5vw",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "background 0.3s, border-color 0.3s",
        background: scrolled ? "rgba(4,9,31,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(52,191,255,0.12)" : "1px solid transparent",
      }}>
        <a href="#" style={{
          fontFamily: "'Electrolize', sans-serif",
          fontSize: "1.3rem",
          fontWeight: 400,
          color: "#F5EFE6",
          textDecoration: "none",
          letterSpacing: "0.05em",
        }}>AP</a>

        <div style={{ display: "flex", gap: "2.5rem" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.825rem",
              fontWeight: 400,
              color: "rgba(245,239,230,0.65)",
              textDecoration: "none",
              transition: "color 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#FF923E")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,239,230,0.65)")}
            >{l.label}</a>
          ))}
        </div>

        <a href="mailto:atharvpalekar07@gmail.com" className="btn-primary" style={{ padding: "0.5rem 1.4rem", fontSize: "0.78rem" }}>
          Hire Me
        </a>
      </nav>
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function HeroSection() {
  const role = useTypewriter(TYPED_ROLES)

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      zIndex: 1,
      padding: "0 6vw",
      overflow: "hidden",
    }}>
      {/* Left gradient veil so text is readable over the 3D scene */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(100deg, rgba(4,9,31,0.82) 0%, rgba(4,9,31,0.45) 55%, transparent 100%)",
        zIndex: -1,
      }} />

      <div style={{ maxWidth: 700 }}>
        <p style={{
          fontFamily: "'Electrolize', sans-serif",
          color: "#34bfff",
          fontSize: "0.78rem",
          letterSpacing: "0.25em",
          marginBottom: "1.25rem",
          opacity: 0.9,
        }}>FULL STACK DEVELOPER · MERN · JAVA · TYPESCRIPT</p>

        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(3.2rem, 7.5vw, 6.5rem)",
          fontWeight: 300,
          color: "#F5EFE6",
          lineHeight: 1.05,
          margin: "0 0 0.4rem",
        }}>Hi, I&#39;m Atharv.</h1>

        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(1.4rem, 3vw, 2.6rem)",
          fontWeight: 300,
          color: "rgba(245,239,230,0.55)",
          margin: "0 0 1.5rem",
          lineHeight: 1.3,
        }}>I build systems that scale.</h2>

        <div style={{
          fontFamily: "'Electrolize', sans-serif",
          color: "#34bfff",
          fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
          marginBottom: "2.5rem",
          minHeight: "1.6rem",
          letterSpacing: "0.06em",
        }}>
          &gt;&nbsp;{role}
          <span style={{ borderRight: "2px solid #FF923E", marginLeft: "2px", animation: "blink 1s step-end infinite" }} />
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a href="#contact" className="btn-primary">Get in touch</a>
          <a href="#projects" className="btn-outline">See my work</a>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: "3rem", marginTop: "4rem", flexWrap: "wrap",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(52,191,255,0.15)",
        }}>
          {[
            { n: "450+", l: "GitHub Commits" },
            { n: "200+", l: "LeetCode Solved" },
            { n: "8.62", l: "CGPA" },
            { n: "5", l: "Projects Shipped" },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#F5EFE6", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.65rem", color: "#7c8594", letterSpacing: "0.12em", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2.5rem", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
      }}>
        <div style={{
          width: 24, height: 38,
          border: "2px solid rgba(245,239,230,0.3)",
          borderRadius: 12,
          display: "flex", justifyContent: "center", paddingTop: 5,
        }}>
          <div style={{
            width: 3, height: 8,
            background: "#FF923E",
            borderRadius: 99,
            animation: "float 1.6s ease-in-out infinite",
          }} />
        </div>
        <span style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.6rem", color: "rgba(245,239,230,0.3)", letterSpacing: "0.2em" }}>SCROLL</span>
      </div>
    </section>
  )
}

// ─── About ─────────────────────────────────────────────────────────────────

function AboutSection() {
  const [tab, setTab] = useState<"skills" | "about">("skills")
  const [ref, visible] = useReveal()
  const [barsVisible, setBarsVisible] = useState(false)
  const barsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setBarsVisible(true); obs.disconnect() }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const stats = [
    { label: "Name", value: "Atharv Palekar" },
    { label: "College", value: "JNEC, Sambhajinagar" },
    { label: "Degree", value: "B.Tech CSE + FinTech" },
    { label: "CGPA", value: "8.62 / 10" },
    { label: "Batch", value: "2023 – 2027" },
    { label: "Location", value: "Maharashtra, India" },
  ]

  return (
    <section id="about" style={{
      position: "relative", zIndex: 1,
      minHeight: "100vh",
      background: "rgba(4,9,31,0.96)",
      borderTop: "1px solid rgba(52,191,255,0.1)",
      padding: "7rem 6vw",
    }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "5rem", alignItems: "start" }}>

        {/* Left — personal stats */}
        <div className={`reveal-start${visible ? " is-visible" : ""}`}>
          <p style={{ fontFamily: "'Electrolize', sans-serif", color: "#FF923E", fontSize: "0.7rem", letterSpacing: "0.22em", marginBottom: "0.75rem" }}>WHO I AM</p>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: "#F5EFE6", marginBottom: "2.5rem", lineHeight: 1.15 }}>
            About Me
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.9rem 0",
                borderBottom: "1px solid rgba(52,191,255,0.1)",
              }}>
                <span style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.72rem", color: "#7c8594", letterSpacing: "0.12em" }}>
                  {s.label.toUpperCase()}
                </span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: "#F5EFE6", fontWeight: 500 }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", flexWrap: "wrap" }}>
            {[
              { href: "https://github.com/Atharv3105", label: "GitHub" },
              { href: "https://www.linkedin.com/in/atharv-palekar-86b726259", label: "LinkedIn" },
              { href: "mailto:atharvpalekar07@gmail.com", label: "Email" },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{
                  padding: "0.45rem 1.1rem",
                  border: "1px solid rgba(52,191,255,0.3)",
                  borderRadius: 3,
                  fontFamily: "'Electrolize', sans-serif",
                  fontSize: "0.7rem",
                  color: "#34bfff",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,191,255,0.1)"; e.currentTarget.style.borderColor = "#34bfff" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(52,191,255,0.3)" }}
              >{l.label}</a>
            ))}
          </div>
        </div>

        {/* Right — tabs */}
        <div className={`reveal-start delay-1${visible ? " is-visible" : ""}`}>
          {/* Tab switcher */}
          <div style={{ display: "flex", gap: "0", marginBottom: "2.5rem", borderBottom: "1px solid rgba(52,191,255,0.15)" }}>
            {(["skills", "about"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "0.75rem 2rem",
                border: "none",
                background: "transparent",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: tab === t ? "#F5EFE6" : "#7c8594",
                borderBottom: `2px solid ${tab === t ? "#FF923E" : "transparent"}`,
                marginBottom: -1,
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}>{t}</button>
            ))}
          </div>

          {tab === "skills" && (
            <div ref={barsRef}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
                {SKILL_BARS.map((s, i) => (
                  <div key={s.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#F5EFE6", fontWeight: 500 }}>{s.name}</span>
                      <span style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.72rem", color: "#7c8594" }}>{s.pct}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div className="skill-bar-fill" style={{ width: barsVisible ? `${s.pct}%` : "0%", transitionDelay: `${i * 0.1}s` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {SKILL_TAGS.map(tag => (
                  <span key={tag} style={{
                    padding: "0.3rem 0.75rem",
                    background: "rgba(52,191,255,0.08)",
                    border: "1px solid rgba(52,191,255,0.2)",
                    borderRadius: 3,
                    fontFamily: "'Electrolize', sans-serif",
                    fontSize: "0.68rem",
                    color: "#34bfff",
                    letterSpacing: "0.04em",
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {tab === "about" && (
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(245,239,230,0.7)", lineHeight: 1.85, marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                I'm a final-year Computer Science student at M.G.M.'s Jawaharlal Nehru Engineering College, specialising in Full-Stack Development with a Minor in{" "}
                <span style={{ color: "#34bfff" }}>Financial Technology</span>.
              </p>
              <p style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(245,239,230,0.7)", lineHeight: 1.85, marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                I architect systems that scale — from microservices handling thousands of concurrent requests to AI-powered mobile apps with real-time facial recognition. My stack spans{" "}
                <span style={{ color: "#FF923E" }}>MERN, Java, TypeScript, FastAPI, Docker,</span>{" "}
                and emerging AI toolkits.
              </p>
              <p style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(245,239,230,0.7)", lineHeight: 1.85, fontSize: "0.95rem" }}>
                Outside the keyboard: competitive programming on LeetCode (200+ problems), representing JNEC at national hackathons, and shipping tools that solve problems at scale.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Projects ──────────────────────────────────────────────────────────────

function ProjectsSection() {
  const [current, setCurrent] = useState(0)
  const [ref, visible] = useReveal()

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCurrent(c => Math.min(PROJECTS.length - 1, c + 1)), [])

  return (
    <section id="projects" style={{
      position: "relative", zIndex: 1,
      background: "rgba(5,11,35,0.97)",
      borderTop: "1px solid rgba(255,146,62,0.1)",
      padding: "7rem 6vw",
      minHeight: "100vh",
    }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className={`reveal-start${visible ? " is-visible" : ""}`} style={{ marginBottom: "4rem" }}>
          <p style={{ fontFamily: "'Electrolize', sans-serif", color: "#FF923E", fontSize: "0.7rem", letterSpacing: "0.22em", marginBottom: "0.75rem" }}>WHAT I'VE BUILT</p>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: "#F5EFE6", lineHeight: 1.15, maxWidth: 480 }}>
            Some things<br />
            <span style={{ color: "#34bfff" }}>I've worked on</span>
          </h2>
        </div>

        {/* Stacked card carousel */}
        <div style={{ display: "flex", gap: "4rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Card stack */}
          <div className={`reveal-start delay-1${visible ? " is-visible" : ""}`} style={{ position: "relative", width: 340, height: 520, flexShrink: 0 }}>
            {PROJECTS.map((project, i) => {
              const offset = i - current
              const isActive = offset === 0
              const hidden = Math.abs(offset) > 2
              return (
                <div
                  key={project.title}
                  style={{
                    position: "absolute",
                    width: 340,
                    height: 520,
                    transform: `translateX(${offset * 18}px) translateY(${offset * 10}px) scale(${1 - Math.abs(offset) * 0.04})`,
                    zIndex: PROJECTS.length - Math.abs(offset),
                    opacity: hidden ? 0 : isActive ? 1 : 0.65,
                    filter: isActive ? "none" : "grayscale(0.5)",
                    transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <ProjectCardStacked project={project} active={isActive} />
                </div>
              )
            })}
          </div>

          {/* Active project detail */}
          <div className={`reveal-start delay-2${visible ? " is-visible" : ""}`} style={{ flex: 1, minWidth: 260 }}>
            {PROJECTS.map((project, i) => (
              <div key={project.title} style={{
                display: i === current ? "block" : "none",
              }}>
                <div style={{
                  fontFamily: "'Electrolize', sans-serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  color: project.color,
                  marginBottom: "0.6rem",
                }}>{project.sub.toUpperCase()}</div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.75rem", fontWeight: 700, color: "#F5EFE6", marginBottom: "1rem" }}>
                  {project.title}
                </h3>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "rgba(245,239,230,0.6)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                  {project.desc}
                </p>
                <p style={{
                  fontFamily: "'Electrolize', sans-serif",
                  fontSize: "0.72rem",
                  color: project.color,
                  letterSpacing: "0.05em",
                  marginBottom: "1.5rem",
                  opacity: 0.85,
                }}>{project.impact}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                  {project.stack.map(t => (
                    <span key={t} style={{
                      padding: "0.25rem 0.65rem",
                      background: "rgba(52,191,255,0.08)",
                      border: "1px solid rgba(52,191,255,0.2)",
                      borderRadius: 3,
                      fontFamily: "'Electrolize', sans-serif",
                      fontSize: "0.66rem",
                      color: "#34bfff",
                    }}>{t}</span>
                  ))}
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: "0.78rem", padding: "0.6rem 1.4rem" }}>
                    Live Demo ↗
                  </a>
                )}
              </div>
            ))}

            {/* Navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
              <button onClick={prev} disabled={current === 0} style={{
                width: 42, height: 42, borderRadius: "50%",
                border: `1px solid ${current === 0 ? "rgba(124,133,148,0.3)" : "rgba(245,239,230,0.4)"}`,
                background: "transparent",
                color: current === 0 ? "#7c8594" : "#F5EFE6",
                fontSize: "1.1rem",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={e => { if (current > 0) { e.currentTarget.style.borderColor = "#FF923E"; e.currentTarget.style.color = "#FF923E" } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = current === 0 ? "rgba(124,133,148,0.3)" : "rgba(245,239,230,0.4)"; e.currentTarget.style.color = current === 0 ? "#7c8594" : "#F5EFE6" }}
              >←</button>
              <span style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.75rem", color: "#7c8594", letterSpacing: "0.1em" }}>
                {String(current + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
              </span>
              <button onClick={next} disabled={current === PROJECTS.length - 1} style={{
                width: 42, height: 42, borderRadius: "50%",
                border: `1px solid ${current === PROJECTS.length - 1 ? "rgba(124,133,148,0.3)" : "rgba(245,239,230,0.4)"}`,
                background: "transparent",
                color: current === PROJECTS.length - 1 ? "#7c8594" : "#F5EFE6",
                fontSize: "1.1rem",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={e => { if (current < PROJECTS.length - 1) { e.currentTarget.style.borderColor = "#FF923E"; e.currentTarget.style.color = "#FF923E" } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = current === PROJECTS.length - 1 ? "rgba(124,133,148,0.3)" : "rgba(245,239,230,0.4)"; e.currentTarget.style.color = current === PROJECTS.length - 1 ? "#7c8594" : "#F5EFE6" }}
              >→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCardStacked({ project, active }: { project: Project; active: boolean }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#0a1535",
      border: `1px solid ${active ? "rgba(52,191,255,0.3)" : "rgba(52,191,255,0.1)"}`,
      borderRadius: 8,
      padding: "2rem",
      display: "flex", flexDirection: "column",
      boxShadow: active ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${project.color}28` : "0 8px 30px rgba(0,0,0,0.3)",
      transition: "box-shadow 0.3s",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Color accent top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: project.color, opacity: active ? 1 : 0.4 }} />

      <div style={{
        fontFamily: "'Electrolize', sans-serif",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        color: project.color,
        marginBottom: "0.6rem",
        marginTop: "0.5rem",
      }}>{project.sub.toUpperCase()}</div>

      <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#F5EFE6", marginBottom: "1rem", lineHeight: 1.2 }}>
        {project.title}
      </h3>

      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "rgba(245,239,230,0.55)", lineHeight: 1.75, flex: 1 }}>
        {project.desc.slice(0, 120)}…
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1.25rem" }}>
        {project.stack.slice(0, 4).map(t => (
          <span key={t} style={{
            padding: "0.2rem 0.55rem",
            background: `${project.color}18`,
            border: `1px solid ${project.color}40`,
            borderRadius: 3,
            fontFamily: "'Electrolize', sans-serif",
            fontSize: "0.62rem",
            color: project.color,
          }}>{t}</span>
        ))}
      </div>

      {project.link && (
        <div style={{ marginTop: "1rem" }}>
          <span style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.65rem", color: "#34bfff", letterSpacing: "0.06em" }}>
            LIVE ↗
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Achievements ──────────────────────────────────────────────────────────

function AchievementsSection() {
  const [ref, visible] = useReveal()
  const [activeCategory, setActiveCategory] = useState<string>("ALL")
  const [selectedId, setSelectedId] = useState<string>("sih-2025")

  const categories = ["ALL", "Hackathon", "Global Challenge", "Hiring Hackathon"]

  const filteredAchievements = activeCategory === "ALL" 
    ? ACHIEVEMENTS 
    : ACHIEVEMENTS.filter(a => a.category === activeCategory)

  const activeItem = ACHIEVEMENTS.find(a => a.id === selectedId) || filteredAchievements[0] || ACHIEVEMENTS[0]

  return (
    <section id="achievements" style={{
      position: "relative", zIndex: 1,
      background: "rgba(4,9,31,0.97)",
      borderTop: "1px solid rgba(52,191,255,0.1)",
      padding: "7rem 6vw",
    }}>
      {/* Background radial ambient glow */}
      <div style={{
        position: "absolute",
        top: "20%",
        right: "10%",
        width: 500,
        height: 500,
        background: "radial-gradient(circle, rgba(255,146,62,0.06) 0%, rgba(52,191,255,0.03) 50%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div className={`reveal-start${visible ? " is-visible" : ""}`} style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "'Electrolize', sans-serif", color: "#FF923E", fontSize: "0.7rem", letterSpacing: "0.22em", marginBottom: "0.75rem" }}>
                INTERACTIVE SPOTLIGHT MATRIX
              </p>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: "#F5EFE6", lineHeight: 1.15 }}>
                Hackathons &amp; Achievements
              </h2>
            </div>

            {/* Filter Category Pills */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {categories.map(cat => {
                const isActive = activeCategory === cat
                const count = cat === "ALL" ? ACHIEVEMENTS.length : ACHIEVEMENTS.filter(a => a.category === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat)
                      const firstInCat = cat === "ALL" ? ACHIEVEMENTS[0] : ACHIEVEMENTS.find(a => a.category === cat)
                      if (firstInCat) setSelectedId(firstInCat.id)
                    }}
                    style={{
                      fontFamily: "'Electrolize', sans-serif",
                      fontSize: "0.725rem",
                      padding: "0.45rem 0.9rem",
                      borderRadius: 20,
                      border: `1px solid ${isActive ? "#FF923E" : "rgba(52,191,255,0.15)"}`,
                      background: isActive ? "rgba(255,146,62,0.15)" : "rgba(255,255,255,0.02)",
                      color: isActive ? "#FF923E" : "rgba(245,239,230,0.6)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span>{cat}</span>
                    <span style={{
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.4rem",
                      borderRadius: 10,
                      background: isActive ? "#FF923E" : "rgba(255,255,255,0.08)",
                      color: isActive ? "#091434" : "rgba(245,239,230,0.5)",
                      fontWeight: 700,
                    }}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Timeline Stepper Nodes */}
        <div className={`reveal-start delay-1${visible ? " is-visible" : ""}`} style={{
          marginBottom: "2.5rem",
          padding: "1rem 1.25rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(52,191,255,0.1)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          overflowX: "auto",
        }}>
          {ACHIEVEMENTS.map((item, idx) => {
            const isSelected = activeItem.id === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                  opacity: isSelected ? 1 : 0.45,
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  padding: "0.25rem 0.5rem",
                  borderRadius: 4,
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isSelected ? item.statusColor : "rgba(255,255,255,0.08)",
                  color: isSelected ? "#091434" : "#F5EFE6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  boxShadow: isSelected ? `0 0 12px ${item.statusColor}` : "none",
                  transition: "all 0.2s ease",
                }}>
                  {idx + 1}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.65rem", color: item.statusColor, letterSpacing: "0.08em" }}>
                    {item.year}
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", fontWeight: 500, color: isSelected ? "#F5EFE6" : "rgba(245,239,230,0.7)" }}>
                    {item.title}
                  </div>
                </div>
                {idx < ACHIEVEMENTS.length - 1 && (
                  <div style={{ width: 30, height: 1, background: "rgba(52,191,255,0.2)", marginLeft: "0.5rem" }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Interactive Dual Stage Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.75rem",
          alignItems: "stretch",
        }}>
          {/* Left Column: Interactive List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredAchievements.map((ach) => {
              const isSelected = activeItem.id === ach.id
              return (
                <div
                  key={ach.id}
                  onClick={() => setSelectedId(ach.id)}
                  style={{
                    padding: "1.25rem 1.5rem",
                    background: isSelected ? "rgba(255,146,62,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? "#FF923E" : "rgba(52,191,255,0.12)"}`,
                    borderLeft: `4px solid ${isSelected ? ach.statusColor : "transparent"}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    transform: isSelected ? "translateX(6px)" : "none",
                    boxShadow: isSelected ? `0 4px 20px rgba(0,0,0,0.3)` : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontSize: "1.25rem" }}>{ach.icon}</span>
                      <span style={{
                        fontFamily: "'Electrolize', sans-serif",
                        fontSize: "0.625rem",
                        color: ach.statusColor,
                        background: `${ach.statusColor}18`,
                        padding: "0.15rem 0.5rem",
                        borderRadius: 4,
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                      }}>{ach.status.toUpperCase()}</span>
                    </div>
                    <span style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.7rem", color: "rgba(245,239,230,0.4)" }}>
                      {ach.year}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: isSelected ? "#F5EFE6" : "rgba(245,239,230,0.85)", margin: "0.25rem 0" }}>
                    {ach.title}
                  </h3>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.775rem", color: "rgba(245,239,230,0.5)", margin: 0, lineHeight: 1.5 }}>
                    {ach.event}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Right Column: Spotlight Feature Box */}
          <div style={{
            background: "rgba(10, 18, 48, 0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,146,62,0.25)",
            borderRadius: 12,
            padding: "2.25rem",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: `0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            {/* Top subtle line glow */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${activeItem.statusColor}, transparent)`,
            }} />

            <div>
              {/* Header Status & Metadata */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: activeItem.statusColor,
                    boxShadow: `0 0 10px ${activeItem.statusColor}`,
                  }} />
                  <span style={{
                    fontFamily: "'Electrolize', sans-serif",
                    fontSize: "0.68rem",
                    color: activeItem.statusColor,
                    letterSpacing: "0.12em",
                    fontWeight: 600,
                  }}>
                    {activeItem.status.toUpperCase()} RECORD
                  </span>
                </div>
                <span style={{
                  fontFamily: "'Electrolize', sans-serif",
                  fontSize: "0.68rem",
                  color: "rgba(245,239,230,0.5)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "0.25rem 0.6rem",
                  borderRadius: 4,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {activeItem.year} • {activeItem.category}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div style={{ marginBottom: "1.25rem" }}>
                <h3 style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "#F5EFE6",
                  marginBottom: "0.35rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}>
                  <span>{activeItem.icon}</span>
                  <span>{activeItem.title}</span>
                </h3>
                <p style={{
                  fontFamily: "'Electrolize', sans-serif",
                  fontSize: "0.78rem",
                  color: "#FF923E",
                  margin: 0,
                  letterSpacing: "0.04em",
                }}>
                  {activeItem.tagline}
                </p>
              </div>

              {/* Description */}
              <p style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(245,239,230,0.7)",
                lineHeight: 1.65,
                marginBottom: "1.5rem",
              }}>
                {activeItem.desc}
              </p>

              {/* Key Highlights */}
              <div style={{ marginBottom: "1.75rem" }}>
                <p style={{
                  fontFamily: "'Electrolize', sans-serif",
                  fontSize: "0.65rem",
                  color: "rgba(245,239,230,0.4)",
                  letterSpacing: "0.15em",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                }}>
                  Key Highlights &amp; Accomplishments
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {activeItem.highlights.map((hl, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                      <span style={{ color: activeItem.statusColor, fontSize: "0.75rem", marginTop: 2 }}>✦</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "rgba(245,239,230,0.85)", lineHeight: 1.5 }}>
                        {hl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Tech Stack Tags */}
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{
                  fontFamily: "'Electrolize', sans-serif",
                  fontSize: "0.65rem",
                  color: "rgba(245,239,230,0.4)",
                  letterSpacing: "0.15em",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                }}>
                  Technologies Employed
                </p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {activeItem.techStack.map((tech, idx) => (
                    <span key={idx} style={{
                      fontFamily: "'Electrolize', sans-serif",
                      fontSize: "0.675rem",
                      padding: "0.2rem 0.55rem",
                      borderRadius: 4,
                      background: "rgba(52,191,255,0.08)",
                      border: "1px solid rgba(52,191,255,0.2)",
                      color: "#34bfff",
                      letterSpacing: "0.04em",
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button / Link */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.7rem", color: "rgba(245,239,230,0.4)" }}>
                  Host: <strong style={{ color: "rgba(245,239,230,0.8)", fontWeight: 500 }}>{activeItem.event}</strong>
                </span>

                {activeItem.link ? (
                  <a
                    href={activeItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      padding: "0.45rem 1.1rem",
                      fontSize: "0.725rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span>Launch Prototype</span>
                    <span>↗</span>
                  </a>
                ) : (
                  <span style={{
                    fontFamily: "'Electrolize', sans-serif",
                    fontSize: "0.675rem",
                    color: activeItem.statusColor,
                    background: `${activeItem.statusColor}15`,
                    border: `1px solid ${activeItem.statusColor}35`,
                    padding: "0.3rem 0.75rem",
                    borderRadius: 4,
                    letterSpacing: "0.06em",
                  }}>
                    VERIFIED SUBMISSION ✓
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ───────────────────────────────────────────────────────────────

function ContactSection() {
  const [ref, visible] = useReveal()

  return (
    <section id="contact" style={{
      position: "relative", zIndex: 1,
      background: "rgba(3,7,22,0.98)",
      borderTop: "1px solid rgba(255,146,62,0.12)",
      padding: "7rem 6vw",
      minHeight: "60vh",
      display: "flex", alignItems: "center",
    }}>
      <div ref={ref} style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div className={`reveal-start${visible ? " is-visible" : ""}`}>
          <p style={{ fontFamily: "'Electrolize', sans-serif", color: "#FF923E", fontSize: "0.7rem", letterSpacing: "0.22em", marginBottom: "1.25rem" }}>OPEN TO OPPORTUNITIES</p>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, color: "#F5EFE6", lineHeight: 1.05, marginBottom: "0.75rem" }}>
            Say hello.
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(245,239,230,0.5)", lineHeight: 1.8, marginBottom: "2.5rem", fontSize: "0.95rem" }}>
            Seeking SDE roles and internships. If you have a problem worth solving or a team worth joining — reach out.
          </p>
          <a href="mailto:atharvpalekar07@gmail.com" className="btn-primary" style={{ fontSize: "0.95rem", padding: "1rem 2.5rem" }}>
            Get in touch
          </a>
        </div>

        <div className={`reveal-start delay-1${visible ? " is-visible" : ""}`} style={{
          display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap",
          marginTop: "3rem", paddingTop: "2rem",
          borderTop: "1px solid rgba(52,191,255,0.1)",
        }}>
          {[
            { href: "https://github.com/Atharv3105", label: "GitHub" },
            { href: "https://www.linkedin.com/in/atharv-palekar-86b726259", label: "LinkedIn" },
            { href: "tel:+919527643427", label: "+91 95276 43427" },
            { href: "mailto:atharvpalekar07@gmail.com", label: "atharvpalekar07@gmail.com" },
          ].map(l => (
            <a key={l.label} href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Electrolize', sans-serif",
                fontSize: "0.72rem",
                color: "#7c8594",
                textDecoration: "none",
                letterSpacing: "0.06em",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#34bfff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#7c8594")}
            >{l.label}</a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      position: "relative", zIndex: 1,
      background: "rgba(3,7,22,0.98)",
      borderTop: "1px solid rgba(52,191,255,0.08)",
      padding: "1.5rem 6vw",
      textAlign: "center",
    }}>
      <p style={{ fontFamily: "'Electrolize', sans-serif", fontSize: "0.68rem", color: "rgba(124,133,148,0.6)", letterSpacing: "0.1em" }}>
        ATHARV PALEKAR © 2026 · BUILT WITH REACT + VITE
      </p>
    </footer>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <CustomCursor />
      <ThreeCanvas />
      <div style={{ position: "relative" }}>
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <AchievementsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
