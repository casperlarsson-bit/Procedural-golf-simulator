import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { ball } from './ball.js'
import { handleUserInputs } from './userInputs.js'

const golfBall = new ball(1)
scene.add(golfBall.mesh)

const geometry = new THREE.PlaneGeometry(10, 10)
const material = new THREE.MeshStandardMaterial({ color: 'lightgreen', side: THREE.DoubleSide })
const plane = new THREE.Mesh(geometry, material)
plane.receiveShadow = true
plane.rotation.x = Math.PI / 2
plane.position.y = -golfBall.radius
scene.add(plane)

function animate() {
    requestAnimationFrame(animate)

    document.addEventListener('keydown', handleUserInputs, false)

    golfBall.euler()
    renderer.render(scene, camera)
}

init()
animate()

export { golfBall }