import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { renderer, scene, camera, controls, init, threeToCannon, cannonToThree, world } from './setup.js'
import { groundMaterial } from './material.js'
import { g } from './ball.js'

class Ground {
	constructor(_length = 1, _height = 1, _depth = 1, _color = 'lightgreen') {
		this.length = _length
		this.height = _height
		this.depth = _depth
		this.color = _color

		// THREE.js body for visual
		this.geometry = new THREE.BoxGeometry(_length, _height, _depth)
		this.material = new THREE.MeshStandardMaterial({ color: _color })
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.receiveShadow = true
		this.normal = new THREE.Vector3(0, 1, 0)

		// Cannon.js for physics
		this.shape = new CANNON.Box(new CANNON.Vec3(this.length / 2, this.height / 2, this.depth / 2))
		this.body = new CANNON.Body({ mass: 0, shape: this.shape }) // Ground is immovable (mass = 0)
		this.body.material = groundMaterial
		this.body.position.copy(this.mesh.position)
		world.addBody(this.body)

		this.mesh.geometry.computeBoundingBox()
		this.boundingBox = new THREE.Box3()
	}

	rotateX(angle) {
		// THREE.js model
		this.mesh.rotation.x = angle

		// CANNON.js
		const euler = new CANNON.Vec3(angle, 0, 0) // Assuming rotation is along the y-axis

		// Convert Euler angles to quaternion
		const quaternion = new CANNON.Quaternion()
		quaternion.setFromEuler(euler.x, euler.y, euler.z)

		// Apply the quaternion to the body
		this.body.quaternion.copy(quaternion)
	}

	rotateY(angle) {
		// THREE.js model
		this.mesh.rotation.y = angle

		// CANNON.js
		const euler = new CANNON.Vec3(0, angle, 0) // Assuming rotation is along the y-axis

		// Convert Euler angles to quaternion
		const quaternion = new CANNON.Quaternion()
		quaternion.setFromEuler(euler.x, euler.y, euler.z)

		// Apply the quaternion to the body
		this.body.quaternion.copy(quaternion)
	}

	rotateZ(angle) {
		// THREE.js model
		this.mesh.rotation.z = angle

		// CANNON.js
		const euler = new CANNON.Vec3(0, 0, angle) // Assuming rotation is along the y-axis

		// Convert Euler angles to quaternion
		const quaternion = new CANNON.Quaternion()
		quaternion.setFromEuler(euler.x, euler.y, euler.z)

		// Apply the quaternion to the body
		this.body.quaternion.copy(quaternion)
	}
}

export { Ground }
