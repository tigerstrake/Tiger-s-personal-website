"use client";

interface BrowserEmbedProps {
  url: string;
  height?: number;
}

export default function BrowserEmbed({ url, height = 620 }: BrowserEmbedProps) {
  const displayUrl = url.replace(/^https?:\/\//, "");

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.09)",
        background: "#0D0F17",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4"
        style={{
          height: "42px",
          background: "#13151E",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Window dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
        </div>

        {/* Address bar */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center gap-2 px-3 rounded-md text-xs truncate transition-colors duration-150"
          style={{
            height: "26px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#5A5F6E",
            fontFamily: "var(--font-mono)",
            textDecoration: "none",
          }}
          title={`Open ${url} in new tab`}
        >
          {/* Lock icon */}
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
            <rect x="2" y="5" width="8" height="6" rx="1" fill="currentColor" />
            <path d="M4 5V3.5a2 2 0 1 1 4 0V5" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
          <span className="truncate">{displayUrl}</span>
        </a>

        {/* Open external */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded transition-colors duration-150"
          style={{ color: "#4D5260" }}
          title="Open in new tab"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M10 2h4v4M14 2 8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* iframe */}
      <iframe
        src={url}
        style={{ width: "100%", height: `${height}px`, border: "none", display: "block" }}
        title="Embedded site"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
