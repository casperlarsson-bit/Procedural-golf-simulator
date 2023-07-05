import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'

class ground {
    constructor(_length = 1, _height = 1, _depth = 1) {
        this.length = _length
        this.height = _height
        this.depth = _depth

        this.geometry = new THREE.BoxGeometry(_length, _height, _depth)
        this.material = new THREE.MeshStandardMaterial({ color: 'lightgreen' })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
    }
}

export { ground }