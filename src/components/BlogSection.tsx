
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, TrendingUp, Newspaper } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
}

export const BlogSection = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching trending news (replace with actual API call)
    const fetchNews = () => {
      const mockArticles: NewsArticle[] = [
        {
          id: '1',
          title: 'The Rise of Modern Barbershops: A Cultural Renaissance',
          description: 'How traditional barbershops are evolving with modern trends while maintaining their classic charm.',
          url: '#',
          publishedAt: '2024-01-15T10:00:00Z',
          source: 'Style Weekly',
          category: 'Lifestyle'
        },
        {
          id: '2',
          title: 'Top 10 Haircut Trends Taking Over 2024',
          description: 'From classic fades to modern textured cuts, discover the most popular hairstyles this year.',
          url: '#',
          publishedAt: '2024-01-14T15:30:00Z',
          source: 'Men\'s Health',
          category: 'Fashion'
        },
        {
          id: '3',
          title: 'The Art of Straight Razor Shaving Makes a Comeback',
          description: 'Traditional shaving techniques are returning as customers seek authentic experiences.',
          url: '#',
          publishedAt: '2024-01-13T09:15:00Z',
          source: 'Grooming Guide',
          category: 'Grooming'
        },
        {
          id: '4',
          title: 'Technology Meets Tradition: Digital Booking Systems in Barbershops',
          description: 'How modern barbershops are embracing technology to improve customer experience.',
          url: '#',
          publishedAt: '2024-01-12T14:20:00Z',
          source: 'Tech Today',
          category: 'Technology'
        },
        {
          id: '5',
          title: 'Sustainable Grooming: Eco-Friendly Practices in Modern Barbershops',
          description: 'Environmental consciousness is shaping the future of grooming and barbering.',
          url: '#',
          publishedAt: '2024-01-11T11:45:00Z',
          source: 'Green Living',
          category: 'Environment'
        },
        {
          id: '6',
          title: 'Celebrity Barber Spotlight: The Artists Behind Iconic Looks',
          description: 'Meet the master barbers who create signature styles for Hollywood\'s biggest stars.',
          url: '#',
          publishedAt: '2024-01-10T16:00:00Z',
          source: 'Celebrity Style',
          category: 'Entertainment'
        }
      ];
      
      setTimeout(() => {
        setArticles(mockArticles);
        setLoading(false);
      }, 1000);
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-900/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-400 font-mono mb-4">
              [LOADING_TRENDING_STORIES...]
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-green-500/30 bg-black/50 p-6 rounded-lg animate-pulse">
                <div className="h-6 bg-green-500/20 rounded mb-4"></div>
                <div className="h-4 bg-green-500/10 rounded mb-2"></div>
                <div className="h-4 bg-green-500/10 rounded mb-2"></div>
                <div className="h-4 bg-green-500/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gray-900/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-green-400 font-mono mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="h-8 w-8" />
            [TRENDING_STORIES]
          </h2>
          <p className="text-green-300 font-mono">
            Stay updated with the latest in barbering and grooming
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black border-green-500/30 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-green-300/60 text-xs font-mono">
                      <Clock className="h-3 w-3" />
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                  <CardTitle className="text-green-400 font-mono text-lg leading-tight">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-green-300/80 font-mono text-sm leading-relaxed">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-green-300/60 text-xs font-mono">
                      <Newspaper className="h-3 w-3" />
                      {article.source}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-green-500/30 text-green-400 hover:bg-green-500/20 font-mono"
          >
            [LOAD_MORE_STORIES]
          </Button>
        </div>
      </div>
    </section>
  );
};
