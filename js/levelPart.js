import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { Ground } from './ground.js'
import { Wall } from './wall.js'
import { Obstacle } from './obstacle.js'
import { scene } from './setup.js'
import { groundLevel } from './main.js'
import { createSeededRandom, getRandomInt } from './level.js'
import { Noise } from './noise.js'
import { world } from './setup.js'

class LevelPart {
	constructor() {
		this.ground = null
		this.walls = []
		this.obstacles = []
	}

	// Seth the ground form argument instead of initialisation
	setGround(ground) {
		this.ground = ground
	}

	// Add a wall to the current level part
	addWall(wall) {
		this.walls.push(wall)
	}

	// Add an obstacle to the current levelpart
	addObstacle(obstacle) {
		this.obstacles.push(obstacle)
	}

	// Add ground, walls and obstacles to the THREE.js scene
	addToScene() {
		scene.add(this.ground.mesh)

		this.walls.forEach((wall) => scene.add(wall.mesh))
		this.obstacles.forEach((obstacle) => scene.add(obstacle.mesh))
	}

	// Generate a level part
	// Should be seed based and maybe be able to get info about adjacent parts to know where walls should be placed
	generateLevelPart(offset = 0, seed = getRandomInt(0, 1000000)) {
		const seededRandom = createSeededRandom(seed)

		const ground = new Ground(10, 0.1, 7)
		ground.mesh.position.y = groundLevel
		ground.mesh.position.x = offset - 1
		ground.body.position.copy(ground.mesh.position)

		const wall1 = new Wall(new THREE.Vector3(10 * seededRandom() - 5, -0.5, 10 * seededRandom() - 5))
		// const wall1 = new Wall(new THREE.Vector3(0, -0.5, 0))
		wall1.rotateY(seededRandom())

		const wall2 = new Wall(new THREE.Vector3(-4.5, -0.5, 0), 0.1, 1, 10 * seededRandom(), 'red')

		this.setGround(ground)
		this.addWall(wall1)
		this.addWall(wall2)

		this.addToScene()

		// // Create a geometry to hold the plane's vertices
		// const planeGeometry = new THREE.PlaneGeometry(30, 10, 50, 50) // Adjust size and segments as needed

		// // Create a new instance of the noise generator
		// const noise = new Noise() // Assuming you've imported and instantiated the Noise class

		// // Loop through the vertices of the plane geometry and set their positions based on noise
		// for (let i = 0; i < planeGeometry.vertices.length; i++) {
		// 	const vertex = planeGeometry.vertices[i]

		// 	// Use noise function to displace vertices in the X direction
		// 	const x = vertex.x
		// 	// const y = vertex.y
		// 	const noiseValue = noise.perlin2(x * 0.1, 0.1) // Adjust frequency by scaling x and y

		// 	// Modify the z coordinate based on the noise value
		// 	vertex.z = noiseValue * 2 // Adjust the scale factor as needed
		// }

		// // Create a material and mesh for the plane
		// const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
		// const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
		// planeMesh.rotation.x = Math.PI / 2

		// // Add the plane to the scene
		// scene.add(planeMesh)

		// const groundShape = new CANNON.Plane() // Representing an infinite plane
		// const groundBody = new CANNON.Body({ mass: 0 }) // Mass 0 makes it immovable
		// groundBody.addShape(groundShape)
		// world.addBody(groundBody)

		// updatePhysicsBody(planeGeometry, groundBody)
		

		return this
	}
}

// Function to update Cannon.js bodies based on Three.js geometry
function updatePhysicsBody(geometry, body) {
	// Adjust the body's position based on the geometry's vertices
	const vertices = geometry.vertices
	for (let i = 0; i < vertices.length; i++) {
		const vertex = vertices[i]
		body.shapes[0].planeConstant = vertex.z // Update the plane constant
		body.position.set(vertex.x, vertex.y, vertex.z) // Set position based on the vertex
		body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) // Adjust orientation this could be wrong
	}
}

export { LevelPart }
