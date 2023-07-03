import { golfBall } from "./main.js"
import { renderer, scene, camera, controls, init } from './setup.js'

function handleUserInputs(event) {
    const keyCode = event.which

    // Space key
    if (keyCode === 32 && golfBall.velocity.length() === 0) {
        golfBall.force = 400
        golfBall.tau = -controls.getAzimuthalAngle() - Math.PI / 2
        golfBall.friction = golfBall.mass * 9.82 * golfBall.my
    }
}

export { handleUserInputs }