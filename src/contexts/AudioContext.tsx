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
  setCurrentBhajan: (bhajan: Bhajan | null) => void;
  setIsPlaying: (playing: boolean) => void;
  playBhajan: (bhajan: Bhajan) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentBhajan, setCurrentBhajan] = useState<Bhajan | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playBhajan = (bhajan: Bhajan) => {
    setCurrentBhajan(bhajan);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentBhajan) return;
    const currentIndex = bhajansData.findIndex((b) => b.id === currentBhajan.id);
    if (currentIndex < bhajansData.length - 1) {
      setCurrentBhajan(bhajansData[currentIndex + 1] as Bhajan);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (!currentBhajan) return;
    const currentIndex = bhajansData.findIndex((b) => b.id === currentBhajan.id);
    if (currentIndex > 0) {
      setCurrentBhajan(bhajansData[currentIndex - 1] as Bhajan);
      setIsPlaying(true);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentBhajan,
        isPlaying,
        setCurrentBhajan,
        setIsPlaying,
        playBhajan,
        togglePlay,
        playNext,
        playPrevious,
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
