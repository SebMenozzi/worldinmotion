export const MoonCalculator = (date) => {

  function datan(x) { return(180/ Math.PI * Math.atan(x)); };

  function datan2(y, x) {
    var a;
    if ((x == 0) && (y == 0)) { return(0); }
    else {
      a = datan(y / x);
      if (x < 0)
        a = a + 180;
      if (y < 0 && x > 0)
        a = a + 360;
      return(a);
    }
  }

  function dsin(x) { return(Math.sin(Math.PI / 180 * x)); }

  function dasin(x) { return(180/ Math.PI * Math.asin(x)); }

  function dcos(x) { return(Math.cos(Math.PI / 180 * x)); }

  function dtan(x) { return(Math.tan(Math.PI / 180 * x)); }

  function range(x) {
    var a
    var b;
    b = x / 360;
    a = 360 * (b - ipart(b));
    if (a  < 0)
      a = a + 360;
    return(a);
  }

  function ipart(x) {
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

  return {
    latitude: latitude,
    longitude: longitude,
    distance: R2
  };
  /*



  var PI   = Math.PI,
    sin  = Math.sin,
    cos  = Math.cos,
    tan  = Math.tan,
    asin = Math.asin,
    atan = Math.atan2,
    acos = Math.acos,
    rad  = PI / 180;

  var dayMs = 1000 * 60 * 60 * 24,
      J1970 = 2440588,
      J2000 = 2451545;

  function toJulian(date) { return date.valueOf() / dayMs - 0.5 + J1970; }
  function fromJulian(j)  { return new Date((j + 0.5 - J1970) * dayMs); }
  function toDays(date)   { return toJulian(date) - J2000; }

  var d = toDays(date);

  var L = rad * (218.316 + 13.176396 * d), // ecliptic longitude
        M = rad * (134.963 + 13.064993 * d), // mean anomaly
        F = rad * (93.272 + 13.229350 * d),  // mean distance

        l  = L + rad * 6.289 * sin(M), // longitude
        b  = rad * 5.128 * sin(F),     // latitude
        dt = 385001 - 20905 * cos(M);  // distance to the moon in km

    return {
      latitude: b,
      longitude: l,
      distance: dt
    };
  return moon;




  var DEG2RAD = Math.PI / 180;
  var RAD2DEG = 180 / Math.PI;
  var TwoPi = Math.PI * 2;

  //
  // 	Moon returns mean ecliptic long and lat of Moon to 10 arc sec (long)
  //	and 3 arc sec (lat) for a few centuries either side of J2000.0.
  //	This function is taken from Arkkana Peck's Javascript code at
  //	http://www.shallowsky.com/moon/hitchhiker.html
  //	but with the addition of the Moon distance series
  //

  function Moon(day)	{
  	// Time measured in Julian centuries from epoch J2000.0:
  	var T = day / 36525;
  	var T2 = T*T;
  	var T3 = T2*T;
  	var T4 = T3*T;

  	// Mean elongation of the moon:
  	var D = angle(297.8502042 + 445267.1115168 * T - 0.0016300 * T2 + T3 / 545868 + T4 / 113065000);
  	// Sun's mean anomaly:
  	var M = angle(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000);
  	// Moon's mean anomaly:
  	var Mprime = angle(134.9634114 + 477198.8676313 * T + 0.0089970 * T2 - T3 / 3536000 + T4 / 14712000);

  	// Done getting the phase angle; now calculate the mean
  	// longitude and latitude.

    // Moon's mean longitude:
    var Lprime = angle(218.3164591 + 481267.88134236 * T - .0013268 * T2 + T3 / 538841 - T4 / 65194000);

    // Moon's argument of latitude (mean distance from ascending node):
    var F = angle(93.2720993 + 483202.0175273 * T - .0034029 * T2 - T3 / 3526000 + T4 / 863310000);

    // Now, the fearsome neverending tables! (KPB - These are available
    // online in machine format!)

    var DcA = new Array(0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 1, 0, 2, 0, 0,
                    4, 0, 4, 2, 2, 1, 1, 2, 2, 4, 2, 0, 2, 2, 1, 2,
                    0, 0, 2, 2, 2, 4, 0, 3, 2, 4, 0, 2, 2, 2, 4, 0,
                    4, 1, 2, 0, 1, 3, 4, 2, 0, 1, 2, 2);

    var McA = new Array(0, 0, 0, 0, 1, 0, 0, -1, 0, -1, 1, 0, 1, 0, 0, 0,
                    0, 0, 0, 1, 1, 0, 1, -1, 0, 0, 0, 1, 0, -1, 0, -2,
                    1, 2, -2, 0, 0, -1, 0, 0, 1, -1, 2, 2, 1, -1, 0,
                    0, -1, 0, 1, 0, 1, 0, 0, -1, 2, 1, 0, 0);

    var MpcA = new Array(1, -1, 0, 2, 0, 0, -2, -1, 1, 0, -1, 0, 1, 0, 1,
                     1, -1, 3, -2, -1, 0, -1, 0, 1, 2, 0, -3, -2,
                     -1, -2, 1, 0,
                     2, 0, -1, 1, 0, -1, 2, -1, 1, -2, -1, -1, -2, 0,
                     1, 4, 0, -2, 0, 2, 1, -2, -3, 2, 1, -1, 3, -1);

    var FcA = new Array(0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, -2, 2, -2,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0,
                    0, 0, 0, -2, 2, 0, 2, 0, 0, 0, 0, 0, 0, -2, 0, 0,
                    0, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0, -2);


  	//	Longitude coefficients from Meeus' table A

    var ScA = new Array(6288774, 1274027, 658314, 213618, -185116, -114332,
                    58793, 57066, 53322, 45758, -40923, -34720, -30383,
                    15327, -12528, 10980, 10675, 10034, 8548, -7888,
                    -6766, -5163, 4987, 4036, 3994, 3861, 3665, -2689,
                    -2602, 2390, -2348, 2236,
                    -2120, -2069, 2048, -1773, -1595, 1215, -1110, -892,
                    -810, 759, -713, -700, 691, 596, 549, 537, 520,
                    -487, -399, -381, 351, -340, 330, 327, -323, 299, 294);

    //	Radius vector coefficients from Meeus' Table A

    var ScAR = new Array(-20905355, -3699111, -2955968, -569925,
    				48888, -3149, 246158, -152138, -170733, -204586, -129620,
    				108743, 104755, 10321, 0, 79661, -34782, -23210, -21636,
    				24208, 30824, -8379, -16675, -12831, -10445, -11650, 14403,
    				-7003, 0, 10056, 6322, -9884, 5751, 0, -4950, 4130, 0,
    				-3958, 0, 3258, 2616, -1897, -2117, 2354, 0, 0, -1423,
    				-1117, -1571, -1739, 0, -4421, 0, 0, 0, 0, 1165, 0, 0,
    				8752);

    var DcB = new Array(0, 0, 0, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0,
                    4, 0, 0, 0, 1, 0, 0, 0, 1, 0, 4, 4,
                    0, 4, 2, 2, 2, 2, 0, 2, 2, 2, 2, 4, 2, 2, 0, 2, 1, 1,
                    0, 2, 1, 2, 0, 4, 4, 1, 4, 1, 4, 2);

    var McB = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 1, -1, -1, -1,
                    1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 1, 0, -1, -2, 0, 1, 1,
                    1, 1, 1, 0, -1, 1, 0, -1, 0, 0, 0, -1, -2);

    var MpcB = new Array(0, 1, 1, 0, -1, -1, 0, 2, 1, 2, 0, -2, 1, 0, -1, 0,
                     -1, -1, -1, 0, 0, -1, 0, 1, 1, 0, 0, 3, 0, -1,
                     1, -2, 0, 2, 1, -2, 3, 2, -3, -1, 0, 0, 1, 0, 1, 1, 0,
                     0, -2, -1, 1, -2, 2, -2, -1, 1, 1, -1, 0, 0);

    var FcB = new Array(1, 1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1, 1, -1, 1,
                    1, -1, -1, -1, 1, 3, 1, 1, 1, -1, -1, -1, 1, -1, 1,
                    -3, 1, -3, -1, -1, 1, -1, 1, -1, 1, 1, 1, 1, -1, 3, -1,
                    -1, 1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1);

    var ScB = new Array(5128122, 280602, 277693, 173237, 55413, 46271, 32573,
                    17198, 9266, 8822, 8216, 4324, 4200, -3359, 2463, 2211,
                    2065, -1870, 1828, -1794, -1749, -1565, -1492, -1475,
                    -1410, -1344, -1335, 1107, 1021, 833,
                    777, 671, 607, 596, 491, -451, 439, 422, 421, -366,
                    -351, 331, 315, 302, -283, -229, 223, 223, -220, -220,
                    -185, 181, -177, 176, 166, -164, 132, -119, 115, 107);


    // term involving the decreasing eccentricity of the earth's orbit:
    var E = 1 - .002516 * T - .0000074 * T2;
    var E2 = E*E;

    var sigma_l = 0.;
    var sigma_b = 0.;
    var sigma_r = 0.;

  //	Sum over table A coeffs - this bit doesn't like Javascript 1.0
  //

    for (var i=0; i < ScA.length; ++i) {
        var ME = 1;
        if (MpcA[i] == 1 || MpcA[i] == -1)
            ME = E;
        else if (MpcA[i] == 2 || MpcA[i] == -2)
            ME = E2;
        sigma_l += ScA[i] * Math.sin(DcA[i] * D + McA[i] * ME * M + MpcA[i] * Mprime + FcA[i] * F);
        sigma_r += ScAR[i] * Math.cos(DcA[i] * D + McA[i] * ME * M + MpcA[i] * Mprime + FcA[i] * F);

    }

    for (var i=0; i < ScB.length ; ++i) {
        var ME = 1;
        if (MpcB[i] == 1 || MpcB[i] == -1)
            ME = E;
        else if (MpcB[i] == 2 || MpcB[i] == -2)
            ME = E2;
        sigma_b += ScB[i] * Math.sin(DcB[i] * D + McB[i] * ME * M + MpcB[i] * Mprime + FcB[i] * F);
    }

    // Three intermediate arguments, in radians:
    var A1 = angle(119.75 + 131.849*T);        // effect of Venus
    var A2 = angle(53.09 + 479264.29*T);       // effect of Jupiter
    var A3 = angle(313.45 + 481266*T);         // ??

    sigma_l += 3958 * Math.sin(A1) + 1962 * Math.sin(Lprime - F) + 318 * Math.sin(A2);
    sigma_b += 382 * Math.sin(A3) - 2235 * Math.sin(Lprime) + 175 * Math.sin(A1 - F) + 175 * Math.sin(A1 + F) + 127 * Math.sin(Lprime - Mprime) - 115 * Math.sin(Lprime + Mprime);

    // Note: sigmas are still in DEGREES (actually millions of degrees)

    // Finally, we can calculate the coordinates of the moon (in radians):
    var lambda = modrad(Lprime + angle(sigma_l / 1000000));
    var beta = angle(sigma_b / 1000000);
    var distance = sigma_r / 1000 + 385000.56;

    var I = angle(1.5424167);      // inclination of lunar equator

    // calculate mean long. of ascending node of lunar orbit:
    var omega = angle(125.044555 - 1934.1361849 * T + .0020762 * T2
                      + T3 / 467410 - T4 / 60616000);

    // Fudge: don't count nutation in longitude for now:
    var delpsi = 0.;

    var W = modrad(lambda - delpsi - omega);
    var A = modrad(Math.atan2( (Math.sin(W) * Math.cos(beta) * Math.cos(I) - Math.sin(beta)*Math.sin(I)), (Math.cos(W) * Math.cos(beta)) ));

    var longitude = (A - F)/ DEG2RAD;
    if (longitude > 180) longitude -= 360;

    var latitude = Math.asin(-Math.sin(W) * Math.cos(beta) * Math.sin(I) - Math.sin(beta) * Math.cos(I));
    latitude /= DEG2RAD;

  	return {
      latitude: deangle(beta),
      longitude: deangle(lambda),
      distance: distance
    };
  }

  function deangle(num) { return (Math.round(num / DEG2RAD * 100)) / 100.; }

  // convert degrees to a valid angle in radians:
  function angle(deg) { return range(deg) * DEG2RAD; }
  function modrad(x) {
  	var a, b
  	b = x / TwoPi;
  	a = TwoPi * (b - ipart(b));
  	if (a  < 0 )
		  a = a + TwoPi
  	return a
  }
  function ipart(x) {
  	var a;
  	if (x> 0)
      a = Math.floor(x);
  	else
  		a = Math.ceil(x);
  	return a;
	}

  function range(x) {
  	var a, b
  	b = x / 360;
  	a = 360 * (b - ipart(b));
  	if (a  < 0 )
  		a = a + 360
  	return a
	}

  var moonEphem = Moon(d);
  return {
    latitude: moonEphem.latitude,
    longitude: moonEphem.longitude,
    distance: moonEphem.distance
  }
  */
}
