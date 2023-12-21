import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'
import { golfBall } from './main.js'
import { DirectionArrow } from './directionArrow.js'

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
//renderer.shadowMap.type = THREE.PCFSoftShadowMap
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000) // FOV, window ratio, near, far
const controls = new OrbitControls(camera, renderer.domElement)
const arrow = new DirectionArrow()
controls.update()
// Create a Cannon.js world
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0) // Set gravity

function setLight() {
	const light = new THREE.AmbientLight(0xffffff, 0.2) // Soft white light color, intensity
	scene.add(light)
	const pointLight = new THREE.PointLight(0xffffff, 1, 0) // Color, near, far
	pointLight.position.set(50, 50, 50)
	pointLight.shadow.mapSize.width = 4096 // Shadow quality
	pointLight.shadow.mapSize.height = 4096
	pointLight.castShadow = true
	scene.add(pointLight)
}

function init() {
	scene.background = new THREE.Color('#78a7ff')
	camera.position.z = 5
	camera.position.y = 2
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
	setLight()
}

// Update the size of the window if the browser ir resized
window.addEventListener('resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})

function threeToCannon(threeVector) {
	return new CANNON.Vec3(threeVector.x, threeVector.y, threeVector.z)
}

function cannonToThree(cannonVector) {
	return new THREE.Vector3(cannonVector.x, cannonVector.y, cannonVector.z)
}

export { renderer, scene, camera, controls, init, arrow, threeToCannon, cannonToThree, world }
