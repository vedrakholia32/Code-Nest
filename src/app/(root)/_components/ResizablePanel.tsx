"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialRatio?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
}

export default function ResizablePanel({
  leftPanel,
  rightPanel,
  initialRatio = 0.5, // 50-50 split by default
  minLeftWidth = 40,
  minRightWidth = 40,
}: ResizablePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [ratio, setRatio] = useState(initialRatio);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      // Calculate new ratio while respecting min widths
      const newRatio = Math.min(
        Math.max(mouseX / containerWidth, minLeftWidth / 100),
        1 - minRightWidth / 100
      );

      setRatio(newRatio);
    },
    [isDragging, minLeftWidth, minRightWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full h-full select-none"
      style={{
        cursor: isDragging ? "col-resize" : "auto",
      }}
    >
      <div className="overflow-hidden" style={{ width: `${ratio * 100}%` }}>{leftPanel}</div>
      <div
        className="absolute h-full cursor-col-resize transition-colors flex items-center justify-center hover:bg-blue-500/20"
        style={{
          left: `calc(${ratio * 100}% - 3px)`,
          width: '10px',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className={`h-full w-[3px] ${isDragging ? 'bg-blue-400' : 'bg-[#1e1e2e]'} shadow-[0_0_10px_rgba(0,0,0,0.5)] rounded-full transition-colors`} />
      </div>
      <div className="overflow-hidden" style={{ width: `${(1 - ratio) * 100}%` }}>{rightPanel}</div>
    </div>
  );
}
