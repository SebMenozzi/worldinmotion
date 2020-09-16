import Keyboard from '../utils/Keyboard';
import Helpers from '../utils/Helpers';
import config from '../config';

// Manages all input interactions
export default class Controls {
  constructor(renderer, scene, camera) {
    // Properties
    this.renderer = renderer;
    this.container = this.renderer.domElement;
    this.scene = scene;
    this.camera = camera;

    this.distanceTarget = 800;
    this.distance = this.distanceTarget;
    this.rotation = { x: 0, y: 0, z: 0};
    this.target = { x: Math.PI*3/2, y: Math.PI / 6.0 };
    this.targetOnDown = {};
    this.incr_rotation = { x: 0, y: 0, z: 0 };
    this.mouse = { x: 0, y: 0 };
    this.mouse2 = { x: 0, y: 0 };
    this.mouseOnDown = { x: 0, y: 0 };

    // Listeners
    // Mouse events

    // On press
    this.container.addEventListener('mousedown', this.onPress, false);
    // On scroll for Chrome
    this.container.addEventListener('mousewheel', this.onZoom, false);
    // On scroll for Firefox
    this.container.addEventListener('DOMMouseScroll', this.onZoom, false);
    // On move
    //renderer.domElement.addEventListener('mousemove', handle.over, false);

  }

  onPressDown(event) {
    event.preventDefault();
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
    var zoomDamp = this.distance / 1000;

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

    var diff1 = Math.abs( this.target.x - this.targetOnDown.x );
    var diff2 = Math.abs( this.target.y - this.targetOnDown.y );

    // Si il n'y a pas eu un mouvement, on regarde si il y a un clique sur un label
    if(diff1 < 0.2 && diff2 < 0.2) {

      this.mouse2.x = ( event.clientX / this.container.clientWidth ) * 2 - 1;
      this.mouse2.y = - ( event.clientY / this.container.clientHeight ) * 2 + 1;

      raycaster.setFromCamera( mouse2, camera );
      var intersects = raycaster.intersectObjects( scene.children );

      if (intersects.length > 0) {
        if (intersects[0].object.name == "Earth" || intersects[0].object.name == "Label" || intersects[0].object.name == "Country" || intersects[0].object.name == "Point") {

          var coords = Helpers.calculate3dPosition(intersects[0].point, 200);

          console.log('Camera:')
          console.log(this.threeCamera.position)

          this.target = Helpers.calculate2dPosition({
            lat: lat,
            lon: lon
          });

          GlobalInfoUI(coords.lat, coords.lon);
        }

      } else {
        INTERSECTED = null;
      }
    }
    container.style.cursor = 'auto';
  }
  checkAltituteBoundries() {
    // max zoom
    if(this.distanceTarget < 501)
      this.distanceTarget = 501;

    // min zoom
    else if(this.distanceTarget > 1300)
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
    const checkAltituteBoundries = (distanceTarget) => {
      // max zoom
      if(distanceTarget < 501)
        distanceTarget = 501;

      // min zoom
      else if(distanceTarget > 1300)
        distanceTarget = 1300;

      return distanceTarget;
    }
    const zoomRelative = (distanceTarget, delta) => {
      distanceTarget -= delta;
      return checkAltituteBoundries(distanceTarget);
    }

    event.preventDefault();
    // @link http://www.h3xed.com/programming/javascript-mouse-scroll-wheel-events-in-firefox-and-chrome
    if(event.wheelDelta)
      var delta = event.wheelDelta * 0.5; // chrome
    else
      var delta = -event.detail * 15; // firefox

    this.distanceTarget = zoomRelative(this.distanceTarget, delta);

    console.log(this.distanceTarget)
  }
  update() {
    this.target.x += this.incr_rotation.x;
    this.target.y += this.incr_rotation.y;

    this.rotation.x += (this.target.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1;
    this.distance += (this.distanceTarget - this.distance) * 0.3;

    this.threeCamera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    this.threeCamera.position.y = this.distance * Math.sin(this.rotation.y);
    this.threeCamera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);
    this.threeCamera.lookAt(new THREE.Vector3());
    // Always call updateProjectionMatrix on camera change
    this.threeCamera.updateProjectionMatrix();
  }
}
