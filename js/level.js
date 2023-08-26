import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { Ground } from './ground.js'
import { Wall } from './wall.js'
import { Obstacle } from './obstacle.js'
import { LevelPart } from './levelPart.js'

class Level {
    constructor() {
        this.levelParts = []
    }

    generateLevel() {
        const ground1 = new Ground(10, 0.1, 10)
        //grounds.push(ground1)

        const wall1 = new Wall(new THREE.Vector3(2, -0.5, 0))
        wall1.mesh.rotation.y = 2
        //walls.push(wall1)

        const wall2 = new Wall(new THREE.Vector3(-4.5, -0.5, 0), 1, 1, 10)
        //wall2.mesh.rotation.y = 0
        //walls.push(wall2)

        const levelPart1 = new LevelPart(ground1)
        this.levelParts.push(levelPart1)
        levelPart1.addWall(wall1)
        levelPart1.addWall(wall2)
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
}

export { Level }