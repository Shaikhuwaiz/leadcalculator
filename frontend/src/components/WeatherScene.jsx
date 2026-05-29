import { useEffect, useState, useRef } from "react";
import "./WeatherScene.css";
import { getChicagoHour } from "../utils/chicagoDate";
import {
  getWeatherIconUrl,
  getSkyGradientForScene,
  getSceneImageUrl,
} from "../utils/weatherVisuals";
import { findSceneForWeather, getMatchingScenes } from "../utils/weatherScenes";


const translateNoaaToWmo = (shortForecast, iconUrl) => {
    const desc = (shortForecast || "").toLowerCase();
    const url = (iconUrl || "").toLowerCase();

    // Thunderstorms
    if (url.includes("tsra") || desc.includes("thunderstorm") || desc.includes("t-storm")) {
        return 96;
    }
    // Blizzard / Heavy Snow
    if (url.includes("blizzard") || desc.includes("blizzard")) {
        return 75;
    }
    // Snow / Sleet
    if (url.includes("snow") || url.includes("sleet") || desc.includes("snow") || desc.includes("sleet")) {
        return 71;
    }
    // Heavy Rain
    if (desc.includes("heavy rain") || desc.includes("heavy showers") || desc.includes("torrential")) {
        return 65;
    }
    // Rain / Showers / Drizzle
    if (url.includes("rain") || url.includes("showers") || desc.includes("rain") || desc.includes("showers") || desc.includes("drizzle")) {
        return 61;
    }
    // Fog / Haze
    if (url.includes("fog") || url.includes("haze") || desc.includes("fog") || desc.includes("haze")) {
        return 45;
    }
    // Partly cloudy / partly sunny (before generic "cloudy")
    if (
        url.includes("sct") ||
        desc.includes("partly cloudy") ||
        desc.includes("partly sunny") ||
        desc.includes("partly clear")
    ) {
        return 2;
    }
    // Mostly sunny / mostly clear
    if (
        url.includes("few") ||
        desc.includes("mostly sunny") ||
        desc.includes("mostly clear")
    ) {
        return 1;
    }
    // Overcast / mostly cloudy (not partly)
    if (
        url.includes("ovc") ||
        desc.includes("overcast") ||
        desc.includes("mostly cloudy") ||
        (desc.includes("cloudy") && !desc.includes("partly"))
    ) {
        return 3;
    }
    // Sunny / clear
    if (desc.includes("sunny") || desc.includes("clear") || url.includes("skc")) {
        return 0;
    }
    return 0;
};

