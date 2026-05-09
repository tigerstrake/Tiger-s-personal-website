import { MouseEvent } from "react";

export function useTilt(maxDeg = 6) {
  function onMouseMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transition = "transform 0.08s ease-out";
    el.style.transform = `perspective(900px) rotateX(${(-y * maxDeg).toFixed(2)}deg) rotateY(${(x * maxDeg * 1.4).toFixed(2)}deg) scale(1.018)`;
  }

  function onMouseLeave(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    el.style.transition = "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transform = "";
  }

  return { onMouseMove, onMouseLeave };
}
