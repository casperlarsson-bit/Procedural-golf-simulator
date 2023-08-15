import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'

class ground {
    constructor(_length = 1, _height = 1, _depth = 1, _color = 'lightgreen') {
        this.length = _length
        this.height = _height
        this.depth = _depth
        this.color = _color

        this.geometry = new THREE.BoxGeometry(_length, _height, _depth)
        this.material = new THREE.MeshStandardMaterial({ color: _color })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
        this.normal = new THREE.Vector3(0, 1, 0)

        this.mesh.geometry.computeBoundingBox()
        this.boundingBox = new THREE.Box3()
    }

    calculateNormal() {
        this.normal = new THREE.Vector3(0, 1, 0).applyEuler(this.mesh.rotation)
        return this.normal
    }

    // Return true if the ball's position is colliding with the ground, false otherwise
    isCollidingWithGround(ball) {
        return ball.mesh.position.y - ball.radius <= this.mesh.position.y + this.height / 2
    }

    // Return the adjusted position vector
    getAdjustedPositionAboveGround(ball) {
        const raycaster = new THREE.Raycaster(ball.mesh.position, this.normal.clone().multiplyScalar(-1))
        const intersections = raycaster.intersectObject(this.mesh)

        if (intersections.length > 0 && ball.firstHit) {
            // Adjust the position just above the ground
            const adjustedPosition = intersections[0].point.clone().add(this.normal.multiplyScalar(ball.radius))
            return adjustedPosition
        }

        return ball.mesh.position // No intersection found, return the original position
    }
}

export { ground }