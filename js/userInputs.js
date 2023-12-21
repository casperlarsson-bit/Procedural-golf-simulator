import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { golfBall } from './main.js'
import { renderer, scene, camera, controls, init, cannonToThree, threeToCannon } from './setup.js'
import { arrow } from './setup.js'
import { h } from './ball.js'

// Flag to track Tab key press state
let isTabPressed = false

// Function to shoot the ball
function shootBall() {
	// Check if the ball is not in motion
	if (golfBall.velocity.length() === 0) {
		// Calculate the angle and force to shoot the ball
		const tau = -controls.getAzimuthalAngle() - Math.PI / 2
		const impulse = new THREE.Vector3(Math.cos(tau), 0, Math.sin(tau)).multiplyScalar(700 * h)
		const topPoint = new CANNON.Vec3(0, golfBall.radius / 2, 0)
		golfBall.body.applyImpulse(threeToCannon(impulse), topPoint)
	}
}

// Make the camera follow and look at the ball
function updateCameraPosition() {
	camera.lookAt(golfBall.mesh.position)
	// camera.position.copy(camera.position.clone().add(golfBall.deltaPosition))
	camera.position.lerp(camera.position.clone().add(golfBall.deltaPosition), 0.7)
	controls.target.copy(golfBall.mesh.position)
}

// Event listener for Tab key press
function handleTabKeyDown(event) {
	// Check if Tab key is pressed and not already handled
	if (event.key === 'Tab' && !isTabPressed) {
		isTabPressed = true
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
export { handleTabKeyDown, handleTabKeyUp, updateCameraPosition }
