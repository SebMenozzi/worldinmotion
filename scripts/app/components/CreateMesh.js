import THREE from '../utils/three';

const urls = {
  earth: {
    day: './assets/textures/earth/world_low-min.jpg',
    night: './assets/textures/earth/night_low.jpg',
    clouds: './assets/textures/earth/clouds_low.jpg',
    specular: './assets/textures/earth/specular.jpg',
    bump: './assets/textures/earth/bump.jpg'
  },
  skybox: [
    "./assets/textures/skybox/s_px.jpg",
    "./assets/textures/skybox/s_nx.jpg",
    "./assets/textures/skybox/s_py.jpg",
    "./assets/textures/skybox/s_ny.jpg",
    "./assets/textures/skybox/s_pz.jpg",
    "./assets/textures/skybox/s_nz.jpg"
  ],
  moon: {
    texture: './assets/textures/moon/texture.jpg',
    bump: './assets/textures/moon/bump.jpg'
  }
};

export default class CreateMesh {
  skybox (radius) {
    let skyboxLoader = new THREE.CubeTextureLoader();

    return skyboxLoader.load(urls.skybox);
    /*
    const textureCube = skyboxLoader.load(urls.skybox);
    const shader = THREE.ShaderLib[ "cube" ];

    shader.uniforms[ "tCube" ].value = textureCube;
    shader.uniforms[ "opacity" ] = { value: 30, type: "f" };
    shader.uniforms[ "tFlip" ] = { value: 1, type: "f" };

    const skyboxMat = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      side: THREE.DoubleSide,
    });
    return new THREE.Mesh( new THREE.BoxGeometry(radius, radius, radius), skyboxMat);
    */
  }
  /*
  day_night (radius) {
    // Textures
    const textureLoader = new THREE.TextureLoader();
    const dayTexture = textureLoader.load(urls.earth.day);
    const nightTexture = textureLoader.load(urls.earth.night);
    const specularTexture = textureLoader.load(urls.earth.specular);

    const uniforms = {
      time: { value: 100 },
      dayTexture: { value: dayTexture },
      nightTexture: { value: nightTexture },
      specularTexture: { value: specularTexture },
      sunDirection: {value: new THREE.Vector3(0.5, 0.2, 1.0) },
      specularDirection: {value: new THREE.Vector3(0.5, 0.2, 1.0) },
    };

    const vs = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;

    const fs = `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D specularTexture;
    uniform vec3 sunDirection;
    uniform vec3 specularDirection;
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
        // Textures for day and night:
        vec3 dayColor       = texture2D( dayTexture, sunDirection );
        vec3 nightColor     = texture2D( nightTexture, tPos ).xyz;

        // Set the color
        gl_FragColor = vec4(dayColor.r, 1.0);
      }
    `;

    const earthGeometry = new THREE.SphereGeometry(radius, radius/2, radius/2);
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vs,
      fragmentShader: fs,
    });
    return new THREE.Mesh(earthGeometry, earthMaterial);
  }
  */
  earth (radius) {
    // Textures
    const textureLoader = new THREE.TextureLoader();
    const dayTexture = textureLoader.load(urls.earth.day);
    const bumpTexture = textureLoader.load(urls.earth.bump);

    const earthGeometry = new THREE.SphereGeometry(radius, radius/2, radius/2);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: dayTexture,
      bumpMap: bumpTexture,
      bumpScale: 1.0,
      roughness: 1
    });
    let earth = new THREE.Mesh(earthGeometry, earthMaterial);
    //earth.castShadow = true; //default is false
    //earth.receiveShadow = true; //default
    return earth;
  }
  clouds (radius) {
    const textureLoader = new THREE.TextureLoader();
    const cloudsTexture = textureLoader.load(urls.earth.clouds);

    const cloudsGeometry = new THREE.SphereGeometry(radius, radius/2, radius/2);
    const cloudsMaterial  = new THREE.MeshPhongMaterial({
      alphaMap: cloudsTexture,
      color: new THREE.Color('#ffffff'),
      opacity: 1,
      transparent: true
    })
    let clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    //clouds.castShadow = true; //default is false
    //clouds.receiveShadow = true; //default
    return clouds;
  }
  night (radius) {
    const textureLoader = new THREE.TextureLoader();
    const nightTexture = textureLoader.load(urls.earth.night);

    const nightGeometry = new THREE.SphereGeometry(radius, radius/2, radius/2);
          nightGeometry.applyMatrix4( new THREE.Matrix4().makeScale( 1.0, 1.0, -1.0 ) );

    const nightMaterial = new THREE.MeshLambertMaterial({
      map: nightTexture,
      color: new THREE.Color('#f1ba3c'),
      opacity: 1,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      blendDst: THREE.OneFactor,
      blendSrc: THREE.OneFactor
    });
    return new THREE.Mesh(nightGeometry, nightMaterial);
  }
  atmosphereLine (radius, index, color) {
    var atmosphereLineGeometry = new THREE.SphereGeometry(radius + index, radius/2, radius/2);
    atmosphereLineGeometry.applyMatrix4( new THREE.Matrix4().makeScale( 1.0, -1.0, 1.0 ) );

    var atmosphereLineMaterial = new THREE.MeshLambertMaterial();
    atmosphereLineMaterial.color.setStyle( color );
    atmosphereLineMaterial.opacity = 1;
    atmosphereLineMaterial.transparent = true;
    atmosphereLineMaterial.depthWrite = false;
    return new THREE.Mesh(atmosphereLineGeometry, atmosphereLineMaterial);
  }
  atmosphere () {
    var material = new THREE.ShaderMaterial({
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          //'float intensity = pow( 2.55 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
          'gl_FragColor = vec4( 0.3, 0.3, 1.0, 1.0 );', // atmosphere's color: white
        '}'
      ].join('\n'),
      //side: THREE.BackSide,
      //blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
    return new THREE.Mesh(atmosphereGeometry, material);
  }
  outsideGlow (color, aperture, scale, opacity) {
    const outGeometry = new THREE.SphereGeometry(206, 100, 100);
    const outMaterial = new THREE.ShaderMaterial({
      uniforms: {
        aperture: { type : "f", value: aperture },
        scale: { type : "f", value : scale },
        color : { type: "c", value: new THREE.Color( color ) },
        opacity: { type: "f", value: opacity }
      },
      vertexShader: [
        'varying vec3 vVertexWorldPosition;',
    		'varying vec3 vVertexNormal;',
    		'void main(){',
    			'vVertexNormal = normalize( normalMatrix * normal );',
    			'vVertexWorldPosition = ( modelMatrix * vec4( position, 1.0 ) ).xyz;',
    			'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
		    '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 color;',
    		'uniform float aperture;',
    		'uniform float scale;',
    		'uniform float opacity;',

    		'varying vec3 vVertexNormal;',
    		'varying vec3 vVertexWorldPosition;',

    		'void main() {',

    			'vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;',
    			'vec3 viewCameraToVertex = ( viewMatrix * vec4( worldCameraToVertex, 0.0 ) ).xyz;',
    			'viewCameraToVertex	= normalize( viewCameraToVertex );',
    			'float intensity = pow( aperture + dot( vVertexNormal, viewCameraToVertex ), scale );',
    			'gl_FragColor = vec4( color, intensity ) * opacity;',

    		'}'
      ].join('\n'),
      side: THREE.BackSide,
      needsUpdate: true,
      transparent: true,
      depthWrite: false
    });
    return new THREE.Mesh( outGeometry, outMaterial );
  }
  block (color) {
    return new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial(
        {
          color: color,
          vertexColors: THREE.FaceColors,
          morphTargets: false
        }
      )
    );
  }
  point (radius, color, opacity) {
    const pointGeometry = new THREE.SphereGeometry(radius, radius/2, radius/2);
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: color,
      opacity: opacity,
      side: THREE.DoubleSide,
      transparent: true
    });
    return new THREE.Mesh(pointGeometry, pointMaterial);
  }
  ring (radius, color, opacity) {
    const pointRingGeometry = new THREE.RingGeometry(radius, radius + 0.5, radius/2);
    const pointRingMaterial = new THREE.MeshBasicMaterial({
      color: color,
      opacity: opacity,
      side: THREE.DoubleSide,
      transparent: true
    });
    return new THREE.Mesh(pointRingGeometry, pointRingMaterial);
  }
  moon (radius) {
    const moonGeometry = new THREE.SphereGeometry(radius, radius/2, radius/2);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(urls.moon.texture);
    const bumpTexture = textureLoader.load(urls.moon.bump);

    const moonMaterial = new THREE.MeshLambertMaterial({
      map: texture
      //bumpMap: bumpTexture,
      //bumpScale: 1.0
    });
    let moon = new THREE.Mesh(moonGeometry, moonMaterial);
    //moon.castShadow = true; //default is false
    //moon.receiveShadow = true; //default
    return moon;
  }
}
