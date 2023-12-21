import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { golfBall } from './main.js'

// To show the viewing angle
class DirectionArrow {
    constructor() {
        // Define the vertices array
        const vertices = new Float32Array([
            -1.0, -1.0, 0.0,    // vertex 1
            1.0, -1.0, 0.0,     // vertex 2
            1.0, 1.0, 1.0,      // vertex 3
        ])

        // Create the geometry and set the position attribute
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

        // Create the material
        const material = new THREE.MeshBasicMaterial({ color: 'lightgray', side: THREE.DoubleSide })

        // Create the mesh using the geometry and material
        const mesh = new THREE.Mesh(geometry, material)

        // Add the mesh to the scene
        scene.add(mesh)

        // Assign the created objects to instance variables
        this.geometry = geometry
        this.material = material
        this.mesh = mesh
    }

    updatePosition() {
        // Check if arrow should be visible
        if (golfBall.velocity.length() > 0.00001 || golfBall.farFromGround()) {
            this.turnOff()
            return
        }

        this.turnOn()

        // Calculate the tau and sideAngle values
        const tau = -controls.getAzimuthalAngle() - Math.PI / 2
        const sideAngle = -controls.getAzimuthalAngle()

        // Calculate the main direction vector
        const mainDirection = new THREE.Vector3(Math.cos(tau), 0, Math.sin(tau)).normalize().multiplyScalar(4)

        // Calculate the side direction vector
        const sideDirection = new THREE.Vector3(Math.cos(sideAngle), 0, Math.sin(sideAngle)).normalize().multiplyScalar(golfBall.radius / 2)

        // Calculate the vertices
        const vertex1 = golfBall.mesh.position.clone().sub(sideDirection)
        const vertex2 = golfBall.mesh.position.clone().add(sideDirection)
        const vertex3 = golfBall.mesh.position.clone().add(mainDirection)

        // Create the vertices array
        const vertices = new Float32Array([
            vertex1.x, vertex1.y, vertex1.z, // vertex 1
            vertex2.x, vertex2.y, vertex2.z, // vertex 2
            vertex3.x, vertex3.y, vertex3.z  // vertex 3
        ])

        // Update the position attribute of the geometry
        this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    }

    turnOn() {
        this.mesh.visible = true
    }

    turnOff() {
        this.mesh.visible = false
    }
}

export { DirectionArrow }