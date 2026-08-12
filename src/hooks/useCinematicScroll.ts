import { useEffect, useRef } from "react";

export interface CinematicLayer {
  name: string;
  yStart?: number;
  yEnd?: number;
  scaleStart?: number;
  scaleEnd?: number;
  opacityStart?: number;
  opacityEnd?: number;
}

export interface UseCinematicScrollOptions {
  layers?: CinematicLayer[];
  mouseParallax?: boolean;
  lerp?: number;
  disabled?: boolean;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function useCinematicScroll(options: UseCinematicScrollOptions = {}) {
  const {
    layers = [],
    mouseParallax = true,
    lerp: lerpFactor = 0.08,
    disabled = false,
  } = options;

  const stateRef = useRef({
    scroll: 0,
    targetScroll: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    rafId: 0,
    reducedMotion: false,
  });

  useEffect(() => {
    if (disabled) return;

    const state = stateRef.current;
    const root = document.documentElement;
    state.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reset scroll on mount to avoid the "new page loads at bottom" bug.
    window.scrollTo(0, 0);
    state.scroll = 0;
    state.targetScroll = 0;

    const docHeight = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = () => {
      const h = docHeight();
      return h > 0 ? window.scrollY / h : 0;
    };

    const handleScroll = () => {
      state.targetScroll = progress();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseParallax) return;
      // Normalized -1 to 1
      state.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      state.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const updateCssVars = () => {
      root.style.setProperty("--cinema-progress", String(state.scroll));
      root.style.setProperty("--cinema-mouse-x", String(state.mouseX));
      root.style.setProperty("--cinema-mouse-y", String(state.mouseY));

      layers.forEach((layer) => {
        const p = state.scroll;
        const yStart = layer.yStart ?? 0;
        const yEnd = layer.yEnd ?? 0;
        const y = yStart + (yEnd - yStart) * p;

        const scaleStart = layer.scaleStart ?? 1;
        const scaleEnd = layer.scaleEnd ?? 1;
        const scale = scaleStart + (scaleEnd - scaleStart) * p;

        const opacityStart = layer.opacityStart ?? 1;
        const opacityEnd = layer.opacityEnd ?? 1;
        const opacity = opacityStart + (opacityEnd - opacityStart) * p;

        root.style.setProperty(`--${layer.name}-y`, `${y}px`);
        root.style.setProperty(`--${layer.name}-scale`, String(scale));
        root.style.setProperty(`--${layer.name}-opacity`, String(opacity));
      });
    };

    const tick = () => {
      if (state.reducedMotion) {
        state.scroll = state.targetScroll;
        state.mouseX = state.targetMouseX;
        state.mouseY = state.targetMouseY;
      } else {
        state.scroll = lerp(state.scroll, state.targetScroll, lerpFactor);
        state.mouseX = lerp(state.mouseX, state.targetMouseX, lerpFactor);
        state.mouseY = lerp(state.mouseY, state.targetMouseY, lerpFactor);
      }

      updateCssVars();
      state.rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll();
    state.rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(state.rafId);

      // Clean up CSS variables
      root.style.removeProperty("--cinema-progress");
      root.style.removeProperty("--cinema-mouse-x");
      root.style.removeProperty("--cinema-mouse-y");
      layers.forEach((layer) => {
        root.style.removeProperty(`--${layer.name}-y`);
        root.style.removeProperty(`--${layer.name}-scale`);
        root.style.removeProperty(`--${layer.name}-opacity`);
      });
    };
  }, [disabled, layers, lerpFactor, mouseParallax]);
}
