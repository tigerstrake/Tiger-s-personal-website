"use client";

import { useState, useCallback, useRef } from "react";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  caption: string;
};

export default function FlyingCarousel({ items }: { items: MediaItem[] }) {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const go = useCallback(
    (idx: number) => {
      if (videoRef.current) videoRef.current.pause();
      setCurrent(idx);
    },
    []
  );

  const prev = () => go((current - 1 + items.length) % items.length);
  const next = () => go((current + 1) % items.length);
  const item = items[current];

  return (
    <div>
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "#0D0F17",
          border: "1px solid rgba(255,255,255,0.07)",
          aspectRatio: "16/9",
        }}
      >
        {item.type === "image" ? (
          <img
            key={item.src}
            src={item.src}
            alt={item.caption}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            key={item.src}
            ref={videoRef}
            src={item.src}
            controls
            playsInline
            className="w-full h-full"
            style={{ background: "#000", objectFit: "contain" }}
          />
        )}

        {items.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(7,8,12,0.8)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 2L4 7L9 12"
                  stroke="#ECEDF2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(7,8,12,0.8)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5 2L10 7L5 12"
                  stroke="#ECEDF2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {items.length > 1 && (
          <div
            className="absolute bottom-3 right-3 text-xs px-2 py-0.5 rounded"
            style={{
              background: "rgba(7,8,12,0.75)",
              color: "#5A5F6E",
              backdropFilter: "blur(4px)",
              fontFamily: "var(--font-display)",
            }}
          >
            {current + 1} / {items.length}
          </div>
        )}
      </div>

      <p
        className="mt-3 text-sm"
        style={{ color: "#5A5F6E", fontFamily: "var(--font-display)" }}
      >
        {item.caption}
      </p>

      {items.length > 1 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: i === current ? "#C8865A" : "rgba(255,255,255,0.18)",
                transform: i === current ? "scale(1.3)" : "scale(1)",
                transition: "background 0.2s, transform 0.2s",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
