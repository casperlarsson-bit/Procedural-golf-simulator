import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { rotateAroundWorldAxis } from './rotation.js'
import { grounds, walls } from './main.js'

const h = 1 / 60
const g = 9.82

const texLoader = new THREE.TextureLoader()

class ball {
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
        // Loop through all grounds and find closest one (downwards)
        const currentGrounds = grounds.filter(currentGround => {
            currentGround.boundingBox.copy(currentGround.mesh.geometry.boundingBox).applyMatrix4(currentGround.mesh.matrixWorld)

            return currentGround.boundingBox.min.x < this.mesh.position.x && this.mesh.position.x < currentGround.boundingBox.max.x
                && currentGround.boundingBox.min.z < this.mesh.position.z && this.mesh.position.z < currentGround.boundingBox.max.z
                && currentGround.boundingBox.min.y < this.mesh.position.y - this.radius
        })

        // If there is no ground underneath the ball, return
        if (currentGrounds.length === 0) {
            this.friction = new THREE.Vector3()
            this.force.y = -g // * this.mass
            return
        }

        // Get the ground with highest y value
        const currentGround = currentGrounds.reduce((prev, current) => (prev.boundingBox.min.y > current.boundingBox.min.y) ? prev : current)

        currentGround.handleCollision(this)
    }

    wallCollision() {
        // Set up pairs of meshes and wall class
        const wallMeshes = walls.map(wall => wall.mesh)
        const wallMap = new Map()
        for (let i = 0; i < walls.length; ++i) {
            wallMap.set(wallMeshes[i], walls[i])
        }

        // Cast a ray in the direction the ball is moving to detect walls that will collide
        // @TODO This assumes ball is going perpendicular towards the wall, goes inside the wall if it has an angle
        const raycaster = new THREE.Raycaster(this.mesh.position, this.velocity.clone().normalize())
        const maxDistance = this.radius // Set a max distance to only have collision as ball hits the wall
        raycaster.far = maxDistance

        const intersects = raycaster.intersectObjects(wallMeshes) // Get the walls which are in the way of the ball
        if (intersects.length > 0 && intersects[0].distance <= maxDistance) {
            const intersection = intersects[0]

            const collidedWallMesh = intersection.object
            const collidedWall = wallMap.get(collidedWallMesh)

            const faceNormal = intersection.face.normal.clone() // Normal of the intersected face, local coordinates
            const angle = collidedWallMesh.rotation.y // Get the rotation of the mesh
            // Create a rotation matrix for rotation around the y-axis
            const rotationMatrix = new THREE.Matrix4()
            rotationMatrix.makeRotationY(angle)

            // Apply rotation to the normal
            faceNormal.applyMatrix4(rotationMatrix);

            collidedWall.setColor('orange')

            // TEMP
            // v_out = v - 2 * (v dot n) * n

            // Calculate reflection of velocity vector based on normal
            const reflection = faceNormal.clone().multiplyScalar(2 * this.velocity.dot(faceNormal))

            // Apply new velocity to the ball after collision
            this.velocity.sub(reflection)
        }
    }
}

export { ball, h, g }