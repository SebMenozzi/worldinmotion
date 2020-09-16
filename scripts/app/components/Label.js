import THREE from '../utils/three';
import Helpers from '../utils/Helpers';

function getScreenCoordinates(position, camera) {
    var vector = new THREE.Vector3();
    vector.copy( position );
    vector.project( camera );

    vector.x = (( vector.x + 1 ) * window.innerWidth / 2 );
    vector.y = (( 1 - vector.y ) * window.innerHeight / 2 );
    return vector;
}

function getScreenCoordinates2(position, camera) {
  /*
    Using the coordinates of a country in the 3D space, this function will
    return the 2D coordinates using the camera projection method.
  */
  var vector = new THREE.Vector3();
  vector.copy(position);
  vector.project(camera);

  vector.x = ((vector.x + 1)/2 * window.innerWidth);
  vector.y = -((vector.y - 1)/2 * window.innerHeight);
  return vector;
}

// Sets up and places all lights in scene
export default class Label {
    constructor(scene, camera, location) {
        this.camera = camera;

        this.position = Helpers.convertLatLonToVec3(location.lat, location.lon).multiplyScalar(200);

        // create html overlay box
        this.labelDiv = document.createElement('div');
        this.labelDiv.className = "label";

        this.label = new THREE.CSS2DObject(this.labelDiv);
        scene.add(this.label);
    }

    setLabel(position, html) {
        this.position = Helpers.convertLatLonToVec3(position.lat, position.lon).multiplyScalar(200);
        this.labelDiv.innerHTML = html;
        this.label.position.set(this.position.x, this.position.y, this.position.z);
    }

    update() {
        var cameraToEarth = new THREE.Vector3(0, 0, 0).sub(this.camera.position);
        var L = Math.sqrt(Math.pow(cameraToEarth.length(), 2) - Math.pow(200, 2))

        var cameraToPin = this.position.clone().sub(this.camera.position);

        if (cameraToPin.length() > L) {
            this.label.visible = false;
        } else {
            // overlay anchor is visible
            this.label.visible = true;
        }
    }
}
