import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  RotateCcw,
  RotateCw
} from "lucide-react";

interface AudioPlayerProps {
  audioFile: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onEnded?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  isShuffled?: boolean;
  onShuffleToggle?: () => void;
  repeatMode?: 'off' | 'all' | 'one';
  onRepeatToggle?: () => void;
  coverImage?: string;
  title?: string;
  artist?: string;
}

export const AudioPlayer = ({ 
  audioFile, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  onEnded,
  volume = 1,
  onVolumeChange,
  isMuted = false,
  onMuteToggle,
  isShuffled = false,
  onShuffleToggle,
  repeatMode = 'off',
  onRepeatToggle,
  coverImage,
  title,
  artist
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (onEnded) {
        onEnded();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeatMode, onEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // Only log if it's not an AbortError (which happens during track changes)
          if (err.name !== 'AbortError') {
            console.error("Audio play error:", err);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Pause current playback before loading new track
    audio.pause();
    audio.load();
    setCurrentTime(0);

    // If should be playing, wait for audio to be ready then play
    if (isPlaying) {
      const handleCanPlay = () => {
        audio.play().catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Audio play error:", err);
          }
        });
        audio.removeEventListener('canplaythrough', handleCanPlay);
      };
      audio.addEventListener('canplaythrough', handleCanPlay);
    }
  }, [audioFile]);

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return Repeat1;
    return Repeat;
  };

  const RepeatIcon = getRepeatIcon();

  return (
    <div className="space-y-6">
      <audio ref={audioRef} src={audioFile} />
      
      {/* Album Art & Info */}
      {(coverImage || title) && (
        <div className="flex items-center gap-4 animate-fade-in">
          {coverImage && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-elevated flex-shrink-0">
              <img 
                src={coverImage} 
                alt={title || 'Album art'} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {title && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{title}</h3>
              {artist && <p className="text-sm text-muted-foreground truncate">{artist}</p>}
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2">
        {/* 10s Backward */}
        <Button 
          size="sm" 
          variant="ghost" 
          className="rounded-full h-9 w-9 hover:bg-accent"
          onClick={() => handleSkip(-10)}
          title="Rewind 10 seconds"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* Previous */}
        <Button 
          size="sm" 
          variant="ghost" 
          className="rounded-full h-10 w-10 hover:bg-accent"
          onClick={onPrevious}
          disabled={!onPrevious}
          title="Previous track"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        {/* Play/Pause */}
        <Button
          size="lg"
          onClick={onPlayPause}
          className="rounded-full h-14 w-14 bg-gradient-hero shadow-elevated hover:shadow-soft transition-all hover:scale-105"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-primary-foreground" />
          ) : (
            <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
          )}
        </Button>

        {/* Next */}
        <Button 
          size="sm" 
          variant="ghost" 
          className="rounded-full h-10 w-10 hover:bg-accent"
          onClick={onNext}
          disabled={!onNext}
          title="Next track"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
        
        {/* 10s Forward */}
        <Button 
          size="sm" 
          variant="ghost" 
          className="rounded-full h-9 w-9 hover:bg-accent"
          onClick={() => handleSkip(10)}
          title="Forward 10 seconds"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between px-4">
        {/* Left Side - Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Shuffle */}
          {onShuffleToggle && (
            <Button
              size="sm"
              variant="ghost"
              className={`rounded-full h-8 w-8 ${isShuffled ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={onShuffleToggle}
              title={isShuffled ? "Shuffle on" : "Shuffle off"}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          )}

          {/* Repeat */}
          {onRepeatToggle && (
            <Button
              size="sm"
              variant="ghost"
              className={`rounded-full h-8 w-8 ${repeatMode !== 'off' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={onRepeatToggle}
              title={repeatMode === 'off' ? 'Repeat off' : repeatMode === 'all' ? 'Repeat all' : 'Repeat one'}
            >
              <RepeatIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Right Side - Volume Control */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => {
                if (onMuteToggle) {
                  onMuteToggle();
                }
                setShowVolumeSlider(!showVolumeSlider);
              }}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            {showVolumeSlider && onVolumeChange && (
              <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg p-3 shadow-elevated animate-scale-in">
                <div className="w-32">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => onVolumeChange(value[0] / 100)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
