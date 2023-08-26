import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'

class Wall {
    constructor(_position = new THREE.Vector3(), _length = 1, _height = 1, _depth = 1, _color = 'lightpink') {
        this.length = _length
        this.height = _height
        this.depth = _depth
        this.color = _color

        this.geometry = new THREE.BoxGeometry(_length, _height, _depth)
        this.material = new THREE.MeshStandardMaterial({ color: _color })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.copy(_position)
        this.mesh.receiveShadow = true
        //this.normal = new THREE.Vector3(0, 1, 0)

        this.mesh.geometry.computeBoundingBox()
        this.boundingBox = new THREE.Box3()
    }

    setColor(color) {
        this.color = color
        const newMaterial = new THREE.MeshStandardMaterial({ color: color})

        this.mesh.material = newMaterial
    }
}


// v_out = v - 2 * (v dot n) * n

// From chatGPT
/*
// Given collision point, box position, and box dimensions
function determineCollidedFaceNormal(collisionPoint, boxPosition, boxDimensions) {
    // Calculate the half dimensions of the box
    const halfWidth = boxDimensions.x / 2;
    const halfHeight = boxDimensions.y / 2;
    const halfDepth = boxDimensions.z / 2;

    // Calculate the distance from the collision point to each face
    const distances = [
        Math.abs(collisionPoint.x - (boxPosition.x - halfWidth)),
        Math.abs(collisionPoint.x - (boxPosition.x + halfWidth)),
        Math.abs(collisionPoint.y - (boxPosition.y - halfHeight)),
        Math.abs(collisionPoint.y - (boxPosition.y + halfHeight)),
        Math.abs(collisionPoint.z - (boxPosition.z - halfDepth)),
        Math.abs(collisionPoint.z - (boxPosition.z + halfDepth))
    ];

    // Find the index of the closest face
    const closestFaceIndex = distances.indexOf(Math.min(...distances));

    // Get the corresponding normal vector for the closest face
    const normals = [
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0, 0, 1)
    ];

    const closestNormal = normals[closestFaceIndex];

    return closestNormal;
}

// Example usage
const collisionPoint = new THREE.Vector3(0, 0, 10); // Example collision point
const boxPosition = new THREE.Vector3(0, 0, 0); // Example box position
const boxDimensions = new THREE.Vector3(10, 10, 10); // Example box dimensions

const closestNormal = determineCollidedFaceNormal(collisionPoint, boxPosition, boxDimensions);
console.log("Closest Normal:", closestNormal);
*/

export { Wall }