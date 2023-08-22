import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { ball, h } from './ball.js'
import { ground } from './ground.js'
import { wall } from './wall.js'
import { handleTabKeyDown, handleTabKeyUp } from './userInputs.js'
import { levelPart } from './levelPart.js'

const groundLevel = -1
const grounds = []

const golfBall = new ball(0.2)
golfBall.mesh.position.y = 1
scene.add(golfBall.mesh)

const ground1 = new ground(10, 0.1, 10)
grounds.push(ground1)

const wall1 = new wall(new THREE.Vector3(2, -0.5, 0))

const levelPart1 = new levelPart(ground1)
levelPart1.addWall(wall1)
levelPart1.generateLevelPart()

function animate() {
    //controls.update()
    setTimeout(() => {

        requestAnimationFrame(animate)

        //document.addEventListener('keydown', handleUserInputs, false)

        golfBall.euler()
        renderer.render(scene, camera)
    }, 1000 * h)
}

init()
animate()

export { golfBall, grounds, groundLevel }