import THREE from '../utils/three';
import { Lensflare, LensflareElement } from '../utils/Lensflare';

// Sets up all lensflares
export default class LensFlares {
  constructor(camera) {
    function lensFlareUpdateCallback( object ) {
      var f, fl = this.lensFlares.length;
      var flare;
      var vecX = -this.positionScreen.x * 2;
      var vecY = -this.positionScreen.y * 2;
      var size = object.size ? object.size : 800;

      var camDistance = camera.position.length();

      for( f = 0; f < fl; f ++ ) {
        flare = this.lensFlares[ f ];

        flare.x = this.positionScreen.x + vecX * flare.distance;
        flare.y = this.positionScreen.y + vecY * flare.distance;

        flare.scale = size / camDistance;
        flare.rotation = 0;
      }
    }

    const sunLoader = new THREE.TextureLoader();
    const textureFlare1 = sunLoader.load( "./assets/textures/lensflare/flare1.jpg" );
    const textureFlare2 = sunLoader.load( "./assets/textures/lensflare/flare2.jpg" );
    const textureFlare3 = sunLoader.load( "./assets/textures/lensflare/flare3.jpg" );
    const textureFlare4 = sunLoader.load( "./assets/textures/lensflare/flare4.jpg" );
    const textureFlare5 = sunLoader.load( "./assets/textures/lensflare/flare5.jpg" );
    const textureFlare6 = sunLoader.load( "./assets/textures/lensflare/flare6.jpg" );

    const lensflare = new Lensflare();

    lensflare.addElement( new LensflareElement( textureFlare1, 1200, 0.0/*, THREE.AdditiveBlending, new THREE.Color('#ffffff')*/));
    lensflare.addElement( new LensflareElement( textureFlare2, 1200, 0.0/*, THREE.AdditiveBlending, new THREE.Color('#ffffff')*/ ));
    lensflare.addElement( new LensflareElement( textureFlare3, 280, 0.1/*, THREE.AdditiveBlending*/ ));

    lensflare.addElement( new LensflareElement( textureFlare4, 450, 0.3/*, THREE.AdditiveBlending, new THREE.Color('#6600cc')*/));
    lensflare.addElement( new LensflareElement( textureFlare5, 450, 0.3/*, THREE.AdditiveBlending*/));
    lensflare.addElement( new LensflareElement( textureFlare6, 300, 0.45/*, THREE.AdditiveBlending*/ ));
    lensflare.addElement( new LensflareElement( textureFlare3, 330, 0.55/*, THREE.AdditiveBlending, new THREE.Color('#6600cc')*/ ));

    lensflare.addElement( new LensflareElement( textureFlare4, 570, 0.8/*, THREE.AdditiveBlending*/ ));

    //	and run each through a function below
    lensflare.customUpdateCallback = lensFlareUpdateCallback;
    return lensflare;
  }
}
