import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { getWatchUrl, getThumbnailUrl } from '@/utils/youtube';
import { useLanguage } from '@/contexts/LanguageContext';

const YoutubePlayerScreen = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const title = searchParams.get('title') || 'Video';
  const channel = searchParams.get('channel') || '';

  if (!videoId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Video Not Found</h1>
          <p className="text-muted-foreground mb-6">The video ID is missing or invalid.</p>
          <Button onClick={() => navigate('/videos')}>
            <FiArrowLeft className="mr-2" />
            Back to Videos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/videos')}
            className="shrink-0"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
              {decodeURIComponent(title)}
            </h1>
            {channel && (
              <p className="text-sm text-muted-foreground truncate">
                {decodeURIComponent(channel)}
              </p>
            )}
          </div>
        </div>

        {/* Player */}
        <div className="max-w-5xl mx-auto">
          <YouTubePlayer 
            videoId={videoId} 
            autoplay={true}
            title={decodeURIComponent(title)}
          />
          
          {/* Video Info */}
          <div className="mt-4 sm:mt-6 p-4 bg-card rounded-lg border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {decodeURIComponent(title)}
                </h2>
                {channel && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {decodeURIComponent(channel)}
                  </p>
                )}
              </div>
              <a
                href={getWatchUrl(videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="sm">
                  <FiExternalLink className="mr-2 h-4 w-4" />
                  Watch on YouTube
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubePlayerScreen;
