import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { world } from './setup.js'
import { wallMaterial } from './material.js'

class Wall {
	constructor(_position = new THREE.Vector3(), _length = 1, _height = 1, _depth = 1, _color = 'lightpink') {
		this.length = _length
		this.height = _height
		this.depth = _depth
		this.color = _color

		// THREE.js body for visual
		this.geometry = new THREE.BoxGeometry(_length, _height, _depth)
		this.material = new THREE.MeshStandardMaterial({ color: _color })
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.position.copy(_position)
		this.mesh.receiveShadow = true

		// Cannon.js for physics
		this.shape = new CANNON.Box(new CANNON.Vec3(this.length / 2, this.height / 2, this.depth / 2))
		this.body = new CANNON.Body({ mass: 0, shape: this.shape }) // Ground is immovable (mass = 0)
		this.body.material = wallMaterial
		this.body.position.copy(this.mesh.position)
		world.addBody(this.body)

		this.mesh.geometry.computeBoundingBox()
		this.boundingBox = new THREE.Box3()
	}

	setColor(color) {
		this.color = color
		const newMaterial = new THREE.MeshStandardMaterial({ color: color })

		this.mesh.material = newMaterial
	}

	rotate(angle) {
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
}

export { Wall }
