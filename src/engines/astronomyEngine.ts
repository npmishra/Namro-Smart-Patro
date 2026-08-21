import { ADDate, CalculationMethodType, LocationData, SolarMoonPositions, SunMoonTimes } from '../types';
import { getMethodOffsets } from './calculationMethods';

const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 180.0 / Math.PI;

function normalizeAngle(deg: number): number {
  let angle = deg % 360;
  if (angle < 0) angle += 360;
  return angle;
}

function sinD(deg: number): number {
  return Math.sin(deg * DEG2RAD);
}

function cosD(deg: number): number {
  return Math.cos(deg * DEG2RAD);
}

function tanD(deg: number): number {
  return Math.tan(deg * DEG2RAD);
}

function asinD(val: number): number {
  return Math.asin(Math.max(-1, Math.min(1, val))) * RAD2DEG;
}

function acosD(val: number): number {
  return Math.acos(Math.max(-1, Math.min(1, val))) * RAD2DEG;
}

/**
 * Calculate Julian Day Number from Gregorian Date and UTC time
 */
export function getJulianDay(adDate: ADDate, utcHours: number = 0): number {
  let Y = adDate.year;
  let M = adDate.month;
  const D = adDate.day + utcHours / 24.0;

  if (M <= 2) {
    Y -= 1;
    M += 12;
  }

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
  return JD;
}

/**
 * Calculate Lahiri / Chitra Paksha Ayanamsa (deg)
 */
export function calculateLahiriAyanamsa(julianCenturies: number): number {
  // Baseline: J2000.0 (JD 2451545.0) Lahiri = 23° 51' 11.0" = 23.853055°
  // Precession rate: 50.29 arcseconds per year = 1.396944° per Julian Century
  return 23.853055 + 1.396944 * julianCenturies;
}

/**
 * Solar & Lunar Celestial Mechanics Engine
 */
