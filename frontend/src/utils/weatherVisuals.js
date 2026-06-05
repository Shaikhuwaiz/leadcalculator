import { getChicagoHourFromIso } from "./chicagoDate";
import {
  findSceneForWeather,
  getSceneImageUrl,
  getSceneSkyGradient,
  getWeatherImageFilename,
  WEATHER_PREVIEW_SAMPLES,
  WEATHER_SCENES,
} from "./weatherScenes";

export { WEATHER_PREVIEW_SAMPLES, WEATHER_SCENES, getSceneImageUrl, findSceneForWeather };

const ICON_FLAT = "/weatherfrog/icons/set-2";

export function previewTimeForHour(hour) {
  const h = String(hour).padStart(2, "0");
  return `2026-05-26T${h}:00:00-05:00`;
}

export function getWeatherImage(code, isDay) {
  return getWeatherImageFilename(code, isDay);
}

function localIconFile(name) {
  return `${ICON_FLAT}/${name}`;
}

/** Local Weather Frog / Google-style icons (avoids broken gstatic URLs). */
export function getWeatherIconUrl(code, isDay, scene = null) {
  if (scene?.icon) {
    let iconName = scene.icon;
    if (iconName === "squalls.svg") iconName = "blizzard.png";
    return localIconFile(iconName.replace('.svg', '.png'));
  }

  if (code === 0) return localIconFile(isDay ? "sunny.png" : "clear_night.png");
  if (code === 1) return localIconFile(isDay ? "mostly_sunny.png" : "mostly_clear_night.png");
  if (code === 2) return localIconFile(isDay ? "partly_cloudy.png" : "partly_cloudy_night.png");
  if (code === 3) return localIconFile(isDay ? "cloudy.png" : "mostly_cloudy_night.png");
  if (code === 45 || code === 48) return localIconFile("haze_fog_dust_smoke.png");
  if (code >= 51 && code <= 55) return localIconFile("drizzle.png");
  if (code === 56 || code === 57 || code === 66 || code === 67) {
    return localIconFile("sleet_hail.png");
  }
  if (code === 68 || code === 69) return localIconFile("sleet_hail.png");
  if (code === 70) return localIconFile("sleet_hail.png");
  if (code === 61 || code === 63) {
    return localIconFile("showers_rain.png");
  }
  if (code === 80 || code === 81) {
    return localIconFile("showers_rain.png");
  }
  if (code === 65 || code === 82) return localIconFile("heavy_rain.png");
  if (code === 71) return localIconFile("flurries.png");
  if (code === 73) return localIconFile("snow_showers_snow.png");
  if (code === 85) {
    return localIconFile("snow_showers_snow.png");
  }
  if (code === 74) return localIconFile("blowing_snow.png");
  if (code === 77) return localIconFile("blizzard.png");
  if (code === 75 || code === 86) return localIconFile("heavy_snow.png");
  if (code === 95) {
    return localIconFile(isDay ? "isolated_scattered_tstorms_day.png" : "isolated_scattered_tstorms_night.png");
  }
  if (code === 96 || code === 97) return localIconFile("strong_tstorms.png");
  if (code === 98) return localIconFile("strong_tstorms.png");
  if (code === 99) return localIconFile("tornado.png");

  return localIconFile(isDay ? "sunny.png" : "clear_night.png");
}

/** @deprecated Use getWeatherIconUrl */
export function getGoogleWeatherIconUrl(code, isDay, scene) {
  return getWeatherIconUrl(code, isDay, scene);
}

