/**
 * Canonical Weather Frog scenes (landscape).
 * Each scene has a tuned sky gradient to match its illustration.
 */

const G = {
  sunnyDay: "linear-gradient(to bottom, #1D8FE1 0%, #6FC4F5 50%, #B8E4FA 100%)",
  mostlySunny: "linear-gradient(to bottom, #2E9AE8 0%, #6FC4F5 50%, #B8E4FA 100%)",
  partlyCloudyDay: "linear-gradient(to bottom, #4BA3E8 0%, #7FC4F2 45%, #C8E8FA 100%)",
  cloudyDay: "linear-gradient(to bottom, #6EB7E6 0%, #8FD0F2 35%, #CDEFFF 72%, #F7FDFF 100%)",
  nightClear: "linear-gradient(to bottom, #0F0C20 0%, #1E1233 60%, #3B1B47 100%)",
  nightCloudy: "linear-gradient(to bottom, #141A28 0%, #2E3A52 100%)",
  nightPartly: "linear-gradient(to bottom, #12182A 0%, #2A3550 55%, #4A3D62 100%)",
  drizzle: "linear-gradient(to bottom, #5E7F94 0%, #8AAFC4 45%, #B5D0E0 100%)",
  rain: "linear-gradient(to bottom, #4A6578 0%, #7296AB 40%, #A8C4D4 100%)",
  heavyRain: "linear-gradient(to bottom, #3D5262 0%, #5E7A8E 35%, #8AA8BA 75%, #B8CED8 100%)",
  freezingRain: "linear-gradient(to bottom, #3E5C6E 0%, #5B8296 30%, #7FA3B5 60%, #A8C8D8 100%)",
  mixedPrecip: "linear-gradient(to bottom, #425E70 0%, #648A9C 40%, #94B4C6 100%)",
  wintryMix: "linear-gradient(to bottom, #4A6272 0%, #7898A8 50%, #A8C0D0 100%)",
  snow: "linear-gradient(to bottom, #6A7F8F 0%, #9AB0C0 55%, #C8DAE4 100%)",
  blizzard: "linear-gradient(to bottom, #4A5565 0%, #6E8090 50%, #98A8B8 100%)",
  stormIso: "linear-gradient(to bottom, #3A3458 0%, #5A5478 40%, #7A7498 100%)",
  stormScattered: "linear-gradient(to bottom, #342F50 0%, #524C70 45%, #726C90 100%)",
  stormStrong: "linear-gradient(to bottom, #2A2240 0%, #483858 50%, #685878 100%)",
  squalls: "linear-gradient(to bottom, #4A7088 0%, #78A0B8 50%, #A8C8DC 100%)",
  windy: "linear-gradient(to bottom, #5A90B0 0%, #88B8D0 55%, #B8D8EC 100%)",
  fog: "linear-gradient(to bottom, #8BA9BD 0%, #C5D8E6 55%, #E8F2F8 100%)",
  tropicalStorm: "linear-gradient(to bottom, #1E1830 0%, #3A2E50 40%, #5A4870 100%)",
  tornado: "linear-gradient(to bottom, #1A1A2A 0%, #2E2E40 50%, #4A4A60 100%)",
};

