import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  RotateCcw, 
  Download, 
  Share2, 
  Heart, 
  Calendar, 
  Sparkles,
  X,
  Play,
  Pause
} from 'lucide-react';

interface Hairstyle {
  id: string;
  name: string;
  category: 'fade' | 'buzz' | 'long' | 'curly' | 'modern';
  imageUrl: string;
  description: string;
  popularity: number;
}

const HAIRSTYLES: Hairstyle[] = [
  {
    id: 'fade-classic',
    name: 'Classic Fade',
    category: 'fade',
    imageUrl: '/placeholder.svg',
    description: 'Timeless fade that works for any occasion',
    popularity: 95
  },
  {
    id: 'buzz-military',
    name: 'Military Buzz',
    category: 'buzz',
    imageUrl: '/placeholder.svg',
    description: 'Clean, sharp, professional look',
    popularity: 88
  },
  {
    id: 'modern-quiff',
    name: 'Modern Quiff',
    category: 'modern',
    imageUrl: '/placeholder.svg',
    description: 'Trendy style with volume and texture',
    popularity: 92
  },
  {
    id: 'long-flow',
    name: 'Long Flow',
    category: 'long',
    imageUrl: '/placeholder.svg',
    description: 'Natural flowing style with layers',
    popularity: 76
  },
  {
    id: 'curly-top',
    name: 'Curly Top Fade',
    category: 'curly',
    imageUrl: '/placeholder.svg',
    description: 'Perfect for natural texture',
    popularity: 84
  }
];

interface ARHairTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  onBookWithStyle?: (styleId: string) => void;
}

export const ARHairTryOn = ({ isOpen, onClose, onBookWithStyle }: ARHairTryOnProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Hairstyle | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
      toast({
        title: "[CAMERA_ACTIVE]",
        description: "AR Hair Try-On is ready!",
      });
    } catch (error) {
      toast({
        title: "[CAMERA_ERROR]",
        description: "Unable to access camera. Please allow camera permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame
      ctx.drawImage(video, 0, 0);
      
      // Add hairstyle overlay (simplified for demo)
      if (selectedStyle) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '20px Arial';
        ctx.fillText(`${selectedStyle.name} Preview`, 20, 40);
      }
      
      // Convert to blob and trigger download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `hair-tryOn-${selectedStyle?.name || 'preview'}.png`;
          a.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "[PHOTO_SAVED]",
            description: "Your AR preview has been saved!",
          });
        }
      });
    }
  };

  // Toggle favorite
  const toggleFavorite = (styleId: string) => {
    setFavorites(prev => 
      prev.includes(styleId) 
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  // Book appointment with selected style
  const handleBookAppointment = () => {
    if (selectedStyle && onBookWithStyle) {
      onBookWithStyle(selectedStyle.id);
      toast({
        title: "[BOOKING_INITIATED]",
        description: `Booking with ${selectedStyle.name} style preference`,
      });
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share && selectedStyle) {
      try {
        await navigator.share({
          title: `Check out this ${selectedStyle.name} hairstyle!`,
          text: `I'm trying on the ${selectedStyle.name} using AR!`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "[LINK_COPIED]",
          description: "Share link copied to clipboard!",
        });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-6xl h-full max-h-[90vh] grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* AR Camera View */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-black/80 border-green-500/50">
              <CardHeader className="border-b border-green-500/30 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-green-400 animate-pulse" />
                    <CardTitle className="text-green-400 font-mono">
                      [AR_HAIR_TRYEON]
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-green-400 hover:text-green-300"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 h-full">
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-900">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      
                      {/* AR Overlay Effects */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Face detection frame */}
                        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-48 h-56 border-2 border-green-400/50 rounded-lg">
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
                        </div>
                        
                        {/* Selected style overlay */}
                        {selectedStyle && (
                          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
                            <p className="text-green-400 font-mono text-sm">
                              STYLE: {selectedStyle.name}
                            </p>
                            <p className="text-green-300/70 text-xs">
                              {selectedStyle.description}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Camera Controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                        <Button
                          onClick={capturePhoto}
                          className="bg-green-500 hover:bg-green-600 text-black font-mono"
                          disabled={!selectedStyle}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          CAPTURE
                        </Button>
                        
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          SHARE
                        </Button>
                        
                        {selectedStyle && (
                          <Button
                            onClick={handleBookAppointment}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-mono"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            BOOK NOW
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-green-400 mx-auto mb-4" />
                        <p className="text-green-400 font-mono mb-4">
                          [INITIALIZING_CAMERA...]
                        </p>
                        <Button onClick={startCamera} className="bg-green-500 hover:bg-green-600 text-black font-mono">
                          ACTIVATE CAMERA
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Hairstyle Selection Panel */}
          <div className="flex flex-col gap-4">
            <Card className="bg-black/80 border-green-500/50">
              <CardHeader className="border-b border-green-500/30 pb-4">
                <CardTitle className="text-green-400 font-mono text-lg">
                  [HAIRSTYLE_LIBRARY]
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {HAIRSTYLES.map((style) => (
                    <motion.div
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStyle(style)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedStyle?.id === style.id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-green-500/30 hover:border-green-500/50 hover:bg-green-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-green-400 font-mono text-sm font-semibold">
                          {style.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(style.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              favorites.includes(style.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-green-400'
                            }`} 
                          />
                        </Button>
                      </div>
                      
                      <p className="text-green-300/70 text-xs mb-2">
                        {style.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-green-500/50 text-green-400">
                          {style.category.toUpperCase()}
                        </Badge>
                        <span className="text-green-300/50 text-xs font-mono">
                          {style.popularity}% MATCH
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card className="bg-black/80 border-green-500/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                    onClick={() => setSelectedStyle(null)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    RESET
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                    onClick={() => {
                      toast({
                        title: "[FAVORITES_SAVED]",
                        description: `${favorites.length} styles in your favorites`,
                      });
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    FAVORITES
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </AnimatePresence>
  );
};