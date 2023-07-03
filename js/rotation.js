import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'

// Rotate an object around an arbitrary axis in world space       
// Code from https://stackoverflow.com/questions/11060734/how-to-rotate-a-3d-object-on-axis-three-js
function rotateAroundWorldAxis(object, axis, radians) {
    const rotWorldMatrix = new THREE.Matrix4()
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians)

    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix) // pre-multiply
    object.matrix = rotWorldMatrix

    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix)
}

export { rotateAroundWorldAxis }