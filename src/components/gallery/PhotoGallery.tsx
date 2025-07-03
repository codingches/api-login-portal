
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  photo_url: string;
  caption: string | null;
  category: string | null;
  created_at: string;
}

interface PhotoGalleryProps {
  barberId: string;
  isOwner?: boolean;
}

export const PhotoGallery = ({ barberId, isOwner = false }: PhotoGalleryProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);

  const { data: photos, isLoading, refetch } = useQuery({
    queryKey: ['photo-gallery', barberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_gallery')
        .select('*')
        .eq('barber_id', barberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Photo[];
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isOwner) return;

    setIsUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${barberId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('photo_gallery')
        .insert({
          barber_id: barberId,
          photo_url: publicUrl,
          category: 'general'
        });

      if (dbError) throw dbError;

      toast({
        title: "Photo uploaded!",
        description: "Your photo has been added to the gallery.",
      });

      refetch();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const filteredPhotos = photos?.filter(photo => 
    selectedCategory === 'all' || photo.category === selectedCategory
  ) || [];

  const categories = ['all', 'general', 'before', 'after'];

  if (isLoading) {
    return (
      <div className="text-green-400 font-mono text-center py-8">
        [LOADING_GALLERY...]
      </div>
    );
  }

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-400 font-mono flex items-center gap-2">
            <Camera className="h-5 w-5" />
            [PHOTO_GALLERY]
          </CardTitle>
          {isOwner && (
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button
                size="sm"
                disabled={isUploading}
                className="bg-green-500 hover:bg-green-600 text-black font-mono"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Add Photo'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Category Filter */}
        <div className="flex gap-2 mb-6">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer font-mono ${
                selectedCategory === category 
                  ? 'bg-green-500 text-black' 
                  : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.toUpperCase()}
            </Badge>
          ))}
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-green-400/60 font-mono text-center py-8">
            No photos in this category
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square rounded-lg overflow-hidden border border-green-500/30 hover:border-green-400 transition-colors group relative"
              >
                <img
                  src={photo.photo_url}
                  alt={photo.caption || 'Gallery photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                    <p className="text-green-300 font-mono text-xs truncate">
                      {photo.caption}
                    </p>
                  </div>
                )}
                {photo.category && photo.category !== 'general' && (
                  <Badge className="absolute top-2 right-2 bg-green-500/20 text-green-400 border-green-500/30">
                    {photo.category.toUpperCase()}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
