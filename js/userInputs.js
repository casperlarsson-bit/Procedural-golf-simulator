import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { golfBall } from './main.js'
import { renderer, scene, camera, controls, init } from './setup.js'

let isTabPressed = false

const handleUserInputsKeydown = document.addEventListener('keydown', function (event) {
    const keyCode = event.key
    event.preventDefault()

    // Space key, shoot ball
    if (keyCode === ' ' && golfBall.velocity.length() === 0) {
        golfBall.tau = -controls.getAzimuthalAngle() - Math.PI / 2
        golfBall.force = new THREE.Vector3(Math.cos(golfBall.tau), 0, Math.sin(golfBall.tau)).multiplyScalar(350)
    }

    // Tab key, display scoreboard
    if (keyCode === 'Tab' && !isTabPressed) {
        isTabPressed = true
        console.log('Open')
    }
})

const handleUserInputsKeyup = document.addEventListener('keyup', function (event) {
    const keyCode = event.key

    // Tab key, remove scoreboard
    if (keyCode === 'Tab') {
        isTabPressed = false
        event.preventDefault()
        console.log('Closing')
    }
})

export { handleUserInputsKeydown, handleUserInputsKeyup }