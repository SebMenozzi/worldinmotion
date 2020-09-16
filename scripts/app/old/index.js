import React, { Component } from 'react'
import ReactDOM from 'react-dom';
/* THREE.JS */
import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';
OBJLoader(THREE);
import moment from 'moment'
import jQuery from 'jquery';
import Stats from 'stats.js'
window.$ = window.jQuery = jQuery;
import Slider from 'react-rangeslider'
import TWEEN from 'tween.js'
import Select from 'react-select';
//import countries from '../../../../public/assets/data/countries.json';

/*
import CSS3DObject from './CSS3DRenderer.js'
CSS3DObject(THREE);
*/

import * as topojson from "topojson-client";
import * as d3 from "d3";

// Three.js objects
var camera,
    scene,
    raycaster,
    mouse,
    skybox,
    clock,
    earth,
    moon,
    night,
    clouds,
    light,
    outsideGlow,
    atmosphereLine,
    lensFlare,
    sun,
    sunlight,
    sunPlane,
    animationGlobe,
    renderer;

var earthGeometry;
var cloudsGeometry;
var nightGeometry;
var atmosphereGeometry;
var moonGeometry;
var outGeometry;
var earthPosition;
var moonPosition;

// camera's distance from center (and thus the globe)
var distanceTarget = 800;
var distance = distanceTarget;

// camera's position
var rotation = { x: 0, y: 0 },
    target = { x: Math.PI*3/2, y: Math.PI / 6.0 },
    incr_rotation = { x: -0.0, y: 0 };

var levitatingBlocks = [];
var reflectiveBalls = [];
var storms = [];
var stormsAnimations = [];
var stormsMaterials = [];
var blocks = [];
var labels = [];
var countryLabels = [];
var markers = [];
var points = [];
var INTERSECTED;
var currentContry = [];
var min = 0;

var urls = {
  earth: {
    day: './assets/textures/earth/world_medium.jpg',
    night: './assets/textures/earth/night_high.jpg',
    clouds: './assets/textures/earth/clouds_high.jpg',
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

//var loadingImages = ['./assets/img/earth/world12.jpg', './assets/img/earth/nightHD.jpg', './assets/img/earth/clouds5.jpg', './assets/img/earth/specular.jpg', './assets/img/earth/bump.jpg'];

var w = window.innerWidth;
var h = window.innerHeight;

var container = document.getElementById('globe');

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.top  = ''
stats.dom.style.bottom  = '0px'
container.appendChild( stats.dom );

const loadGlobe = () => {
  /*
  // load an image asynchronously
  function loadImage(url) {

    var img = new Image();
    img.src = url;
    img.onload = function() {
      // remove from loadingLmages
      console.log(url + ' has been loaded.')
      loadingImages.splice(loadingImages.indexOf(img), 1);
      if(loadingImages.length == 0) {
        init()
        loadStats()

        function getLocation() {
          console.log('get Geolocation: ' + navigator.geolocation)
          if (navigator.geolocation) {
            console.log('yeah')
            navigator.geolocation.getCurrentPosition((position) => {
              console.log(position)
              var point = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                radius: 1,
                index: 1,
              };
              drawPoint(point);
            }, (error) => {
              console.error(error)
            });
          } else {
            console.log("Geolocation is not supported by this browser.");
          }
        }

        getLocation()

        //test()
        //start()
      }
    }
  }
  for (var i = 0; i < loadingImages.length; ++i) {
   loadImage(loadingImages[i]);
  }
  */
  init()
  //loadStats()

  function getLocation() {
    console.log('get Geolocation: ' + navigator.geolocation)
    if (navigator.geolocation) {
      console.log('yeah')
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        var point = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          radius: 1,
          index: 1,
        };
        drawPoint(point);
      }, (error) => {
        console.error(error)
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  getLocation()
}

  /* INITIALIZATION OF THE GLOBE */
const init = () => {

  target = calculate2dPosition({
    lat: 2.5,
    lon: 48.834
  });

  setSize();

  // Clock
  clock = new THREE.Clock();

  // Camera
  camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);

  // Scene
  scene = new THREE.Scene();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Geometries
  earthGeometry = new THREE.SphereGeometry(200, 100, 100);

  cloudsGeometry = new THREE.SphereGeometry(200, 100, 100);

  moonGeometry = new THREE.SphereGeometry(toScaleInMi(1079), toScaleInMi(1079)/2, toScaleInMi(1079)/2);

  //atmosphereGeometry = new THREE.SphereGeometry(208, 100, 100);
  //atmosphereGeometry.applyMatrix( new THREE.Matrix4().makeScale( -1.0, 1.0, 1.0 ) );

  nightGeometry = new THREE.SphereGeometry(201, 100, 100);
  nightGeometry.applyMatrix( new THREE.Matrix4().makeScale( -1.0, 1.0, 1.0 ) );

  //inGeometry = new THREE.SphereGeometry(201, 100, 100);

	outGeometry = new THREE.SphereGeometry(206, 100, 100);

  // ISS
  //whereIsISS()

  // Earth
  earth = createMesh.earth();
  earth.name = 'Earth';
  //earth.castShadow = true;
  earth.receiveShadow = true;
  scene.add(earth);

  // Earth
  moon = createMesh.moon();
  moon.name = 'Moon';
  //moon.castShadow = true;
  moon.receiveShadow = true;
  scene.add(moon);

  skybox = createMesh.skybox()
  scene.add(skybox);

  // night
  night = createMesh.night();
  night.rotation.y = (2 * Math.PI) / 2;
	earth.add(night);

  // Clouds
  clouds = createMesh.clouds();
  earth.add(clouds);

  // Atmosphere
  atmosphereLine = new THREE.Group();
  atmosphereLine.add( createMesh.atmosphereLine(2.5, '#000659') );
  atmosphereLine.add( createMesh.atmosphereLine(2, '#000659') );
  atmosphereLine.add( createMesh.atmosphereLine(1.5, '#0036ad') );
  atmosphereLine.add( createMesh.atmosphereLine(1, '#024bc6') );
  atmosphereLine.add( createMesh.atmosphereLine(0.5, '#0362e0') );
  earth.add(atmosphereLine);

  outsideGlow = createMesh.outsideGlow('#0043ff', 0.71, 28.0, 1.0);
  earth.add(outsideGlow);

  earth.scale.set(0.01, 0.01, 0.01);

  // Lumière ambiente
  scene.add(new THREE.AmbientLight(0x000000));

  // Axes (Equator...)
  //addAxes()

  sunlight = new THREE.Group();
  // white light
  sunlight.add( new THREE.DirectionalLight(0xe8f7ff, 0.2) );
  // blue light
  sunlight.add( new THREE.DirectionalLight(0x5757ff, 0.5) );
  sunlight.add( new THREE.DirectionalLight( 0xffffff, 1.5 ) );

  sunlight.position.set(-600, 0, 200);
  //sunlight.castShadow = true;
  scene.add(sunlight);

  sun = addLensFlare();
  sun.position.set(-600, 0, 4000);
  scene.add(sun);

  addSunPlane()

  addStorms()

  console.log(stormsAnimations)

  // Renderer
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setSize(w, h);
  renderer.setClearColor( 0x000000, 1 );
  renderer.sortObjects = false;

  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;

  renderer.shadowCameraNear = 3;
  renderer.shadowCameraFar = camera.far;
  renderer.shadowCameraFov = 50;

  renderer.shadowMapBias = 0.0039;
  renderer.shadowMapDarkness = 0.5;
  renderer.shadowMapWidth = 1024;
  renderer.shadowMapHeight = 1024;

  new TWEEN.Tween(earth.scale)
    .to({
      x: 1,
      y: 1,
      z: 1
    }, 1000)
    .delay(4000)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  // Add scene to DOM
  //renderer.domElement.style.position = 'absolute';
  container.appendChild(renderer.domElement);

  // DOM event handlers
  window.addEventListener('resize', handle.resize, false);

  container.addEventListener('mousedown', handle.drag.start, false);
  // Scroll for Chrome
  container.addEventListener('mousewheel', handle.scroll, false);
  // Scroll for Firefox
  container.addEventListener('DOMMouseScroll', handle.scroll, false);

  container.addEventListener('mousemove', handle.over, false);

  // Bootstrap render
  animate();
}

const toScaleInMi = (data) => {
  // real radius of earth: 3959 mi => 200
  return ((data * 200) / 3959);
}

const toScaleInKm = (data) => {
  // real radius of earth: 6371 km => 200
  return ((data * 200) / 6371);
}

const randomNumber = ( from, to ) => {
	return Math.floor( Math.random() * ( to - from + 1 ) + from );
};

const geopositionToVector3 = ( lat, lon, radius ) => {
	var phi = ( lat ) * Math.PI/180;
	var theta = ( lon - 180 ) * Math.PI/180;

	var x = -( radius ) * Math.cos( phi ) * Math.cos( theta );
	var y = ( radius ) * Math.sin( phi );
	var z = ( radius ) * Math.cos( phi ) * Math.sin( theta );

	return new THREE.Vector3( x, y, z );
};

const addSunPlane = () => {
  var sunLoader = new THREE.TextureLoader();
  var sunTexture1 = sunLoader.load( "./assets/textures/lensflare/sun.png" );
  var sunTexture2 = sunLoader.load( "./assets/textures/lensflare/flare1.jpg" );

  var sunPlane0 = new THREE.Sprite(new THREE.SpriteMaterial({
		map: sunTexture1,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: .25,
	}));
  sunPlane0.scale.x = sunPlane0.scale.y = 1000;

  var sunPlane1 = new THREE.Sprite(new THREE.SpriteMaterial({
		map: sunTexture1,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: .05,
	}));
  sunPlane1.scale.x = sunPlane1.scale.y = 7000;

  var sunPlane2 = new THREE.Sprite(new THREE.SpriteMaterial({
		map: sunTexture2,
		transparent: true,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.8
	}));
  sunPlane2.scale.x = sunPlane2.scale.y = 2000;

  sunPlane = new THREE.Group();
  sunPlane.add( sunPlane0 );
  sunPlane.add( sunPlane1 );
  sunPlane.add( sunPlane2 );
	scene.add(sunPlane);
}

const addStorms = () => {
  function TextureAnimator( texture, tilesHoriz, tilesVert, numTiles, tileDuration )
  {
  	this.tilesHorizontal = tilesHoriz;
  	this.tilesVertical = tilesVert;
  	this.numberOfTiles = numTiles;

  	this.tileDisplayDuration = tileDuration;

  	this.init = function()
  	{
  		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  		texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
  		texture.anisotropy = 0;

  		this.currentDisplayTime = 0;
  		this.currentTile = 0;
  	};

  	this.update = function( milliSec )
  	{
  		this.currentDisplayTime += milliSec;

  		while ( this.currentDisplayTime > this.tileDisplayDuration ) {

  			this.currentDisplayTime -= this.tileDisplayDuration;
  			this.currentTile++;

  			if( this.currentTile == this.numberOfTiles ) {

  				this.currentTile = 0;

  			};

  			var currentColumn = this.currentTile % this.tilesHorizontal;
  			texture.offset.x = currentColumn / this.tilesHorizontal;
  			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
  			texture.offset.y = currentRow / this.tilesVertical;

  		};
  	};

  	this.init();
  }

  var vector = new THREE.Vector3();

  // Storms
	for ( var i = 0; i < 20; i++ ) {

    var textureLoader = new THREE.TextureLoader();
    var stormTexture = textureLoader.load('./assets/textures/storm.png');

    var stormAnimator = new TextureAnimator( stormTexture, 8, 8, 64, 30 );

    console.log(stormAnimator)

		stormsAnimations.push( stormAnimator );

    var stormsMaterial = new THREE.MeshLambertMaterial({
      name: "Storm",
      map: stormTexture,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      blendDst: THREE.OneFactor,
      blendSrc: THREE.OneFactor,
    });
    stormsMaterials.push( stormsMaterial );

    var stormGeometry = new THREE.PlaneBufferGeometry( randomNumber( 10, 30 ), randomNumber( 10, 30 ) );

    var storm = new THREE.Mesh(stormGeometry, stormsMaterial);
    stormGeometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
    earth.add( storm );
    storms.push( storm );

    var positions = geopositionToVector3(randomNumber(-90, 90), randomNumber(-180, 180), 200);
		storms[i].position.set( positions.x, positions.y, positions.z );

    vector.copy( storms[i].position ).multiplyScalar( 2 );
		storms[i].lookAt( vector );
  }
}

const animationStorms = () => {
  // Storms animations
	var delta = clock.getDelta();
	var t = Math.floor( clock.getElapsedTime() );
	var positions;
  var vector = new THREE.Vector3();

  for ( var i = 0; i < storms.length; i++ ) {
    positions = geopositionToVector3( randomNumber( -90, 90 ), randomNumber( -180, 180 ), 200 );

    if ( i % 2 ) {
      if ( t % 11 == 0 ) {
        storms[i].position.set( positions.x, positions.y, positions.z );
        stormsMaterials[i].opacity = 0;
      } else {
        stormsMaterials[i].opacity = 0.7;
      }
    } else {
      if ( t % 7 == 0 ) {
        storms[i].position.set( positions.x, positions.y, positions.z );
        stormsMaterials[i].opacity = 0;
      } else {
        stormsMaterials[i].opacity = 0.7;
      }
    }

    vector.copy( storms[i].position ).multiplyScalar( 2 );
		storms[i].lookAt( vector );

    switch (i) {
      case 0: case 10:
        stormsAnimations[i].update( 350 * delta );
        break;
      case 1: case 11:
        stormsAnimations[i].update( 120 * delta );
        break;
      case 2: case 12:
        stormsAnimations[i].update( 150 * delta );
        break;
      case 3: case 13:
        stormsAnimations[i].update( 180 * delta );
        break;
      case 4: case 14:
        stormsAnimations[i].update( 200 * delta );
        break;
      case 5: case 15:
        stormsAnimations[i].update( 230 * delta );
        break;
      case 6: case 16:
        stormsAnimations[i].update( 250 * delta );
        break;
      case 7: case 17:
        stormsAnimations[i].update( 270 * delta );
        break;
      case 8: case 18:
        stormsAnimations[i].update( 300 * delta );
        break;
      case 9: case 19:
        stormsAnimations[i].update( 320 * delta );
        break;
    }
  }
}

const addLensFlare = () => {
  //	this function will operate over each lensflare artifact, moving them around the screen
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

  const lensFlare = new THREE.LensFlare( textureFlare1, 1200, 0.0, THREE.AdditiveBlending, new THREE.Color('#ffffff') );
    lensFlare.add( textureFlare2, 1200, 0.0, THREE.AdditiveBlending, new THREE.Color('#ffffff') );
    lensFlare.add( textureFlare3, 280, 0.1, THREE.AdditiveBlending );

    lensFlare.add( textureFlare4, 450, 0.3, THREE.AdditiveBlending, new THREE.Color('#6600cc'));
    lensFlare.add( textureFlare5, 450, 0.3, THREE.AdditiveBlending);
    lensFlare.add( textureFlare6, 300, 0.45, THREE.AdditiveBlending );
    lensFlare.add( textureFlare3, 330, 0.55, THREE.AdditiveBlending, new THREE.Color('#6600cc') );

    lensFlare.add( textureFlare4, 570, 0.8, THREE.AdditiveBlending );

  /*
  var lensFlare = new THREE.LensFlare(textureFlare1, 400, 0.0, THREE.AdditiveBlending);

		lensFlare.add(textureFlare5, 1000, 0.0, THREE.AdditiveBlending);
		lensFlare.add(textureFlare3, 170, 0.1, THREE.AdditiveBlending);
		lensFlare.add(textureFlare2, 180, 0.2, THREE.AdditiveBlending);
		lensFlare.add(textureFlare4, 320, 0.3, THREE.AdditiveBlending, new THREE.Color('#0033ff'));
		lensFlare.add(textureFlare2, 200, 0.4, THREE.AdditiveBlending, new THREE.Color('#004422'));
		lensFlare.add(textureFlare2, 410, 0.5, THREE.AdditiveBlending, new THREE.Color('#6600cc'));
		lensFlare.add(textureFlare4, 590, 0.6, THREE.AdditiveBlending, new THREE.Color('#003300'));
		lensFlare.add(textureFlare3, 250, 0.6, THREE.AdditiveBlending, new THREE.Color('#0033ff'));
		lensFlare.add(textureFlare4, 800, 0.9, THREE.AdditiveBlending, new THREE.Color('#ffffff'));
  */

  //	and run each through a function below
  lensFlare.customUpdateCallback = lensFlareUpdateCallback;
  return lensFlare;
};

const whereIsISS = () => {

  //Manager from ThreeJs to track a loader and its status
  var manager = new THREE.LoadingManager();
  //Loader for Obj from Three.js
  var loader = new THREE.OBJLoader(manager);
  var iss = new THREE.Group();

  //Launch loading of the obj file, addBananaInScene is the callback when it's ready
  loader.load('./assets/models/iss.obj', function(object) {
    //Go through all children of the loaded object and search for a Mesh
    object.traverse(function(child) {
      //This allow us to check if the children is an instance of the Mesh constructor
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          specular: 0xffffff,
          shininess: 25,
          shading: THREE.FlatShading
        });
        //Sometimes there are some vertex normals missing in the .obj files, ThreeJs will compute them
        child.geometry.computeVertexNormals();
      }
    });
    object.scale.set(0.1, 0.1, 0.1);
    // just temporary --> in case if it's night
    //iss.add(new THREE.SpotLight(0xffffff, 0.2, 200, Math.PI/2, 0.5));
    iss.add(object);
    iss.name = 'ISS';
    scene.add(iss);

    setInterval(function() {
      $.get('http://wheretheiss.at/w/ajax/realtime', function(data_iss) {
        var pos2d = calculate2dPosition({ lat: data_iss.data.lat, lon: data_iss.data.lon });
        pos2d.altitude = 200 + ((data_iss.data.alt*200)/3959);
        set3dPosition(iss, pos2d);
        iss.lookAt(earthPosition);
        iss.updateMatrix();
      });
    }, 1000)
  });
}

