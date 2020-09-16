import THREE from '../utils/three';
import Helpers from '../utils/Helpers';
import CreateMesh from './CreateMesh';
import Label from './Label';
import config from '../../config';

// Sets up and places all lights in scene
export default class Geolocation {
  constructor(scene, camera, container) {
    this.scene = scene;
    this.camera = camera;
    this.container = container;

    this.init = this.init.bind(this);
    this.createMesh = new CreateMesh();
    this.getGeolocation();
  }
  getGeolocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.init(position.coords);
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }
  init(coords) {
    this.label = new Label(this.container, this.camera.threeCamera, { lat: coords.latitude, lon: coords.longitude }, '<div class="location active"></div>')
    config.labels.push(this.label);

    var position = Helpers.convertLatLonToVec3(coords.latitude, coords.longitude).multiplyScalar(200);
    this.pin = this.createMesh.point(0.5, '#ff005d', 1);
    this.pin.position.set(position.x, position.y, position.z);
    this.scene.add(this.pin);
  }
}
