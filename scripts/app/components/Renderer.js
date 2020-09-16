import THREE from '../utils/three';
import config from '../../config';

// Main webGL renderer class
export default class Renderer {
    constructor(scene, container) {
        // Properties
        this.scene = scene;
        this.container = container;

        // Create WebGL renderer and set its antialias
        this.threeRenderer = new THREE.WebGLRenderer({ precision: "mediump", devicePixelRatio:1, antialias:false /*alpha: true,*/ });

        // Set clear color to fog to enable fog or to hex color for no fog
        //this.threeRenderer.setClearColor(scene.fog.color);
        this.threeRenderer.setPixelRatio(window.devicePixelRatio); // For retina
        this.threeRenderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

        // Appends canvas
        container.appendChild(this.threeRenderer.domElement);

        // Shadow map options
        this.threeRenderer.shadowMap.enabled = true;
        this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Create label renderer
        this.labelRenderer = new THREE.CSS2DRenderer();
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        container.appendChild(this.labelRenderer.domElement);

        // Get anisotropy for textures
        config.maxAnisotropy = this.threeRenderer.capabilities.getMaxAnisotropy()

        // Initial size update set to canvas container
        this.updateSize();

        // Listeners
        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    updateSize() {
        this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    render(scene, Camera) {
        // Renders scene to canvas target
        this.threeRenderer.render(scene, Camera.threeCamera);
        this.labelRenderer.render(scene, Camera.threeCamera);
        Camera.update();

        for(var i=0; i< config.labels.length; i++)
            config.labels[i].update();
    }
}
