
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  CheckCircle, 
  Star, 
  Instagram, 
  DollarSign, 
  Clock,
  Lightbulb,
  Target
} from "lucide-react";

interface Suggestion {
  id: string;
  suggestion_type: string;
  title: string;
  description: string;
  completed: boolean;
  priority: number;
}

interface ClientSuggestionsProps {
  barberId: string;
}

export const ClientSuggestions = ({ barberId }: ClientSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const suggestionIcons = {
    profile_optimization: Star,
    social_media: Instagram,
    pricing_strategy: DollarSign,
    availability: Clock,
  };

  const priorityColors = {
    1: "text-red-400 border-red-500/30",
    2: "text-yellow-400 border-yellow-500/30",
    3: "text-green-400 border-green-500/30",
  };

  useEffect(() => {
    fetchSuggestions();
  }, [barberId]);

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('barber_suggestions')
        .select('*')
        .eq('barber_id', barberId)
        .order('priority', { ascending: true });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to load suggestions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (suggestionId: string) => {
    try {
      const { error } = await supabase
        .from('barber_suggestions')
        .update({ completed: true })
        .eq('id', suggestionId);

      if (error) throw error;

      setSuggestions(prev => 
        prev.map(s => s.id === suggestionId ? { ...s, completed: true } : s)
      );

      toast({
        title: "Great job!",
        description: "Suggestion marked as completed",
      });
    } catch (error: any) {
      console.error('Error updating suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to update suggestion",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-black border-green-500/30">
        <CardContent className="p-6 text-center text-green-400">
          Loading suggestions...
        </CardContent>
      </Card>
    );
  }

  const completedCount = suggestions.filter(s => s.completed).length;
  const totalCount = suggestions.length;

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Client Acquisition Suggestions
          <Badge variant="outline" className="ml-auto border-green-500/30">
            {completedCount}/{totalCount} completed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center text-green-300/60 py-8">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No suggestions available at the moment.</p>
          </div>
        ) : (
          suggestions.map((suggestion) => {
            const IconComponent = suggestionIcons[suggestion.suggestion_type as keyof typeof suggestionIcons] || TrendingUp;
            const priorityClass = priorityColors[suggestion.priority as keyof typeof priorityColors] || "text-green-400 border-green-500/30";

            return (
              <div
                key={suggestion.id}
                className={`border rounded-lg p-4 ${priorityClass} ${
                  suggestion.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-400">
                        {suggestion.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${priorityClass}`}
                        >
                          Priority {suggestion.priority}
                        </Badge>
                        {suggestion.completed && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-green-300/80 text-sm mb-3">
                      {suggestion.description}
                    </p>
                    {!suggestion.completed && (
                      <Button
                        size="sm"
                        onClick={() => markCompleted(suggestion.id)}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      >
                        Mark as Done
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
