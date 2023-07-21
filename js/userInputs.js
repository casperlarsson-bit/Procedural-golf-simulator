import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { golfBall } from "./main.js"
import { renderer, scene, camera, controls, init } from './setup.js'

function handleUserInputs(event) {
    const keyCode = event.which

    // Space key
    if (keyCode === 32 && golfBall.velocity.length() === 0) {
        golfBall.tau = -controls.getAzimuthalAngle() - Math.PI / 2
        golfBall.force = new THREE.Vector3(Math.cos(golfBall.tau), 0, Math.sin(golfBall.tau)).multiplyScalar(350)
        //golfBall.friction = new THREE.Vector3(Math.cos(golfBall.tau), 0, Math.sin(golfBall.tau)).multiplyScalar(golfBall.mass * 9.82 * golfBall.my)
    }
}

export { handleUserInputs }