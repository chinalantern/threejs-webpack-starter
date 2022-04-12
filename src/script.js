import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loader
const loader = new THREE.TextureLoader()
const crossTxtr = loader.load('./10x10cross.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100)

const particlesGeometry = new THREE.BufferGeometry()
const particlesCnt = 60000

const posArray = new Float32Array(particlesCnt * 3) // float32 array to provide an xyz axis for every particle

// increment over them all
for (let i = 0; i < particlesCnt * 3; i++) {
  //   posArray[i] = Math.random() // random position each particles xyz axis
  //   posArray[i] = Math.random() -  0.5 // centered
  //   posArray[i] = (Math.random() -  0.5) * 5 // dispersed starfield
  posArray[i] = (Math.random() - 0.5) * (Math.random() * 10) // dispersed by random value starfield
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(posArray, 3)
)

// Materials

const material = new THREE.PointsMaterial({
  size: 0.005,
})

const particlesMaterial = new THREE.PointsMaterial({
  map: crossTxtr,
  transparent: true,
  size: 0.005,
  color: 'red',
  //   blending: THREE.AdditiveBlending
})

// Mesh
const sphere = new THREE.Points(geometry, material)

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particlesMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(new THREE.Color('#21282a'),1)    // change the bkg color

// cursor move event listener | when even happens call the animateParticles function
const cursor = { x: 0, y: 0 }
document.addEventListener('mousemove', (moveParticlesEvent) => {
  // set the state of cursor interaction
  //   cursor.x = moveParticlesEvent.clientX
  //   cursor.y = moveParticlesEvent.clientY
  //   cursor.x = moveParticlesEvent.clientX / window.innerWidth // normalize cursor position so its from 0 - 1
  //   cursor.y = moveParticlesEvent.clientY / window.innerHeight // normalize cursor position so its from 0 - 1
  cursor.x = moveParticlesEvent.clientX / window.innerWidth - 0.5 // set -0.5 and 0.5 as min/max | and help center our object
  cursor.y = moveParticlesEvent.clientY / window.innerHeight - 0.5 // set -0.5 and 0.5 as min/max | and help center our object
})

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  //   sphere.rotation.y = 0.5 * elapsedTime

  // animate camera about objects
  const cameraX = cursor.x - 1 // neg 1 is there bc threejs inverts x coortinates
  const cameraY = -cursor.y

  //   camera.position.x = cameraX
  //   camera.position.y = cameraY
  camera.position.x = (cameraX - camera.position.x) / 88 // add easy easing
  camera.position.y = (cameraY - camera.position.y) / 88 // add easy easing
  //   particlesMesh.rotation.x = cursorY * 0.1 * (elapsedTime * 0.00008)
  //   particlesMesh.rotation.y = cursorX * 0.1 * (elapsedTime * 0.00008)

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // create frame by frame recursive loop
  window.requestAnimationFrame(tick)
}

tick()
