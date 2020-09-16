import THREE from '../utils/three';
import * as topojson from "topojson-client";
import * as d3 from "d3";

// Class that creates and updates the main camera
export default class Border {
  constructor(scene, file, name, radius, lineWidth, opacity) {
    this.scene = scene;
    this.file = file;
    this.name = name;
    this.radius = radius;
    this.lineWidth = lineWidth;
    this.opacity = opacity;

    this.init();
    this.place = this.place.bind(this);
  }

  init() {
    d3.json(this.file, (error, topology) => {
      if (error) throw error;
      this.place(topology);
    });
  }
  place(topology) {
    // Converts a point [longitude, latitude] in degrees to a THREE.Vector3.
    const vertex = (point) => {
      var lambda = point[0] * Math.PI / 180,
          phi = point[1] * Math.PI / 180,
          cosPhi = Math.cos(phi);
      return new THREE.Vector3(
        this.radius * cosPhi * Math.cos(lambda),
        this.radius * cosPhi * Math.sin(lambda),
        this.radius * Math.sin(phi)
      );
    }

    // Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
    const wireframe = (multilinestring, material) => {
      var geometry = new THREE.Geometry;
      multilinestring.coordinates.forEach(function(line) {
        d3.pairs(line.map(vertex), function(a, b) {
          geometry.vertices.push(a, b);
        });
      });
      return new THREE.LineSegments(geometry, material);
    }

    this.border = wireframe(topojson.mesh(topology, topology.objects[this.name]), new THREE.LineBasicMaterial({ color: 0xffffff, /*linewidth: this.linewidth,*/ linecap: 'round', linejoin: 'round', transparent: true, opacity: this.opacity }));
    this.border.name = "Border";
    // Weird rotations
    this.border.rotation.x = Math.PI / 2;
    this.border.rotation.z = Math.PI;
    this.border.rotation.y = Math.PI;

    this.scene.add(this.border);
  }
}
