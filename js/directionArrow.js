import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { golfBall } from './main.js'

class DirectionArrow {
    constructor() {
        this.vertices = new Float32Array([
            -1.0, -1.0, 0.0,    // vertex 1
            1.0, -1.0, 0.0,     // vertex 2
            1.0, 1.0, 1.0,      // vertex 3
        ])

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3))
        this.material = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide })
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        scene.add(this.mesh)
    }

    updatePosition() {
        const tau = -controls.getAzimuthalAngle() - Math.PI / 2
        const direction = golfBall.mesh.position.clone().add(new THREE.Vector3(Math.cos(tau), 0, Math.sin(tau)).normalize().multiplyScalar(5))

        this.vertices = new Float32Array([
            golfBall.mesh.position.x, golfBall.mesh.position.y, golfBall.mesh.position.z,    // vertex 1
            13.0, -5.0, 2.0,     // vertex 2
            direction.x, direction.y, direction.z,      // vertex 3
        ])

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3))
    }
}

export { DirectionArrow }