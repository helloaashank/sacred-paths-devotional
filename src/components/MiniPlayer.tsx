import { useAudio } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { FiCopy, FiDisc } from "react-icons/fi";

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

  const credits = currentBhajan.credits;
  const thumbnailSrc = currentBhajan.thumbnail || `/thumbnails/bhajans/${currentBhajan.id}.jpg`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-elevated z-50 animate-slide-in-bottom">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Album Art */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden shadow-soft bg-muted">
              <img 
                src={thumbnailSrc}
                alt={currentBhajan.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Bhajan Info & Credits */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-xs sm:text-sm text-foreground truncate">
              {currentBhajan.title}
            </h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {currentBhajan.artist} • {currentBhajan.deity}
            </p>
            {/* Compact Credits - Desktop Only */}
            <div className="hidden md:flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground/70">
              {credits?.label && credits.label !== "Unknown" && (
                <span className="flex items-center gap-1">
                  <FiDisc className="h-2.5 w-2.5" />
                  {credits.label}
                </span>
              )}
              {credits?.copyright && (
                <span className="flex items-center gap-1">
                  <FiCopy className="h-2.5 w-2.5" />
                  © {credits.copyright}
                </span>
              )}
            </div>
          </div>

          {/* Controls - Desktop & Tablet */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent"
              onClick={playPrevious}
              title="Previous track"
            >
              <SkipBack className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>

            <Button
              size="sm"
              onClick={togglePlay}
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10 bg-gradient-hero shadow-soft hover:shadow-elevated transition-all hover:scale-105"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              ) : (
                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground ml-0.5" />
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent"
              onClick={playNext}
              title="Next track"
            >
              <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>

            {/* Volume Control - Desktop */}
            <div className="relative ml-1 sm:ml-2 hidden md:block">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </Button>
              
              {showVolumeSlider && (
                <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg p-2 sm:p-3 shadow-elevated animate-scale-in z-10">
                  <div className="w-20 sm:w-24 flex items-center gap-1.5 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 sm:h-6 sm:w-6 p-0"
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

          {/* Controls - Mobile Only */}
          <div className="flex sm:hidden items-center gap-1.5">
            <Button
              size="sm"
              onClick={togglePlay}
              className="rounded-full h-9 w-9 bg-gradient-hero shadow-soft"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
              )}
            </Button>
          </div>

          {/* Close Button */}
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent flex-shrink-0"
            onClick={() => {
              setCurrentBhajan(null);
              setIsPlaying(false);
            }}
            title="Close player"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
