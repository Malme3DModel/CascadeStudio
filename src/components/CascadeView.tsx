'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'
import { Pane } from 'tweakpane'

export function CascadeView() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const mainObjectRef = useRef<THREE.Group | null>(null)
  const guiRef = useRef<Pane | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!mountRef.current || isInitialized) return

    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x222222)
    scene.fog = new THREE.Fog(0x222222, 200, 600)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000)
    camera.position.set(50, 100, 150)
    camera.lookAt(0, 45, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    const light = new THREE.HemisphereLight(0xffffff, 0x444444)
    light.position.set(0, 200, 0)
    scene.add(light)

    const light2 = new THREE.DirectionalLight(0xbbbbbb)
    light2.position.set(6, 50, -12)
    light2.castShadow = true
    light2.shadow.camera.top = 200
    light2.shadow.camera.bottom = -200
    light2.shadow.camera.left = -200
    light2.shadow.camera.right = 200
    light2.shadow.mapSize.width = 128
    light2.shadow.mapSize.height = 128
    scene.add(light2)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 45, 0)
    controls.panSpeed = 2
    controls.zoomSpeed = 1
    controls.screenSpacePanning = true
    controls.update()
    controlsRef.current = controls

    mount.appendChild(renderer.domElement)

    const guiContainer = document.createElement('div')
    guiContainer.className = 'gui-panel'
    guiContainer.id = 'guiPanel'
    mount.appendChild(guiContainer)

    const gui = new Pane({
      title: 'Cascade Control Panel',
      container: guiContainer
    })
    guiRef.current = gui

    const params = {
      MeshRes: 0.1,
      Cache: true,
      GroundPlane: true,
      Grid: true
    }

    console.log('GUI params:', params)

    setIsInitialized(true)

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!mount || !camera || !renderer) return
      const newWidth = mount.clientWidth
      const newHeight = mount.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mount && renderer) {
        mount.removeChild(renderer.domElement)
      }
      if (guiContainer && mount.contains(guiContainer)) {
        mount.removeChild(guiContainer)
      }
      if (gui) {
        gui.dispose()
      }
      if (renderer) {
        renderer.dispose()
      }
    }
  }, [isInitialized])

  useEffect(() => {
    const handleRenderShapes = (event: CustomEvent) => {
      if (!sceneRef.current || !mainObjectRef.current) return

      const { facelist, edgelist, sceneOptions } = event.detail

      if (mainObjectRef.current) {
        sceneRef.current.remove(mainObjectRef.current)
      }

      const mainObject = new THREE.Group()
      mainObject.name = "shape"
      mainObject.rotation.x = -Math.PI / 2
      mainObjectRef.current = mainObject

      if (facelist && facelist.length > 0) {
        const vertices: number[] = []
        const normals: number[] = []
        const triangles: number[] = []
        const uvs: number[] = []
        let vInd = 0

        facelist.forEach((face: any) => {
          vertices.push(...face.vertex_coord)
          normals.push(...face.normal_coord)
          uvs.push(...face.uv_coord)

          for (let i = 0; i < face.tri_indexes.length; i += 3) {
            triangles.push(
              face.tri_indexes[i + 0] + vInd,
              face.tri_indexes[i + 1] + vInd,
              face.tri_indexes[i + 2] + vInd
            )
          }

          vInd += face.vertex_coord.length / 3
        })

        const geometry = new THREE.BufferGeometry()
        geometry.setIndex(triangles)
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
        geometry.computeBoundingSphere()
        geometry.computeBoundingBox()

        const material = new THREE.MeshPhongMaterial({
          color: 0xf5f5f5,
          shininess: 30,
        })

        const model = new THREE.Mesh(geometry, material)
        model.castShadow = true
        model.name = "Model Faces"
        mainObject.add(model)
      }

      if (edgelist && edgelist.length > 0) {
        const lineVertices: THREE.Vector3[] = []

        edgelist.forEach((edge: any) => {
          for (let i = 0; i < edge.vertex_coord.length - 3; i += 3) {
            lineVertices.push(
              new THREE.Vector3(
                edge.vertex_coord[i],
                edge.vertex_coord[i + 1],
                edge.vertex_coord[i + 2]
              )
            )
            lineVertices.push(
              new THREE.Vector3(
                edge.vertex_coord[i + 3],
                edge.vertex_coord[i + 4],
                edge.vertex_coord[i + 5]
              )
            )
          }
        })

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(lineVertices)
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          linewidth: 1.5,
        })
        const line = new THREE.LineSegments(lineGeometry, lineMaterial)
        line.name = "Model Edges"
        mainObject.add(line)
      }

      sceneRef.current.add(mainObject)

      const event2 = new CustomEvent('cascade-log', {
        detail: { message: 'Generation Complete!' }
      })
      window.dispatchEvent(event2)
    }

    const handleExportSTL = () => {
      if (!mainObjectRef.current) return
      const exporter = new STLExporter()
      const result = exporter.parse(mainObjectRef.current)
      const blob = new Blob([result], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'model.stl'
      a.click()
      URL.revokeObjectURL(url)
    }

    const handleExportOBJ = () => {
      if (!mainObjectRef.current) return
      const exporter = new OBJExporter()
      const result = exporter.parse(mainObjectRef.current)
      const blob = new Blob([result], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'model.obj'
      a.click()
      URL.revokeObjectURL(url)
    }

    window.addEventListener('cascade-render-shapes', handleRenderShapes as EventListener)
    window.addEventListener('cascade-export-stl', handleExportSTL)
    window.addEventListener('cascade-export-obj', handleExportOBJ)

    return () => {
      window.removeEventListener('cascade-render-shapes', handleRenderShapes as EventListener)
      window.removeEventListener('cascade-export-stl', handleExportSTL)
      window.removeEventListener('cascade-export-obj', handleExportOBJ)
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        backgroundColor: '#222222'
      }} 
    />
  )
}
