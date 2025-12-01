import { useAudio } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiX } from "react-icons/fi";
import { AudioPlayer } from "./AudioPlayer";

export const MiniPlayer = () => {
  const { currentBhajan, isPlaying, togglePlay, playNext, playPrevious, setCurrentBhajan, setIsPlaying } = useAudio();

  if (!currentBhajan) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50 animate-slide-in-bottom">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
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
          <div className="hidden md:flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-8 w-8"
              onClick={playPrevious}
            >
              <FiSkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              onClick={togglePlay}
              className="rounded-full h-10 w-10 bg-gradient-hero shadow-soft"
            >
              {isPlaying ? (
                <FiPause className="h-5 w-5 text-primary-foreground" />
              ) : (
                <FiPlay className="h-5 w-5 text-primary-foreground ml-0.5" />
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-8 w-8"
              onClick={playNext}
            >
              <FiSkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Controls - Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              size="sm"
              onClick={togglePlay}
              className="rounded-full h-10 w-10 bg-gradient-hero shadow-soft"
            >
              {isPlaying ? (
                <FiPause className="h-5 w-5 text-primary-foreground" />
              ) : (
                <FiPlay className="h-5 w-5 text-primary-foreground ml-0.5" />
              )}
            </Button>
          </div>

          {/* Close Button */}
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full h-8 w-8"
            onClick={() => {
              setCurrentBhajan(null);
              setIsPlaying(false);
            }}
          >
            <FiX className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar - Hidden on mobile to save space */}
        <div className="hidden md:block mt-2">
          <AudioPlayer
            audioFile={currentBhajan.audioFile}
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            onNext={playNext}
            onPrevious={playPrevious}
          />
        </div>
      </div>
    </div>
  );
};
