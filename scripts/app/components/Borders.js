import THREE from '../utils/three';
import Border from './Border';

export default class Borders {
  constructor(scene) {
    this.scene = scene;
  }
  coastline_50m() {
    new Border(this.scene, './assets/data/world.json', 'coastline_50m', 200.1, 1.0, 1.0).init();
  }
  coastline_110m() {
    new Border(this.scene, './assets/data/world.json', 'coastline_110m', 200.1, 1.5, 1.0).init();
  }
  lakes_50m() {
    new Border(this.scene, './assets/data/world.json', 'lakes_50m', 200.1, 1.0, 0.6).init();
  }
  lakes_110m() {
    new Border(this.scene, './assets/data/world.json', 'lakes_110m', 200.1, 1.0, 0.6).init();
  }
  rivers_50m() {
    new Border(this.scene, './assets/data/world.json', 'rivers_50m', 200.1, 1.0, 0.6).init();
  }
  rivers_110m() {
    new Border(this.scene, './assets/data/world.json', 'rivers_110m', 200.1, 1.0, 0.6).init();
  }
  countries_50m() {
    new Border(this.scene, './assets/data/countries_50m.json', 'countries', 200.1, 1.5, 1.0).init();
  }
  usa_10m() {
    new Border(this.scene, './assets/data/usa_10m.json', 'state', 200.1, 1.0, 1.0).init();
  }
  usa() {
    new Border(this.scene, './assets/data/usa.json', 'state', 200.1, 1.0, 1.0).init();
  }
  france() {
    new Border(this.scene, './assets/data/france.json', 'regions', 200.1, 1.0, 1.0).init();
  }
}