const addAxes = () => {
  function buildAxis( src, dst, colorHex, dashed ) {
    var geom = new THREE.Geometry(),
        mat;
    if(dashed) {
      mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
    } else {
      mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
    }
    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
    var axis = new THREE.Line( geom, mat );
    return axis;
  }

  function buildAxes( length ) {
    var axes = new THREE.Object3D();
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
    return axes;
  }
  var axes = buildAxes( 1000 );
  earth.add( axes );

  function add_lat_marker_geometry(radius, lat, size, color) {
    var geometry = new THREE.TorusGeometry(radius * Math.cos(lat / 180 * Math.PI), size, 8, 64);
    var material = new THREE.MeshBasicMaterial({
      color: color
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = radius * Math.sin(lat / 180 * Math.PI);
    return mesh;
  }
  function add_lng_marker_geometry(radius, lng, size, color) {
      var geometry = new THREE.TorusGeometry(radius, size, 8, 64);
      var material = new THREE.MeshBasicMaterial({
        color: color
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = lng * Math.PI / 180.0;
      return mesh;
  }
  function add_marker_geometry(radius) {
    var marker_mesh = new THREE.Group();
    // equator
    marker_mesh.add(add_lat_marker_geometry(radius, 0, 0.5, 0xffffff));
    // lines of lat
    for (var lat = -90; lat < 90; lat += 10) {
      marker_mesh.add(add_lat_marker_geometry(radius, lat, 0.1, 0xffffff));
    }
    // lines of lng
    for (var lng = 0; lng < 180; lng += 10) {
      marker_mesh.add(add_lng_marker_geometry(radius, lng, 0.1, 0xffffff));
    }
    // tropics
    marker_mesh.add(add_lat_marker_geometry(radius, 23.5, 0.5, 0x0043ff));
    marker_mesh.add(add_lat_marker_geometry(radius, -23.5, 0.5, 0x0043ff));
    return marker_mesh;
  }
  //earth.add(add_marker_geometry(202));
}

const setSize = () => {
  w = window.innerWidth;
  h = window.innerHeight;
}

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180)
}

const toDegrees = (angle) => {
  return angle * (180 / Math.PI);
}

const checkAltituteBoundries = () => {
  // max zoom
  if(distanceTarget < 501)
    distanceTarget = 501;

  // min zoom
  else if(distanceTarget > 1300)
    distanceTarget = 1300;
}

const getCurrentTimeFromTimezone = (timezone) => {
  return moment.utc(new Date()).utcOffset(timezone).format('HH:mm:ss');
}

const getTimeFromDate = (date) => {
  return moment(date).format('HH:mm:ss');
}

const decimalAdjust = (type, value, exp) => {
  // Si la valeur de exp n'est pas définie ou vaut zéro...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // Si la valeur n'est pas un nombre
  // ou si exp n'est pas un entier...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Si la valeur est négative
  if (value < 0) {
    return -decimalAdjust(type, -value, exp);
  }
  // Décalage
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Décalage inversé
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

const calculate3dPosition = (coords, radius) => {
  var latitude = 90 - (Math.acos(coords.y / radius)) * 180 / Math.PI;
  var longitude = ((90 + (Math.atan2(coords.x , coords.z)) * 180 / Math.PI) % 360) + 180;

  if (longitude > 180) {
    longitude -= 360;
  }

  return {
    lat: latitude,
    lon: longitude
  }
}

const calculate2dPosition = (coords) => {
  var phi = (90 + coords.lon) * Math.PI / 180;
  var theta = (180 - coords.lat) * Math.PI / 180;

  return {
    x: phi,
    y: Math.PI - theta
  }
}

const set3dPosition = (mesh, coords) => {
  if(!coords)
    coords = mesh.userData;

  var x = coords.x;
  var y = coords.y;
  var altitude = coords.altitude;

  mesh.position.set(
    altitude * Math.sin(x) * Math.cos(y),
    altitude * Math.sin(y),
    altitude * Math.cos(x) * Math.cos(y)
  );
}

const createLevitatingBlock = (properties) => {
  // create mesh
  var block = createMesh.block(properties.color);
  // calculate 2d position
  var pos2d = calculate2dPosition(properties);

  block.userData = {
    // set 2d position on earth so we can more
    // easily recalculate the 3d position
    x: pos2d.x,
    y: pos2d.y,
    altitude: 200 - properties.size / 1.5,
    levitation: .1,
    size: properties.size
  }
  set3dPosition(block);
  block.lookAt(earthPosition);
  block.scale.set(properties.size, properties.size, properties.size)
  block.updateMatrix();
  return block;
}

// Create a block mesh and set its position in 3d
// space just below the earths surface
const createBlock = (properties) => {
  // create mesh
  var block = createMesh.block(properties.color);

  // calculate 2d position
  var pos2d = calculate2dPosition(properties);

  pos2d.altitude = 200 + properties.size.y / 2;
  set3dPosition(block, pos2d);
  block.lookAt(earthPosition);
  block.scale.set(properties.size.x, properties.size.y, properties.size.z)
  block.updateMatrix();

  return block;
}

// internal function to levitate all levitating
// blocks each tick. Called on render.
const levitateBlocks = () => {
  levitatingBlocks.forEach(function(block, i) {

    var userData = block.userData;

    // if entirely outide of earth, stop levitating
    if(userData.altitude > 200 + userData.size / 2) {
      levitatingBlocks.splice(i, 1);
      return;
    }

    userData.altitude += userData.levitation;
    set3dPosition(block);
    block.updateMatrix();
  });
}

const createMarker = (properties) => {
  var map = new THREE.TextureLoader().load('./assets/img/pin.svg');
  var spriteMaterial = new THREE.SpriteMaterial({
    map: map,
    side: THREE.DoubleSide,
  });
  var sprite = new THREE.Sprite( spriteMaterial );
  //sprite.scale.set(20, 20, 20)
  sprite.userData = properties;

  var pos2d = calculate2dPosition(properties);
  pos2d.altitude = 202;
  set3dPosition(sprite, pos2d);
  console.log(sprite.position)
  sprite.lookAt(earthPosition);
  sprite.updateMatrix();

	return sprite;
}

const makeTextSprite = (properties) => {
	if ( properties === undefined ) properties = {};

  var message = properties.hasOwnProperty("message") ? properties["message"] : "";
	var fontface = properties.hasOwnProperty("fontface") ? properties["fontface"] : "Arial";
	var fontsize = properties.hasOwnProperty("fontsize") ? properties["fontsize"] : 35;
	var color = properties.hasOwnProperty("color") ? properties["color"] : { r:0, g:0, b:0, a:1.0 };
  var shadowColor = properties.hasOwnProperty("shadowColor") ? properties["shadowColor"] : { r:0, g:0, b:0, a:1 };
  var lineWidth = properties.hasOwnProperty("lineWidth") ? properties["lineWidth"] : 1;
  var shadowBlur = properties.hasOwnProperty("shadowBlur") ? properties["shadowBlur"] : 5;
  var size = properties.hasOwnProperty("size") ? properties["size"] : { x: 20, y: 10, z: 1.0 };
  var transparent = properties.hasOwnProperty("transparent") ? properties["transparent"] : false;
  var lat = properties.hasOwnProperty("long") ? properties["long"] : 0;
  var long = properties.hasOwnProperty("long") ? properties["long"] : 0;

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	// get size data (height depends only on font size)
	var metrics = context.measureText(message);
	var textWidth = metrics.width;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '100 ' + fontsize + 'px ' + fontface;
  context.shadowColor = "rgba(" + shadowColor.r + "," + shadowColor.g + "," + shadowColor.b + "," + shadowColor.a + ")";
  context.shadowBlur = shadowBlur;
  context.lineWidth = lineWidth;
  context.strokeText(message, 125, 50);
  context.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
  context.fillText(message, 125, 50);

	var texture = new THREE.Texture(canvas)
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial({ map: texture, side:THREE.DoubleSide });
	var sprite = new THREE.Sprite( spriteMaterial );
  //sprite.material.transparent = transparent;
  spriteMaterial.depthWrite = false;
  sprite.material.side = 0;
  sprite.userData = properties;
  var pos2d = calculate2dPosition(properties);
  pos2d.altitude = 202;
  set3dPosition(sprite, pos2d);
  sprite.lookAt(earthPosition);
  sprite.scale.set(properties.size.x, properties.size.y, properties.size.z)
  sprite.updateMatrix();

	return sprite;
}

// Source: http://explorer.worldwind.earth/js/model/sun/SolarCalculator.js
/**
 *
 * @param {Date} localTime
 * @param {Number} utcOffset
 * @param {Number} lat
 * @param {Number} lng
 * @returns {undefined}
 */
const SolarCalculator = (localTime, utcOffset, lat, lng) => {
  // TODO: define intermediate and final output properties‡
  /**
   *
   * @param {Number} jd
   * @returns {Number}
   */
  var calcTimeJulianCent = function (jd) {
      var T = (jd - 2451545.0) / 36525.0;
      return T;
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcJDFromJulianCent = function (t) {
      var JD = t * 36525.0 + 2451545.0;
      return JD;
  };
  /**
   *
   * @param {Number} yr
   * @returns {Boolean}
   */
  var isLeapYear = function (yr) {
      return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
  };
  /**
   *
   * @param {Number} jd
   * @returns {Number}
   */
  var calcDoyFromJD = function (jd) {
      var z = Math.floor(jd + 0.5);
      var f = (jd + 0.5) - z;
      if (z < 2299161) {
          var A = z;
      } else {
          var alpha = Math.floor((z - 1867216.25) / 36524.25);
          var A = z + 1 + alpha - Math.floor(alpha / 4);
      }
      var B = A + 1524;
      var C = Math.floor((B - 122.1) / 365.25);
      var D = Math.floor(365.25 * C);
      var E = Math.floor((B - D) / 30.6001);
      var day = B - D - Math.floor(30.6001 * E) + f;
      var month = (E < 14) ? E - 1 : E - 13;
      var year = (month > 2) ? C - 4716 : C - 4715;

      var k = (isLeapYear(year) ? 1 : 2);
      var doy = Math.floor((275 * month) / 9) - k * Math.floor((month + 9) / 12) + day - 30;
      return doy;
  };
  /**
   *
   * @param {Number} angleRad
   * @returns {Number}
   */
  var radToDeg = function (angleRad) {
      return (180.0 * angleRad / Math.PI);
  };
  /**
   *
   * @param {Number} angleDeg
   * @returns {Number}
   */
  var degToRad = function (angleDeg) {
      return (Math.PI * angleDeg / 180.0);
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcGeomMeanLongSun = function (t) {
      var L0 = 280.46646 + t * (36000.76983 + t * (0.0003032));
      while (L0 > 360.0) {
          L0 -= 360.0;
      }
      while (L0 < 0.0) {
          L0 += 360.0;
      }
      return L0;		// in degrees
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcGeomMeanAnomalySun = function (t) {
      var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
      return M;		// in degrees
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcEccentricityEarthOrbit = function (t) {
      var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
      return e;		// unitless
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcSunEqOfCenter = function (t) {
      var m = calcGeomMeanAnomalySun(t);
      var mrad = degToRad(m);
      var sinm = Math.sin(mrad);
      var sin2m = Math.sin(mrad + mrad);
      var sin3m = Math.sin(mrad + mrad + mrad);
      var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
      return C;		// in degrees
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcSunTrueLong = function (t) {
      var l0 = calcGeomMeanLongSun(t);
      var c = calcSunEqOfCenter(t);
      var O = l0 + c;
      return O;		// in degrees
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcSunTrueAnomaly = function (t) {
      var m = calcGeomMeanAnomalySun(t);
      var c = calcSunEqOfCenter(t);
      var v = m + c;
      return v;		// in degrees
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcSunRadVector = function (t) {
      var v = calcSunTrueAnomaly(t);
      var e = calcEccentricityEarthOrbit(t);
      var R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(degToRad(v)));
      return R;		// in AUs
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcSunApparentLong = function (t) {
      var o = calcSunTrueLong(t);
      var omega = 125.04 - 1934.136 * t;
      var lambda = o - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
      return lambda;		// in degrees
  };
  /**
   *
   * @param {Number} t
   * @returns {Number}
   */
  var calcMeanObliquityOfEcliptic = function (t) {
      var seconds = 21.448 - t * (46.8150 + t * (0.00059 - t * (0.001813)));
      var e0 = 23.0 + (26.0 + (seconds / 60.0)) / 60.0;
      return e0;		// in degrees
  };
  /**
   *
   * @param {Number} t
   * @returns {Number} degrees
   */
  var calcObliquityCorrection = function (t) {
      var e0 = calcMeanObliquityOfEcliptic(t);
      var omega = 125.04 - 1934.136 * t;
      var e = e0 + 0.00256 * Math.cos(degToRad(omega));
      return e;		// in degrees
  };
  /**
   *
   * @param {Number} t
   * @returns {Number} degrees
   */
  var calcSunRtAscension = function (t) {
      var e = calcObliquityCorrection(t);
      var lambda = calcSunApparentLong(t);
      var tananum = (Math.cos(degToRad(e)) * Math.sin(degToRad(lambda)));
      var tanadenom = (Math.cos(degToRad(lambda)));
      var alpha = radToDeg(Math.atan2(tananum, tanadenom));
      return alpha;		// in degrees
  };
  /**
   *
   * @param {Number} t Julian date century
   * @returns {Number} degrees
   */
  var calcSunDeclination = function (t) {
      var e = calcObliquityCorrection(t);
      var lambda = calcSunApparentLong(t);

      var sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
      var theta = radToDeg(Math.asin(sint));
      return theta;		// in degrees
  };
  /**
   * Computes the equation of time.
   * @param {Number} t
   * @returns {Number} minutes
   */
  var calcEquationOfTime = function (t) {
      var epsilon = calcObliquityCorrection(t);
      var l0 = calcGeomMeanLongSun(t);
      var e = calcEccentricityEarthOrbit(t);
      var m = calcGeomMeanAnomalySun(t);

      var y = Math.tan(degToRad(epsilon) / 2.0);
      y *= y;

      var sin2l0 = Math.sin(2.0 * degToRad(l0));
      var sinm = Math.sin(degToRad(m));
      var cos2l0 = Math.cos(2.0 * degToRad(l0));
      var sin4l0 = Math.sin(4.0 * degToRad(l0));
      var sin2m = Math.sin(2.0 * degToRad(m));

      var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
      return radToDeg(Etime) * 4.0;	// in minutes of time
  };
  /**
   * Returns the hour angle [radians] at sunrise; negate teh value for sunset.
   * @param {Number} lat Observer latitude
   * @param {Number} solarDec Declination
   * @returns {Number} radians
   */
  var calcHourAngleSunrise = function (lat, solarDec) {
      var latRad = degToRad(lat);
      var sdRad = degToRad(solarDec);
      var HAarg = (Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
      var HA = Math.acos(HAarg);
      return HA;		// in radians (for sunset, use -HA)
  };
  /**
   *
   * @param {Object} inputVal
   * @returns {Boolean}
   */
  var isNumber = function (inputVal) {
      var oneDecimal = false;
      var inputStr = "" + inputVal;
      for (var i = 0; i < inputStr.length; i++) {
          var oneChar = inputStr.charAt(i);
          if (i == 0 && (oneChar == "-" || oneChar == "+")) {
              continue;
          }
          if (oneChar == "." && !oneDecimal) {
              oneDecimal = true;
              continue;
          }
          if (oneChar < "0" || oneChar > "9") {
              return false;
          }
      }
      return true;
  }
  /**
   * Gets the Julian date for the given calendar date at 00:00 UTC.
   * @param {Number} year
   * @param {Number} month
   * @param {Number} day
   * @returns {Number} Fractional julian date at 00:00 UTC (e.g. the Julian date for
   * 2016 June 7 00:00:00.0 UT is JD 2457546.5)
   */
  var getJD = function (year, month, day) {
      if (month <= 2) {
          year -= 1;
          month += 12;
      }
      var A = Math.floor(year / 100);
      var B = 2 - A + Math.floor(A / 4);
      var JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
      return JD;
  };
  /**
   * Converts the given hours, minutes, seconds to minutes.
   * @param {Number} hour
   * @param {Number} minute
   * @param {Number} second
   * @returns {Number} Fractional minutes
   */
  var getTimeLocal = function (hour, minute, second) {
      var mins = hour * 60 + minute + second / 60.0;
      return mins;
  };
  /**
   *
   * @param {type} output
   * @param {Number} T
   * @param {Number} localtime
   * @param {Number} latitude
   * @param {Number} longitude
   * @param {Number} zone
   * @returns {Number}
   */
  var calcAzEl = function (output, T, localtime, latitude, longitude, zone) {
      var eqTime = calcEquationOfTime(T);
      var theta = calcSunDeclination(T);

      var solarTimeFix = eqTime + 4.0 * longitude - 60.0 * zone;
      var earthRadVec = calcSunRadVector(T);
      var trueSolarTime = localtime + solarTimeFix;
      while (trueSolarTime > 1440) {
          trueSolarTime -= 1440;
      }
      var hourAngle = trueSolarTime / 4.0 - 180.0;
      if (hourAngle < -180) {
          hourAngle += 360.0;
      }
      var haRad = degToRad(hourAngle);
      var csz = Math.sin(degToRad(latitude)) * Math.sin(degToRad(theta)) + Math.cos(degToRad(latitude)) * Math.cos(degToRad(theta)) * Math.cos(haRad);
      if (csz > 1.0) {
          csz = 1.0
      } else if (csz < -1.0) {
          csz = -1.0
      }
      var zenith = radToDeg(Math.acos(csz));
      var azDenom = (Math.cos(degToRad(latitude)) * Math.sin(degToRad(zenith)));
      if (Math.abs(azDenom) > 0.001) {
          var azRad = ((Math.sin(degToRad(latitude)) * Math.cos(degToRad(zenith))) - Math.sin(degToRad(theta))) / azDenom;
          if (Math.abs(azRad) > 1.0) {
              if (azRad < 0) {
                  azRad = -1.0;
              } else {
                  azRad = 1.0;
              }
          }
          var azimuth = 180.0 - radToDeg(Math.acos(azRad));
          if (hourAngle > 0.0) {
              azimuth = -azimuth;
          }
      } else {
          if (latitude > 0.0) {
              azimuth = 180.0;
          } else {
              azimuth = 0.0;
          }
      }
      if (azimuth < 0.0) {
          azimuth += 360.0;
      }
      var exoatmElevation = 90.0 - zenith;

      // Atmospheric Refraction correction

      var refractionCorrection = 0.0;
      if (exoatmElevation > 85.0) {
          refractionCorrection = 0.0;
      } else {
          var te = Math.tan(degToRad(exoatmElevation));
          if (exoatmElevation > 5.0) {
              refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
          } else if (exoatmElevation > -0.575) {
              refractionCorrection = 1735.0 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711)));
          } else {
              refractionCorrection = -20.774 / te;
          }
          refractionCorrection = refractionCorrection / 3600.0;
      }

      var solarZen = zenith - refractionCorrection;
      var result = {
          eot: eqTime,
          theta: theta,
          azimuth: azimuth,
          zenith: solarZen
      };
      return result;
  };
  /**
   *
   * @param {Number} jd
   * @param {Number} longitude
   * @param {Number} timezone
   * @param {type} dst
   * @returns {Number}
   */
  var calcSolNoon = function (jd, longitude, timezone, dst) {
      var tnoon = calcTimeJulianCent(jd - longitude / 360.0);
      var eqTime = calcEquationOfTime(tnoon);
      var solNoonOffset = 720.0 - (longitude * 4) - eqTime; // in minutes
      var newt = calcTimeJulianCent(jd + solNoonOffset / 1440.0);
      eqTime = calcEquationOfTime(newt);
      var solNoonLocal = 720 - (longitude * 4) - eqTime + (timezone * 60.0); // in minutes
      if (dst)
          solNoonLocal += 60.0;
      while (solNoonLocal < 0.0) {
          solNoonLocal += 1440.0;
      }
      while (solNoonLocal >= 1440.0) {
          solNoonLocal -= 1440.0;
      }
      return solNoonLocal;
  };
  /**
   *
   * @param {type} rise
   * @param {Number} JD
   * @param {Number} latitude
   * @param {Number} longitude
   * @returns {Object} Result containing timeUTC and hourAngle
   */
  var calcSunriseSetUTC = function (rise, JD, latitude, longitude) {
      var t = calcTimeJulianCent(JD);
      var eqTime = calcEquationOfTime(t);
      var solarDec = calcSunDeclination(t);
      var hourAngle = calcHourAngleSunrise(latitude, solarDec);
      if (!rise)
          hourAngle = -hourAngle;
      var delta = longitude + radToDeg(hourAngle);
      var timeUTC = 720 - (4.0 * delta) - eqTime;	// in minutes
      var result = {
          timeUTC: timeUTC,
          hourAngle: radToDeg(hourAngle)
      };
      return result
  };
  /**
   *
   * @param {type} rise 1 for sunrise, 0 for sunset
   * @param {Number} JD
   * @param {Number} latitude
   * @param {Number} longitude
   * @param {Number} timezone
   * @param {type} dst
   * @returns {Object} Result containing timeLocal, timeUTC and hourAngle
   */
  var calcSunriseSet = function (rise, JD, latitude, longitude, timezone, dst) {
      var result = calcSunriseSetUTC(rise, JD, latitude, longitude);
      var timeUTC = result.timeUTC;
      var newResult = calcSunriseSetUTC(rise, JD + result.timeUTC / 1440.0, latitude, longitude);
      if (isNumber(newResult.timeUTC)) {
          var timeLocal = newResult.timeUTC + (timezone * 60.0);
          timeLocal += ((dst) ? 60.0 : 0.0);
          if ((timeLocal >= 0.0) && (timeLocal < 1440.0)) {
          } else {
              var jday = JD;
              var increment = ((timeLocal < 0) ? 1 : -1);
              while ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
                  timeLocal += increment * 1440.0;
                  jday -= increment
              }
          }
      } else { // no sunrise/set found
          var doy = calcDoyFromJD(JD);
          var jdy;
          if (((latitude > 66.4) && (doy > 79) && (doy < 267)) ||
              ((latitude < -66.4) && ((doy < 83) || (doy > 263)))) {   //previous sunrise/next sunset
              if (rise) { // find previous sunrise
                  jdy = calcJDofNextPrevRiseSet(0, rise, JD, latitude, longitude, timezone, dst)
              } else { // find next sunset
                  jdy = calcJDofNextPrevRiseSet(1, rise, JD, latitude, longitude, timezone, dst)
              }
          } else {   //previous sunset/next sunrise
              if (rise == 1) { // find previous sunrise
                  jdy = calcJDofNextPrevRiseSet(1, rise, JD, latitude, longitude, timezone, dst)
              } else { // find next sunset
                  jdy = calcJDofNextPrevRiseSet(0, rise, JD, latitude, longitude, timezone, dst)
              }
          }
      }
      // Add the local time to the result
      result.timeLocal = timeLocal;
      return result;
  };
  /**
   *
   * @param {type} next
   * @param {Number} rise
   * @param {Number} JD
   * @param {Number} latitude
   * @param {Number} longitude
   * @param {Number} tz
   * @param {type} dst
   * @returns {Number}
   */
  var calcJDofNextPrevRiseSet = function (next, rise, JD, latitude, longitude, tz, dst) {
      var julianday = JD;
      var increment = ((next) ? 1.0 : -1.0);

      var result = calcSunriseSetUTC(rise, julianday, latitude, longitude);
      var time = result.timeUTC;
      while (!isNumber(time)) {
          julianday += increment;
          result = calcSunriseSetUTC(rise, julianday, latitude, longitude);
          time = result.timeUTC;
      }
      var timeLocal = time + tz * 60.0 + ((dst) ? 60.0 : 0.0);
      while ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
          var incr = ((timeLocal < 0) ? 1 : -1);
          timeLocal += (incr * 1440.0);
          julianday -= incr
      }
      return julianday;
  };

  /*********************/

  // 4-digit year; valid range = -2000 to 6000
  var year = localTime ? localTime.getFullYear() : undefined;
  // 2-digit month; valid range = 1 to 12
  var month = localTime ? localTime.getMonth() + 1 : undefined; // convert from zero-based month
  // 2-digit day; valid range = 1 to 31
  var day = localTime ? localTime.getDate() : undefined;
  // Observer local hour; valid range = 0 to 24
  var hour = localTime ? localTime.getHours() : undefined;
  // Observer local minute; valid range = 0 to 59
  var minute = localTime ? localTime.getMinutes() : undefined;
  // Observer local second; valid range = 0 to 59
  var second = localTime ? localTime.getSeconds() : undefined;
  // Observer time zone (negative west of Greenwich)
  var tz = utcOffset || 0; // hours

  var jday = getJD(year, month, day);
  var tl = getTimeLocal(hour, minute, second);
  var julianDay = jday + tl / 1440.0 - tz / 24.0;
  var T = calcTimeJulianCent(julianDay);

  var eqTime = calcEquationOfTime(T);
  var theta = calcSunDeclination(T);

  var solarTimeFix = eqTime + 4.0 * lng - 60.0 * tz;
  var earthRadVec = calcSunRadVector(T);
  var trueSolarTime = tl + solarTimeFix;
  while (trueSolarTime > 1440) {
      trueSolarTime -= 1440;
  }
  var hourAngle = trueSolarTime / 4.0 - 180.0;
  if (hourAngle < -180) {
      hourAngle += 360.0;
  }
  var haRad = degToRad(hourAngle);
  var csz = Math.sin(degToRad(lat)) * Math.sin(degToRad(theta)) + Math.cos(degToRad(lat)) * Math.cos(degToRad(theta)) * Math.cos(haRad);
  if (csz > 1.0) {
      csz = 1.0
  } else if (csz < -1.0) {
      csz = -1.0
  }
  var zenith = radToDeg(Math.acos(csz));
  var azDenom = (Math.cos(degToRad(lat)) * Math.sin(degToRad(zenith)));
  if (Math.abs(azDenom) > 0.001) {
      var azRad = ((Math.sin(degToRad(lat)) * Math.cos(degToRad(zenith))) - Math.sin(degToRad(theta))) / azDenom;
      if (Math.abs(azRad) > 1.0) {
          if (azRad < 0) {
              azRad = -1.0;
          } else {
              azRad = 1.0;
          }
      }
      var azimuth = 180.0 - radToDeg(Math.acos(azRad));
      if (hourAngle > 0.0) {
          azimuth = -azimuth;
      }
  } else {
      if (lat > 0.0) {
          azimuth = 180.0;
      } else {
          azimuth = 0.0;
      }
  }
  if (azimuth < 0.0) {
      azimuth += 360.0;
  }
  var exoatmElevation = 90.0 - zenith;

  // Atmospheric Refraction correction

  var refractionCorrection = 0.0;
  if (exoatmElevation > 85.0) {
      refractionCorrection = 0.0;
  } else {
      var te = Math.tan(degToRad(exoatmElevation));
      if (exoatmElevation > 5.0) {
          refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
      } else if (exoatmElevation > -0.575) {
          refractionCorrection = 1735.0 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711)));
      } else {
          refractionCorrection = -20.774 / te;
      }
      refractionCorrection = refractionCorrection / 3600.0;
  }
  var solarZen = zenith - refractionCorrection;

  //var azEl = calcAzEl(1, T, tl, lat, lng, tz);

  calcSolNoon(jday, lng, tz);
  var rise = calcSunriseSet(1, jday, lat, lng, tz);
  var set = calcSunriseSet(0, jday, lat, lng, tz);
  var midnight = new Date(localTime.getFullYear(), localTime.getMonth(), localTime.getDate());
  var sunriseTime = new Date(midnight.getTime() + rise.timeLocal * 60000);
  var sunsetTime =  new Date(midnight.getTime() + set.timeLocal * 60000);

  var alpha = calcSunRtAscension(T);

  // TODO: create limitDegrees360
  while (alpha < 0)
      alpha += 360;

  // TODO: create calcGreenwichMeanSiderealTime()
  var elapsedJulianDays = julianDay - 2451545.0;
  var greenwichMeanSiderealTime = (18.697374558 + 24.06570982441908 * elapsedJulianDays) % 24;
  var longitude = alpha - (greenwichMeanSiderealTime * 15.0);

  // TODO: create limitDegrees180()
  while (longitude > 180)
      longitude -= 360;
  while (longitude < -180)
      longitude += 360;
  while (azimuth > 180)
      azimuth -= 360;
  while (longitude < -180)
      azimuth += 360;


  // TODO: return a new Sunlight object
  var sunlight = {
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute,
    second: second,
    utcOffset: tz,
    julianDate: julianDay,
    observerLatitude: lat,
    observerLongitude: lng,
    subsolarLatitude: theta,
    subsolarLongitude: longitude,
    azimuth: azimuth,
    zenith: zenith,
    rightAscension: alpha,
    hourAngle: hourAngle,
    sunriseHourAngle: rise.hourAngle,
    sunsetHourAngle: set.hourAngle,
    sunrise: sunriseTime,
    sunset: sunsetTime
  };
  return sunlight;
};

const day_night = (time) => {
  /*
  function getJulianFromUnix(time) {
    return ((time / 1000) / 86400.0) + 2440587.5
  }

  // Source: https://en.wikipedia.org/wiki/Position_of_the_Sun
  function sunCoordinates(time) {
    // Start by calculating n, the number of days (positive or negative) since Greenwich noon, Terrestrial Time, on 1 January 2000 (J2000.0). If you know the Julian date for your desired time then
    let D = getJulianFromUnix(time) - 2451545
    // The mean anomaly of the Sun (actually, of the Earth in its orbit around the Sun, but it is convenient to pretend the Sun orbits the Earth), is:
    let g = 357.529 + 0.98560028 * D
    // The mean longitude of the Sun, corrected for the aberration of light, is:
    let L = 280.459 + 0.98564736 * D
    // Finally, the ecliptic longitude of the Sun is:
    let lambda = L +
      1.915 * Math.sin(toRadians(g)) +
      0.020 * Math.sin(toRadians(2 * g))

    let e = 23.439 - 0.00000036 * D
    let y = Math.cos(toRadians(e)) * Math.sin(toRadians(lambda))
    let x = Math.cos(toRadians(lambda))

    let rightAscension = Math.atan2(y, x)
    // The Sun's declination at any given moment is calculated by:
    let declination = Math.asin(
      Math.sin(toRadians(e)) * Math.sin(toRadians(lambda))
    )

    let gmst = 18.697374558 + 24.06570982441908 * D
    let hourAngle = (gmst / 24 * Math.PI * 2) - rightAscension

    return {
      hourAngle: hourAngle,
      declination: declination
    }
  }
  */

  var sunPosition = SolarCalculator(time, 2, 49.2536521, 4.023489800000001);
  var pos2d = calculate2dPosition({ lat: sunPosition.subsolarLatitude, lon: sunPosition.subsolarLongitude });
  pos2d.altitude = 4000;

  set3dPosition(sunlight, pos2d);
  set3dPosition(sun, pos2d);
  set3dPosition(sunPlane, pos2d);

  //outsideGlow.position.set(7, 0, 0);
}

const moon_position = (date) => {
  function datan(x) { return(180/ Math.PI * Math.atan(x)); };

  function datan2(y, x)
    {
    var a;

    if ((x == 0) && (y == 0))
      {
      return(0);
      }
    else
      {
      a = datan(y / x);
      if (x < 0)
        a = a + 180;
      if (y < 0 && x > 0)
        a = a + 360;
      return(a);
      };
    }

  function dsin(x) { return(Math.sin(Math.PI / 180 * x)); }

  function dasin(x) { return(180/ Math.PI * Math.asin(x)); }

  function dcos(x) { return(Math.cos(Math.PI / 180 * x)); }

  function dtan(x) { return(Math.tan(Math.PI / 180 * x)); }

  function range(x)
    {
    var a
    var b;

    b = x / 360;
    a = 360 * (b - ipart(b));
    if (a  < 0)
      a = a + 360;

    return(a);
    }

  function ipart(x)
    {
    var a;

    if (x> 0)
      a = Math.floor(x);
    else
      a = Math.ceil(x);

    return(a);
    }


  Date.prototype.getJulianDay = function() {
    return(this.valueOf() / (1000*60*60*24) - 0.5 + 2440588);
  }

  // Greenwich Mean Sidereal Time
  Date.prototype.getGMST = function() {
    var MJD;
    var MJD0;
    var UT;
    var t_eph;
    var gmst;

    MJD = this.getJulianDay() - 2400000.5;
    MJD0 = Math.floor(MJD);
    UT = (MJD - MJD0) * 24.0;
    t_eph = (MJD0 - 51544.5) / 36525.0;
    gmst = 6.697374558 + 1.0027379093*UT + (8640184.812866 +
           (0.093104 - 0.0000062*t_eph) * t_eph) *t_eph / 3600.0;

    return(gmst%24);
  }

  var days;
  var t;
  var F;
  var L1;
  var M1;
  var C1;
  var V1;
  var Obl;
  var Ec1;
  var R1;
  var Th1;
  var Om1;
  var Lam1;
  var L2;
  var Om2;
  var M2;
  var D;
  var D2;
  var R2;
  var R3;
  var Bm;
  var Lm;
  var HLm;
  var HBm;
  var Ra2;
  var Dec2;
  var GMST;
  var latitude;
  var longitude;
  var point=[];

  days = date.getJulianDay() - 2451545;
  t = days / 36525;

  // Sun formulas
  L1 = range(280.466 + 36000.8 * t);
  M1 = range(357.529+35999*t - 0.0001536* t*t + t*t*t/24490000);
  C1 = (1.915 - 0.004817* t - 0.000014* t * t)* dsin(M1);
  C1 = C1 + (0.01999 - 0.000101 * t)* dsin(2*M1);
  C1 = C1 + 0.00029 * dsin(3*M1);
  V1 = M1 + C1;
  Ec1 = 0.01671 - 0.00004204 * t - 0.0000001236 * t*t;
  R1 = 0.99972 / (1 + Ec1 * dcos(V1));
  Th1 = L1 + C1;
  Om1 = range(125.04 - 1934.1 * t);
  Lam1 = Th1 - 0.00569 - 0.00478 * dsin(Om1);
  Obl = (84381.448 - 46.815 * t)/3600;

  //  Moon formulas
  //  F   - Argument of latitude (F)
  //  L2  - Mean longitude (L')
  //  Om2 - Long. Asc. Node (Om')
  //  M2  - Mean anomaly (M')
  //  D   - Mean elongation (D)
  //  D2  - 2 * D
  //  R2  - Lunar distance (Earth - Moon distance)
  //  R3  - Distance ratio (Sun / Moon)
  //  Bm  - Geocentric Latitude of Moon
  //  Lm  - Geocentric Longitude of Moon
  //  HLm - Heliocentric longitude
  //  HBm - Heliocentric latitude
  //  Ra2 - Lunar Right Ascension
  //  Dec2- Declination

  F = range(93.2721 + 483202 * t - 0.003403 * t* t - t * t * t/3526000);
  L2 = range(218.316 + 481268 * t);
  Om2 = range(125.045 - 1934.14 * t + 0.002071 * t * t + t * t * t/450000);
  M2 = range(134.963 + 477199 * t + 0.008997 * t * t + t * t * t/69700);
  D = range(297.85 + 445267 * t - 0.00163 * t * t + t * t * t/545900);
  D2 = 2*D;
  R2 = 1 + (-20954 * dcos(M2) - 3699 * dcos(D2 - M2) - 2956 *
       dcos(D2)) / 385000;
  R3 = (R2 / R1) / 379.168831168831;
  Bm = 5.128 * dsin(F) + 0.2806 * dsin(M2 + F);
  Bm = Bm + 0.2777 * dsin(M2 - F) + 0.1732 * dsin(D2 - F);
  Lm = 6.289 * dsin(M2) + 1.274 * dsin(D2 -M2) + 0.6583 * dsin(D2);
  Lm = Lm + 0.2136 * dsin(2*M2) - 0.1851 * dsin(M1) - 0.1143 * dsin(2 * F);
  Lm = Lm +0.0588 * dsin(D2 - 2*M2);
  Lm = Lm + 0.0572* dsin(D2 - M1 - M2) + 0.0533* dsin(D2 + M2);
  Lm = Lm + L2;
  Ra2 = datan2(dsin(Lm) * dcos(Obl) - dtan(Bm)* dsin(Obl), dcos(Lm));
  Dec2 = dasin(dsin(Bm)* dcos(Obl) + dcos(Bm)*dsin(Obl)*dsin(Lm));
  HLm = range(Lam1 + 180 + (180/Math.PI) * R3 * dcos(Bm) * dsin(Lam1 - Lm));
  HBm = R3 * Bm;

  GMST = date.getGMST();
  latitude = Dec2;
  latitude = Math.round(10000*latitude)/10000;
  longitude = Ra2 - (GMST * 15);
  if (longitude < -180)
    longitude += 360;
  if (longitude > 180)
    longitude -= 360;
  longitude = Math.round(10000*longitude)/10000;

  //console.log('Latitude: ' + latitude + 'Longitude: ' + longitude)
  var pos2d = calculate2dPosition({ lat: latitude, lon: longitude });
  pos2d.altitude = 3000;

  set3dPosition(moon, pos2d);
  moonPosition = moon.position;
}

const day_night2 = (time) => {
  function getJulianFromUnix(time) {
    return ((time / 1000) / 86400.0) + 2440587.5
  }

  // Source: https://en.wikipedia.org/wiki/Position_of_the_Sun
  function sunCoordinates(time) {
    // Start by calculating n, the number of days (positive or negative) since Greenwich noon, Terrestrial Time, on 1 January 2000 (J2000.0). If you know the Julian date for your desired time then
    let D = getJulianFromUnix(time) - 2451545
    // The mean anomaly of the Sun (actually, of the Earth in its orbit around the Sun, but it is convenient to pretend the Sun orbits the Earth), is:
    let g = 357.529 + 0.98560028 * D
    // The mean longitude of the Sun, corrected for the aberration of light, is:
    let L = 280.459 + 0.98564736 * D
    // Finally, the ecliptic longitude of the Sun is:
    let lambda = L +
      1.915 * Math.sin(toRadians(g)) +
      0.020 * Math.sin(toRadians(2 * g))

    let e = 23.439 - 0.00000036 * D
    let y = Math.cos(toRadians(e)) * Math.sin(toRadians(lambda))
    let x = Math.cos(toRadians(lambda))

    let rightAscension = Math.atan2(y, x)
    // The Sun's declination at any given moment is calculated by:
    let declination = Math.asin(
      Math.sin(toRadians(e)) * Math.sin(toRadians(lambda))
    )

    let gmst = 18.697374558 + 24.06570982441908 * D
    let hourAngle = (gmst / 24 * Math.PI * 2) - rightAscension

    return {
      hourAngle: hourAngle,
      declination: declination
    }
  }

  const coord = sunCoordinates(time.utcOffset(0).format('x'));
  const earthRadius = 200;
  const distance_earth_sun = 1500000;
  const h = coord.hourAngle;
  const d = coord.declination;

  let x_sunlight = distance_earth_sun + earthRadius * Math.cos(h)
  let y_sunlight = distance_earth_sun + earthRadius * Math.sin(d)
  let z_sunlight = distance_earth_sun + earthRadius * Math.sin(h)

  let x_sun = distance_earth_sun + earthRadius * Math.cos(h)
  let y_sun = distance_earth_sun + earthRadius * Math.sin(d)
  let z_sun = distance_earth_sun + earthRadius * Math.sin(h)

  sunlight.position.set(x_sunlight, y_sunlight, z_sunlight);
  sun.position.set(x_sun, y_sun, z_sun);
  sunPlane.position.copy( sun.position );

  //outsideGlow.position.set(7, 0, 0);
}

const zoomRelative = (delta) => {
  distanceTarget -= delta;
  checkAltituteBoundries();
}

const zoomTo = (altitute) => {
  distanceTarget = altitute;
  checkAltituteBoundries();
}

const zoomImmediatelyTo = (altitute) => {
  distanceTarget = distance = altitute;
  checkAltituteBoundries();
}

// Keep track of mouse positions
mouse = { x: 0, y: 0 };
const mouse2 = { x: 0, y: 0 };
const mouseOnDown = { x: 0, y: 0 };
const targetOnDown = {};

// DOM event handlers
const handle = {
  scroll: function(e) {
    e.preventDefault();
    // @link http://www.h3xed.com/programming/javascript-mouse-scroll-wheel-events-in-firefox-and-chrome
    if(e.wheelDelta) {
      // chrome
      var delta = e.wheelDelta * 0.5;
    } else {
      // firefox
      var delta = -e.detail * 15;
    }
    zoomRelative(delta);
    return false;
  },
  resize: function(e) {
    setSize();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  },
	over: function(e) {
    e.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    /*
    raycaster.setFromCamera( mouse, camera );

 		var intersects = raycaster.intersectObjects( scene.children );
 		if (intersects.length > 0) {
 			if (INTERSECTED != intersects[0].object && intersects[0].object.name == "Label") {
        container.style.cursor = 'pointer';
         if(INTERSECTED) {
           INTERSECTED.material.opacity = 1;
           INTERSECTED.material.color = new THREE.Color(0xFFFFFF);
           INTERSECTED.material.linewidth=1;
           INTERSECTED.scale.set(40, 20, 1);
         }
         INTERSECTED = intersects[0].object;
         INTERSECTED.scale.set(60, 30, 20);
 			}

 		} else {
 			INTERSECTED = null;
 		}
    */
  },
  // @link https://github.com/dataarts/webgl-globe/blob/master/globe/globe.js#L273-L334
  drag: {
    start: function(e) {
      e.preventDefault();
      // We disable events that could annoy the user during draging the earth
      container.addEventListener('mousemove', handle.drag.move, false);
      container.addEventListener('mouseup', handle.drag.end, false);
      //container.addEventListener('mouseout', handle.drag.end, false);

      mouseOnDown.x = -e.clientX;
      mouseOnDown.y = e.clientY;

      targetOnDown.x = target.x;
      targetOnDown.y = target.y;

      container.style.cursor = '-webkit-grab';
	  },
    move: function(e) {
      mouse.x = -e.clientX;
      mouse.y = e.clientY;

      var zoomDamp = distance / 500;

      target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
      target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

      target.y = target.y > Math.PI / 2 ? Math.PI / 2 : target.y;
      target.y = target.y < - Math.PI / 2 ? - Math.PI / 2 : target.y;
    },
    end: function(e) {
      container.removeEventListener('mousemove', handle.drag.move, false);
      container.removeEventListener('mouseup', handle.drag.start, false);

      var diff1 = Math.abs( target.x - targetOnDown.x );
      var diff2 = Math.abs( target.y - targetOnDown.y );

      // Si il n'y a pas eu un mouvement, on regarde si il y a un clique sur un label
      if(diff1 < 0.2 && diff2 < 0.2) {
        mouse2.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse2.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse2, camera );

     		var intersects = raycaster.intersectObjects( scene.children );
     		if (intersects.length > 0) {
          if (intersects[0].object.name == "Earth" || intersects[0].object.name == "Label" || intersects[0].object.name == "Country" || intersects[0].object.name == "Point") {

            var coords = calculate3dPosition(intersects[0].point, 200);

            console.log('Camera:')
            console.log(camera.position)

            console.log('Intersection:')
            console.log(intersects[0].point)

            getInfoFromLocation(coords.lat, coords.lon);

            console.log(SolarCalculator(new Date(), 2, coords.lat, coords.lon));
            /*
            addMarker({
              lat: coords.lat,
              lon: coords.lon
            });
            */
          }

     		} else {
     			INTERSECTED = null;
     		}
      }
      container.style.cursor = 'auto';
    }
  }
}

const createMesh = {
  skybox: function() {
    var skyboxLoader = new THREE.CubeTextureLoader();
    var textureCube = skyboxLoader.load(urls.skybox);
    var shader = THREE.ShaderLib[ "cube" ];

    shader.uniforms[ "tCube" ].value = textureCube;
    shader.uniforms[ "opacity" ] = { value: 30, type: "f" };
    shader.uniforms[ "tFlip" ] = { value: 1, type: "f" };

    var skyboxMat = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      side: THREE.DoubleSide,
    });
    return new THREE.Mesh( new THREE.BoxGeometry(10000, 10000, 10000), skyboxMat);
  },
  earth: function() {
    var textureLoader = new THREE.TextureLoader();
    var dayTexture = textureLoader.load(urls.earth.day);
    var bumpTexture = textureLoader.load(urls.earth.bump);
    var specularTexture = textureLoader.load(urls.earth.specular);

    var earthMaterial = new THREE.MeshStandardMaterial({
      map: dayTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.5,
      specularMap: specularTexture,
      specular: 0x141310,
      //shininess: 20,
      roughness: 1
    });

    /*
    var materialsArray=[]

    //earthGeometry = new THREE.BoxGeometry(100, 100, 100, 200, 200, 200);
    for (var i in earthGeometry.vertices) {
        var vertex = earthGeometry.vertices[i];

        var coords = calculate3dPosition({x: vertex.x, y: vertex.y, z: vertex.z }, distanceTarget);
        var token = "pk.eyJ1Ijoic2VibWVub3p6aSIsImEiOiJjajN4OW5weXcwMDB5MndyenF1NHh4OXlwIn0.zlQyGPTwui3k89AVs25t_Q";

        earthGeometry.faces[i].materialIndex = i;

        var material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture( `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coords.lon},${coords.lat},6/200x200@2x?access_token=${token}` ) });
        materialsArray.push(material);
    }

    earthGeometry.materials = materialsArray;
    */

    var earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthPosition = earth.position;
    return earth;
  },
  clouds: function() {
    var textureLoader = new THREE.TextureLoader();
    var cloudsTexture = textureLoader.load(urls.earth.clouds);

    var cloudsMaterial  = new THREE.MeshPhongMaterial({
      alphaMap: cloudsTexture,
      color: new THREE.Color('#ffffff'),
      opacity: 1,
      transparent: true
    })
    return new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  },
  night: function() {
    var textureLoader = new THREE.TextureLoader();
    var nightTexture = textureLoader.load(urls.earth.night);

    //nightTexture.wrapS = THREE.RepeatWrapping; // You do not need to set `.wrapT` in this case
    //nightTexture.mapping.z = 0.5;

    var nightMaterial = new THREE.MeshLambertMaterial({
      map: nightTexture,
      color: new THREE.Color('#f1ba3c'),
      opacity: 1,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      blendDst: THREE.OneFactor,
      blendSrc: THREE.OneFactor,
      //reflectivity: 100
    });

    var nightMesh = new THREE.Mesh(nightGeometry, nightMaterial);
    return nightMesh;
  },
  atmosphereLine: function(index, color) {
    var atmosphereLineGeometry = new THREE.SphereGeometry(200 + index, 100, 100);
    atmosphereLineGeometry.applyMatrix( new THREE.Matrix4().makeScale( -1.0, 1.0, 1.0 ) );

    var atmosphereLineMaterial = new THREE.MeshLambertMaterial();
    atmosphereLineMaterial.color.setStyle( color );
    atmosphereLineMaterial.opacity = 1;
    atmosphereLineMaterial.transparent = true;
    atmosphereLineMaterial.depthWrite = false;
    return new THREE.Mesh(atmosphereLineGeometry, atmosphereLineMaterial);
  },
  atmosphere: function() {
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
    var mesh = new THREE.Mesh(atmosphereGeometry, material);
    //mesh.scale.set(1.1, 1.1, 1.1);
    return mesh;
  },
  outsideGlow: function( color, aperture, scale, opacity ) {
    var outMaterial = new THREE.ShaderMaterial({
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
    var outMesh = new THREE.Mesh( outGeometry, outMaterial );
    return outMesh;
  },
  block: function(color) {
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
  },
  moon: function() {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(urls.moon.texture);
    var bumpTexture = textureLoader.load(urls.moon.bump);

    var moonMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      //bumpMap: bumpTexture,
      //bumpScale: 1.0
    });

    var moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set( 1000, 500, -2000 );
    moonPosition = moon.position;
    return moon;
  },
  reflectiveBall: function() {

    var envMap = new THREE.TextureLoader().load( "./assets/textures/metal.jpg" );
        envMap.mapping = THREE.CubeRefractionMapping;

    var material = new THREE.MeshStandardMaterial({ color: "red", roughness: 1 });
    var envMap = new THREE.TextureLoader().load( "./assets/textures/metal.jpg" );
    envMap.mapping = THREE.SphericalReflectionMapping;
    material.envMap = envMap;
    var roughnessMap = new THREE.TextureLoader().load( "./assets/textures/metal.jpg" );
    roughnessMap.magFilter = THREE.NearestFilter;
    material.roughnessMap = roughnessMap;
    roughnessMap.magFilter = THREE.NearestFilter;
    material.roughnessMap = roughnessMap;

    return new THREE.Mesh(new THREE.SphereGeometry(2, 20, 20), material);
  }
}
const addBlock = (data) => {
  var block = createBlock(data);
  scene.add(block);
  blocks.push(block);
  return this;
}
const addLabel = (data) => {
  var label = makeTextSprite(data);
  label.name = 'Label';
  scene.add(label);
  labels.push(label);
  return this;
}/*
const loadStats = () => {
  for (var i = 0; i < countries.length; i++) {
    var color = new THREE.Color( 0xffffff );
    var size = (countries[i].pib_ppp)/59999; // PIB PPA
    //var size = (countries[i].life_expectancy/(84-countries[i].life_expectancy))*2 // life expectancy
    //var size = (83.7-countries[i].life_expectancy)*2 //mortality

    var block = {
      color: color.setHSL(size, 1.0, 0.5 ),
      size: {
        x: 1,
        y: 1,
        z: size
      },
      lat: parseFloat(countries[i].latitude),
      lon: parseFloat(countries[i].longitude)
    };

    var label = {
      message: countries[i].name,
      fontsize: countries[i].fontSize,
      color: {r:255, g:255, b:255, a:1},
      shadowColor: {r:0, g:0, b:0, a:.8},
      size: {
        x: 40,
        y: 20,
        z: 1.0
      },
      transparent: true,
      lat: parseFloat(countries[i].latitude),
      lon: parseFloat(countries[i].longitude)
    }
    addLabel(label);

    //addBlock(block);


    var label = labelCountry(
      {
        name: countries[i].name,
        lat: parseFloat(countries[i].latitude),
        lon: parseFloat(countries[i].longitude),
        fontSize: countries[i].fontsize
      },
      200, document.body);
  }
}
*/
function convertDistanceTargetToPourcentage(distanceTarget) {
  return ((distanceTarget * 100) / 1300)
}

function convertLatLonToVec3(lat,lon) {
    lat =  lat * Math.PI / 180.0;
    lon = -lon * Math.PI / 180.0;
    return new THREE.Vector3(
        Math.cos(lat) * Math.cos(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.sin(lon));
}
/*
const LabelCountry = (countries) => {
  class Label extends Component {
    constructor(props) {
      super(props);
      this.state = {
        display: 'none',
        top: '0px',
        left: '0px'
      }
    }
    update() {
      label.style.display = 'block';
      //this.box.style.fontSize = ((location.fontSize * convertDistanceTargetToPourcentage(distanceTarget)) / 100) + 'px';
      //console.log(this.box.style.fontSize)
      // update the box overlays position
      label.style.left = ( posx - boundingRect.width ) + 'px';
      label.style.top =  posy + 'px';
    }
    render(){
      return (
        <div className="labelCountry" id={props.id}>
          {props.name}
        </div>
      )
    }
  }

  class Labels extends Component {
    constructor(props) {
      super(props);
      this.state = {
        labels: [],
        countries: countries
      }
    }
    render(){
      return (
        {countries.map(country => <Label key={country.id} name={country.name} />)}
      )
    }
  }

  ReactDOM.render(<Labels />, document.getElementById('labels'));
}
*/
/*
const labelCountry = (location, radius, domElement) => {
	var screenVector = new THREE.Vector3(0,0,0);
	var position = convertLatLonToVec3(location.lat, location.lon).multiplyScalar(radius);

  // create html overlay box
	var label = document.createElement('label');
      label.innerHTML = location.name;
      label.className = "label2";

  domElement.appendChild(label);
}

labelCountry.prototype.update = function ()
{
  console.log(this.position)
	screenVector.copy(position);
  screenVector.project( camera );

  if (distanceTarget > 600) {
    label.style.display = 'none';
  } else {
    var cameraToEarth = earth.position.clone().sub(camera.position);
    var L = Math.sqrt(Math.pow(cameraToEarth.length(), 2) - Math.pow(200, 2))

    var cameraToPin = position.clone().sub(camera.position);

    if(cameraToPin.length() > L) {
      // overlay anchor is obscured
      label.style.display = 'none';

    } else {
      // overlay anchor is visible
      screenVector.project( camera );

      var posx = Math.round(( screenVector.x + 1 ) * domElement.offsetWidth / 2 );
      var posy = Math.round(( 1 - screenVector.y ) * domElement.offsetHeight / 2 );
      var boundingRect = label.getBoundingClientRect();

      this.label.style.display = 'block';
      //this.box.style.fontSize = ((location.fontSize * convertDistanceTargetToPourcentage(distanceTarget)) / 100) + 'px';
      //console.log(this.box.style.fontSize)
      // update the box overlays position
      this.label.style.left = ( posx - boundingRect.width ) + 'px';
      this.label.style.top =  posy + 'px';
    }
  }

};
*/
/*
getSolarInfoFromLocation = (lat, lon) => {
  Math.floor(totalSeconds / 3600);
  http://api.timezonedb.com/v2/get-time-zone?key=U39LJEIGJLPH&format=json&by=position&lat=49.03302122132389&lng=4.092231558281924
}
*/
const getInfoFromLocation = (lat, lon) => {
  const data = {
    countryName: null,
    countryFlag: null,
    time: null,
    temperature: null,
  };

  target = calculate2dPosition({
    lat: lat,
    lon: lon
  });

  /*
  function getCountryFromLatAndLon(callback) {
    $.get(`http://ws.geonames.org/countryCodeJSON?lat=${parseFloat(lat)}&lng=${parseFloat(lon)}&username=sebmenozzi`, function(result) {
      if(result.countryName != undefined) {
        callback(result);
      }
    });
  }
  */
  function getCountryFromLatAndLon(callback) {
    var key = 'U39LJEIGJLPH';
    http://api.timezonedb.com/v2/get-time-zone?key=U39LJEIGJLPH&format=json&by=position&lat=49.03302122132389&lng=4.092231558281924
    $.get(`http://api.timezonedb.com/v2/get-time-zone?key=${key}&format=json&by=position&lat=${parseFloat(lat)}&lng=${parseFloat(lon)}`, function(result) {
      callback(result);
    });
  }

  function getWeatherFromLatAndLon(callback) {
    var apiKey = '24d3d329374ee1ab7ba99ad99030678f'; // provided by openweathermap
    $.get(`http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${parseFloat(lat)}&lon=${parseFloat(lon)}&appid=${apiKey}`, function(result) {
      if(result.cod == 200) {
        callback(result);
      }
    });
  }

  function loadDom(data) {
    return (
      <div className="container">
        <div className="infoBox">
          <p className="coordinates">{decimalAdjust('round', lat, -3) } °, {decimalAdjust('round', lon, -3) } °</p>
          <p className="temperature">{data.temperature} ° C</p>
        </div>

        <div className="countryBox" style={{display: data.countryName ? 'block' : 'none'}}>
          <img className="border" src="https://image.ibb.co/gFxj6F/border.png" />
          <img className="flag" width={250} height={150} src={data.countryFlag} />
          <h2 className="name">{data.countryName}</h2>
          <p className="time">{data.time}</p>
          <p className="time">☀️ {getTimeFromDate(data.sunrise)}</p>
          <p className="time">🌙 {getTimeFromDate(data.sunset)}</p>
        </div>
      </div>
    )
  }

  getCountryFromLatAndLon(function(country){
    if(country.countryName) {
      var utcOffset = Math.floor(country.gmtOffset / 3600);
      var sunData = SolarCalculator(new Date(), utcOffset, lat, lon);

      data.countryName = country.countryName;
      data.countryFlag = 'http://flagpedia.net/data/flags/normal/' + country.countryCode.toLowerCase() + '.png';
      data.time = getCurrentTimeFromTimezone(utcOffset);
      data.sunrise = sunData.sunrise;
      data.sunset = sunData.sunset;
      ReactDOM.render(loadDom(data), document.getElementById('GlobalInfo'));
    }
  })
  getWeatherFromLatAndLon(function(weather) {
    if(weather) {
      data.temperature = weather.main.temp;
      ReactDOM.render(loadDom(data), document.getElementById('GlobalInfo'));
    }
  })
}
const infoBox = (lat, lon) => {
	var screenVector = new THREE.Vector3(0,0,0);

  var pos2d = calculate2dPosition({ lat: lat, lon: lon });
  pos2d.altitude = 220;

  console.log(pos2d)

  var posx = Math.round(( pos2d.x + 1 ) * w / 2 - 50) + 'px';
	var posy = Math.round(( 1 - pos2d.y ) * h / 2 - 50) + 'px';

  var dom = (
    <div style={{position: 'absolute', top: posy, left: posx}}>
      Salut
    </div>
  );

  ReactDOM.render(dom, document.getElementById('labels'));

}
const render = () => {
  target.x += incr_rotation.x;
  target.y += incr_rotation.y;

  rotation.x += (target.x - rotation.x) * 0.1;
  rotation.y += (target.y - rotation.y) * 0.1;
  distance += (distanceTarget - distance) * 0.3;

  camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
  camera.position.y = distance * Math.sin(rotation.y);
  camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);
  camera.lookAt(earthPosition);

  var coords = calculate3dPosition({x: camera.position.x, y: camera.position.y, z: camera.position.z }, distanceTarget);
  //var token = "pk.eyJ1Ijoic2VibWVub3p6aSIsImEiOiJjajN4OW5weXcwMDB5MndyenF1NHh4OXlwIn0.zlQyGPTwui3k89AVs25t_Q";
  //console.log(`https://api.mapbox.com/styles/v1/mapbox/traffic-night-v2/static/${coords.lon},${coords.lat},8/1280x1280@2x?access_token=${token}`)
  /*
  if (distanceTarget <= 300) {
    console.log(`https://api.mapbox.com/styles/v1/mapbox/traffic-night-v2/static/${coords.lon},${coords.lat},8/1280x1280@2x?access_token=${token}`)
  }
  */

  //camera.fov = 20;
  //camera.updateProjectionMatrix();

  //moon.rotation.y += 0.1;
  //scene.rotation.y += 0.005;

  animationStorms()

  //console.log(calculate3dPosition(camera.position))

  //let pos = new THREE.Vector3( camera.position.x, camera.position.y, camera.position.z ).unproject( camera );

  //console.log(earthPosition)

  //clouds.rotation.y += .00005;
/*
  new labelCountry(
    {
      name: 'Reims',
      lat: 49.2537022,
      lon: 4.0234847,
      fontSize: 12
    },
    200, document.body).update();
  */
  /*
  countryLabels.forEach(function(label, i) {
    label.update();
  })
  */

  renderer.render(scene, camera);
}
const slider = () => {

  class Slider extends Component {
    constructor(props) {
      super(props);
      this.state = {
        year: 2016
      }
      this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
      this.setState({year: event.target.value});
    }
    render(){
      return (
        <div className={styles.slider}>
            <input
              type="range"
              min="1960"
              max="2016"
              step="1"
              value={this.state.year}
              onChange={this.handleChange}
              />
            <div className={styles.year}>{this.state.year}</div>
        </div>
      )
    }
  }

  ReactDOM.render(<Slider />, document.getElementById('slider'));
}
const outputUpdate = () => {
  console.log('test')
  /*
  var output = document.querySelector("#volume");
	output.value = vol;
  output.style.left = vol + 'px';
  */
}
const drawPoint = (properties) => {
  var pos2d = calculate2dPosition(properties);
  pos2d.altitude = 200;

  const pointGeometry = new THREE.SphereGeometry(properties.radius, 32, 32);
  const pointMaterial = new THREE.MeshBasicMaterial({
    color: '#ff3600',
    opacity: 0.8,
    side: THREE.DoubleSide,
    transparent: true
  });
  let point = new THREE.Mesh(pointGeometry, pointMaterial);
  point.name = "Point";

  set3dPosition(point, pos2d);
  point.lookAt(earthPosition);
  point.scale.set(0.01, 0.01, 0.01);
  point.updateMatrix();
  earth.add(point);

  new TWEEN.Tween(point.scale)
    .to({
      x: 1,
      y: 1,
      z: 1
    }, 1000)
    .delay(properties.index * 350 + 1000)
    .easing(TWEEN.Easing.Cubic.Out)
    .onComplete(function() {
      console.log('youpi: ' + point.scale)
    })
    .start();

  const pointRingGeometry = new THREE.RingGeometry(properties.radius + 0.5, properties.radius + 1, 32);
  const pointRingMaterial = new THREE.MeshBasicMaterial({
    color: '#ff3600',
    opacity: .8,
    side: THREE.DoubleSide,
    transparent: true
  });

  let pointRing = new THREE.Mesh(pointRingGeometry, pointRingMaterial);
  pointRing.name = "Point";
  set3dPosition(pointRing, pos2d);
  pointRing.lookAt(earthPosition);
  pointRing.scale.set(1, 1, 1);
  pointRing.updateMatrix();
  earth.add(pointRing);

  new TWEEN.Tween(pointRing.scale)
    .to({
      x: 1,
      y: 1,
      z: 1
    }, 1500)
    .delay(properties.index * 350 + 1500)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  return point;
}
const drawCurve = (a, b) => {
  const distance = a.clone().sub(b).length();

  let mid = a.clone().lerp(b, 0.5);
  const midLength = mid.length();
  mid.normalize();
  mid.multiplyScalar(midLength + distance * 0.25);

  let normal = (new THREE.Vector3()).subVectors(a, b);
  normal.normalize();

  const midStart = mid.clone().add(normal.clone().multiplyScalar(distance * 0.25));
  const midEnd = mid.clone().add(normal.clone().multiplyScalar(distance * -0.25));

  let splineCurveA = new THREE.CubicBezierCurve3(a, a, midStart, mid);
  let splineCurveB = new THREE.CubicBezierCurve3(mid, midEnd, b, b);

  let points2 = splineCurveA.getPoints(100);
  points2 = points2.splice(0, points2.length - 1);
  points2 = points2.concat(splineCurveB.getPoints(100));

  let lineGeometry = new THREE.BufferGeometry();
  let positions = new Float32Array(points2.length * 3);

  for (let i = 0; i < points2.length; i++) {
    positions[i * 3 + 0] = points2[i].x;
    positions[i * 3 + 1] = points2[i].y;
    positions[i * 3 + 2] = points2[i].z;
  }
  lineGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  lineGeometry.setDrawRange(0, 0);

  var lineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(0xff3600),
    linewidth: 6,
    opacity: 1,
    transparent: true
  });

  let line = new THREE.Line(lineGeometry, lineMaterial);
  line.currentPoint = 0;

  earth.add(line);
  return line;
}
const test = () => {
  var data = [
    {
      long: -81.173,
      lat: 28.4,
      radius: 8
    },
    {
      long: -81.1,
      lat: 32.084,
      radius: 3
    },
    {
      long: -74.006,
      lat: 40.713,
      radius: 5
    },
    {
      long: -0.128,
      lat: 51.507,
      radius: 2
    },
    {
      long: -87.63,
      lat: 41.878,
      radius: 2
    },
    {
      long: -122.419,
      lat: 37.775,
      radius: 2
    },
    {
      long: -90.199,
      lat: 38.627,
      radius: 3
    },
    {
      long: -77.042,
      lat: -12.046,
      radius: 2
    },
    {
      long: -77.345,
      lat: 25.06,
      radius: 5
    },
    {
      long: -117.783,
      lat: 33.542,
      radius: 2
    },
    {
      long: -149.9,
      lat: 61.218,
      radius: 2
    },
    {
      long: -123.121,
      lat: 49.283,
      radius: 2
    },
    {
      long: 25.462,
      lat: 36.393,
      radius: 2
    },
    {
      long: -122.676,
      lat: 45.523,
      radius: 3
    },
    {
      long: -95.401,
      lat: 29.817,
      radius: 2
    }
  ];

  for (let i = 0; i < data.length; i++) {
    var point = {
      lat: data[i].lat,
      lon: data[i].long,
      radius: data[i].radius,
      index: i,
    };
    points.push(drawPoint(point));

    let newLine = drawCurve(points[0].position, points[i].position);

    new TWEEN.Tween(newLine)
      .to({
        currentPoint: 200
      }, 2000)
      .delay(i * 350 + 1500)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
        newLine.geometry.setDrawRange(0, newLine.currentPoint);
      })
      .start();
  }
}
const animate = () => {
  requestAnimationFrame(animate);
  TWEEN.update();
  stats.begin();
  stats.end();
  render();
}
setInterval(() => {
  let now = new Date();
  let date = moment(new Date(2017, 7, 21, 12, 50, 0)).add(min, 'minutes').toDate();
  min++;
  moon_position(now);
  day_night(now)
}, 5000)
/*
const createDatabase = () => {

  // On enlève tout
  db.remove({}, { multi: true });

  // On remet la base
  for (i in countries)
    db.insert(countries[i])

}
*/
const animateGlobe = (move) => {
  if(move) {
    animationGlobe = setInterval(() => {
      scene.rotation.y += 0.005;
    }, 0)
  } else {
    clearInterval(animationGlobe);
  }
}
const start = () => {
  animateGlobe(true)

  class Start extends Component {
    componentWillMount() {
      this.state = {
        country: null,
      }
    }
    render() {
      return (
        <div className={styles.start}>
          <div className={styles.form}>
            <h3 className={styles.title}>Discover the world in 360</h3>
            <input className={styles.usernameInput} type="text" maxLength={14} placeholder="Email Adress" />
            <input className={styles.usernameInput} type="text" maxLength={14} placeholder="Password" />
          </div>
        </div>
      )
    }
  }

  ReactDOM.render(<Start />, document.getElementById('startScreen'));
}
loadGlobe()

