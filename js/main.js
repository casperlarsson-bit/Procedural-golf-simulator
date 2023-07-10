import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { ball, h } from './ball.js'
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
const helper1 = new THREE.Box3Helper(ground1.boundingBox)
//scene.add(helper1)

const ground2 = new ground(20, 0.1, 10, 'red')
ground2.mesh.position.y = -4
ground2.mesh.position.x = 14
grounds.push(ground2)
scene.add(ground2.mesh)
const helper2 = new THREE.Box3Helper(ground2.boundingBox)
//scene.add(helper2)

const ground3 = new ground(10, 0.1, 10, 'orange')
ground3.mesh.position.y = -5
grounds.push(ground3)
scene.add(ground3.mesh)

function animate() {
    //controls.update()
    setTimeout(() => {

        requestAnimationFrame(animate)

        document.addEventListener('keydown', handleUserInputs, false)

        golfBall.euler()
        renderer.render(scene, camera)
    }, 1000 * h)
}

init()
animate()

export { golfBall, grounds }