export default function WeatherScene() {
    const [weatherData, setWeatherData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);


   

    const activeCode = weatherData ? weatherData.current.weather_code : 0;
    const activeIsDay = weatherData ? Boolean(weatherData.current.is_day) : getChicagoHour() >= 6 && getChicagoHour() < 20;
    const activeTemp = weatherData ? weatherData.current.temperature_2m : 26;
    const activeApparentTemp = weatherData ? weatherData.current.apparent_temperature : 26;
    const activeHigh = weatherData ? weatherData.daily.temperature_2m_max[0] : 29;
    const activeLow = weatherData ? weatherData.daily.temperature_2m_min[0] : 19;
    const activeTime = weatherData ? weatherData.current.time : new Date().toISOString();

    useEffect(() => {
        const headers = { "User-Agent": "WeatherDashboardApp" };

        // Bourbon, MO coordinates lookup on NOAA first
        fetch("https://api.weather.gov/points/38.2098,-91.1612", { headers })
            .then(res => {
                if (!res.ok) throw new Error("NOAA lookup failed");
                return res.json();
            })
            .then(pointData => {
                const forecastUrl = pointData.properties.forecast;
                const hourlyUrl = pointData.properties.forecastHourly;

                return Promise.all([
                    fetch(hourlyUrl, { headers }).then(r => r.json()),
                    fetch(forecastUrl, { headers }).then(r => r.json()),
                    fetch("https://api.weather.gov/alerts/active?point=38.2098,-91.1612", { headers }).then(r => r.json())
                ]);
            })
            .then(([hourly, daily, alerts]) => {
                if (!hourly.properties || !daily.properties) {
                    throw new Error("NOAA forecast properties missing");
                }
                const current = hourly.properties.periods[0];
                const todayForecast = daily.properties.periods[0];
                const tonightForecast = daily.properties.periods[1];

                const high = todayForecast.isDaytime ? todayForecast.temperature : tonightForecast.temperature;
                const low = !todayForecast.isDaytime ? todayForecast.temperature : tonightForecast.temperature;

                const activeAlerts = (alerts.features || []).map(f => f.properties.event);
                const wmoCode = translateNoaaToWmo(current.shortForecast, current.icon);

                const unifiedData = {
                    current: {
                        temperature_2m: Math.round((current.temperature - 32) * 5 / 9),
                        apparent_temperature: Math.round((current.temperature - 32) * 5 / 9),
                        weather_code: wmoCode,
                        is_day: current.isDaytime ? 1 : 0,
                        time: current.startTime
                    },
                    daily: {
                        temperature_2m_max: [Math.round((high - 32) * 5 / 9)],
                        temperature_2m_min: [Math.round((low - 32) * 5 / 9)]
                    },
                    alerts: activeAlerts
                };

                setWeatherData(unifiedData);
            })
            .catch(err => {
                console.warn("NOAA fetch failed, falling back to Open-Meteo:", err);

                // Fallback to Open-Meteo
                fetch("https://api.open-meteo.com/v1/forecast?latitude=38.2098&longitude=-91.1612&current=temperature_2m,apparent_temperature,weather_code,is_day,precipitation,cloud_cover&daily=temperature_2m_max,temperature_2m_min&timezone=auto")
                    .then(res => res.json())
                    .then(data => {
                        if (!data || !data.current) return;

                        setWeatherData({
                            current: {
                                temperature_2m: data.current.temperature_2m,
                                apparent_temperature: data.current.apparent_temperature,
                                weather_code: data.current.weather_code,
                                is_day: data.current.is_day,
                                time: data.current.time
                            },
                            daily: {
                                temperature_2m_max: [data.daily.temperature_2m_max[0]],
                                temperature_2m_min: [data.daily.temperature_2m_min[0]]
                            },
                            alerts: [] // No alerts on Open-Meteo
                        });
                    })
                    .catch(meteoErr => console.error("Weather fetch fallback error", meteoErr));
            });
    }, []);

    const getWeatherDescription = (code) => {
        if (code === 0) return "Clear";
        if (code === 1) return "Clear with Periodic Clouds";
        if (code === 2) return "Partly Cloudy";
        if (code === 3) return "Overcast";
        if (code >= 45 && code <= 48) return "Smoke / Fog";
        if (code >= 51 && code <= 55) return "Drizzle";
        if (code === 56 || code === 57) return "Freezing Drizzle";
        if (code === 61 || code === 63) return "Rain";
        if (code === 65 || code === 82) return "Heavy Rain";
        if (code === 66 || code === 67) return "Freezing Rain";
        if (code === 68 || code === 69) return "Rain and Snow";
        if (code === 70) return "Ice Crystals";
        if (code === 71 || code === 73) return "Snow";
        if (code === 74) return "Low Drifting Snow";
        if (code === 75 || code === 86) return "Heavy Snow Storm";
        if (code === 77) return "Squalls";
        if (code >= 80 && code <= 81) return "Rain Showers";
        if (code === 85) return "Snow Showers";
        if (code === 95) return "Scattered Thunderstorms";
        if (code >= 96 && code <= 99) return "Heavy Thunderstorms";
        return "Unknown";
    };


    const getWeatherLabel = (code, isDay) => {
        if (code === 0) return isDay ? "Sunny" : "Clear";
        if (code === 1) return isDay ? "Mostly Sunny" : "Mostly Clear";
        if (code === 2) return "Partly Cloudy";
        if (code === 3) return "Cloudy";
        if (code >= 45 && code <= 48) return "Foggy";
        if (code >= 51 && code <= 55) return "Drizzle";
        if (code === 56 || code === 57) return "Freezing Drizzle";
        if (code === 61 || code === 63) return "Rainy";
        if (code === 65 || code === 82) return "Heavy Rain";
        if (code === 66 || code === 67) return "Freezing Rain";
        if (code === 68 || code === 69) return "Hailstorm";
        if (code === 70) return "Ice Crystals";
        if (code === 71 || code === 73) return "Snowy";
        if (code === 74) return "Drifting Snow";
        if (code === 75 || code === 86) return "Blizzard";
        if (code === 77) return "Squally";
        if (code >= 80 && code <= 81) return "Rain Showers";
        if (code === 85) return "Snow Showers";
        if (code === 95) return "Stormy";
        if (code >= 96 && code <= 99) return "Severe Storms";
        return isDay ? "Sunny" : "Clear";
    };

    const displayCode = activeCode;
    const displayIsDay = activeIsDay;
    const displayTime = activeTime;

    const [displayScene, setDisplayScene] = useState(null);
    const prevCodeRef = useRef(null);

    useEffect(() => {
        if (!weatherData) return;
        const code = weatherData.current.weather_code;
        const isDay = Boolean(weatherData.current.is_day);
        const key = `weather_scene_idx_${code}_${isDay ? 1 : 0}`;
        const tsKey = `weather_scene_ts_${code}_${isDay ? 1 : 0}`;
        const matches = getMatchingScenes(code, isDay);

        if (!matches || matches.length === 0) {
            // fallback to existing logic
            setDisplayScene(findSceneForWeather(code, isDay));
            prevCodeRef.current = code;
            return;
        }

        const prev = prevCodeRef.current;
        const storedIdx = localStorage.getItem(key);
        let idx = parseInt(storedIdx || "0", 10);
        const lastUpdated = parseInt(localStorage.getItem(tsKey) || "0", 10);
        const now = Date.now();
        const keepSceneDelayMs = 2 * 60 * 1000; // keep the same variant for at least 2 minutes
        const sceneIsFresh = now - lastUpdated < keepSceneDelayMs;

        if (prev !== null && prev !== code) {
            // Actual weather code changed while component was mounted
            idx = (idx + 1) % matches.length;
            localStorage.setItem(key, idx.toString());
            localStorage.setItem(tsKey, now.toString());
        } else if (prev === null) {
            // Initial mount or remount
            if (!storedIdx) {
                localStorage.setItem(key, idx.toString());
                localStorage.setItem(tsKey, now.toString());
            } else if (!sceneIsFresh && matches.length > 1) {
                // Allow a new variant only after a short hold window
                idx = (idx + 1) % matches.length;
                localStorage.setItem(key, idx.toString());
                localStorage.setItem(tsKey, now.toString());
            }
        }

        prevCodeRef.current = code;
        setDisplayScene(matches[idx]);
    }, [weatherData]);

    const weatherImageUrl = displayScene ? getSceneImageUrl(displayScene) : null;
    const skyBackground = displayScene
        ? getSkyGradientForScene(displayScene, displayTime)
        : "transparent";
    const showLiveData = !!weatherData;

    return (
        <div className="scene">
            <div
                className="weather-card"
                style={{ background: skyBackground }}
            >
      
               
                {showLiveData && (
                    <div className="skyIconContainer">
                        <img
                            src={getWeatherIconUrl(displayCode, displayIsDay, displayScene)}
                            alt={getWeatherDescription(displayCode)}
                            className="skyIconImg"
                        />
                        <div className="skyIconLabel">
                            {getWeatherLabel(displayCode, displayIsDay)}
                        </div>
                    </div>
                )}
                <div
                    className="stormGradientOverlay"
                    style={{
                        background:
                            displayCode >= 95
                                ? "linear-gradient(to bottom, rgba(100, 70, 130, 0.12) 0%, rgba(140, 100, 160, 0.06) 50%, transparent 100%)"
                                : displayCode >= 51 && displayCode <= 86
                                  ? "linear-gradient(to bottom, rgba(60, 80, 100, 0.08) 0%, transparent 55%)"
                                  : "transparent",
                    }}
                />
                {weatherImageUrl && (
                    <div className="weather-scene-layer">
                        {weatherImageUrl.endsWith(".mp4") ? (
                            <video
                                className="weatherScene"
                                src={weatherImageUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <img
                                className="weatherScene"
                                src={weatherImageUrl}
                                alt="weather frog"
                            />
                        )}
                    </div>
                )}

                {showLiveData && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 12,
                            fontFamily: "'Inter', 'Segoe UI', sans-serif",
                            pointerEvents: "none",
                        }}
                    >
                        <div className="weather-info-container">
                            {/* Location & Time */}
                            <div className="weather-location">
                                <span className="weather-icon">location_on</span>
                                <span>Bourbon, MO &bull; {currentTime.toLocaleString("en-US", { timeZone: "America/Chicago", weekday: "short", hour: "numeric", minute: "2-digit", timeZoneName: "short" })}</span>
                            </div>

                            {/* Big temperature */}
                            <div className="weather-temp">
                                {Math.round(activeTemp)}&deg;
                            </div>

                            {/* Feels like */}
                            <div className="weather-feels-like">
                                Feels like {Math.round(activeApparentTemp)}&deg;
                            </div>

                            {/* High / Low + Alert */}
                            <div className="weather-high-low">
                                <span>Day: &uarr; {Math.round(activeHigh)}&deg; &nbsp; Night: &darr; {Math.round(activeLow)}&deg;</span>
                                {weatherData.alerts && weatherData.alerts.length > 0 && (
                                    <span className="alert-pill">
                                        <span className="alert-icon">warning</span>
                                        {weatherData.alerts[0].toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}