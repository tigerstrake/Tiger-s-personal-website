"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  caption: string;
};

const AUTO_ADVANCE_MS = 3000;

export default function FlyingCarousel({ items }: { items: MediaItem[] }) {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number) => {
    if (videoRef.current) videoRef.current.pause();
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrent(idx);
    setProgressKey((k) => k + 1);
  }, []);

  const goNext = useCallback(() => {
    goTo((current + 1) % items.length);
  }, [current, items.length, goTo]);

  const goPrev = () => goTo((current - 1 + items.length) % items.length);

  // Auto-advance images after 3s
  useEffect(() => {
    if (items.length < 2) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (items[current].type === "image") {
      timerRef.current = setTimeout(goNext, AUTO_ADVANCE_MS);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, items, goNext]);

  const item = items[current];
  const isImage = item.type === "image";

  return (
    <div>
      {/* Media frame */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "#070810",
          border: "1px solid rgba(255,255,255,0.1)",
          aspectRatio: "16/9",
        }}
      >
        {isImage ? (
          <Image
            key={item.src}
            src={item.src}
            alt={item.caption}
            fill
            sizes="(min-width: 1024px) 896px, calc(100vw - 48px)"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <video
            key={item.src}
            ref={videoRef}
            src={item.src}
            controls
            muted
            preload="metadata"
            playsInline
            onEnded={goNext}
            className="w-full h-full"
            style={{ objectFit: "contain", background: "#000" }}
          />
        )}

        {/* Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(7,8,12,0.88)",
                border: "1.5px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              <ChevronLeft size={20} color="#ECEDF2" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(7,8,12,0.88)",
                border: "1.5px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              <ChevronRight size={20} color="#ECEDF2" />
            </button>
          </>
        )}

        {/* Counter badge */}
        {items.length > 1 && (
          <div
            className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(7,8,12,0.82)",
              color: "#8A8F9C",
              backdropFilter: "blur(6px)",
              fontFamily: "var(--font-display)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {current + 1} / {items.length}
          </div>
        )}

        {/* Progress bar (images only) */}
        {isImage && items.length > 1 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              key={progressKey}
              className="h-full"
              style={{
                background: "#C8865A",
                animation: `carousel-progress ${AUTO_ADVANCE_MS}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      {/* Caption */}
      <p
        className="mt-3 text-sm"
        style={{ color: "#8A8F9C", fontFamily: "var(--font-display)" }}
      >
        {item.caption}
      </p>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="flex gap-2 mt-3 items-center flex-wrap">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === current}
              style={{
                width: i === current ? "20px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === current ? "#C8865A" : "rgba(255,255,255,0.18)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.25s ease, background 0.2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
