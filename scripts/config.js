import TWEEN from 'tween.js';

// This object contains the state of the app
export default {
  isDev: false,
  isLoaded: false,
  isTweening: false,
  isRotating: true,
  isMouseMoving: false,
  isMouseOver: false,
  maxAnisotropy: 1,
  dpr: 1,
  easing: TWEEN.Easing.Quadratic.InOut,
  duration: 500,
  model: {
    path: './assets/models/Teapot.json',
    scale: 20
  },
  labels: [],
  distanceTarget: 800, // camera's distance from center (and thus the globe)
  textures: {
    path: './assets/textures/',
    imageFiles: [
      { name: 'earth_day', image: 'earth/world_low.jpg' },
      { name: 'earth_night', image: 'earth/night_high.jpg' },
      { name: 'earth_clouds', image: 'earth/clouds_high.jpg' },
      { name: 'earth_specular', image: 'earth/specular.jpg' },
      { name: 'earth_bump', image: 'earth/bump.jpg' },

      { name: 'skybox_s_px', image: 'skybox/s_px.jpg' },
      { name: 'skybox_s_nx', image: 'skybox/s_nx.jpg' },
      { name: 'skybox_s_py', image: 'skybox/s_py.jpg' },
      { name: 'skybox_s_ny', image: 'skybox/s_ny.jpg' },
      { name: 'skybox_s_pz', image: 'skybox/s_pz.jpg' },
      { name: 'skybox_s_nz', image: 'skybox/s_nz.jpg' },

      { name: 'moon_texture', image: 'moon/texture.jpg' },
      { name: 'moon_bump', image: 'moon/bump.jpg' },

      { name: 'sun', image: 'lensflare/sun.png' },
      { name: 'flare1', image: 'lensflare/flare1.jpg' },
      { name: 'flare2', image: 'lensflare/flare2.jpg' },
      { name: 'flare3', image: 'lensflare/flare3.jpg' },
      { name: 'flare4', image: 'lensflare/flare4.jpg' },
      { name: 'flare5', image: 'lensflare/flare5.jpg' },
      { name: 'flare6', image: 'lensflare/flare6.jpg' }
    ]
  },
  mesh: {
    enableHelper: false,
    wireframe: false,
    translucent: false,
    material: {
      color: 0xffffff,
      emissive: 0xffffff
    }
  },
  fog: {
    color: 0xffffff,
    near: 0.0008
  },
  camera: {
    fov: 30,
    near: 1,
    far: 10000,
    aspect: 1,
    posX: 0,
    posY: 0,
    posZ: 0
  },
  controls: {
    autoRotate: false,
    autoRotateSpeed: 1.0,
    rotateSpeed: 0.5,

    noZoom: false,
    zoomSpeed: 0.8,

    minDistance: 600,
    maxDistance: 1300,

    distance: 800,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    enableDamping: true,
    dampingFactor: 0.25,
    enableZoom: true,
    deceleration: 0.8,
    target: {
      x: 0,
      y: 0,
      z: 0
    }
  },
  ambientLights: [
    {
      enabled: true,
      color: 0xffffff
    }
  ],
  /*
  spotLights: [
    {
      enabled: true,
      color: 0xe8f7ff, // low blue
      intensity: 4.0,
      distance: 200,
      angle: 1.05,
      penumbra: 0,
      decay: 1,
      x: 0,
      y: 0,
      z: 0
    },
    {
      enabled: true,
      color: 0x5757ff, // blue
      intensity: 2.0,
      distance: 1000,
      angle: 1.05,
      penumbra: 0.1,
      decay: 1.5,
      x: 0,
      y: 0,
      z: 0
    },
    {
      enabled: true,
      color: 0xffffff, // white
      intensity: 2.0,
      distance: 1000,
      angle: 1.05,
      penumbra: 0.1,
      decay: 1.5,
      x: 0,
      y: 0,
      z: 0
    }
  ],
  */
  /*
  pointLights: [
    {
      enabled: true,
      color: 0xffffff, // white
      intensity: 10.0,
      distance: 4000,
      x: 0,
      y: 0,
      z: 0
    }
  ],
  */
  spotLights: [],
  pointLights: [],
  directionalLights: [],

  directionalLights: [
    {
      enabled: true,
      color: 0xe8f7ff, // low blue
      intensity: 0.2,
      x: 0,
      y: 0,
      z: 0
    },
    {
      enabled: true,
      color: 0x5757ff, // blue
      intensity: 0.5,
      x: 0,
      y: 0,
      z: 0
    },
    {
      enabled: true,
      color: 0xffffff, // white
      intensity: 0.5,
      x: 0,
      y: 0,
      z: 0
    }
  ],

  hemiLights: [],
  shadow: {
    enabled: false,
    helperEnabled: true,
    bias: 0,
    mapWidth: 2048,
    mapHeight: 2048,
    near: 250,
    far: 400,
    top: 100,
    right: 100,
    bottom: -100,
    left: -100
  },
  lensFlares: [
    {
      texture_name: 'flare1',
      size: 1200,
      distance: 0.0,
      color: 0xffffff
    },
    {
      texture_name: 'flare2',
      size: 1200,
      distance: 0.0,
      color: 0xffffff
    },
    {
      texture_name: 'flare3',
      size: 280,
      distance: 0.1
    },
    {
      texture_name: 'flare4',
      size: 450,
      distance: 0.3,
      color: 0x6600cc
    },
    {
      texture_name: 'flare5',
      size: 450,
      distance: 0.3
    },
    {
      texture_name: 'flare6',
      size: 300,
      distance: 0.45
    },
    {
      texture_name: 'flare3',
      size: 330,
      distance: 0.55,
      color: 0x6600cc
    },
    {
      texture_name: 'flare4',
      size: 570,
      distance: 0.8
    }
  ]
};
