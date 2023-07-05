import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { ball } from './ball.js'
import { ground } from './ground.js'
import { handleUserInputs } from './userInputs.js'

const grounds = []

const golfBall = new ball(1)
golfBall.mesh.position.y = 2
scene.add(golfBall.mesh)

const ground1 = new ground(10, 0.1, 10)
ground1.mesh.position.y = -1
grounds.push(ground1)
scene.add(ground1.mesh)

function animate() {
    requestAnimationFrame(animate)

    document.addEventListener('keydown', handleUserInputs, false)

    golfBall.euler()
    renderer.render(scene, camera)
}

init()
animate()

export { golfBall, grounds }