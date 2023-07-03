import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'
import { renderer, scene, camera, controls, init } from './setup.js'
import { ball } from './ball.js'

const golfBall = new ball(1)
scene.add(golfBall.mesh)

function animate() {
    requestAnimationFrame(animate)
    setTimeout(function(){
        golfBall.euler()
        //code goes here
   }, 2000); //Time before execution

    controls.getAzimuthalAngle() // For angle
    renderer.render(scene, camera)
}

init()
animate()