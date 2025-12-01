import { createContext, useContext, useState, ReactNode } from "react";
import bhajansData from "@/data/bhajans.json";

interface Bhajan {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: string;
  language: string;
  deity: string;
  audioFile: string;
  lyrics: string;
}

interface AudioContextType {
  currentBhajan: Bhajan | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  setCurrentBhajan: (bhajan: Bhajan | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsShuffled: (shuffled: boolean) => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  playBhajan: (bhajan: Bhajan) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentBhajan, setCurrentBhajan] = useState<Bhajan | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  const playBhajan = (bhajan: Bhajan) => {
    setCurrentBhajan(bhajan);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const cycleRepeatMode = () => {
    setRepeatMode(mode => {
      if (mode === 'off') return 'all';
      if (mode === 'all') return 'one';
      return 'off';
    });
  };

  const getNextBhajan = () => {
    if (!currentBhajan) return null;
    
    const currentIndex = bhajansData.findIndex((b) => b.id === currentBhajan.id);
    
    if (isShuffled) {
      const availableIndices = bhajansData
        .map((_, i) => i)
        .filter(i => i !== currentIndex);
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      return bhajansData[randomIndex] as Bhajan;
    }
    
    if (currentIndex < bhajansData.length - 1) {
      return bhajansData[currentIndex + 1] as Bhajan;
    } else if (repeatMode === 'all') {
      return bhajansData[0] as Bhajan;
    }
    
    return null;
  };

  const playNext = () => {
    const nextBhajan = getNextBhajan();
    if (nextBhajan) {
      setCurrentBhajan(nextBhajan);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (!currentBhajan) return;
    const currentIndex = bhajansData.findIndex((b) => b.id === currentBhajan.id);
    if (currentIndex > 0) {
      setCurrentBhajan(bhajansData[currentIndex - 1] as Bhajan);
      setIsPlaying(true);
    } else if (repeatMode === 'all') {
      setCurrentBhajan(bhajansData[bhajansData.length - 1] as Bhajan);
      setIsPlaying(true);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentBhajan,
        isPlaying,
        volume,
        isMuted,
        isShuffled,
        repeatMode,
        setCurrentBhajan,
        setIsPlaying,
        setVolume,
        setIsMuted,
        setIsShuffled,
        setRepeatMode,
        playBhajan,
        togglePlay,
        playNext,
        playPrevious,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
