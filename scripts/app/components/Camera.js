import THREE from '../utils/three';
import Label from './Label';
import config from '../../config';
import Helpers from '../utils/Helpers';
import {UpdatePosition} from '../ui/GlobalInfoUI.jsx'

// Class that creates and updates the main camera
export default class Camera {
  constructor(container, scene) {
    // Properties
    this.container = container;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();

    this.distanceTarget = 800;
    this.distance = this.distanceTarget;
    this.rotation = { x: 0, y: 0, z: 0};
    this.target = { x: Math.PI*3/2, y: Math.PI / 6.0 };
    this.targetOnDown = {};
    this.incr_rotation = { x: -0.0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.mouse2 = { x: 0, y: 0 };
    this.mouseOnDown = { x: 0, y: 0 };
    this.time = 0;

    // Create and position a Perspective Camera
    this.threeCamera = new THREE.PerspectiveCamera(config.camera.fov, window.innerWidth / window.innerHeight, config.camera.near, config.camera.far);
    this.threeCamera.position.set(config.camera.posX, config.camera.posY, config.camera.posZ);
    // Initial sizing
    this.updateSize();

    // Bindings
    this.onPressDown = this.onPressDown.bind(this);
    this.onPressUp = this.onPressUp.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.onMove = this.onMove.bind(this);
    this.checkAltituteBoundries = this.checkAltituteBoundries.bind(this);
    this.zoomRelative = this.zoomRelative.bind(this);
    this.zoomTo = this.zoomTo.bind(this);
    this.zoomImmediatelyTo = this.zoomImmediatelyTo.bind(this);

    this.cursor = new Label(this.scene, this.threeCamera, { lat: 0, lon: 0 })
    config.labels.push(this.cursor);

    // Listeners
    // On resize window
    window.addEventListener('resize', () => this.updateSize(), false);
    // On press
    this.container.addEventListener('mousedown', this.onPressDown, false);
    // On scroll for Chrome
    this.container.addEventListener('mousewheel', this.onZoom, false);
    // On scroll for Firefox
    this.container.addEventListener('DOMMouseScroll', this.onZoom, false);
  }
  onPressDown(event) {
    event.preventDefault();
    // We start a counter
    this.timerID = setInterval(
      () => {this.time += 500;},
      500
    );
    // We disable events that could annoy the user during draging the earth
    this.container.addEventListener('mousemove', this.onMove, false);
    this.container.addEventListener('mouseup', this.onPressUp, false);

    this.mouseOnDown.x = -event.clientX;
    this.mouseOnDown.y = event.clientY;

    this.targetOnDown.x = this.target.x;
    this.targetOnDown.y = this.target.y;

    this.container.style.cursor = '-webkit-grab';
  }
  onMove(event) {
    var zoomDamp = this.distance / 500;

    this.mouse.x = -event.clientX;
    this.mouse.y = event.clientY;

    this.target.x = this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005 * zoomDamp;
    this.target.y = this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005 * zoomDamp;

    this.target.y = this.target.y > Math.PI / 2 ? Math.PI / 2 : this.target.y;
    this.target.y = this.target.y < - Math.PI / 2 ? - Math.PI / 2 : this.target.y;
  }
  onPressUp(event) {
    this.container.removeEventListener('mousemove', this.onMove, false);
    this.container.removeEventListener('mouseup', this.onPressDown, false);
    // Stop the counter
    clearInterval(this.timerID);
    // If "time of draging" doesn't exceed 1 second
    if (this.time < 1000) {
      var diff1 = Math.abs( this.target.x - this.targetOnDown.x );
      var diff2 = Math.abs( this.target.y - this.targetOnDown.y );

      // If there is a movement
      if(diff1 < 0.2 && diff2 < 0.2) {

        this.mouse2.x = ( event.clientX / this.container.clientWidth ) * 2 - 1;
        this.mouse2.y = - ( event.clientY / this.container.clientHeight ) * 2 + 1;

        this.raycaster.setFromCamera( this.mouse2, this.threeCamera );
        var intersects = this.raycaster.intersectObjects( this.scene.children );

        if (intersects.length > 0) {
          if (intersects[0].object.name == "Earth" || intersects[0].object.name == "Label" || intersects[0].object.name == "Border" || intersects[0].object.name == "Point") {
            // Redirect to the current location
            var coords = Helpers.calculate3dPosition(intersects[0].point, 200);

            this.target = Helpers.calculate2dPosition({
              lat: coords.lat,
              lon: coords.lon
            });

            this.cursor.setLabel({ lat: coords.lat, lon: coords.lon }, '<div class="cursor"></div>');

            UpdatePosition(coords.lat, coords.lon);
          }
        }
      }
    }
    // Reset the counter
    this.time = 0;
    this.container.style.cursor = 'auto';
  }
  checkAltituteBoundries() {
    // max zoom
    if(this.distanceTarget <= 300)
      this.distanceTarget = 300;

    // min zoom
    else if(this.distanceTarget >= 1300)
      this.distanceTarget = 1300;
  }
  zoomRelative(delta) {
    this.distanceTarget -= delta;
    this.checkAltituteBoundries();
  }
  zoomTo(altitute) {
    this.distanceTarget = altitute;
    this.checkAltituteBoundries();
  }
  zoomImmediatelyTo(altitute) {
    this.distanceTarget = this.distance = altitute;
    this.checkAltituteBoundries();
  }
  onZoom(event) {
    event.preventDefault();
    // @link http://www.h3xed.com/programming/javascript-mouse-scroll-wheel-events-in-firefox-and-chrome
    if(event.wheelDelta)
      var delta = event.wheelDelta * 0.5; // chrome
    else
      var delta = -event.detail * 15; // firefox

    this.zoomRelative(delta);
  }
  update() {
    var deleration = 0.1;
    var deleration2 = 0.3;

    this.rotation.x += (this.target.x - this.rotation.x) * deleration;
    this.rotation.y += (this.target.y - this.rotation.y) * deleration;
    this.distance += (this.distanceTarget - this.distance) * deleration2;

    this.threeCamera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    this.threeCamera.position.y = this.distance * Math.sin(this.rotation.y);
    this.threeCamera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);
    this.threeCamera.lookAt(new THREE.Vector3());
  }
  updateSize() {
    // Multiply by dpr in case it is retina device
    this.threeCamera.aspect = (window.innerWidth / window.innerHeight);
    // Always call updateProjectionMatrix on camera change
    this.threeCamera.updateProjectionMatrix();
  }
}
