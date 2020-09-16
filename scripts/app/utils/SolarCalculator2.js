export const SolarCalculator2 = (time) => {
  const getJulianFromUnix = (time) => {
    return ((time / 1000) / 86400.0) + 2440587.5
  }
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180)
  }

  const toDegrees = (angle) => {
    return angle * (180 / Math.PI);
  }

  // Source: https://en.wikipedia.org/wiki/Position_of_the_Sun
  const sunCoordinates = (time) => {
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

  const coord = sunCoordinates(time);
  const earthRadius = 200;
  const distance_earth_sun = 1500000;
  const h = coord.hourAngle;
  const d = coord.declination;

  return {
    x: distance_earth_sun + earthRadius * Math.cos(h),
    y: distance_earth_sun + earthRadius * Math.sin(d),
    z: distance_earth_sun + earthRadius * Math.sin(h)
  }
}
