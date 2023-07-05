import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { rotateAroundWorldAxis } from './rotation.js'
import { grounds } from './main.js'

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

        // Calculate acceleration according to ODE v' = (F - F_friction) / m
        const acceleration = this.force.sub(this.friction).divideScalar(this.mass)
        this.force = new THREE.Vector3()

        // Iterate next velocity according to Euler's method
        this.velocity.add(acceleration.multiplyScalar(h))

        // Iterate next position according to Euler's method
        this.mesh.position.x += this.velocity.x * h
        this.mesh.position.y += this.velocity.y * h
        this.mesh.position.z += this.velocity.z * h

        // Rotate ball as it moves
        rotateAroundWorldAxis(this.mesh, new THREE.Vector3(this.velocity.z, 0, -this.velocity.x), this.velocity.length() / this.radius * h)

        // Test if ball should stop, then remove friction and set velocity to 0
        if (this.velocity.x * Math.cos(this.tau) < 0) {
            //if (this.velocity.length() < 0.04) {
            this.friction = new THREE.Vector3()
            this.velocity = new THREE.Vector3()
        }
    }

    gravity() {
        // Loop through all grounds and find closest one (downwards)

        const currentGround = grounds[0]

        // if collision or on top of it
        if (currentGround && this.mesh.position.y <= currentGround.mesh.position.y + currentGround.height / 2 + this.radius) {
            this.force.y = 0
            this.velocity.y *= Math.abs(this.velocity.y) < 0.7 ? 0 : -0.7
            this.mesh.position.y = currentGround.mesh.position.y + currentGround.height / 2 + this.radius
        }
        else {
            // if no collision
            this.force.y = -g
        }


    }
}

export { ball }