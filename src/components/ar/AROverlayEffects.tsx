import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AROverlayEffectsProps {
  isActive: boolean;
  faceDetected: boolean;
  selectedStyle?: string;
  confidence?: number;
}

export const AROverlayEffects = ({ 
  isActive, 
  faceDetected, 
  selectedStyle, 
  confidence = 0 
}: AROverlayEffectsProps) => {
  const [scanningProgress, setScanningProgress] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (isActive && faceDetected) {
      const interval = setInterval(() => {
        setScanningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setShowAnalysis(true);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setScanningProgress(0);
      setShowAnalysis(false);
    }
  }, [isActive, faceDetected]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Scanning Grid */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path 
                d="M 20 0 L 0 0 0 20" 
                fill="none" 
                stroke="rgba(34, 197, 94, 0.3)" 
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Face Detection Frame */}
      <AnimatePresence>
        {faceDetected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-64 h-72"
          >
            {/* Main detection frame */}
            <div className="relative w-full h-full border-2 border-green-400/60 rounded-lg">
              {/* Corner indicators */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>

              {/* Scanning line */}
              <motion.div
                className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                animate={{
                  top: ['0%', '100%', '0%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />

              {/* Face analysis points */}
              <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-green-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-green-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
            </div>

            {/* Confidence indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 rounded px-3 py-1 border border-green-500/30"
            >
              <span className="text-green-400 font-mono text-xs">
                CONFIDENCE: {Math.round(confidence)}%
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning Progress */}
      <AnimatePresence>
        {scanningProgress > 0 && scanningProgress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-green-500/30 min-w-64"
          >
            <div className="text-center">
              <p className="text-green-400 font-mono text-sm mb-2">
                [FACIAL_ANALYSIS_IN_PROGRESS]
              </p>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${scanningProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-green-300/70 text-xs">
                Analyzing face shape and features...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Complete */}
      <AnimatePresence>
        {showAnalysis && selectedStyle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-green-500/30 max-w-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-sm">
                  [ANALYSIS_COMPLETE]
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-300/70 text-xs">Face Shape:</span>
                  <span className="text-green-400 text-xs font-mono">OVAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300/70 text-xs">Hair Type:</span>
                  <span className="text-green-400 text-xs font-mono">STRAIGHT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300/70 text-xs">Style Match:</span>
                  <span className="text-green-400 text-xs font-mono">95%</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-green-500/20">
                <p className="text-green-400 font-mono text-xs">
                  ACTIVE STYLE: {selectedStyle}
                </p>
                <p className="text-green-300/50 text-xs mt-1">
                  Perfect match for your face shape!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style Overlay Indicator */}
      <AnimatePresence>
        {selectedStyle && showAnalysis && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-400 font-mono text-sm">
                [AR_OVERLAY_ACTIVE]
              </span>
            </div>
            <p className="text-purple-300/70 text-xs mt-1">
              {selectedStyle} preview enabled
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hints */}
      <AnimatePresence>
        {isActive && !faceDetected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30"
          >
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-8 h-8 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <p className="text-yellow-400 font-mono text-sm">
                [POSITION_YOUR_FACE]
              </p>
              <p className="text-yellow-300/70 text-xs mt-1">
                Center your face in the frame for AR preview
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};