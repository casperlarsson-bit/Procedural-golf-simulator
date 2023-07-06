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

        this.mesh.geometry.computeBoundingBox()
        this.boundingBox = new THREE.Box3()
    }
}

export { ground }