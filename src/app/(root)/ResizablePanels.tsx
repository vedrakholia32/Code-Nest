
"use client";
import React, { useState, useRef, useEffect, ReactNode, MouseEvent } from "react";

interface ResizablePanelsProps {
  left: ReactNode;
  right: ReactNode;
}

export default function ResizablePanels({ left, right }: ResizablePanelsProps) {
  const [ratio, setRatio] = useState(0.7); // Default 70% editor, 30% output
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "";
  };

  const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ("clientX" in e ? e.clientX : 0) - rect.left;
    let newRatio = x / rect.width;
    newRatio = Math.max(0.2, Math.min(0.8, newRatio)); // Clamp between 20% and 80%
    setRatio(newRatio);
  };

  useEffect(() => {
  const move: EventListener = (e) => handleMouseMove(e as unknown as MouseEvent);
    const up: EventListener = () => handleMouseUp();
    if (isDragging.current) {
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [isDragging.current]);

  return (
    <div ref={containerRef} className="flex w-full h-full relative select-none">
      <div style={{ width: `${ratio * 100}%` }} className="h-full">
        {left}
      </div>
      <div
        className="w-2 h-full bg-[#232334] cursor-col-resize z-10 hover:bg-blue-500 transition-colors"
        onMouseDown={handleMouseDown}
        style={{ position: "relative" }}
      />
      <div style={{ width: `${(1 - ratio) * 100}%` }} className="h-full">
        {right}
      </div>
    </div>
  );
}
