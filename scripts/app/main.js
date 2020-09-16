// Global imports -
import THREE from './utils/three';
import './utils/CSS2DRenderer.js';
import TWEEN from 'tween.js';

// Local imports -
// Components
import Renderer from './components/Renderer';
import Camera from './components/Camera';
import Borders from './components/Borders';
import CreateMesh from './components/CreateMesh';
import Sun from './components/Sun';
import Moon from './components/Moon';
import Geolocation from './components/Geolocation';

// Helpers
import Texture from './model/Texture';

// Managers
import Stats from 'stats.js'

// Ui
import LoadingUI from './ui/LoadingUI.jsx'
import NavigationUI from './ui/NavigationUI.jsx'
import {UpdatePourcentage} from './ui/LoadingUI.jsx'

// data
import Config from '../config';
// -- End of imports

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Main {
  constructor(container) {
    // Set container property to container element
    this.container = container;

    // Add stats
    this.stats = new Stats();
    this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.stats.dom.style.opacity  = 0.8;
    this.stats.dom.style.top = '';
    this.stats.dom.style.left = '';
    this.stats.dom.style.right = '0px';
    this.stats.dom.style.bottom = '0px';
    this.container.appendChild(this.stats.dom);

    this.scene = new THREE.Scene();
    this.renderer = new Renderer(this.scene, container);

    this.camera = new Camera(this.container, this.scene);

    // Create Country Borders
    this.borders = new Borders(this.scene);
    this.borders.countries_50m()
    //this.borders.usa()
    //this.borders.france()

    UpdatePourcentage(0)

    // We simulate loading
    setTimeout(() => {
      // Everything is now fully loaded
      // MESHES
      // Earth
      this.createMesh = new CreateMesh();
      // Day texture
      this.earth = this.createMesh.earth(200);
      this.earth.name = 'Earth';

      // Night texture
      this.night = this.createMesh.night(201);
      this.earth.add(this.night)
      // Clouds texture
      this.clouds = this.createMesh.clouds(200);
      this.earth.add(this.clouds)

      // Atmosphere

      this.atmosphereLine = new THREE.Group();
      this.atmosphereLine.add(this.createMesh.atmosphereLine(200, 2, '#000659'));
      this.atmosphereLine.add(this.createMesh.atmosphereLine(200, 1.5, '#000659'));
      this.atmosphereLine.add(this.createMesh.atmosphereLine(200, 1.0, '#0036ad'));
      this.atmosphereLine.add(this.createMesh.atmosphereLine(200, 0.5, '#024bc6'));
      this.earth.add(this.atmosphereLine);
      // Glow effect
      this.outsideGlow = this.createMesh.outsideGlow('#0043ff', 0.71, 28.0, 1.0);
      this.earth.add(this.outsideGlow);

      // We add the complete earth on scene
      this.scene.add(this.earth)

      this.sun = new Sun(this.scene, this.camera);
      this.moon = new Moon(this.scene, this.camera);

      this.skybox = this.createMesh.skybox(10000);
      //this.scene.add(this.skybox)
      this.scene.background = this.skybox;

      UpdatePourcentage(100)
    }, 2000)

    //CSS object
    this.geolocation = new Geolocation(this.scene, this.camera, this.container);

    // Start render which does not wait for textures fully loaded
    this.render();
  }
  render() {
    this.renderer.render(this.scene, this.camera);

    // Call any vendor or module updates here
    TWEEN.update();
    //this.controls.threeControls.update();

    // Stats module (FPS tracker...)
    this.stats.begin();
    this.stats.end();

    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }
}
