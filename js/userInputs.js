import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { golfBall } from './main.js'
import { renderer, scene, camera, controls, init } from './setup.js'

// Flag to track Tab key press state
let isTabPressed = false

// Function to shoot the ball
function shootBall() {
    // Check if the ball is not in motion
    if (golfBall.velocity.length() === 0) {
        // Calculate the angle and force to shoot the ball
        const tau = -controls.getAzimuthalAngle() - Math.PI / 2
        const force = new THREE.Vector3(Math.cos(tau), 0, Math.sin(tau)).multiplyScalar(350)

        // Update the ball's properties
        golfBall.tau = tau
        golfBall.force = force
    }
}

// Event listener for Tab key press
function handleTabKeyDown(event) {
    // Check if Tab key is pressed and not already handled
    if (event.key === 'Tab' && !isTabPressed) {
        isTabPressed = true
        console.log(event.key)
    }

    if (event.key === 'Tab') event.preventDefault()
}

// Event listener for Tab key release
function handleTabKeyUp(event) {
    // Check if Tab key is released
    if (event.key === 'Tab') {
        // Reset Tab key press state
        isTabPressed = false
        event.preventDefault()
        console.log('Released')
    }
}

// Add event listener for keydown
document.addEventListener('keydown', (event) => {
    // Call shootBall function on Space key press
    if (event.key === ' ') {
        shootBall()
    }

    // Call handleTabKeyDown function for Tab key press
    handleTabKeyDown(event)
})

// Add event listener for keyup
document.addEventListener('keyup', handleTabKeyUp)

// Export event handling functions for external use
export { handleTabKeyDown, handleTabKeyUp }
