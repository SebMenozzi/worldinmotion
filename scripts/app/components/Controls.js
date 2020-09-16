import THREE from '../utils/three';

import OrbitControls from '../utils/OrbitControls';
import config from '../../config';

// Controls based on orbit controls
export default class Controls {
  constructor(camera, container) {
    // Orbit controls first needs to pass in THREE to constructor
    this.threeControls = new THREE.OrbitControls(camera, container);
    console.log(this.threeControls)
    this.init();
  }

  init() {
    this.threeControls.target.set(config.controls.target.x, config.controls.target.y, config.controls.target.z);
    this.threeControls.autoRotate = config.controls.autoRotate;
    this.threeControls.autoRotateSpeed = config.controls.autoRotateSpeed;
    this.threeControls.rotateSpeed = config.controls.rotateSpeed;
    this.threeControls.zoomSpeed = config.controls.zoomSpeed;
    this.threeControls.distance = config.controls.distance;
    this.threeControls.minDistance = config.controls.minDistance;
    this.threeControls.maxDistance = config.controls.maxDistance;
    this.threeControls.minPolarAngle = config.controls.minPolarAngle;
    this.threeControls.maxPolarAngle = config.controls.maxPolarAngle;
    this.threeControls.enableDamping = config.controls.enableDamping;
    this.threeControls.enableZoom = config.controls.enableZoom;
    this.threeControls.dampingFactor = config.controls.dampingFactor;
    this.threeControls.deceleration = config.controls.deceleration;
  }
}
