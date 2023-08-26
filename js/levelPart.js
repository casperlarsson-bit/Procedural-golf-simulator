import { Ground } from './ground.js'
import { Wall } from './wall.js'
import { Obstacle } from './obstacle.js'
import { scene } from './setup.js'
import { groundLevel } from './main.js'

class LevelPart {
    constructor(_ground = new Ground()) {
        this.ground = _ground
        this.walls = []
        this.obstacles = []
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
    generateLevelPart() {
        this.ground.mesh.position.y = groundLevel

        const seed = getRandomInt(0, 1000000) // Generate random seed number, for now
        const seededRandom = createSeededRandom(seed)

        // Generate random numbers using the seeded random generator
        const randomNumber = seededRandom()




        this.addToScene()
    }
}

// Truncate a pseudo random number
function createSeededRandom(seed) {
    let state = seed % 2147483647 // 2^31 - 1
    if (state <= 0) {
        state += 2147483646
    }

    return () => {
        state = state * 16807 % 2147483647
        return (state - 1) / 2147483646
    }
}

// Get a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


export { LevelPart }