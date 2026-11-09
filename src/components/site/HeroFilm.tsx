"use client";

import { useEffect, useRef, useState } from "react";

export function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      if (preference.matches) video.pause();
      else void video.play().catch(() => setPlaying(false));
    };
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    } else video.pause();
  }

  return (
    <>
      <div className="hero-film" aria-hidden="true">
        <video
          ref={videoRef}
          src="/media/studio-hero.mp4"
          poster="/media/studio-hero-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setFailed(true);
            setPlaying(false);
          }}
          style={failed ? { visibility: "hidden" } : undefined}
        />
      </div>
      {!failed && (
        <button
          type="button"
          className="hero-film-toggle"
          onClick={togglePlayback}
          aria-label={
            playing ? "Pause background video" : "Play background video"
          }
        >
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>{" "}
          {playing ? "Pause film" : "Play film"}
        </button>
      )}
    </>
  );
}
