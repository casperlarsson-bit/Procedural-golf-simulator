import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { renderer, scene, camera, controls, init, threeToCannon, cannonToThree, world } from './setup.js'
import { ballMaterial } from './material.js'
import { rotateAroundWorldAxis } from './rotation.js'
import { levelOne } from './main.js'
import { LevelPart } from './levelPart.js'

const h = 1 / 60
const g = 9.82

const texLoader = new THREE.TextureLoader()

class Ball {
	constructor(
		_radius = 0.5,
		_position = new THREE.Vector3(0, -0.8, 0),
		_mass = 0.6,
		_color = '#' +
			Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, '0')
	) {
		// THREE.js body for visual
		this.radius = _radius
		this.geometry = new THREE.SphereGeometry(_radius, 42, 42) // Radius, width segments, height segments
		this.material = new THREE.MeshStandardMaterial({ color: _color, normalMap: texLoader.load('./textures/golfball-normal.jpg') })
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.castShadow = true
		this.mesh.position.copy(_position)

		// Cannon.js for physics
		this.shape = new CANNON.Sphere(_radius)
		this.body = new CANNON.Body({ mass: _mass, shape: this.shape })
		this.body.material = ballMaterial
		// this.body.linearDamping = 0.5
		this.body.angularDamping = 0.7
		this.body.position.set(_position.x, _position.y, _position.z)
		world.addBody(this.body)

		this.firstHit = true

		// Physical properties
		this.mass = _mass
		this.my = 0.55 // Temp
		this.velocity = new THREE.Vector3()
		this.force = new THREE.Vector3()
		this.tau = 0
		this.friction = new THREE.Vector3()
		this.deltaPosition = new CANNON.Vec3()
	}

	updatePosition() {
		// Initialize previous position
		const previousPosition = this.body.position.clone()

		// Update Cannon.js simulation
		world.step(h)

		if (this.body.velocity.length() < 0.1) {
			this.body.velocity.copy(new CANNON.Vec3())
		}

		// Get current position
		const currentPosition = this.body.position.clone()
		this.deltaPosition = currentPosition.vsub(previousPosition)

		// Update Three.js mesh position based on Cannon.js body position
		this.mesh.position.copy(this.body.position)
		this.mesh.quaternion.copy(this.body.quaternion)
		this.velocity = cannonToThree(this.body.velocity)
	}

	findClosestGround() {
		const currentGrounds = levelOne.filterGrounds(this.mesh.position, this.radius)

		if (currentGrounds.length === 0) {
			return null
		}

		return currentGrounds.reduce((prev, current) => (prev.boundingBox.min.y > current.boundingBox.min.y ? prev : current))
	}

	farFromGround() {
		const currentGround = this.findClosestGround()

		if (!currentGround) return true

		return Math.abs(currentGround.mesh.position.y - this.mesh.position.y) > currentGround.height / 2 + this.radius
	}
}

export { Ball, h, g }
