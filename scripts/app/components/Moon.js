import THREE from '../utils/three';
import Helpers from '../utils/Helpers';
import CreateMesh from '../components/CreateMesh';
import {MoonCalculator} from '../utils/MoonCalculator';
import {Clock} from './Clock';

export default class Moon {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.moon = new CreateMesh().moon(50);
    this.scene.add(this.moon)

    this.update();
    // Every minute
    setInterval(() => {
      this.update();
    }, 1000)
  }
  update() {
    let moonPosition = MoonCalculator(Clock());
    var pos2d = Helpers.calculate2dPosition({ lat: moonPosition.latitude, lon: moonPosition.longitude });
    pos2d.altitude = 2000;
    Helpers.set3dPosition(this.moon, pos2d);
  }
}
