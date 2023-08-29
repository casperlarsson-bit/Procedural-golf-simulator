import { renderer, scene, camera, controls, init, updateCameraPosition } from './setup.js'
import { Ball, h } from './ball.js'
import { handleTabKeyDown, handleTabKeyUp } from './userInputs.js'
import { Level } from './level.js'

const groundLevel = -1

const golfBall = new Ball(0.2)
golfBall.mesh.position.y = 1
scene.add(golfBall.mesh)

const levelOne = new Level()
levelOne.generateLevel()

function animate() {
    //controls.update()
    setTimeout(() => {

        requestAnimationFrame(animate)

        golfBall.euler()
        updateCameraPosition()
        renderer.render(scene, camera)
    }, 1000 * h)
}

init()
animate()

export { golfBall, groundLevel, levelOne, }