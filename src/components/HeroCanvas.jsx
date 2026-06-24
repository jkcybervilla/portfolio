import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { HERO_CONFIG } from '../config/hero.config'

export default function HeroCanvas({ scrollProgress }) {
  const canvasRef = useRef(null)
  const progressRef = useRef(0)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const modelRef = useRef(null)
  const animFrameRef = useRef(null)

  // Keep scrollProgress in ref for animation loop
  useEffect(() => {
    progressRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
    })
    renderer.setClearColor(0x0a0a0f, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    rendererRef.current = renderer

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0.8, 5)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // --- Scene ---
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xd4af37, 3)
    directionalLight.position.set(5, 5, 3)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const fillLight = new THREE.DirectionalLight(0x4488ff, 1.5)
    fillLight.position.set(-5, 2, -3)
    scene.add(fillLight)

    const pointLight = new THREE.PointLight(0xffffff, 2)
    pointLight.position.set(0, 3, 2)
    scene.add(pointLight)

    const hemisphereLight = new THREE.HemisphereLight(0x0a0a2e, 0x111111, 0.8)
    scene.add(hemisphereLight)

    // --- Load GLTF model ---
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    loader.setDRACOLoader(dracoLoader)

    loader.load('/models/scene.gltf', (gltf) => {
      const model = gltf.scene

      // Auto-fit model to view
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2.5 / maxDim

      model.scale.setScalar(scale)
      model.position.sub(center.multiplyScalar(scale))
      model.position.y -= 0.5

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      scene.add(model)
      modelRef.current = model

      // Debug: log model size
      console.log('Model loaded. Size:', size, 'Scale applied:', scale)
    })

    // --- Animation Loop ---
    let currentCamZ = 5
    let currentCamY = 0.8

    function animate() {
      const progress = progressRef.current

      // Camera target values based on scrollProgress (0 → 1)
      const targetZ = 5 + (2.5 - 5) * progress       // 5 → 2.5
      const targetY = 0.8 + (0.3 - 0.8) * progress   // 0.8 → 0.3

      // Lerp camera
      currentCamZ += (targetZ - currentCamZ) * 0.05
      currentCamY += (targetY - currentCamY) * 0.05
      camera.position.z = currentCamZ
      camera.position.y = currentCamY
      camera.lookAt(0, 0, 0)

      // Model rotation (direct assignment)
      if (modelRef.current) {
        const startRot = -Math.PI * 0.2
        const endRot = Math.PI * 1.8
        modelRef.current.rotation.y = startRot + (endRot - startRot) * progress
      }

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.render(scene, camera)
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // --- Resize ---
    function handleResize() {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full block"
    />
  )
}