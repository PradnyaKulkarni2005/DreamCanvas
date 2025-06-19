"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VantaDotsBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadVanta = async () => {
      if (!mounted || !vantaRef.current) return;

      (window as any).THREE = THREE;
      const VANTA = await import("vanta/src/vanta.dots");

      // Destroy if already running
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
      }

      vantaEffectRef.current = VANTA.default({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        spacing: 30.0,
        showLines: false,
        color: 0xb5eceb,
        color2: 0x9dcfef,
        backgroundColor: 0x151414,
      });
    };

    loadVanta();

    return () => {
      mounted = false;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="w-full h-screen"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
};

export default VantaDotsBackground;
