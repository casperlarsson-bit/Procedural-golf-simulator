import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { Ground } from './ground.js'
import { Wall } from './wall.js'
import { Obstacle } from './obstacle.js'
import { scene } from './setup.js'
import { groundLevel } from './main.js'
import { createSeededRandom, getRandomInt } from './level.js'

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
	addWall(wall = new Wall()) {
		this.walls.push(wall)
	}

	// Add an obstacle to the current levelpart
	addObstacle(obstacle = new obstacle()) {
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
		wall1.mesh.rotation.y = seededRandom()

		const wall2 = new Wall(new THREE.Vector3(-4.5, -0.5, 0), 0.1, 1, 10 * seededRandom())

		this.setGround(ground)
		this.addWall(wall1)
		this.addWall(wall2)

		this.addToScene()
		return this
	}
}

export { LevelPart }