var radius = 200.1,
    mesh,
    graticule;

d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology) {
  if (error) throw error;
  //scene.add(graticule = graticule10(), new THREE.LineBasicMaterial({color: 0xaaaaaa}));
  //scene.add(mesh = wireframe(topojson.mesh(topology, topology.objects.land), new THREE.LineBasicMaterial({color: 0xffffff})));

  mesh = wireframe(topojson.mesh(topology, topology.objects.countries), new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 1, linecap: 'round', linejoin: 'round'}))
  // Weird rotations
  mesh.rotation.x = Math.PI / 2;
  mesh.rotation.z = Math.PI;
  mesh.rotation.y = Math.PI;

  scene.add(mesh);
});

// Converts a point [longitude, latitude] in degrees to a THREE.Vector3.
function vertex(point) {
  var lambda = point[0] * Math.PI / 180,
      phi = point[1] * Math.PI / 180,
      cosPhi = Math.cos(phi);
  return new THREE.Vector3(
    radius * cosPhi * Math.cos(lambda),
    radius * cosPhi * Math.sin(lambda),
    radius * Math.sin(phi)
  );
}

// Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
function wireframe(multilinestring, material) {
  var geometry = new THREE.Geometry;
  multilinestring.coordinates.forEach(function(line) {
    d3.pairs(line.map(vertex), function(a, b) {
      geometry.vertices.push(a, b);
    });
  });
  return new THREE.LineSegments(geometry, material);
}

