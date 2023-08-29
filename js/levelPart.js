import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { Ground } from './ground.js'
import { Wall } from './wall.js'
import { Obstacle } from './obstacle.js'
import { scene } from './setup.js'
import { groundLevel } from './main.js'
import { createSeededRandom, getRandomInt } from './level.js'

class LevelPart {
    constructor(_ground = new Ground()) {
        this.ground = _ground
        this.walls = []
        this.obstacles = []
    }

    // Seth the ground form argument instead of initialisation
    setGround(ground = new Ground()) {
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

        this.walls.forEach(wall => scene.add(wall.mesh))
        this.obstacles.forEach(obstacle => scene.add(obstacle.mesh))
    }

    // Generate a level part
    // Should be seed based and maybe be able to get info about adjacent parts to know where walls should be placed
    generateLevelPart(seed = getRandomInt(0, 1000000), prevLevelPart = null) {
        const seededRandom = createSeededRandom(seed)

        // No previous level part, this is the start plate
        if (!prevLevelPart) {

        }

        // Generate random numbers using the seeded random generator
        const randomNumber = seededRandom()

        const ground1 = new Ground(10, 0.1, 10)
        ground1.mesh.position.y = groundLevel
        const wall1 = new Wall(new THREE.Vector3(10 * seededRandom() - 5, -0.5, 10 * seededRandom() - 5))
        wall1.mesh.rotation.y = seededRandom()

        const wall2 = new Wall(new THREE.Vector3(-4.5, -0.5, 0), 0.1, 1, 10 * seededRandom())
        //wall2.mesh.rotation.y = 0

        this.setGround(ground1)
        this.addWall(wall1)
        this.addWall(wall2)


        this.addToScene()
    }
}

export { LevelPart }