import THREE from '../utils/three';
import config from '../../config';

// Sets up and places all lights in scene
export default class Light {
  constructor(scene) {
    this.scene = scene;
    this.ambientLights = new THREE.AmbientLight();
    this.directionalLights = new THREE.DirectionalLight();
    this.pointLights = new THREE.PointLight();
    this.hemiLights = new THREE.HemisphereLight();
    this.spotLights = new THREE.SpotLight();

    this.place('ambientLights');
    this.place('directionalLights');
    this.place('pointLights');
    this.place('hemiLights');
    this.place('spotLights');
  }

  place(lightType) {
    switch(lightType) {
      case 'ambientLights':
        for(let i = 0; i < config.ambientLights.length; i++) {
          let ambientLight = new THREE.AmbientLight(config.ambientLights[i].color);
              ambientLight.visible = config.ambientLights[i].enabled;
          this.ambientLights.add(ambientLight);
        }
        break;

      case 'directionalLights':
        for(let i = 0; i < config.directionalLights.length; i++) {
          let directionalLight = new THREE.DirectionalLight(config.directionalLights[i].color, config.directionalLights[i].intensity);

          directionalLight.visible = config.directionalLights[i].enabled;

          directionalLight.position.set(config.directionalLights[i].x, config.directionalLights[i].y, config.directionalLights[i].z);
        	directionalLight.castShadow = true;

        	// define the visible area of the projected shadow
        	//
          var size = 3000;
          directionalLight.shadow.camera.left = -size;
        	directionalLight.shadow.camera.right = size;
        	directionalLight.shadow.camera.top = size;
        	directionalLight.shadow.camera.bottom = -size;

        	directionalLight.shadow.camera.near = 1;
        	directionalLight.shadow.camera.far = 4000;

        	// Shadow map size
        	directionalLight.shadow.mapSize.width = 1024;
        	directionalLight.shadow.mapSize.height = 1024;

          //var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
          //helper.visible = true;
          //this.scene.add(helper)
          this.directionalLights.add(directionalLight);
        }
        break;

      case 'pointLights':
        for(let i = 0; i < config.pointLights.length; i++) {
          let pointLight = new THREE.PointLight(config.pointLights[i].color, config.pointLights[i].intensity, config.pointLights[i].distance);
          pointLight.position.set(config.pointLights[i].x, config.pointLights[i].y, config.pointLights[i].z);
          pointLight.visible = config.pointLights[i].enabled;

          pointLight.castShadow = true;            // default false

          //Set up shadow properties for the light
          pointLight.shadow.mapSize.width = 512;  // default
          pointLight.shadow.mapSize.height = 512; // default
          pointLight.shadow.camera.near = 0.5;       // default
          pointLight.shadow.camera.far = 500      // default

          this.pointLights.add(pointLight);
        }
        break;

      case 'hemiLights':
        for(let i = 0; i < config.hemiLights.length; i++) {
          let hemiLight = new THREE.HemisphereLight(config.hemiLights[i].color, config.hemiLights[i].groundColor, config.hemiLights[i].intensity);
          hemiLight.position.set(config.hemiLights[i].x, config.hemiLights[i].y, config.hemiLights[i].z);
          hemiLight.visible = config.hemiLights[i].enabled;
          this.hemiLights.add(hemiLight);
        }
        break;

      case 'spotLights':
        for(let i = 0; i < config.spotLights.length; i++) {
          let spotLight = new THREE.SpotLight(config.spotLights[i].color, config.spotLights[i].intensity, config.spotLights[i].distance, config.spotLights[i].angle, config.spotLights[i].penumbra, config.spotLights[i].decay);
          spotLight.position.set(config.spotLights[i].x, config.spotLights[i].y, config.spotLights[i].z);
          spotLight.visible = config.spotLights[i].enabled;

          spotLight.castShadow = true;

          //Set up shadow properties for the light
          //spotLight.shadow.camera.near = 10;       // default
          //spotLight.shadow.camera.far = 1000      // default

          spotLight.intensity = 100.0;

          //spotLight.rotation.x = Math.PI;

          var lightHelper = new THREE.SpotLightHelper(spotLight);
          this.scene.add(lightHelper)

          var shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
				  this.scene.add(shadowCameraHelper);

          this.spotLights.add(spotLight);
        }
        break;
    }
  }
}