export function getSkyGradient(code, isDay, timeString) {
  const hour = getChicagoHourFromIso(timeString);
  const isNight = !isDay || hour < 6 || hour >= 20;

  if (isNight) {
    if (code >= 96) return "linear-gradient(to bottom, #1A1028 0%, #2E2040 100%)";
    if (code >= 95) return "linear-gradient(to bottom, #1E1430 0%, #342848 100%)";
    if (code === 77) return "linear-gradient(to bottom, #1A2838 0%, #3A5068 100%)";
    if (code >= 71 && code <= 86) return "linear-gradient(to bottom, #1A2030 0%, #3A4558 100%)";
    if (code >= 51 && code <= 70) return "linear-gradient(to bottom, #1A2838 0%, #3A5060 100%)";
    if (code === 2) return "linear-gradient(to bottom, #12182A 0%, #2A3550 55%, #4A3D62 100%)";
    if (code === 3) return "linear-gradient(to bottom, #141A28 0%, #2E3A52 100%)";
    return "linear-gradient(to bottom, #0F0C20 0%, #1E1233 60%, #3B1B47 100%)";
  }

  // Evening override for sunny/cloudy/clear (codes 0, 1, 2, 3)
  if (hour >= 17 && hour < 20 && code <= 3) {
    return "linear-gradient(to bottom, #5A9FD4 0%, #F0B88A 55%, #F8D4B0 100%)";
  }

  if (code >= 96) {
    return "linear-gradient(to bottom, #2A2240 0%, #483858 50%, #685878 100%)";
  }
  if (code === 95) {
    return "linear-gradient(to bottom, #3A3458 0%, #5A5478 40%, #7A7498 100%)";
  }
  if (code === 77) {
    return "linear-gradient(to bottom, #4A7088 0%, #78A0B8 50%, #A8C8DC 100%)";
  }
  if (code === 67 || code === 66) {
    return "linear-gradient(to bottom, #3E5C6E 0%, #5B8296 30%, #7FA3B5 60%, #A8C8D8 100%)";
  }
  if (code === 68 || code === 69) {
    return "linear-gradient(to bottom, #425E70 0%, #648A9C 40%, #94B4C6 100%)";
  }
  if (code === 65 || code === 82) {
    return "linear-gradient(to bottom, #3D5262 0%, #5E7A8E 35%, #8AA8BA 75%, #B8CED8 100%)";
  }
  if (code === 61 || code === 63 || code === 80 || code === 81) {
    return "linear-gradient(to bottom, #4A6578 0%, #7296AB 40%, #A8C4D4 100%)";
  }
  if (code >= 51 && code <= 55) {
    return "linear-gradient(to bottom, #5E7F94 0%, #8AAFC4 45%, #B5D0E0 100%)";
  }
  if (code >= 71 && code <= 86) {
    return "linear-gradient(to bottom, #6A7F8F 0%, #9AB0C0 55%, #C8DAE4 100%)";
  }
  if (code >= 45 && code <= 48) {
    return "linear-gradient(to bottom, #8BA9BD 0%, #C5D8E6 55%, #E8F2F8 100%)";
  }
  if (code === 3) {
    return "linear-gradient(to bottom, #6EB7E6 0%, #8FD0F2 35%, #CDEFFF 72%, #F7FDFF 100%)";
  }
  if (code === 2) {
    return "linear-gradient(to bottom, #4BA3E8 0%, #7FC4F2 45%, #C8E8FA 100%)";
  }
  if (code === 1) {
    return "linear-gradient(to bottom, #2E9AE8 0%, #6FC4F5 50%, #B8E4FA 100%)";
  }
  if (hour >= 6 && hour < 9) {
    return "linear-gradient(to bottom, #6CA6CD 0%, #99C5E3 40%, #F3D2C9 100%)";
  }
  if (hour >= 17 && hour < 20) {
    return "linear-gradient(to bottom, #5A9FD4 0%, #F0B88A 55%, #F8D4B0 100%)";
  }
  return "linear-gradient(to bottom, #1D8FE1 0%, #89D0F5 100%)";
}

export function getSkyGradientForWeather(code, isDay, timeString) {
  const scene = findSceneForWeather(code, isDay);
  const base = getSkyGradient(code, isDay, timeString);
  return getSceneSkyGradient(scene, timeString, base);
}

export function getSkyGradientForScene(scene, timeString) {
  const base = getSkyGradient(scene.code, scene.isDay, timeString);
  return getSceneSkyGradient(scene, timeString, base);
}
