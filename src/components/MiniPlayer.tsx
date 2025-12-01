import { useAudio } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export const MiniPlayer = () => {
  const { 
    currentBhajan, 
    isPlaying, 
    volume,
    isMuted,
    togglePlay, 
    playNext, 
    playPrevious, 
    setCurrentBhajan, 
    setIsPlaying,
    setVolume,
    toggleMute
  } = useAudio();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!currentBhajan) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-elevated z-50 animate-slide-in-bottom">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Album Art - Desktop Only */}
          <div className="hidden md:block">
            <div className="w-12 h-12 rounded-md overflow-hidden shadow-soft flex-shrink-0 bg-muted">
              <img 
                src={`/images/books/${currentBhajan.deity.toLowerCase()}.jpg`}
                alt={currentBhajan.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Bhajan Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-foreground truncate">
              {currentBhajan.title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {currentBhajan.artist} • {currentBhajan.deity}
            </p>
          </div>

          {/* Controls - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-8 w-8 hover:bg-accent"
              onClick={playPrevious}
              title="Previous track"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              onClick={togglePlay}
              className="rounded-full h-10 w-10 bg-gradient-hero shadow-soft hover:shadow-elevated transition-all hover:scale-105"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-primary-foreground" />
              ) : (
                <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-8 w-8 hover:bg-accent"
              onClick={playNext}
              title="Next track"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Volume Control - Desktop */}
            <div className="relative ml-2">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full h-8 w-8 hover:bg-accent"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              {showVolumeSlider && (
                <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg p-3 shadow-elevated animate-scale-in">
                  <div className="w-24 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-3 w-3" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      className="cursor-pointer flex-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls - Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              size="sm"
              onClick={togglePlay}
              className="rounded-full h-10 w-10 bg-gradient-hero shadow-soft"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-primary-foreground" />
              ) : (
                <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
              )}
            </Button>
          </div>

          {/* Close Button */}
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full h-8 w-8 hover:bg-accent"
            onClick={() => {
              setCurrentBhajan(null);
              setIsPlaying(false);
            }}
            title="Close player"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
