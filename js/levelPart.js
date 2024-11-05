import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { Ground } from './ground.js'
import { Wall } from './wall.js'
import { Obstacle } from './obstacle.js'
import { cannonToThree, scene } from './setup.js'
import { groundLevel } from './main.js'
import { createSeededRandom, getRandomInt } from './level.js'
import { Noise } from './noise.js'
import { world } from './setup.js'
import { groundMaterial } from './material.js'

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

		// const wall1 = new Wall(new THREE.Vector3(10 * seededRandom() - 5, -0.5, 10 * seededRandom() - 5))
		// const wall1 = new Wall(new THREE.Vector3(0, -0.5, 0))
		// wall1.rotateY(seededRandom())

		const wall2 = new Wall(new THREE.Vector3(-4.5, -0.5, 0), 0.1, 1, 10 * seededRandom(), 'red')

		this.setGround(ground)
		// this.addWall(wall1)
		this.addWall(wall2)

		this.addToScene()

		// Create a geometry to hold the plane's vertices
		const planeGeometry = new THREE.PlaneGeometry(30, 10, 50, 50) // Adjust size and segments as needed

		// Create a new instance of the noise generator
		const noise = new Noise() // Assuming you've imported and instantiated the Noise class

		// Loop through the vertices of the plane geometry and set their positions based on noise
		for (let i = 0; i < planeGeometry.vertices.length; i++) {
			const vertex = planeGeometry.vertices[i]

			// Use noise function to displace vertices in the X direction
			const x = vertex.x
			const y = vertex.y
			const noiseValue = noise.perlin2(x * 0.1, 0.1) // Adjust frequency by scaling x and y

			// Modify the z coordinate based on the noise value
			vertex.z = noiseValue * 2 // Adjust the scale factor as needed
		}

		// Create a material and mesh for the plane
		const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
		const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
		planeMesh.rotation.x = -Math.PI / 2

		// Add the plane to the scene
		// scene.add(planeMesh)

		var matrix = []
		var sizeX = 15,
			sizeY = 15
		for (var i = 0; i < sizeX; i++) {
			matrix.push([])
			for (var j = 0; j < sizeY; j++) {
				var height = Math.cos((i / sizeX) * Math.PI * 2) * Math.cos((j / sizeY) * Math.PI * 2) + 2
				if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeY - 1) height = 3
				matrix[i].push(height)
			}
		}

		// Create the heightfield
		var hfShape = new CANNON.Heightfield(matrix, {
			elementSize: 1,
		})
		var groundBody = new CANNON.Body({ mass: 0 })
		groundBody.addShape(hfShape)
		groundBody.position.set(0, -1, 0);
		world.addBody(groundBody)

		// const visualPlane = createVisualPlane(groundBody.shapes[0]) // groundBody is your Cannon.js body
		
		const visualPlane = createVisualHeightfield(groundBody)
		// visualPlane.rotation.x = -Math.PI / 2
		// console.log(visualPlane.geometry)
		scene.add(visualPlane)


		return this
	}
}

// Function to update Cannon.js bodies based on Three.js geometry
function createVisualHeightfield(cannonHeightfield) {
	const matrix = cannonHeightfield.shapes[0].data
	const elementSize = cannonHeightfield.shapes[0].elementSize
	const width = matrix.length
	const height = matrix[0].length

	const geometry = new THREE.Geometry()

	// Create vertices
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const vertex = new THREE.Vector3(i * elementSize, j * elementSize, matrix[i][j])
			geometry.vertices.push(vertex.add(cannonToThree(cannonHeightfield.position)))
		}
	}


	// Create faces
	for (let i = 0; i < width - 1; i++) {
		for (let j = 0; j < height - 1; j++) {
			const index = i * height + j
			const a = index
			const b = index + 1
			const c = index + height
			const d = index + height + 1

			geometry.faces.push(new THREE.Face3(a, b, d))
			geometry.faces.push(new THREE.Face3(d, c, a))

			geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)])
			geometry.faceVertexUvs[0].push([new THREE.Vector2(1, 1), new THREE.Vector2(0, 1), new THREE.Vector2(0, 0)])
		}
	}

	geometry.computeFaceNormals()
	geometry.computeVertexNormals()

	const material = new THREE.MeshBasicMaterial({ color: 'orange', side: THREE.DoubleSide })
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}

export { LevelPart }
