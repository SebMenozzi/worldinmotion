import THREE from '../utils/three'
import LensFlares from './LensFlares'
import Light from './Light'
import Helpers from '../utils/Helpers'
import {SolarCalculator} from '../utils/SolarCalculator'
import {SolarCalculator2} from '../utils/SolarCalculator2'
import {Clock} from './Clock'

import CreateMesh from './CreateMesh';

// Class that creates and updates the main camera
export default class Sun {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.sun = new THREE.Group()
    this.sunLight = new Light(this.scene).directionalLights
    this.block = new CreateMesh().block(new THREE.Color( 0xf44336 ));
    this.scene.add(this.block)
    this.init()
    this.update()

    setInterval(() => {
      this.update()
    }, 1000)
  }
  init() {
    function addSunPlane(texture, size, opacity) {
      let sunPlane = new THREE.Sprite(new THREE.SpriteMaterial({
    		map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: opacity,
    	}))
      sunPlane.scale.x = sunPlane.scale.y = size
      return sunPlane
    }
    const sunLoader = new THREE.TextureLoader()
    const sunTexture1 = sunLoader.load("./assets/textures/lensflare/sun.png")
    const sunTexture2 = sunLoader.load("./assets/textures/lensflare/flare1.jpg")

    this.sun.add(addSunPlane(sunTexture1, 1000, 0.25))
    this.sun.add(addSunPlane(sunTexture1, 8000, 0.05))
    this.sun.add(addSunPlane(sunTexture2, 2000, 0.8))
    this.sun.add(new LensFlares(this.camera.threeCamera))

    this.scene.add(this.sun)

    this.scene.add(this.sunLight)
  }
  update() {
    let sunPosition = SolarCalculator(Clock(), 2, 0, 0)

    var pos2d = Helpers.calculate2dPosition({ lat: sunPosition.subsolarLatitude, lon: sunPosition.subsolarLongitude - 13.5})

    pos2d.altitude = 200
    Helpers.set3dPosition(this.block, pos2d)

    pos2d.altitude = 1000
    Helpers.set3dPosition(this.sunLight, pos2d)

    pos2d.altitude = 4000
    Helpers.set3dPosition(this.sun, pos2d)
  }
}