// See https://github.com/d3/d3-geo/issues/95
function graticule10() {
  var epsilon = 1e-6,
      x1 = 180, x0 = -x1, y1 = 80, y0 = -y1, dx = 10, dy = 10,
      X1 = 180, X0 = -X1, Y1 = 90, Y0 = -Y1, DX = 90, DY = 360,
      x = graticuleX(y0, y1, 2.5), y = graticuleY(x0, x1, 2.5),
      X = graticuleX(Y0, Y1, 2.5), Y = graticuleY(X0, X1, 2.5);

  function graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - epsilon, dy).concat(y1);
    return function(x) { return y.map(function(y) { return [x, y]; }); };
  }

  function graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - epsilon, dx).concat(x1);
    return function(y) { return x.map(function(x) { return [x, y]; }); };
  }

  return {
    type: "MultiLineString",
    coordinates: d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X)
        .concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y))
        .concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) { return Math.abs(x % DX) > epsilon; }).map(x))
        .concat(d3.range(Math.ceil(y0 / dy) * dy, y1 + epsilon, dy).filter(function(y) { return Math.abs(y % DY) > epsilon; }).map(y))
  };
}
/*
setInterval(() => {
  let date = moment(new Date()).add(min, 'seconds').toDate();
  min++;
  moon_position(date);
}, 1000)
*/
//init()
//slider()
//infoBox(46.48372145, 2.60926281)
