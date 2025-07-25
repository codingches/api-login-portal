import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface HairStyle {
  id: string;
  name: string;
  category: string;
  description: string;
  popularity: number;
}

interface ARSession {
  id: string;
  userId?: string;
  selectedStyles: string[];
  favorites: string[];
  capturedPhotos: string[];
  sessionStart: Date;
  lastActivity: Date;
}

export const useARHairTryOn = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<ARSession | null>(null);
  const [userPreferences, setUserPreferences] = useState<{
    faceShape?: string;
    hairType?: string;
    lifestyle?: string;
    preferredStyles?: string[];
  }>({});
  const { toast } = useToast();

  // Start AR session
  const startARSession = useCallback((userId?: string) => {
    const session: ARSession = {
      id: `ar_session_${Date.now()}`,
      userId,
      selectedStyles: [],
      favorites: [],
      capturedPhotos: [],
      sessionStart: new Date(),
      lastActivity: new Date(),
    };
    
    setCurrentSession(session);
    setIsARActive(true);
    
    // Store session in localStorage for persistence
    localStorage.setItem('arHairSession', JSON.stringify(session));
    
    toast({
      title: "[AR_SESSION_STARTED]",
      description: "Welcome to Virtual Hair Try-On!",
    });
    
    return session;
  }, [toast]);

  // End AR session
  const endARSession = useCallback(() => {
    if (currentSession) {
      // Save session data
      const finalSession = {
        ...currentSession,
        lastActivity: new Date(),
      };
      
      // You could save to Supabase here for user analytics
      console.log('AR Session ended:', finalSession);
      
      localStorage.removeItem('arHairSession');
    }
    
    setCurrentSession(null);
    setIsARActive(false);
    
    toast({
      title: "[AR_SESSION_ENDED]",
      description: "Thanks for trying Virtual Hair Try-On!",
    });
  }, [currentSession, toast]);

  // Save hairstyle to favorites
  const saveFavoriteStyle = useCallback((styleId: string) => {
    if (!currentSession) return;
    
    const updatedSession = {
      ...currentSession,
      favorites: [...currentSession.favorites, styleId],
      lastActivity: new Date(),
    };
    
    setCurrentSession(updatedSession);
    localStorage.setItem('arHairSession', JSON.stringify(updatedSession));
    
    toast({
      title: "[STYLE_FAVORITED]",
      description: "Hairstyle added to your favorites!",
    });
  }, [currentSession, toast]);

  // Capture and save photo
  const capturePhoto = useCallback((photoData: string, styleId?: string) => {
    if (!currentSession) return;
    
    const photoId = `photo_${Date.now()}`;
    const updatedSession = {
      ...currentSession,
      capturedPhotos: [...currentSession.capturedPhotos, photoId],
      selectedStyles: styleId ? [...currentSession.selectedStyles, styleId] : currentSession.selectedStyles,
      lastActivity: new Date(),
    };
    
    setCurrentSession(updatedSession);
    
    // Store photo data (in real app, you'd upload to storage)
    localStorage.setItem(`ar_photo_${photoId}`, photoData);
    localStorage.setItem('arHairSession', JSON.stringify(updatedSession));
    
    toast({
      title: "[PHOTO_CAPTURED]",
      description: "Your AR photo has been saved!",
    });
    
    return photoId;
  }, [currentSession, toast]);

  // Update user preferences for better recommendations
  const updatePreferences = useCallback((preferences: Partial<typeof userPreferences>) => {
    const updated = { ...userPreferences, ...preferences };
    setUserPreferences(updated);
    
    // Store in localStorage and eventually sync to user profile
    localStorage.setItem('arHairPreferences', JSON.stringify(updated));
    
    toast({
      title: "[PREFERENCES_UPDATED]",
      description: "Your style preferences have been saved!",
    });
  }, [userPreferences, toast]);

  // Get style recommendations based on preferences
  const getStyleRecommendations = useCallback((availableStyles: HairStyle[]) => {
    if (!userPreferences.faceShape && !userPreferences.hairType) {
      // Return popular styles if no preferences set
      return availableStyles.sort((a, b) => b.popularity - a.popularity).slice(0, 5);
    }
    
    // Simple recommendation logic (in real app, this would be AI-powered)
    const recommended = availableStyles.filter(style => {
      const matchesFaceShape = !userPreferences.faceShape || 
        style.category.includes(userPreferences.faceShape);
      const matchesHairType = !userPreferences.hairType || 
        style.description.toLowerCase().includes(userPreferences.hairType.toLowerCase());
      
      return matchesFaceShape || matchesHairType;
    });
    
    return recommended.sort((a, b) => b.popularity - a.popularity);
  }, [userPreferences]);

  // Check for existing session on mount
  const restoreSession = useCallback(() => {
    const stored = localStorage.getItem('arHairSession');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        setCurrentSession(session);
        
        // Check if session is still valid (within 24 hours)
        const sessionAge = Date.now() - new Date(session.sessionStart).getTime();
        if (sessionAge < 24 * 60 * 60 * 1000) {
          setIsARActive(true);
        } else {
          localStorage.removeItem('arHairSession');
        }
      } catch (error) {
        localStorage.removeItem('arHairSession');
      }
    }
    
    // Restore preferences
    const storedPrefs = localStorage.getItem('arHairPreferences');
    if (storedPrefs) {
      try {
        setUserPreferences(JSON.parse(storedPrefs));
      } catch (error) {
        localStorage.removeItem('arHairPreferences');
      }
    }
  }, []);

  return {
    // State
    isARActive,
    currentSession,
    userPreferences,
    
    // Actions
    startARSession,
    endARSession,
    saveFavoriteStyle,
    capturePhoto,
    updatePreferences,
    getStyleRecommendations,
    restoreSession,
  };
};