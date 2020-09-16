import Keyboard from '../utils/Keyboard';
import Helpers from '../utils/Helpers';
import config from '../config';

// Manages all input interactions
export default class Interaction {
  constructor(renderer, scene, camera, controls) {
    // Properties
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.timeout = null;

    // Instantiate keyboard helper
    this.keyboard = new Keyboard();

    // Listeners
    // Mouse events
    this.renderer.domElement.addEventListener('mousemove', (event) => Helpers.throttle(this.onMouseMove(event), 250), false);
    this.renderer.domElement.addEventListener('mouseleave', (event) => this.onMouseLeave(event), false);
    this.renderer.domElement.addEventListener('mouseover', (event) => this.onMouseOver(event), false);

    // Keyboard events
    this.keyboard.domElement.addEventListener('keydown', (event) => {
      // Only once
      if(event.repeat) {
        return;
      }

      if(this.keyboard.eventMatches(event, 'escape')) {
        console.log('Escape pressed');
      }
    });
  }

  onMouseOver(event) {
    event.preventDefault();

    config.isMouseOver = true;
  }

  onMouseLeave(event) {
    event.preventDefault();

    config.isMouseOver = false;
  }

  onMouseMove(event) {
    event.preventDefault();

    clearTimeout(this.timeout);

    this.timeout = setTimeout(function() {
      config.isMouseMoving = false;
    }, 200);

    config.isMouseMoving = true;
  }
}
