import { useState, useEffect } from 'react';
import { getEmbedUrl } from '@/utils/youtube';
import { Skeleton } from '@/components/ui/skeleton';

interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
  title?: string;
  className?: string;
}

export const YouTubePlayer = ({ 
  videoId, 
  autoplay = false, 
  title = 'YouTube Video',
  className = ''
}: YouTubePlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Invalid video ID</p>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(videoId, autoplay);

  return (
    <div className={`relative w-full ${className}`}>
      {isLoading && (
        <Skeleton className="absolute inset-0 aspect-video rounded-lg" />
      )}
      
      {hasError ? (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Failed to load video</p>
        </div>
      ) : (
        <iframe
          src={embedUrl}
          title={title}
          className="w-full aspect-video rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
};
