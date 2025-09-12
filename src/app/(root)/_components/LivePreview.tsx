"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  RotateCcw, 
  ExternalLink, 
  Maximize2, 
  Minimize2,
  Wifi,
  WifiOff,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";

interface LivePreviewProps {
  url: string;
  isLoading?: boolean;
  onUrlChange?: (url: string) => void;
  className?: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile' | 'custom';

interface ViewportConfig {
  width: number;
  height: number;
  label: string;
  icon: any;
}

const VIEWPORT_CONFIGS: Record<ViewportSize, ViewportConfig> = {
  desktop: {
    width: 1920,
    height: 1080,
    label: 'Desktop',
    icon: Monitor
  },
  tablet: {
    width: 768,
    height: 1024,
    label: 'Tablet',
    icon: Tablet
  },
  mobile: {
    width: 375,
    height: 667,
    label: 'Mobile',
    icon: Smartphone
  },
  custom: {
    width: 1200,
    height: 800,
    label: 'Custom',
    icon: Settings
  }
};

export default function LivePreview({ 
  url, 
  isLoading = false, 
  onUrlChange,
  className = "" 
}: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDevTools, setShowDevTools] = useState(false);
  const [customSize, setCustomSize] = useState({ width: 1200, height: 800 });
  const [isVisible, setIsVisible] = useState(true);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if preview URL is accessible
  useEffect(() => {
    if (!url) {
      setIsConnected(false);
      return;
    }

    const checkConnection = async () => {
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    
    return () => clearInterval(interval);
  }, [url]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsConnected(true);
  };

  // Handle iframe error
  const handleIframeError = () => {
    setIsConnected(false);
  };

  // Refresh preview
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Get current viewport config
  const currentViewport = viewport === 'custom' 
    ? { ...VIEWPORT_CONFIGS.custom, ...customSize }
    : VIEWPORT_CONFIGS[viewport];

  // Calculate scale to fit container
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const availableWidth = containerRect.width - 40; // padding
      const availableHeight = containerRect.height - 120; // toolbar height

      const scaleX = availableWidth / currentViewport.width;
      const scaleY = availableHeight / currentViewport.height;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(newScale);
      setContainerSize({ 
        width: containerRect.width, 
        height: containerRect.height 
      });
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    
    return () => window.removeEventListener('resize', updateScale);
  }, [currentViewport, isFullscreen]);

  if (!url && !isLoading) {
    return (
      <div className={`flex items-center justify-center h-full bg-surface rounded-lg border border-border ${className}`}>
        <div className="text-center">
          <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-weight-semibold text-primary mb-2">No Preview Available</h3>
          <p className="text-secondary">Start a development server to see your app preview</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-surface rounded-lg border border-border overflow-hidden ${className}`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface-hover">
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-xs font-weight-medium ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* URL Display */}
          <div className="flex items-center gap-2 px-3 py-1 bg-surface rounded border border-border">
            <span className="text-xs text-secondary">{url || 'No URL'}</span>
            {url && (
              <button
                onClick={() => window.open(url, '_blank')}
                className="text-purple-500 hover:text-purple-600 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Selector */}
          <div className="flex items-center gap-1 bg-surface rounded border border-border">
            {Object.entries(VIEWPORT_CONFIGS).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = viewport === key;
              
              return (
                <button
                  key={key}
                  onClick={() => setViewport(key as ViewportSize)}
                  className={`p-2 rounded transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-secondary hover:text-primary hover:bg-surface-hover'
                  }`}
                  title={config.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="p-2 text-secondary hover:text-primary hover:bg-surface-hover rounded transition-colors"
              title={isVisible ? "Hide preview" : "Show preview"}
            >
              {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleRefresh}
              className="p-2 text-secondary hover:text-primary hover:bg-surface-hover rounded transition-colors"
              title="Refresh"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 text-secondary hover:text-primary hover:bg-surface-hover rounded transition-colors"
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Size Controls */}
      {viewport === 'custom' && (
        <div className="flex items-center gap-4 px-3 py-2 bg-surface-hover border-b border-border">
          <div className="flex items-center gap-2">
            <label className="text-xs text-secondary">Width:</label>
            <input
              type="number"
              value={customSize.width}
              onChange={(e) => setCustomSize(prev => ({ ...prev, width: parseInt(e.target.value) || 1200 }))}
              className="w-16 px-2 py-1 text-xs bg-surface border border-border rounded"
              min="300"
              max="3000"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-secondary">Height:</label>
            <input
              type="number"
              value={customSize.height}
              onChange={(e) => setCustomSize(prev => ({ ...prev, height: parseInt(e.target.value) || 800 }))}
              className="w-16 px-2 py-1 text-xs bg-surface border border-border rounded"
              min="300"
              max="2000"
            />
          </div>
          <div className="text-xs text-secondary">
            Scale: {Math.round(scale * 100)}%
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-5 bg-gray-100 dark:bg-gray-900">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-secondary">Loading preview...</p>
            </motion.div>
          ) : url && isVisible ? (
            <motion.div
              key={`preview-${refreshKey}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden"
              style={{
                width: currentViewport.width * scale,
                height: currentViewport.height * scale,
                transform: `scale(${scale})`,
                transformOrigin: 'center'
              }}
            >
              {/* Device Frame for Mobile/Tablet */}
              {(viewport === 'mobile' || viewport === 'tablet') && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full"></div>
                  {viewport === 'mobile' && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              )}

              {/* Iframe */}
              <iframe
                ref={iframeRef}
                src={url}
                key={refreshKey}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                loading="lazy"
                title="Live Preview"
              />

              {/* Overlay for disconnected state */}
              {!isConnected && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <WifiOff className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Connection lost</p>
                    <button
                      onClick={handleRefresh}
                      className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <EyeOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-secondary">Preview hidden</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-hover border-t border-border text-xs text-secondary">
        <div className="flex items-center gap-4">
          <span>{currentViewport.label}</span>
          <span>{currentViewport.width} × {currentViewport.height}</span>
          {scale < 1 && <span>Scale: {Math.round(scale * 100)}%</span>}
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
