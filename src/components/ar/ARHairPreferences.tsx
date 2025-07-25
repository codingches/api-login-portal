import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Calendar, Sun, Cloud, Zap } from 'lucide-react';

interface ARHairPreferencesProps {
  onSave: (preferences: UserPreferences) => void;
  onSkip: () => void;
  initialPreferences?: UserPreferences;
}

interface UserPreferences {
  faceShape: string;
  hairType: string;
  lifestyle: string[];
  occasions: string[];
  maintenance: string;
  personality: string[];
}

const FACE_SHAPES = [
  { id: 'oval', label: 'Oval', description: 'Balanced proportions' },
  { id: 'round', label: 'Round', description: 'Soft, curved features' },
  { id: 'square', label: 'Square', description: 'Strong jawline' },
  { id: 'heart', label: 'Heart', description: 'Wide forehead, narrow chin' },
  { id: 'diamond', label: 'Diamond', description: 'Wide cheekbones' },
  { id: 'oblong', label: 'Oblong', description: 'Longer face shape' },
];

const HAIR_TYPES = [
  { id: 'straight', label: 'Straight', description: 'Naturally straight hair' },
  { id: 'wavy', label: 'Wavy', description: 'Natural waves and texture' },
  { id: 'curly', label: 'Curly', description: 'Defined curls' },
  { id: 'coily', label: 'Coily', description: 'Tight coils and kinks' },
  { id: 'fine', label: 'Fine', description: 'Thin, delicate strands' },
  { id: 'thick', label: 'Thick', description: 'Dense, voluminous hair' },
];

const LIFESTYLE_OPTIONS = [
  { id: 'professional', label: 'Professional', icon: User },
  { id: 'active', label: 'Active/Sports', icon: Zap },
  { id: 'creative', label: 'Creative', icon: User },
  { id: 'social', label: 'Social', icon: User },
  { id: 'casual', label: 'Casual', icon: User },
];

const OCCASION_OPTIONS = [
  { id: 'work', label: 'Work/Business' },
  { id: 'special', label: 'Special Events' },
  { id: 'casual', label: 'Daily Casual' },
  { id: 'date', label: 'Date Nights' },
  { id: 'formal', label: 'Formal Events' },
];

const MAINTENANCE_LEVELS = [
  { id: 'low', label: 'Low Maintenance', description: 'Minimal daily styling' },
  { id: 'medium', label: 'Medium Maintenance', description: 'Some daily styling' },
  { id: 'high', label: 'High Maintenance', description: 'Detailed daily styling' },
];

export const ARHairPreferences = ({ onSave, onSkip, initialPreferences }: ARHairPreferencesProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || {
      faceShape: '',
      hairType: '',
      lifestyle: [],
      occasions: [],
      maintenance: '',
      personality: [],
    }
  );

  const handleSave = () => {
    onSave(preferences);
  };

  const updateLifestyle = (lifestyleId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      lifestyle: checked 
        ? [...prev.lifestyle, lifestyleId]
        : prev.lifestyle.filter(id => id !== lifestyleId)
    }));
  };

  const updateOccasions = (occasionId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      occasions: checked 
        ? [...prev.occasions, occasionId]
        : prev.occasions.filter(id => id !== occasionId)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-mono text-green-400 mb-2">
          [PERSONALIZATION_SETUP]
        </h2>
        <p className="text-green-300/70 text-sm">
          Help us recommend the perfect hairstyles for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Face Shape */}
        <Card className="bg-black/80 border-green-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 font-mono text-sm">
              FACE_SHAPE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={preferences.faceShape}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, faceShape: value }))}
            >
              {FACE_SHAPES.map((shape) => (
                <div key={shape.id} className="flex items-center space-x-2 p-2 rounded border border-green-500/20 hover:border-green-500/40">
                  <RadioGroupItem value={shape.id} id={shape.id} />
                  <div className="flex-1">
                    <Label htmlFor={shape.id} className="text-green-400 font-mono cursor-pointer">
                      {shape.label}
                    </Label>
                    <p className="text-green-300/50 text-xs">{shape.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Hair Type */}
        <Card className="bg-black/80 border-green-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 font-mono text-sm">
              HAIR_TYPE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={preferences.hairType}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, hairType: value }))}
            >
              {HAIR_TYPES.map((type) => (
                <div key={type.id} className="flex items-center space-x-2 p-2 rounded border border-green-500/20 hover:border-green-500/40">
                  <RadioGroupItem value={type.id} id={type.id} />
                  <div className="flex-1">
                    <Label htmlFor={type.id} className="text-green-400 font-mono cursor-pointer">
                      {type.label}
                    </Label>
                    <p className="text-green-300/50 text-xs">{type.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Lifestyle */}
        <Card className="bg-black/80 border-green-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 font-mono text-sm">
              LIFESTYLE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {LIFESTYLE_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={preferences.lifestyle.includes(option.id)}
                    onCheckedChange={(checked) => updateLifestyle(option.id, checked as boolean)}
                  />
                  <Label htmlFor={option.id} className="text-green-400 font-mono cursor-pointer flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Occasions */}
        <Card className="bg-black/80 border-green-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 font-mono text-sm">
              OCCASIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {OCCASION_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={preferences.occasions.includes(option.id)}
                    onCheckedChange={(checked) => updateOccasions(option.id, checked as boolean)}
                  />
                  <Label htmlFor={option.id} className="text-green-400 font-mono cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Level */}
      <Card className="bg-black/80 border-green-500/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 font-mono text-sm">
            MAINTENANCE_LEVEL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.maintenance}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, maintenance: value }))}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MAINTENANCE_LEVELS.map((level) => (
                <div key={level.id} className="flex items-start space-x-2 p-3 rounded border border-green-500/20 hover:border-green-500/40">
                  <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={level.id} className="text-green-400 font-mono cursor-pointer">
                      {level.label}
                    </Label>
                    <p className="text-green-300/50 text-xs mt-1">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onSkip}
          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
        >
          SKIP FOR NOW
        </Button>
        
        <Button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-black font-mono"
          disabled={!preferences.faceShape || !preferences.hairType}
        >
          SAVE PREFERENCES
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="text-center">
        <div className="flex justify-center space-x-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === 0 ? 'bg-green-500' : 'bg-green-500/30'
              }`}
            />
          ))}
        </div>
        <p className="text-green-300/50 text-xs font-mono">
          STEP 1/5 - PERSONALIZATION SETUP
        </p>
      </div>
    </motion.div>
  );
};