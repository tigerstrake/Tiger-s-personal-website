"use client";

import { useTilt } from "@/hooks/useTilt";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}

export default function TiltCard({ children, className, style, intensity }: TiltCardProps) {
  const { onMouseMove, onMouseLeave } = useTilt(intensity);
  return (
    <div
      className={className}
      style={{ ...style, cursor: "pointer" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