export const WEATHER_SCENES = [
  { id: "01", label: "Sunny", image: "01-sunny-beach-reading.png", folder: "landscape", landscapeDir: "01-sunny", code: 0, isDay: true, previewHour: 12, gradient: G.sunnyDay },
  { id: "02", label: "Mostly Sunny", image: "02-mostly-sunny-beach-reading.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
  { id: "03", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-citypark-ukelele.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "04", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-home-flowers.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "05", label: "Clear (night)", image: "05-clear-home-lounging.png", folder: "landscape", landscapeDir: "05-clear", code: 0, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "06", label: "Mostly Clear (night)", image: "06-mostly-clear-home-lounging.png", folder: "landscape", landscapeDir: "06-mostly-clear", code: 1, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "07", label: "Partly Cloudy (night)", image: "07-partly-cloudy-night-home-inside.png", folder: "landscape", landscapeDir: "07-partly-cloudy-night", code: 2, isDay: false, previewHour: 22, gradient: G.nightPartly },
  { id: "08", label: "Mostly Cloudy (night)", image: "08-mostly-cloudy-night-home-inside.png", folder: "landscape", landscapeDir: "08-mostly-cloudy-night", code: 3, isDay: false, previewHour: 22, gradient: G.nightCloudy },
  { id: "09", label: "Cloudy", image: "09-cloudy-hills-coffee.png", folder: "landscape", landscapeDir: "09-cloudy", code: 3, isDay: true, previewHour: 11, gradient: G.cloudyDay },
  { id: "10", label: "Drizzle", image: "10-drizzle-home-laundry.png", folder: "landscape", landscapeDir: "10-drizzle", code: 53, isDay: true, previewHour: 11, gradient: G.drizzle },
  { id: "11", label: "Rain", image: "11-rain-home-inside.png", folder: "landscape", landscapeDir: "11-rain", code: 61, isDay: true, previewHour: 12, gradient: G.rain },
  { id: "12", label: "Heavy Rain", image: "12-heavy-rain-busstop-umbrella.png", folder: "landscape", landscapeDir: "12-heavy-rain", code: 65, isDay: true, previewHour: 12, gradient: G.heavyRain },
  { id: "13", label: "Flurries", image: "13-flurries-citypark-snowman.png", folder: "landscape", landscapeDir: "13-flurries", code: 71, isDay: true, previewHour: 12, gradient: G.snow },
  { id: "14", label: "Snow", image: "13-flurries-creek-iceskating.png", folder: "landscape", landscapeDir: "13-flurries", code: 73, isDay: true, previewHour: 12, gradient: G.snow },
  { id: "15", label: "Snow Showers", image: "15-snow-showers-snow-home-shoveling.png", folder: "landscape", landscapeDir: "15-snow-showers-snow", code: 85, isDay: true, previewHour: 12, gradient: G.snow },
  { id: "16", label: "Blowing Snow", image: "16-blowing-snow-field-snowman.png", folder: "landscape", landscapeDir: "16-blowing-snow", code: 74, isDay: true, previewHour: 12, gradient: G.blizzard },
  { id: "17", label: "Blizzard", image: "17-heavy-snow-blizzard-home-inside.png", folder: "landscape", landscapeDir: "17-heavy-snow-blizzard", code: 75, isDay: true, previewHour: 12, gradient: G.blizzard },
  {
    id: "18",
    label: "Freezing Rain",
    image: "19-mixed-rain-hail-rain-sleet-busstop-waiting.png",
    folder: "landscape",
    landscapeDir: "19-mixed-rain-hail-rain-sleet",
    code: 67,
    isDay: true,
    previewHour: 12,
    gradient: G.freezingRain,
  },
  {
    id: "19",
    label: "Mixed Rain / Hail / Sleet",
    image: "19-mixed-rain-hail-rain-sleet-cafe-entering.png",
    folder: "landscape",
    landscapeDir: "19-mixed-rain-hail-rain-sleet",
    code: 68,
    isDay: true,
    previewHour: 12,
    gradient: G.mixedPrecip,
  },
  { id: "20", label: "Rain–Snow Wintry Mix", image: "20-rain-snow-wintry-mix-citypark-snowman.png", folder: "landscape", landscapeDir: "20-rain-snow-wintry-mix", code: 69, isDay: true, previewHour: 12, gradient: G.wintryMix },
  { id: "21", label: "Rain Showers", image: "11-shower-rain-field-leaf.png", folder: "landscape", landscapeDir: "11-rain", code: 80, isDay: true, previewHour: 12, gradient: G.rain },
  { id: "22", label: "Isolated Thunderstorms", image: "22-iso-thunderstorms-home-inside.png", folder: "landscape", landscapeDir: "22-iso-thunderstorms", code: 95, isDay: true, previewHour: 15, gradient: G.stormIso },
  {
    id: "23",
    label: "Scattered Thunderstorms",
    image: "23-scattered-thunderstorms-home-inside.png",
    folder: "landscape",
    landscapeDir: "23-scattered-thunderstorms",
    code: 95,
    isDay: true,
    previewHour: 15,
    gradient: G.stormScattered,
  },
  { id: "24", label: "Strong Thunderstorms", image: "24-strong-thunderstorms-home-inside.png", folder: "landscape", landscapeDir: "24-strong-thunderstorms", code: 96, isDay: true, previewHour: 15, gradient: G.stormStrong },
  { id: "25", label: "Squalls", image: "25-breezy-windy-creek-pinwheel.png", folder: "landscape", landscapeDir: "25-breezy-windy", code: 77, isDay: true, previewHour: 12, gradient: G.squalls, icon: "squalls.svg" },
  { id: "26", label: "Breezy / Windy", image: "25-breezy-windy-home-laundry.png", folder: "landscape", landscapeDir: "25-breezy-windy", code: 77, isDay: true, previewHour: 14, gradient: G.windy, icon: "windy_breezy.svg" },
  { id: "27", label: "Haze / Fog / Smoke", image: "26-haze-fog-dust-smoke-bridge.png", folder: "landscape", landscapeDir: "26-haze-fog-dust-smoke", code: 45, isDay: true, previewHour: 10, gradient: G.fog },
  { id: "28", label: "Sunny", image: "01-sunny-beach-sandcastle.png", folder: "landscape", landscapeDir: "01-sunny", code: 0, isDay: true, previewHour: 12, gradient: G.sunnyDay },
  { id: "29", label: "Sunny", image: "01-sunny-beach-sunscreen.png", folder: "landscape", landscapeDir: "01-sunny", code: 0, isDay: true, previewHour: 12, gradient: G.sunnyDay },
{ id: "30", label: "Mostly Sunny", image: "02-mostly-sunny-beach-sandcastle.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
{ id: "31", label: "Mostly Sunny", image: "02-mostly-sunny-beach-sunscreen.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
  { id: "32", label: "Mostly Sunny", image: "02-mostly-sunny-citypark-picnic.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
  { id: "33", label: "Mostly Sunny", image: "02-mostly-sunny-creek-swimming.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
  { id: "34", label: "Mostly Sunny", image: "02-mostly-sunny-hills-sunbathing.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
  { id: "35", label: "Mostly Sunny", image: "02-mostly-sunny-field-kite.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
  { id: "36", label: "Mostly Sunny", image: "02-mostly-sunny-home-laundry.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
  { id: "37", label: "Mostly Sunny", image: "02-mostly-sunny-orchard-picking.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
  { id: "38", label: "Mostly Sunny", image: "02-mostly-sunny-rooftop-pinacolada.png", folder: "landscape", landscapeDir: "02-mostly-sunny", code: 1, isDay: true, previewHour: 12, gradient: G.mostlySunny },
  { id: "39", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-beach-shells.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "40", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-citypark-ukelele_c.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "41", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-citypark-ukelele_f.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "42", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-field-biking.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "43", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-field-biking_c.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "44", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-field-biking_f.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "45", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-field-hiking.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "46", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-field-hiking_c.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "47", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-field-hiking_f.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "48", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-hills-painting.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "49", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-hills-reading.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "50", label: "Partly Cloudy (day)", image: "03-partly-cloudy-day-home-flowers.png", folder: "landscape", landscapeDir: "03-partly-cloudy-day", code: 2, isDay: true, previewHour: 14, gradient: G.partlyCloudyDay },
  { id: "51", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-beach-shells.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "52", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-citypark-ukelele.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "53", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-creek-feet.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "54", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-field-hiking.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "55", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-hills-painting.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "56", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-hills-reading.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "57", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-home-flowers_f.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "58", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-orchard-butterflies.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "59", label: "Mostly Cloudy (day)", image: "04-mostly-cloudy-day-orchard-treeswing.png", folder: "landscape", landscapeDir: "04-mostly-cloudy-day", code: 3, isDay: true, previewHour: 12, gradient: G.cloudyDay },
  { id: "61", label: "Clear (night)", image: "05-clear-creek-stars.png", folder: "landscape", landscapeDir: "05-clear", code: 0, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "62", label: "Clear (night)", image: "05-clear-field-lanterns.png", folder: "landscape", landscapeDir: "05-clear", code: 0, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "63", label: "Clear (night)", image: "05-clear-hills-camping.png", folder: "landscape", landscapeDir: "05-clear", code: 0, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "64", label: "Clear (night)", image: "05-clear-hills-telescope.png", folder: "landscape", landscapeDir: "05-clear", code: 0, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "65", label: "Clear (night)", image: "05-clear-orchard-fireflies.png", folder: "landscape", landscapeDir: "05-clear", code: 0, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "66", label: "Mostly Clear (night)", image: "06-mostly-clear-creek-stars.png", folder: "landscape", landscapeDir: "06-mostly-clear", code: 1, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "67", label: "Mostly Clear (night)", image: "06-mostly-clear-field-lanterns.png", folder: "landscape", landscapeDir: "06-mostly-clear", code: 1, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "68", label: "Mostly Clear (night)", image: "06-mostly-clear-hills-camping.png", folder: "landscape", landscapeDir: "06-mostly-clear", code: 1, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "69", label: "Mostly Clear (night)", image: "06-mostly-clear-hills-telescope.png", folder: "landscape", landscapeDir: "06-mostly-clear", code: 1, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "70", label: "Mostly Clear (night)", image: "06-mostly-clear-orchard-fireflies.png", folder: "landscape", landscapeDir: "06-mostly-clear", code: 1, isDay: false, previewHour: 22, gradient: G.nightClear },
  { id: "71", label: "Partly Cloudy (night)", image: "07-partly-cloudy-night-creek-fireflies.png", folder: "landscape", landscapeDir: "07-partly-cloudy-night", code: 2, isDay: false, previewHour: 22, gradient: G.nightPartly },
  { id: "72", label: "Partly Cloudy (night)", image: "07-partly-cloudy-night-field-fireflies.png", folder: "landscape", landscapeDir: "07-partly-cloudy-night", code: 2, isDay: false, previewHour: 22, gradient: G.nightPartly },
  { id: "73", label: "Partly Cloudy (night)", image: "07-partly-cloudy-night-hills-smores.png", folder: "landscape", landscapeDir: "07-partly-cloudy-night", code: 2, isDay: false, previewHour: 22, gradient: G.nightPartly },
  { id: "74", label: "Partly Cloudy (night)", image: "07-partly-cloudy-night-orchard-eating.png", folder: "landscape", landscapeDir: "07-partly-cloudy-night", code: 2, isDay: false, previewHour: 22, gradient: G.nightPartly },
  { id: "75", label: "Mostly Cloudy (night)", image: "08-mostly-cloudy-night-creek-fireflies.png", folder: "landscape", landscapeDir: "08-mostly-cloudy-night", code: 3, isDay: false, previewHour: 22, gradient: G.nightCloudy },
  { id: "76", label: "Mostly Cloudy (night)", image: "08-mostly-cloudy-night-field-fireflies.png", folder: "landscape", landscapeDir: "08-mostly-cloudy-night", code: 3, isDay: false, previewHour: 22, gradient: G.nightCloudy },
  { id: "77", label: "Mostly Cloudy (night)", image: "08-mostly-cloudy-night-hills-smores.png", folder: "landscape", landscapeDir: "08-mostly-cloudy-night", code: 3, isDay: false, previewHour: 22, gradient: G.nightCloudy },
  { id: "78", label: "Mostly Cloudy (night)", image: "08-mostly-cloudy-night-orchard-eating.png", folder: "landscape", landscapeDir: "08-mostly-cloudy-night", code: 3, isDay: false, previewHour: 22, gradient: G.nightCloudy },
  { id: "79", label: "Cloudy", image: "09-cloudy-hills-coffee.png", folder: "landscape", landscapeDir: "09-cloudy", code: 3, isDay: true, previewHour: 11, gradient: G.cloudyDay },
  { id: "80", label: "Cloudy", image: "09-cloudy-home-flowers.png", folder: "landscape", landscapeDir: "09-cloudy", code: 3, isDay: true, previewHour: 11, gradient: G.cloudyDay },
  { id: "81", label: "Cloudy", image: "09-cloudy-orchard-watching.png", folder: "landscape", landscapeDir: "09-cloudy", code: 3, isDay: true, previewHour: 11, gradient: G.cloudyDay },
  { id: "82", label: "Drizzle", image: "10-drizzle-creek-leaf.png", folder: "landscape", landscapeDir: "10-drizzle", code: 53, isDay: true, previewHour: 11, gradient: G.drizzle },
  { id: "83", label: "Drizzle", image: "10-drizzle-field-leaf.png", folder: "landscape", landscapeDir: "10-drizzle", code: 53, isDay: true, previewHour: 11, gradient: G.drizzle },
  { id: "84", label: "Drizzle", image: "10-drizzle-hills-umbrella.png", folder: "landscape", landscapeDir: "10-drizzle", code: 53, isDay: true, previewHour: 11, gradient: G.drizzle },
  { id: "85", label: "Drizzle", image: "10-drizzle-home-laundry.png", folder: "landscape", landscapeDir: "10-drizzle", code: 53, isDay: true, previewHour: 11, gradient: G.drizzle },
  { id: "86", label: "Drizzle", image: "10-drizzle-orchard-reading.png", folder: "landscape", landscapeDir:"10-drizzle", code: 53, isDay: true, previewHour: 11, gradient: G.drizzle },
  { id: "87", label: "Rain", image: "11-rain-creek-leaf.png", folder: "landscape", landscapeDir: "11-rain", code: 61, isDay: true, previewHour: 12, gradient: G.rain },
  { id: "88", label: "Rain", image: "11-rain-hills-umbrella.png", folder: "landscape", landscapeDir: "11-rain", code: 61, isDay: true, previewHour: 12, gradient: G.rain },
  { id: "89", label: "Rain", image: "11-rain-home-laundry.png", folder: "landscape", landscapeDir: "11-rain", code: 61, isDay: true, previewHour: 12, gradient: G.rain },
  { id: "90", label: "Rain", image: "11-shower-rain-field-leaf.png", folder: "landscape", landscapeDir: "11-rain", code: 61, isDay: true, previewHour: 12, gradient: G.rain },
  { id: "91", label: "Rain", image: "11-shower-rain-field-leaf.png", folder: "landscape", landscapeDir: "11-rain", code: 61, isDay: true, previewHour: 12, gradient: G.rain },
  { id: "92", label: "Heavy Rain", image: "12-heavy-rain-cafe-sitting-singing.png", folder: "landscape", landscapeDir: "12-heavy-rain", code: 65, isDay: true, previewHour: 12, gradient: G.heavyRain },
  { id: "93", label: "Heavy Rain", image: "12-heavy-rain-creek-leaf.png", folder: "landscape", landscapeDir: "12-heavy-rain", code: 65, isDay: true, previewHour: 12, gradient: G.heavyRain },
  { id: "94", label: "Flurries", image: "13-flurries-creek-iceskating.png", folder: "landscape", landscapeDir: "13-flurries", code: 71, isDay: true, previewHour: 12, gradient: G.snow },
  { id: "95", label: "Snow Showers", image: "15-snow-showers-snow-citypark-snowman.png", folder: "landscape", landscapeDir: "15-snow-showers-snow", code: 85, isDay: true, previewHour: 12, gradient: G.snow },
  { id: "96", label: "Snow Showers", image: "15-snow-showers-snow-creek-iceskating.png", folder: "landscape", landscapeDir: "15-snow-showers-snow", code: 85, isDay: true, previewHour: 12, gradient: G.snow },
  { id: "97", label: "Blizzard", image: "17-heavy-snow-blizzard-home-shoveling.png", folder: "landscape", landscapeDir: "17-heavy-snow-blizzard", code: 75, isDay: true, previewHour: 12, gradient: G.blizzard },
  { id: "98", label: "Isolated Thunderstorms", image: "22-iso-thunderstorms-cafe-looking-outside.png", folder: "landscape", landscapeDir: "22-iso-thunderstorms", code: 95, isDay: true, previewHour: 15, gradient: G.stormIso },
  { id: "99", label: "Isolated Thunderstorms", image: "22-iso-thunderstorms-busstop-newspaper.png", folder: "landscape", landscapeDir: "22-iso-thunderstorms", code: 95, isDay: true, previewHour: 15, gradient: G.stormIso },
 {
    id: "100",
    label: "Scattered Thunderstorms",
    image: "23-scattered-thunderstorms-cafe-looking-outside.png",
    folder: "landscape",
    landscapeDir: "23-scattered-thunderstorms",
    code: 95,
    isDay: true,
    previewHour: 15,
    gradient: G.stormScattered,
  },
  {
    id: "101",
    label: "Scattered Thunderstorms",
    image: "23-scattered-thunderstorms-busstop-newspaper.png",
    folder: "landscape",
    landscapeDir: "23-scattered-thunderstorms",
    code: 95,
    isDay: true,
    previewHour: 15,
    gradient: G.stormScattered,
  },{
    id: "102",
    label: "Scattered Thunderstorms",
    image: "23-scattered-thunderstorms-busstop-coffee.png",
    folder: "landscape",
    landscapeDir: "23-scattered-thunderstorms",
    code: 95,
    isDay: true,
    previewHour: 15,
    gradient: G.stormScattered,
  },
    { id: "103", label: "Strong Thunderstorms", image: "24-strong-thunderstorms-busstop-coffee.png", folder: "landscape", landscapeDir: "24-strong-thunderstorms", code: 96, isDay: true, previewHour: 15, gradient: G.stormStrong },
  { id: "104", label: "Strong Thunderstorms", image: "24-strong-thunderstorms-cafe-looking-outside.png", folder: "landscape", landscapeDir: "24-strong-thunderstorms", code: 96, isDay: true, previewHour: 15, gradient: G.stormStrong },
  { id: "105", label: "Strong Thunderstorms", image: "24-strong-thunderstorms-busstop-newspaper.png", folder: "landscape", landscapeDir: "24-strong-thunderstorms", code: 96, isDay: true, previewHour: 15, gradient: G.stormStrong },
  { id: "106", label: "Haze / Fog / Smoke", image: "26-haze-fog-dust-smoke-busstop-waiting.png", folder: "landscape", landscapeDir: "26-haze-fog-dust-smoke", code: 45, isDay: true, previewHour: 10, gradient: G.fog },
  { id: "107", label: "Haze / Fog / Smoke", image: "26-haze-fog-dust-smoke-field-lantern.png", folder: "landscape", landscapeDir: "26-haze-fog-dust-smoke", code: 45, isDay: true, previewHour: 10, gradient: G.fog },
  { id: "108", label: "Haze / Fog / Smoke", image: "26-haze-fog-dust-smoke-fruit-stand.png", folder: "landscape", landscapeDir: "26-haze-fog-dust-smoke", code: 45, isDay: true, previewHour: 10, gradient: G.fog },
  { id: "109", label: "Haze / Fog / Smoke", image: "26-haze-fog-dust-smoke-hills-cocoa.png", folder: "landscape", landscapeDir: "26-haze-fog-dust-smoke", code: 45, isDay: true, previewHour: 10, gradient: G.fog },
  { id: "110", label: "Haze / Fog / Smoke", image: "26-haze-fog-dust-smoke-mountain.png", folder: "landscape", landscapeDir: "26-haze-fog-dust-smoke", code: 45, isDay: true, previewHour: 10, gradient: G.fog },
  { id: "111", label: "Haze / Fog / Smoke", image: "26-haze-fog-dust-smoke-pier.png", folder: "landscape", landscapeDir: "26-haze-fog-dust-smoke", code: 45, isDay: true, previewHour: 10, gradient:G.fog },
  { id: "112", label: "Haze / Fog / Smoke", image: "26-haze-fog-dust-smoke-rooftop.png", folder: "landscape", landscapeDir: "26-haze-fog-dust-smoke", code: 45, isDay: true, previewHour: 10, gradient: G.fog },

];

export const WEATHER_PREVIEW_SAMPLES = WEATHER_SCENES;

export function getSceneImageUrl(scene) {
  if (scene.folder === "landscape" && scene.landscapeDir) {
    return `/weatherfrog/landscape/${scene.landscapeDir}/${scene.image}`;
  }
  return `/weatherfrog/images/wide/${scene.image}`;
}

export function getMatchingScenes(code, isDay) {
  const dayMatches = WEATHER_SCENES.filter((s) => s.code === code && s.isDay === isDay);
  if (dayMatches.length > 0) return dayMatches;

  const codeMatches = WEATHER_SCENES.filter((s) => s.code === code);
  if (codeMatches.length > 0) return codeMatches;

  return [];
}

export function findSceneForWeather(code, isDay) {
  // Find all scenes matching code and isDay
  const dayMatches = WEATHER_SCENES.filter((s) => s.code === code && s.isDay === isDay);
  if (dayMatches.length > 0) {
    // Cycle through themes based on current hour
    const hour = new Date().getHours();
    return dayMatches[hour % dayMatches.length];
  }

  // Find all scenes matching just the code
  const codeMatches = WEATHER_SCENES.filter((s) => s.code === code);
  if (codeMatches.length > 0) {
    // Cycle through themes based on current hour
    const hour = new Date().getHours();
    return codeMatches[hour % codeMatches.length];
  }

  // Fallback to default scene
  return WEATHER_SCENES.find((s) => s.id === (isDay ? "01" : "05")) || WEATHER_SCENES[0];
}

export function getWeatherImageFilename(code, isDay) {
  return findSceneForWeather(code, isDay).image;
}

export function getSceneSkyGradient(scene, timeString, fallbackGradient) {
  if (!scene) return fallbackGradient;
  if (scene.gradient) return scene.gradient;
  return fallbackGradient;
}
