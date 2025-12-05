import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FiPlay, FiYoutube } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  processVideoData, 
  isValidYouTubeUrl, 
  YouTubeVideo,
  getThumbnailUrl 
} from '@/utils/youtube';
import youtubeLinksData from '@/data/youtubeLinks.json';

const Videos = () => {
  const [videos, setVideos] = useState<(YouTubeVideo & { videoId: string; thumbnail: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    try {
      const processedVideos = (youtubeLinksData as YouTubeVideo[])
        .filter(video => {
          if (!isValidYouTubeUrl(video.url)) {
            toast({
              title: "Invalid URL",
              description: `Skipped invalid YouTube URL: ${video.url}`,
              variant: "destructive",
            });
            return false;
          }
          return true;
        })
        .map(processVideoData);
      
      setVideos(processedVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = (video: YouTubeVideo & { videoId: string }) => {
    const params = new URLSearchParams();
    if (video.title) params.set('title', encodeURIComponent(video.title));
    if (video.channelName) params.set('channel', encodeURIComponent(video.channelName));
    
    navigate(`/videos/${video.videoId}?${params.toString()}`);
  };

  const handleImageError = (videoId: string) => {
    setImageErrors(prev => ({ ...prev, [videoId]: true }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FiYoutube className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t.nav.videos}
          </h1>
        </div>
        <p className="text-muted-foreground">
          Watch spiritual videos and bhajans
        </p>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <FiYoutube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Videos Yet</h2>
          <p className="text-muted-foreground">
            Add videos to src/data/youtubeLinks.json to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video) => (
            <Card 
              key={video.id} 
              className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 border-border bg-card"
              onClick={() => handlePlayVideo(video)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={imageErrors[video.videoId] 
                    ? getThumbnailUrl(video.videoId, 'medium')
                    : video.thumbnail
                  }
                  alt={video.title || 'Video thumbnail'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(video.videoId)}
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 sm:p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <FiPlay className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-white" />
                  </div>
                </div>
                
                {/* YouTube Badge */}
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <FiYoutube className="h-3 w-3" />
                  <span>YouTube</span>
                </div>
              </div>
              
              {/* Content */}
              <CardContent className="p-3 sm:p-4">
                <h3 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {video.title || 'Untitled Video'}
                </h3>
                {video.channelName && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {video.channelName}
                  </p>
                )}
                {video.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                    {video.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;
