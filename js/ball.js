import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'

const h = 1 / 60
const g = 9.82
const my = 0.55 // Temp

const texLoader = new THREE.TextureLoader()

class ball {
    constructor(_radius = 0.5, _color = '#' + Math.floor(Math.random() * 16777215).toString(16)) {
        this.radius = _radius
        this.geometry = new THREE.SphereGeometry(_radius, 42, 42) // Radius, width segments, height segments
        this.material = new THREE.MeshStandardMaterial({ color: _color, normalMap: texLoader.load('./textures/golfball-normal.jpg') })
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.mass = 1
        this.velocity = new THREE.Vector2(0, 0)
        this.force = 400
        this.tau = Math.PI
        this.friction = this.mass * g * my
    }

    euler() {
        // Calculate acceleration according to ODE v' = (F - F_friction) / m
        const acceleration = new THREE.Vector2((this.force - this.friction) * Math.cos(this.tau) / this.mass, (this.force - this.friction) * Math.sin(this.tau) / this.mass)
        this.force = 0

        // Iterate next velocity according to Euler's method
        this.velocity.add(acceleration.multiplyScalar(h))

        // Iterate next position according to Euler's method
        this.mesh.position.x += this.velocity.x * h
        this.mesh.position.y += this.velocity.y * h

        // Test if ball should stop, then remove friction and set velocity to 0
        if (this.velocity.x * Math.cos(this.tau) < 0) {
            this.friction = 0
            this.velocity = new THREE.Vector2()
        }
    }
}

export { ball }