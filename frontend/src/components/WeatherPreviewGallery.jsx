import { useState } from "react";

import {
  getWeatherIconUrl,
  getSceneImageUrl,
  getSkyGradientForScene,
  previewTimeForHour,
  WEATHER_PREVIEW_SAMPLES,
} from "../utils/weatherVisuals";

import "./WeatherPreviewGallery.css";

export default function WeatherPreviewGallery({ onClose }) {

  const [currentIndex, setCurrentIndex] = useState(0);

  const sample = WEATHER_PREVIEW_SAMPLES[currentIndex];

  const timeString = previewTimeForHour(
    sample.previewHour
  );

  const imageUrl = getSceneImageUrl(sample);

  const gradient = getSkyGradientForScene(
    sample,
    timeString
  );

  return (
    <div className="weather-preview-overlay">

      <div className="weather-preview-header">

        <h2>Weather background preview</h2>

        <p>
          Each card shows the sky gradient + frog image
          for that condition.
        </p>

        <button
          type="button"
          className="weather-preview-close"
          onClick={onClose}
        >
          Back to live weather
        </button>

      </div>

      <div className="weather-carousel-container">

        <button
          className="carousel-btn left"
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === 0
                ? WEATHER_PREVIEW_SAMPLES.length - 1
                : prev - 1
            )
          }
        >
          ←
        </button>

        <div className="weather-preview-card">

          <div className="weather-preview-label">
            {sample.id} — {sample.label}
          </div>

          <div
            className="weather-preview-scene"
            style={{ background: gradient }}
          >

            <img
              className="weather-preview-icon"
              src={getWeatherIconUrl(
                sample.code,
                sample.isDay,
                sample
              )}
              alt=""
            />

            <img
              className="weather-preview-frog"
              src={imageUrl}
              alt=""
            />

          </div>

        </div>

        <button
          className="carousel-btn right"
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === WEATHER_PREVIEW_SAMPLES.length - 1
                ? 0
                : prev + 1
            )
          }
        >
          →
        </button>

      </div>

    </div>
  );
}