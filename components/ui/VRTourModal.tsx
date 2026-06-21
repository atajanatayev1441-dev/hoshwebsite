'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { X, RotateCcw, Volume2, Compass } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'

/* ─── ROOM DEFINITIONS ─────────────────────────────────────────────
   src: path to equirectangular 360° panorama photo
   For real VR quality — upload photos taken with a 360° camera or
   phone panorama mode, then update these paths.
   Hotspots are defined in spherical coords: yaw -180..180, pitch -90..90
──────────────────────────────────────────────────────────────────── */
type Hotspot = {
  yaw: number        // horizontal angle: 0=forward, 90=right, -90=left, 180=behind
  pitch: number      // vertical angle: 0=horizon, -30=slightly down
  toRoom: string
  labelRu: string
  labelTk: string
}
type Room = {
  id: string
  labelRu: string
  labelTk: string
  src: string
  hotspots: Hotspot[]
}

const ROOMS: Room[] = [
  {
    id: 'entrance',
    labelRu: 'Вход', labelTk: 'Girelge',
    src: '/images/hero.jpg',
    hotspots: [
      { yaw: 0, pitch: -10, toRoom: 'main-hall', labelRu: 'Войти в зал', labelTk: 'Zala gir' },
    ],
  },
  {
    id: 'main-hall',
    labelRu: 'Основной зал', labelTk: 'Esasy zal',
    src: '/images/photo_2026-06-19_18-49-24.jpg',
    hotspots: [
      { yaw: -90,  pitch: -5,  toRoom: 'bar',        labelRu: '← Бар',       labelTk: '← Bar' },
      { yaw:  90,  pitch: -5,  toRoom: 'art-wall',   labelRu: '→ Арт-стена', labelTk: '→ Sungat diwary' },
      { yaw:  0,   pitch: -5,  toRoom: 'industrial', labelRu: '↑ #Industrial', labelTk: '↑ #Industrial' },
      { yaw:  180, pitch: -5,  toRoom: 'entrance',   labelRu: '↓ Выход',     labelTk: '↓ Çykyş' },
    ],
  },
  {
    id: 'bar',
    labelRu: 'Барная зона', labelTk: 'Bar zonagy',
    src: '/images/photo_2026-06-19_18-49-22.jpg',
    hotspots: [
      { yaw: 90, pitch: -5, toRoom: 'main-hall', labelRu: '→ Зал', labelTk: '→ Zal' },
    ],
  },
  {
    id: 'art-wall',
    labelRu: 'Арт-стена', labelTk: 'Sungat diwary',
    src: '/images/art-wall.jpg',
    hotspots: [
      { yaw: -90, pitch: -5, toRoom: 'main-hall', labelRu: '← Зал', labelTk: '← Zal' },
    ],
  },
  {
    id: 'industrial',
    labelRu: '#Industrial', labelTk: '#Industrial',
    src: '/images/industrial.jpg',
    hotspots: [
      { yaw: 180, pitch: -5, toRoom: 'main-hall', labelRu: '↓ Назад', labelTk: '↓ Yzyna' },
      { yaw: -90, pitch: -5, toRoom: 'vip',       labelRu: '← VIP',   labelTk: '← VIP' },
    ],
  },
  {
    id: 'vip',
    labelRu: 'VIP Зона', labelTk: 'VIP Zona',
    src: '/images/interior.jpg',
    hotspots: [
      { yaw: 90, pitch: -5, toRoom: 'industrial', labelRu: '→ Назад', labelTk: '→ Yzyna' },
    ],
  },
]

const ROOM_MAP = Object.fromEntries(ROOMS.map(r => [r.id, r]))

interface Props { onClose: () => void }

