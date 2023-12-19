import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init, arrow } from './setup.js'
import { Ball, h } from './ball.js'
import { handleTabKeyDown, handleTabKeyUp, updateCameraPosition } from './userInputs.js'
import { Level } from './level.js'

const groundLevel = -1

const golfBall = new Ball(0.2, new THREE.Vector3(0, 5, 0))
scene.add(golfBall.mesh)

const levelOne = new Level()
levelOne.generateLevel()

function animate() {
	//controls.update()
	setTimeout(() => {
		requestAnimationFrame(animate)

		// console.log(golfBall.mesh.position.y - golfBall.body.position.y)

		// golfBall.euler()
		golfBall.updatePosition()
		arrow.updatePosition()
		updateCameraPosition()
		renderer.render(scene, camera)
	}, 1000 * h)
}

init()
animate()

export { golfBall, groundLevel, levelOne }
