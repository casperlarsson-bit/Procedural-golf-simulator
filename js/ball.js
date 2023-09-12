import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { rotateAroundWorldAxis } from './rotation.js'
import { levelOne } from './main.js'
import { LevelPart } from './levelPart.js'

const h = 1 / 60
const g = 9.82

const texLoader = new THREE.TextureLoader()

class Ball {
    constructor(_radius = 0.5, _mass = 0.6, _color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')) {
        this.radius = _radius
        this.geometry = new THREE.SphereGeometry(_radius, 42, 42) // Radius, width segments, height segments
        this.material = new THREE.MeshStandardMaterial({ color: _color, normalMap: texLoader.load('./textures/golfball-normal.jpg') })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.castShadow = true

        this.firstHit = true

        // Physical properties
        this.mass = _mass
        this.my = 0.55 // Temp
        this.velocity = new THREE.Vector3()
        this.force = new THREE.Vector3()
        this.tau = 0
        this.friction = new THREE.Vector3()
    }

    euler() {
        this.gravity()
        this.wallCollision()

        // Calculate acceleration according to ODE v' = (F - F_friction) / m
        const acceleration = this.force.sub(this.friction).divideScalar(this.mass)
        this.force = new THREE.Vector3()

        // Iterate next velocity according to Euler's method
        this.velocity.add(acceleration.multiplyScalar(h))

        // Iterate next position according to Euler's method
        this.mesh.position.copy(this.mesh.position.clone().add(this.velocity.clone().multiplyScalar(h)))

        // Rotate ball as it moves
        rotateAroundWorldAxis(this.mesh, new THREE.Vector3(this.velocity.z, 0, -this.velocity.x), this.velocity.length() / this.radius * h)

        // Test if ball should stop, then remove friction and set velocity to 0, this has to be done better
        //if (this.velocity.x * Math.cos(this.tau) < 0) {
        if (this.velocity.length() < 0.05) {
            this.friction = new THREE.Vector3()
            this.velocity = new THREE.Vector3()
        }
    }

    gravity() {
        const currentGround = this.findClosestGround()

        if (!currentGround) {
            this.applyFreeFalling()
            return
        }

        currentGround.handleCollision(this)
    }

    wallCollision() {
        const walls = levelOne.getWalls()

        // Cast a ray in the direction the ball is moving to detect walls that will collide
        // @TODO This assumes ball is going perpendicular towards the wall, goes inside the wall if it has an angle
        const raycaster = new THREE.Raycaster(this.mesh.position, this.velocity.clone().normalize())
        const maxDistance = this.radius // Set a max distance to only have collision as the ball hits the wall
        raycaster.far = maxDistance

        // Get intersections between the ray and wall meshes
        const intersects = raycaster.intersectObjects(walls.map(wall => wall.mesh))

        if (intersects.length > 0) {
            const intersection = intersects[0]
            const collidedWall = walls.find(wall => wall.mesh === intersection.object)

            const faceNormal = intersection.face.normal.clone() // Normal of the intersected face, local coordinates
            const angle = collidedWall.mesh.rotation.y // Get the rotation of the mesh

            // Apply rotation to the face normal
            const rotationMatrix = new THREE.Matrix4().makeRotationY(angle)
            faceNormal.applyMatrix4(rotationMatrix)

            // Temporarily change the colour for visualisation
            collidedWall.setColor('orange')

            // Calculate reflection of velocity vector based on normal
            // v_out = v - 2 * (v dot n) * n
            const reflection = faceNormal.clone().multiplyScalar(2 * this.velocity.dot(faceNormal))

            // Apply new velocity to the ball after collision
            this.velocity.sub(reflection)
        }
    }

    findClosestGround() {
        const currentGrounds = levelOne.filterGrounds(this.mesh.position, this.radius)

        if (currentGrounds.length === 0) {
            return null
        }

        return currentGrounds.reduce((prev, current) => (prev.boundingBox.min.y > current.boundingBox.min.y) ? prev : current)
    }

    applyFreeFalling() {
        this.friction = new THREE.Vector3()
        this.force.y = -g // * this.mass
    }

    farFromGround() {
        const currentGround = this.findClosestGround()

        if (!currentGround) return true

        return Math.abs(currentGround.mesh.position.y - this.mesh.position.y) > (currentGround.height / 2 + this.radius)
    }
}

export { Ball, h, g }