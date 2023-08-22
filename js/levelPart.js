import { ground } from './ground.js'
import { wall } from './wall.js'
import { obstacle } from './obstacle.js'
import { scene } from './setup.js'
import { groundLevel } from './main.js'

class levelPart {
    constructor(_ground = new ground()) {
        this.ground = _ground
        this.walls = []
        this.obstacles = []
    }

    // Add a wall to the current level part
    addWall(wall = new wall()) {
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
    }

    // Generate a level part
    // Should be seed based and maybe be able to get info about adjacent parts to know where walls should be placed
    generateLevelPart() {
        this.ground.mesh.position.y = groundLevel

        this.addToScene()
    }
}

export { levelPart }