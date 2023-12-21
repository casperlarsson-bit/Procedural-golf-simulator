import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { world } from './setup.js'

// Create materials
const ballMaterial = new CANNON.Material()
const groundMaterial = new CANNON.Material()
const wallMaterial = new CANNON.Material()

// Define contact material between ball and ground
const ballGroundContactMaterial = new CANNON.ContactMaterial(ballMaterial, groundMaterial, {
	friction: 0.5,
	restitution: 0.5,
})

const ballWallContactMaterial = new CANNON.ContactMaterial(ballMaterial, wallMaterial, {
	friction: 0.5,
	restitution: 0.8,
})

// Add contact material to the world
world.addContactMaterial(ballWallContactMaterial)
world.addContactMaterial(ballGroundContactMaterial)

export { ballMaterial, groundMaterial, wallMaterial }
