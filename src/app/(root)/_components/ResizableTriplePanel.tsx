"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ResizableTriplePanelProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialLeftRatio?: number;
  initialRightRatio?: number;
  minLeftWidth?: number;
  minCenterWidth?: number;
  minRightWidth?: number;
}

export default function ResizableTriplePanel({
  leftPanel,
  centerPanel,
  rightPanel,
  initialLeftRatio = 0.25,
  initialRightRatio = 0.25,
  minLeftWidth = 15,
  minCenterWidth = 40,
  minRightWidth = 20,
}: ResizableTriplePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [leftRatio, setLeftRatio] = useState(initialLeftRatio);
  const [rightRatio, setRightRatio] = useState(initialRightRatio);

  // Calculate center ratio
  const centerRatio = 1 - leftRatio - rightRatio;

  const handleLeftMouseDown = useCallback(() => {
    setIsDraggingLeft(true);
  }, []);

  const handleRightMouseDown = useCallback(() => {
    setIsDraggingRight(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      const mouseRatio = mouseX / containerWidth;

      if (isDraggingLeft) {
        // Dragging left divider
        const maxLeftRatio = 1 - rightRatio - minCenterWidth / 100;
        const newLeftRatio = Math.min(
          Math.max(mouseRatio, minLeftWidth / 100),
          maxLeftRatio
        );
        setLeftRatio(newLeftRatio);
      } else if (isDraggingRight) {
        // Dragging right divider
        const minRightPosition = leftRatio + minCenterWidth / 100;
        const newRightRatio = Math.min(
          Math.max(1 - mouseRatio, minRightWidth / 100),
          1 - minRightPosition
        );
        setRightRatio(newRightRatio);
      }
    },
    [isDraggingLeft, isDraggingRight, leftRatio, rightRatio, minLeftWidth, minCenterWidth, minRightWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  }, []);

  useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      {/* Left Panel */}
      <div 
        className="h-full overflow-hidden"
        style={{ width: `${leftRatio * 100}%` }}
      >
        {leftPanel}
      </div>

      {/* Left Divider */}
      <div
        className="w-1 bg-[#313244] hover:bg-[#7c3aed] cursor-col-resize flex-shrink-0 transition-colors duration-200 group"
        onMouseDown={handleLeftMouseDown}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-0.5 h-8 bg-gray-600 group-hover:bg-[#7c3aed] transition-colors duration-200"></div>
        </div>
      </div>

      {/* Center Panel */}
      <div 
        className="h-full overflow-hidden"
        style={{ width: `${centerRatio * 100}%` }}
      >
        {centerPanel}
      </div>

      {/* Right Divider */}
      <div
        className="w-1 bg-[#313244] hover:bg-[#7c3aed] cursor-col-resize flex-shrink-0 transition-colors duration-200 group"
        onMouseDown={handleRightMouseDown}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-0.5 h-8 bg-gray-600 group-hover:bg-[#7c3aed] transition-colors duration-200"></div>
        </div>
      </div>

      {/* Right Panel */}
      <div 
        className="h-full overflow-hidden"
        style={{ width: `${rightRatio * 100}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
}