export function VRTourModal({ onClose }: Props) {
  const { lang } = useLang()
  const ru = lang === 'ru'

  const mountRef  = useRef<HTMLDivElement>(null)
  const rendRef   = useRef<any>(null)
  const sceneRef  = useRef<any>(null)
  const camRef    = useRef<any>(null)
  const meshRef   = useRef<any>(null)
  const rafRef    = useRef<number>(0)
  const isDrag    = useRef(false)
  const lastPos   = useRef({ x: 0, y: 0 })
  const rotation  = useRef({ lon: 0, lat: 0 })
  const autoSpin  = useRef(true)

  const [currentId, setCurrentId] = useState('entrance')
  const [hotspotPositions, setHotspotPositions] = useState<{ hs: Hotspot; x: number; y: number; visible: boolean }[]>([])
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const room = ROOM_MAP[currentId]

  /* ─── Convert spherical → screen coords ─── */
  const updateHotspots = useCallback((THREE: any) => {
    if (!camRef.current || !rendRef.current) return
    const cam = camRef.current
    const rend = rendRef.current
    const w = rend.domElement.clientWidth
    const h = rend.domElement.clientHeight

    const positions = (ROOM_MAP[currentId]?.hotspots ?? []).map(hs => {
      const phi   = THREE.MathUtils.degToRad(90 - hs.pitch)
      const theta = THREE.MathUtils.degToRad(hs.yaw)
      const vec = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta),
      )
      const projected = vec.project(cam)
      return {
        hs,
        x: (projected.x + 1) / 2 * w,
        y: (-projected.y + 1) / 2 * h,
        visible: projected.z < 1,
      }
    })
    setHotspotPositions(positions)
  }, [currentId])

  /* ─── Initialise Three.js scene ─── */
  useEffect(() => {
    if (!mountRef.current) return
    setLoading(true)
    let THREE: any, animId: number

    import('three').then((mod) => {
      THREE = mod

      const el = mountRef.current!
      const w = el.clientWidth, h = el.clientHeight

      /* Renderer */
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h)
      el.appendChild(renderer.domElement)
      rendRef.current = renderer

      /* Scene & Camera */
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(80, w / h, 1, 1100)
      camera.position.set(0, 0, 0.01)
      sceneRef.current = scene
      camRef.current   = camera

      /* Sphere (inside-out) */
      const geo = new THREE.SphereGeometry(500, 64, 32)
      geo.scale(-1, 1, 1)
      const mat = new THREE.MeshBasicMaterial({ color: 0x111111 })
      const mesh = new THREE.Mesh(geo, mat)
      scene.add(mesh)
      meshRef.current = mesh

      /* Load first texture */
      const loader = new THREE.TextureLoader()
      loader.load(ROOM_MAP[currentId].src, (tex: any) => {
        tex.colorSpace = THREE.SRGBColorSpace
        mesh.material = new THREE.MeshBasicMaterial({ map: tex })
        setLoading(false)
      })

      /* Animation loop */
      function animate() {
        animId = requestAnimationFrame(animate)
        if (autoSpin.current && !isDrag.current) rotation.current.lon -= 0.04

        const lat = Math.max(-85, Math.min(85, rotation.current.lat))
        const phi = THREE.MathUtils.degToRad(90 - lat)
        const theta = THREE.MathUtils.degToRad(rotation.current.lon)
        camera.target = new THREE.Vector3(
          500 * Math.sin(phi) * Math.cos(theta),
          500 * Math.cos(phi),
          500 * Math.sin(phi) * Math.sin(theta),
        )
        camera.lookAt(camera.target)
        renderer.render(scene, camera)
        updateHotspots(THREE)
      }
      animate()
      rafRef.current = animId

      /* Resize */
      const onResize = () => {
        const w2 = el.clientWidth, h2 = el.clientHeight
        camera.aspect = w2 / h2
        camera.updateProjectionMatrix()
        renderer.setSize(w2, h2)
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    })

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (rendRef.current) {
        rendRef.current.dispose()
        rendRef.current.domElement.remove()
      }
    }
  }, [])

  /* ─── Load new texture when room changes ─── */
  useEffect(() => {
    if (!meshRef.current || !sceneRef.current) return
    setIsTransitioning(true)
    import('three').then((THREE) => {
      const loader = new THREE.TextureLoader()
      loader.load(ROOM_MAP[currentId].src, (tex: any) => {
        tex.colorSpace = THREE.SRGBColorSpace
        meshRef.current.material = new THREE.MeshBasicMaterial({ map: tex })
        setIsTransitioning(false)
      })
    })
  }, [currentId])

  /* ─── Mouse/touch drag controls ─── */
  const onPointerDown = (e: React.PointerEvent) => {
    isDrag.current = true
    autoSpin.current = false
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrag.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    rotation.current.lon -= dx * 0.2
    rotation.current.lat += dy * 0.2
    lastPos.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = () => { isDrag.current = false }

  /* ─── Touch pinch-zoom ─── */
  const lastPinch = useRef(0)
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      if (lastPinch.current > 0 && camRef.current) {
        camRef.current.fov = Math.max(40, Math.min(100, camRef.current.fov - (d - lastPinch.current) * 0.3))
        camRef.current.updateProjectionMatrix()
      }
      lastPinch.current = d
    }
  }

  /* ─── Navigate to room ─── */
  function goTo(id: string) {
    setCurrentId(id)
    rotation.current = { lon: 0, lat: 0 }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#000' }}>

      {/* Three.js canvas */}
      <div
        ref={mountRef}
        className="flex-1"
        style={{ cursor: isDrag.current ? 'grabbing' : 'grab', touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchMove={onTouchMove}
        onTouchEnd={() => { lastPinch.current = 0 }}
      />

      {/* Hotspot arrows rendered as HTML over canvas */}
      {hotspotPositions.map(({ hs, x, y, visible }, i) => visible && (
        <button
          key={i}
          onClick={() => goTo(hs.toRoom)}
          style={{
            position: 'absolute',
            left: x, top: y,
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            pointerEvents: 'auto',
          }}
        >
          {/* Animated ring */}
          <span style={{
            position: 'absolute', width: 56, height: 56, borderRadius: '50%',
            border: '2px solid rgba(201,168,76,0.4)',
            animation: 'hs-ping 2s ease-out infinite',
          }} />
          {/* Main dot */}
          <span style={{
            width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,10,10,0.7)',
            border: '2px solid rgba(201,168,76,0.85)',
            backdropFilter: 'blur(8px)',
            color: '#C9A84C', fontSize: 22, fontWeight: 300,
            boxShadow: '0 0 20px rgba(201,168,76,0.3)',
            transition: 'transform 0.2s, background 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(10,10,10,0.7)' }}
          >
            ↑
          </span>
          {/* Label */}
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#C9A84C',
            background: 'rgba(0,0,0,0.6)',
            padding: '3px 10px',
            backdropFilter: 'blur(6px)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {ru ? hs.labelRu : hs.labelTk}
          </span>
        </button>
      ))}

      {/* Loading overlay */}
      {(loading || isTransitioning) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div style={{ textAlign: 'center' }}>
            <Compass size={32} style={{ color: '#C9A84C', margin: '0 auto 12px', animation: 'spin 2s linear infinite' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              {ru ? 'Загрузка...' : 'Ýüklenýär...'}
            </p>
          </div>
        </div>
      )}

      {/* Top UI bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between px-6 py-5" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        pointerEvents: 'none',
      }}>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
            HOŞ LOUNGE · {ru ? 'ВИРТУАЛЬНЫЙ ТУР' : 'WIRTUAL SYÝAHAT'}
          </p>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 3vw, 30px)', fontWeight: 300, fontStyle: 'italic', color: '#FAFAF8', margin: 0 }}>
            {ru ? room.labelRu : room.labelTk}
          </h3>
        </div>
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => { autoSpin.current = !autoSpin.current }}
            title={ru ? 'Авто-вращение' : 'Awtomatik aýlanma'}
            style={{ width: 38, height: 38, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={onClose}
            style={{ width: 38, height: 38, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Bottom: room navigation strip */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-5 px-6" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 10, pointerEvents: 'auto' }}>
          {ROOMS.map(r => {
            const isCur = r.id === currentId
            return (
              <button
                key={r.id}
                onClick={() => goTo(r.id)}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: isCur ? '#0a0a0a' : 'rgba(255,255,255,0.5)',
                  background: isCur ? '#C9A84C' : 'rgba(0,0,0,0.5)',
                  border: isCur ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.15)',
                  padding: '6px 14px', cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.25s',
                  whiteSpace: 'nowrap',
                }}
              >
                {ru ? r.labelRu : r.labelTk}
              </button>
            )
          })}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center', letterSpacing: '0.1em' }}>
          {ru ? 'Перетащите для просмотра · Нажмите стрелки для перехода' : 'Görmek üçin süýşüriň · Geçmek üçin ok düwmelerine basyň'}
        </p>
      </div>

      <style>{`
        @keyframes hs-ping {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(2); opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
