import moment from 'moment';

// Provides simple static functions that are used multiple times in the app
export default class Helpers {
  static throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    let last, deferTimer;

    return function() {
      const context = scope || this;

      const now  = +new Date,
          args = arguments;

      if(last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      }
      else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  static logProgress() {
    return function(xhr) {
      if(xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;

        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
    }
  }

  static logError() {
    return function(xhr) {
      console.error(xhr);
    }
  }

  static handleColorChange(color) {
    return (value) => {
      if(typeof value === 'string') {
        value = value.replace('#', '0x');
      }

      color.setHex(value);
    };
  }

  static update(mesh) {
    this.needsUpdate(mesh.material, mesh.geometry);
  }

  static needsUpdate(material, geometry) {
    return function() {
      material.shading = +material.shading; //Ensure number
      material.vertexColors = +material.vertexColors; //Ensure number
      material.side = +material.side; //Ensure number
      geometry.verticesNeedUpdate = true;
      geometry.normalsNeedUpdate = true;
      geometry.colorsNeedUpdate = true;
    };
  }

  static updateTexture(material, materialKey, textures) {
    return function(key) {
      material[materialKey] = textures[key];
    };
  }

  static calculate3dPosition(coords, radius) {
    var latitude = 90 - (Math.acos(coords.y / radius)) * 180 / Math.PI;
    var longitude = ((90 + (Math.atan2(coords.x , coords.z)) * 180 / Math.PI) % 360) + 180;

    if (longitude > 180)
      longitude -= 360;

    return {
      lat: latitude,
      lon: longitude
    }
  }

  static calculate2dPosition(coords) {
    var phi = (90 + coords.lon) * Math.PI / 180;
    var theta = (180 - coords.lat) * Math.PI / 180;

    return {
      x: phi,
      y: Math.PI - theta
    }
  }

  static set3dPosition(mesh, coords) {
    if(!coords)
      coords = mesh.userData;

    var x = coords.x;
    var y = coords.y;
    var altitude = coords.altitude;

    mesh.position.x = altitude * Math.sin(x) * Math.cos(y);
    mesh.position.y = altitude * Math.sin(y);
    mesh.position.z = altitude * Math.cos(x) * Math.cos(y);
  }

  static convertLatLonToVec3(lat, lon) {
    lat =  lat * Math.PI / 180.0;
    lon = -lon * Math.PI / 180.0;
    return new THREE.Vector3(
        Math.cos(lat) * Math.cos(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.sin(lon));
  }

  static decimalAdjust(type, value, exp) {
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
    /*
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    */
    // Décalage
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Décalage inversé
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  static toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  static getDateFormatted(date) {
    return moment(date).format('HH:mm:ss');
  }

  static getDateFromTimezone(date, timezone) {
    return moment(date).utcOffset(timezone).format();
  }

  static getDateFormattedFromTimezone(date, timezone) {
    return moment(date).utcOffset(timezone).format('HH:mm:ss');
  }
}
