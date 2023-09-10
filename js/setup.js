import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
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

function setLight() {
    const light = new THREE.AmbientLight(0xffffff, 0.2) // Soft white light; color, intensity
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

const cameraTarget = new THREE.Vector3(); // The point the camera should follow
const cameraDistance = 10; // The distance between the camera and the golf ball

// Make the camera follow and look at the ball
// Right now, the camera gets locked and you can not rotate
function updateCameraPosition() {
    // camera.position.copy(golfBall.mesh.position).add(new THREE.Vector3(0, 5, 10)) // Adjust the offset as needed
    // camera.lookAt(golfBall.mesh.position)

    // Assuming golfBall.position is the position of your golf ball
    cameraTarget.copy(golfBall.mesh.position);
    cameraTarget.y += cameraDistance; // Adjust the camera height

    // Use linear interpolation to smoothly move the camera towards the target
    camera.position.lerp(cameraTarget, 0.1);
    camera.lookAt(golfBall.mesh.position);
}

export { renderer, scene, camera, controls, init, updateCameraPosition, arrow }