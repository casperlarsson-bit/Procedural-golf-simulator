import { Ground } from './ground.js'
import { Wall } from './wall.js'
import { Obstacle } from './obstacle.js'
import { LevelPart } from './levelPart.js'

class Level {
    constructor() {
        this.levelParts = []
    }

    generateLevel() {
        const levelPart1 = new LevelPart()
        this.levelParts.push(levelPart1)
        levelPart1.generateLevelPart()
    }

    filterGrounds(position, radius) {
        const grounds = this.levelParts.map(levelPart => levelPart.ground)

        return grounds.filter(currentGround => {
            currentGround.boundingBox.copy(currentGround.mesh.geometry.boundingBox).applyMatrix4(currentGround.mesh.matrixWorld)

            return currentGround.boundingBox.min.x < position.x && position.x < currentGround.boundingBox.max.x
                && currentGround.boundingBox.min.z < position.z && position.z < currentGround.boundingBox.max.z
                && currentGround.boundingBox.min.y < position.y - radius
        })
    }

    getWalls() {
        return this.levelParts.map(levelPart => levelPart.walls).reduce((initial, current) => initial.concat(current), [])
    }

    getObstacles() {
        return this.levelParts.map(levelPart => levelPart.obstacles).reduce((initial, current) => initial.concat(current), [])
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

export { Level, createSeededRandom, getRandomInt }