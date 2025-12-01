import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiPlay, FiPause, FiSkipForward, FiSkipBack } from "react-icons/fi";

interface AudioPlayerProps {
  audioFile: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const AudioPlayer = ({ audioFile, isPlaying, onPlayPause, onNext, onPrevious }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Number(e.target.value);
      setCurrentTime(audio.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioFile} />
      
      {/* Player Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button 
          size="sm" 
          variant="ghost" 
          className="rounded-full"
          onClick={onPrevious}
          disabled={!onPrevious}
        >
          <FiSkipBack />
        </Button>
        
        <Button
          size="lg"
          onClick={onPlayPause}
          className="rounded-full h-12 w-12 bg-gradient-hero shadow-soft"
        >
          {isPlaying ? (
            <FiPause className="text-xl text-primary-foreground" />
          ) : (
            <FiPlay className="text-xl text-primary-foreground ml-1" />
          )}
        </Button>
        
        <Button 
          size="sm" 
          variant="ghost" 
          className="rounded-full"
          onClick={onNext}
          disabled={!onNext}
        >
          <FiSkipForward />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};
