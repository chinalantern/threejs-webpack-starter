import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { FlatShading } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Global variables
// var camera, scene, renderer, light, model
var model

// Loader
const loader = new GLTFLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
loader.load('mask.glb', (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3)

  model = gltf.scene

  scene.add(model)
})

// Lights 1
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// Light 2
const pointLight2 = new THREE.PointLight(0xff0000, 1)
pointLight2.position.set(-2.12, 1, -1)
scene.add(pointLight2)

// Add a folder for the GUI to keep organized
const light2 = gui.addFolder('Light 2')

// Add control interfact to our obj to manipulate it and prototype on the fly
light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

// Add a point light helper to make controling the light easier
// const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1)
// scene.add(pointLightHelper2)

// Light 3
const pointLight3 = new THREE.PointLight(0x50edb4, 1)
pointLight3.position.set(2.26, -3, 1.39)
scene.add(pointLight3)

// Add a folder for the GUI to keep organized
const light3 = gui.addFolder('Light 3')

// Add control interfact to our obj to manipulate it and prototype on the fly
light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
light3.add(pointLight3.position, 'x').min(-6).max(6).step(0.01)
light3.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01)

// Color testing feature
const light3Color = {
  color: 0xff0000, //red
}

// we use the GUI debug point light to set the actual light simultaneously
light3.addColor(light3Color, 'color').onChange(() => {
  pointLight3.color.set(light3Color.color)
})

// Add a point light helper to make controling the light easier
// const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1)
// scene.add(pointLightHelper3)

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
  alpha: true, // make the background canvas transparent so we can see our webpage
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

// Add interaction based on mouse movement
let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0
const windowHalfX = window.innerWidth / 2 //we half it to keep the interaction smooth
const windowHalfY = window.innerHeight / 2

const onDocumentMouseMove = (event) => {
  mouseX = event.clientX - windowHalfX // mouse cursor when moved on x-axis
  mouseY = event.clientY - windowHalfY // mouse cursor when moved on y-axis
}

document.addEventListener('mousemove', onDocumentMouseMove)

// when window scrolls lets move the model
const updatemodel = (event) => {
  model.position.y = window.scrollY * 0.002
}
window.addEventListener('scroll', updatemodel)

const clock = new THREE.Clock()

const tick = () => {
  // finish up mouse movement interaction
  targetX = mouseX * 0.001
  targetY = mouseY * 0.001

  const elapsedTime = clock.getElapsedTime()

  // finishing up more mouse movement interaction
  if (model) {
    model.rotation.x += 0.92 * (targetY - model.rotation.x)
    model.rotation.y += 0.35 * (targetX - model.rotation.y)
    // model.position.z += 5.01 * (targetY - model.rotation.x)
  }

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
