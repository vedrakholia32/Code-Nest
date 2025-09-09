"use client";

import { useState } from "react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { Minus, Plus, Type } from "lucide-react";

export default function FontSizeControl() {
  const { fontSize, setFontSize } = useCodeEditorStore();
  const [showSlider, setShowSlider] = useState(false);

  const handleDecrease = () => {
    if (fontSize > 10) {
      setFontSize(fontSize - 1);
    }
  };

  const handleIncrease = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 1);
    }
  };

  const handleSliderChange = (value: number) => {
    setFontSize(value);
  };

  return (
    <div className="relative flex items-center gap-1">
      {/* Font Size Display Button */}
      <button
        onClick={() => setShowSlider(!showSlider)}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-[#262637] hover:bg-[#2a2a3a] text-gray-300 rounded border border-[#313244] transition-colors"
        title="Font Size"
      >
        <Type size={12} />
        <span className="font-mono">{fontSize}</span>
      </button>

      {/* Quick Decrease Button */}
      <button
        onClick={handleDecrease}
        disabled={fontSize <= 10}
        className="p-1 text-gray-400 hover:text-white hover:bg-[#2a2a3a] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Decrease font size"
      >
        <Minus size={14} />
      </button>

      {/* Quick Increase Button */}
      <button
        onClick={handleIncrease}
        disabled={fontSize >= 24}
        className="p-1 text-gray-400 hover:text-white hover:bg-[#2a2a3a] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Increase font size"
      >
        <Plus size={14} />
      </button>

      {/* Font Size Slider Popup */}
      {showSlider && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowSlider(false)}
          />
          
          {/* Slider Popup */}
          <div className="absolute top-full left-0 mt-2 bg-[#1e1e2e] border border-[#313244] rounded-lg p-3 z-50 shadow-xl">
            <div className="flex flex-col gap-2 w-32">
              <div className="flex justify-between text-xs text-gray-400">
                <span>10</span>
                <span className="font-medium text-white">{fontSize}px</span>
                <span>24</span>
              </div>
              
              <input
                type="range"
                min={10}
                max={24}
                value={fontSize}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="w-full h-2 bg-[#313244] rounded-lg appearance-none cursor-pointer slider"
              />
              
              <div className="flex justify-between gap-1">
                <button
                  onClick={() => handleSliderChange(12)}
                  className="px-2 py-1 text-xs bg-[#262637] hover:bg-[#7c3aed] text-gray-300 hover:text-white rounded transition-colors"
                >
                  12
                </button>
                <button
                  onClick={() => handleSliderChange(14)}
                  className="px-2 py-1 text-xs bg-[#262637] hover:bg-[#7c3aed] text-gray-300 hover:text-white rounded transition-colors"
                >
                  14
                </button>
                <button
                  onClick={() => handleSliderChange(16)}
                  className="px-2 py-1 text-xs bg-[#262637] hover:bg-[#7c3aed] text-gray-300 hover:text-white rounded transition-colors"
                >
                  16
                </button>
                <button
                  onClick={() => handleSliderChange(18)}
                  className="px-2 py-1 text-xs bg-[#262637] hover:bg-[#7c3aed] text-gray-300 hover:text-white rounded transition-colors"
                >
                  18
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
