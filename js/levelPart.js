import { ground } from './ground.js'
import { wall } from './wall.js'
import { obstacle, obstacle } from './obstacle.js'

class levelPart {
    constructor(_ground = new ground()) {
        this.ground = _ground
        this.walls = []
        this.obstacles = []
    }

    addWall(wall = new wall()) {
        this.walls.push(wall)
    }

    addObstacle(obstacle = new obstacle()) {
        this.obstacles.push(obstacle)
    }
}

export { levelPart }