export function calculateSunMoonPositions(
  adDate: ADDate,
  method: CalculationMethodType = 'drik',
  utcHours: number = 6.0 // Approximate midday in Nepal (~11:45 AM local)
): SolarMoonPositions {
  const JD = getJulianDay(adDate, utcHours);
  const T = (JD - 2451545.0) / 36525.0; // Julian centuries from J2000.0

  const offsets = getMethodOffsets(method, T);

  // 1. Solar Mean Longitude & Anomaly
  const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M_sun = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);

  // Equation of Center (Sun)
  const C_sun =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinD(M_sun) +
    (0.019993 - 0.000101 * T) * sinD(2 * M_sun) +
    0.000289 * sinD(3 * M_sun);

  // Geometric True Longitude (Tropical)
  const sunTropicalLong = normalizeAngle(L0 + C_sun);

  // Obliquity of the Ecliptic
  const eps0 = 23.439291 - 0.0130042 * T;

  // Sun Declination & Right Ascension
  const sunDeclination = asinD(sinD(eps0) * sinD(sunTropicalLong));
  const sunRA = normalizeAngle(
    Math.atan2(cosD(eps0) * sinD(sunTropicalLong), cosD(sunTropicalLong)) * RAD2DEG
  );

  // Equation of Time (minutes)
  const y = tanD(eps0 / 2.0) * tanD(eps0 / 2.0);
  const Etime =
    4.0 *
    RAD2DEG *
    (y * sinD(2 * L0) -
      2 * 0.0167086 * sinD(M_sun) +
      4 * 0.0167086 * y * sinD(M_sun) * cosD(2 * L0) -
      0.5 * y * y * sinD(4 * L0) -
      1.25 * 0.0167086 * 0.0167086 * sinD(2 * M_sun));

  // 2. Lunar Celestial Mechanics (Brown/ELP Simplified Model with High Terms)
  const L_moon = normalizeAngle(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const M_moon = normalizeAngle(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
  const D_elong = normalizeAngle(297.8501921 + 445267.5105277 * T - 0.0018819 * T * T);
  const F_arg = normalizeAngle(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);

  // Lunar Longitude Perturbations
  const deltaL_moon =
    6.288774 * sinD(M_moon) +
    1.274027 * sinD(2 * D_elong - M_moon) +
    0.658314 * sinD(2 * D_elong) +
    0.213618 * sinD(2 * M_moon) -
    0.185116 * sinD(M_sun) -
    0.114332 * sinD(2 * F_arg) +
    0.058793 * sinD(2 * D_elong - 2 * M_moon) +
    0.057066 * sinD(2 * D_elong - M_sun - M_moon) +
    0.053322 * sinD(2 * D_elong + M_moon) +
    0.046102 * sinD(2 * D_elong - M_sun) -
    0.015327 * sinD(2 * D_elong - 2 * F_arg);

  const moonTropicalLong = normalizeAngle(L_moon + deltaL_moon);

  // 3. Ayanamsa and Sidereal Conversion
  const baseAyanamsa = calculateLahiriAyanamsa(T);
  const effectiveAyanamsa = baseAyanamsa + offsets.ayanamsaOffset;

  const sunSiderealLong = normalizeAngle(sunTropicalLong - effectiveAyanamsa + offsets.sunLongitudeOffset);
  const moonSiderealLong = normalizeAngle(moonTropicalLong - effectiveAyanamsa + offsets.moonLongitudeOffset);

  // 4. Lunar Phase & Illumination
  const elongation = normalizeAngle(moonTropicalLong - sunTropicalLong);
  const phaseAngle = 180 - elongation;
  const illuminationFraction = (1 + cosD(phaseAngle)) / 2; // 0 to 1
  const phasePercentage = Math.round(illuminationFraction * 100);

  let phaseName = 'नयाँ चन्द्र (New Moon)';
  if (elongation >= 355 || elongation < 5) phaseName = 'औंसी (New Moon)';
  else if (elongation >= 5 && elongation < 85) phaseName = 'शुक्ल पक्ष चन्द्र (Waxing Crescent)';
  else if (elongation >= 85 && elongation < 95) phaseName = 'पहिलो प्रहर (First Quarter)';
  else if (elongation >= 95 && elongation < 175) phaseName = 'शुक्ल पक्ष चन्द्र (Waxing Gibbous)';
  else if (elongation >= 175 && elongation < 185) phaseName = 'पूर्णिमा (Full Moon)';
  else if (elongation >= 185 && elongation < 265) phaseName = 'कृष्ण पक्ष चन्द्र (Waning Gibbous)';
  else if (elongation >= 265 && elongation < 275) phaseName = 'तेस्रो प्रहर (Last Quarter)';
  else phaseName = 'कृष्ण पक्ष चन्द्र (Waning Crescent)';

  const lunarAgeDays = (elongation / 360.0) * 29.53058867;

  return {
    sunLongitude: sunSiderealLong,
    moonLongitude: moonSiderealLong,
    sunDeclination,
    sunRightAscension: sunRA,
    equationOfTimeMinutes: Etime,
    lunarPhasePercentage: phasePercentage,
    lunarPhaseName: phaseName,
    lunarAgeDays: parseFloat(lunarAgeDays.toFixed(2)),
    sunDistanceAU: 1.00014 - 0.01671 * cosD(M_sun),
    moonDistanceKm: Math.round(385000 - 20900 * cosD(M_moon)),
    ayanamsaDeg: parseFloat(effectiveAyanamsa.toFixed(4)),
  };
}

/**
 * Format minutes past midnight into standard HH:MM AM/PM string
 */
export function formatTimeFromMinutes(totalMinutes: number): string {
  let mins = Math.round(totalMinutes) % 1440;
  if (mins < 0) mins += 1440;

  const hours24 = Math.floor(mins / 60);
  const minutes = mins % 60;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  const paddedMins = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const paddedHours = hours12 < 10 ? `0${hours12}` : `${hours12}`;

  return `${paddedHours}:${paddedMins} ${period}`;
}

/**
 * Format time range
 */
export function formatTimeRange(startMins: number, endMins: number): string {
  return `${formatTimeFromMinutes(startMins)} - ${formatTimeFromMinutes(endMins)}`;
}

/**
 * Astronomical Sunrise, Sunset, Muhurat & Timings for given Date and Location
 */
export function calculateSunMoonTimes(
  adDate: ADDate,
  location: LocationData,
  method: CalculationMethodType = 'drik'
): SunMoonTimes {
  const JD = getJulianDay(adDate, 12.0);
  const T = (JD - 2451545.0) / 36525.0;
  const offsets = getMethodOffsets(method, T);

  // Solar parameters
  const L0 = normalizeAngle(280.46646 + 36000.76983 * T);
  const M = normalizeAngle(357.52911 + 35999.05029 * T);
  const lambda = normalizeAngle(
    L0 + 1.914602 * sinD(M) + 0.019993 * sinD(2 * M)
  );
  const eps = 23.439291 - 0.0130042 * T;
  const declination = asinD(sinD(eps) * sinD(lambda));

  const y = tanD(eps / 2.0) * tanD(eps / 2.0);
  const eqTime =
    4.0 *
    RAD2DEG *
    (y * sinD(2 * L0) - 2 * 0.0167086 * sinD(M) + 4 * 0.0167086 * y * sinD(M) * cosD(2 * L0));

  // Solar Noon in local time minutes past midnight
  const tzHours = location.timezoneOffsetMinutes / 60.0;
  const solarNoonMinutes = 720 - 4 * location.longitude - eqTime + tzHours * 60;

  // Zenith angle for sunrise/sunset: -0.833° standard + altitude dip correction
  // Dip in degrees = 0.0353 * sqrt(height_meters) / 60
  const dipDeg = (0.0353 * Math.sqrt(Math.max(0, location.elevationMeters))) / 60.0;
  const zenith = 90.8333 + dipDeg;

  // Hour angle H
  const cosH =
    (cosD(zenith) - sinD(location.latitude) * sinD(declination)) /
    (cosD(location.latitude) * cosD(declination));

  let hourAngleDeg = 90;
  if (cosH >= 1.0) {
    hourAngleDeg = 0; // Polar night
  } else if (cosH <= -1.0) {
    hourAngleDeg = 180; // Midnight sun
  } else {
    hourAngleDeg = acosD(cosH);
  }

  const halfDayMinutes = hourAngleDeg * 4;

  const sunriseMins = solarNoonMinutes - halfDayMinutes + offsets.sunriseRefractionMinutes;
  const sunsetMins = solarNoonMinutes + halfDayMinutes + offsets.sunriseRefractionMinutes;

  const dayLengthMins = Math.max(0, sunsetMins - sunriseMins);
  const dayLengthHours = Math.floor(dayLengthMins / 60);
  const dayLengthRemainingMins = Math.round(dayLengthMins % 60);

  const nightLengthMins = 1440 - dayLengthMins;
  const nightLengthHours = Math.floor(nightLengthMins / 60);
  const nightLengthRemainingMins = Math.round(nightLengthMins % 60);

  // Muhurat Segments (Day is divided into 8 or 15 equal parts)
  const segmentLength = dayLengthMins / 8.0;

  // Weekday for Rahu Kaal, Yamaganda, Gulika Kaal (0 = Sunday ... 6 = Saturday)
  const d = new Date(Date.UTC(adDate.year, adDate.month - 1, adDate.day));
  const weekday = d.getUTCDay();

  // Rahu Kaal segment offsets per weekday (Sunday=8th, Mon=2nd, Tue=7th, Wed=5th, Thu=6th, Fri=4th, Sat=3rd)
  const rahuSegments = [7, 1, 6, 4, 5, 3, 2]; // 0-indexed: [Sun(8th), Mon(2nd), Tue(7th), Wed(5th), Thu(6th), Fri(4th), Sat(3rd)]
  const yamaSegments = [4, 3, 2, 1, 0, 6, 5]; // Yamaganda segments
  const gulikaSegments = [6, 5, 4, 3, 2, 1, 0]; // Gulika segments

  const rahuStart = sunriseMins + rahuSegments[weekday] * segmentLength;
  const rahuEnd = rahuStart + segmentLength;

  const yamaStart = sunriseMins + yamaSegments[weekday] * segmentLength;
  const yamaEnd = yamaStart + segmentLength;

  const gulikaStart = sunriseMins + gulikaSegments[weekday] * segmentLength;
  const gulikaEnd = gulikaStart + segmentLength;

  // Abhijit Muhurat: 8th Muhurat of 15-division day (~24 min before to ~24 min after Solar Noon)
  const abhijitDuration = dayLengthMins / 15.0;
  const abhijitStart = solarNoonMinutes - abhijitDuration / 2.0;
  const abhijitEnd = solarNoonMinutes + abhijitDuration / 2.0;

  // Brahma Muhurat: 96 to 48 minutes before sunrise
  const brahmaStart = sunriseMins - 96;
  const brahmaEnd = sunriseMins - 48;

  // Godhuli: 24 mins before sunset to 24 mins after sunset
  const godhuliStart = sunsetMins - 24;
  const godhuliEnd = sunsetMins + 24;

  // Pradosh Kaal: Sunset to 72 mins after sunset
  const pradoshStart = sunsetMins;
  const pradoshEnd = sunsetMins + 72;

  // Moonrise / Moonset approximation based on lunar age
  const positions = calculateSunMoonPositions(adDate, method);
  const moonOffsetMins = (positions.lunarAgeDays / 29.530588) * 1440;
  const moonriseMins = (sunriseMins + moonOffsetMins) % 1440;
  const moonsetMins = (moonriseMins + 720) % 1440;

  // Disha Shoola
  const dishaShoolaData = [
    { direction: 'West', directionNepali: 'पश्चिम', remedy: 'Eat Betel leaf (पान)', remedyNepali: 'पान वा घिउ सेवन गरेर प्रस्थान गर्ने' }, // Sunday
    { direction: 'East', directionNepali: 'पूर्व', remedy: 'Look into Mirror (दर्पण)', remedyNepali: 'ऐना हेरेर प्रस्थान गर्ने' }, // Monday
    { direction: 'North', directionNepali: 'उत्तर', remedy: 'Eat Jaggery (गुड)', remedyNepali: 'गुड वा धनियाँ सेवन गरेर प्रस्थान गर्ने' }, // Tuesday
    { direction: 'North', directionNepali: 'उत्तर', remedy: 'Eat Sesame (तिल)', remedyNepali: 'तिल वा सर्स्युं खाएर प्रस्थान गर्ने' }, // Wednesday
    { direction: 'South', directionNepali: 'दक्षिण', remedy: 'Eat Curd (दही)', remedyNepali: 'दही खाएर प्रस्थान गर्ने' }, // Thursday
    { direction: 'West', directionNepali: 'पश्चिम', remedy: 'Eat Barley (जौ)', remedyNepali: 'जौ वा राई खाएर प्रस्थान गर्ने' }, // Friday
    { direction: 'East', directionNepali: 'पूर्व', remedy: 'Eat Ginger/Mustard (अदुवा)', remedyNepali: 'अदुवा वा उड़द खाएर प्रस्थान गर्ने' }, // Saturday
  ];

  return {
    sunrise: formatTimeFromMinutes(sunriseMins),
    sunset: formatTimeFromMinutes(sunsetMins),
    solarNoon: formatTimeFromMinutes(solarNoonMinutes),
    dayLength: `${dayLengthHours} घण्टा ${dayLengthRemainingMins} मिनेट`,
    nightLength: `${nightLengthHours} घण्टा ${nightLengthRemainingMins} मिनेट`,
    moonrise: formatTimeFromMinutes(moonriseMins),
    moonset: formatTimeFromMinutes(moonsetMins),
    brahmaMuhurat: formatTimeRange(brahmaStart, brahmaEnd),
    pradoshKaal: formatTimeRange(pradoshStart, pradoshEnd),
    godhuliKaal: formatTimeRange(godhuliStart, godhuliEnd),
    abhijitMuhurat: formatTimeRange(abhijitStart, abhijitEnd),
    rahuKaal: formatTimeRange(rahuStart, rahuEnd),
    yamagandaKaal: formatTimeRange(yamaStart, yamaEnd),
    gulikaKaal: formatTimeRange(gulikaStart, gulikaEnd),
    dishaShoola: dishaShoolaData[weekday],
  };
}
