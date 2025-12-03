import { useState, useEffect, useRef } from "react";

interface LyricLine {
  time: number;
  text: string;
}

interface SyncedLyricsProps {
  lrcFile?: string;
  fallbackLyrics?: string;
  currentTime: number;
  isPlaying: boolean;
}

// Parse LRC format: [mm:ss.xx]text or [mm:ss]text
const parseLRC = (lrcContent: string): LyricLine[] => {
  const lines = lrcContent.split('\n');
  const lyrics: LyricLine[] = [];

  for (const line of lines) {
    // Match timestamps like [00:00.00] or [00:00]
    const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = match[4].trim();
      
      if (text) {
        lyrics.push({ time, text });
      }
    }
  }

  return lyrics.sort((a, b) => a.time - b.time);
};

// Parse plain text lyrics (split by newlines)
const parsePlainLyrics = (text: string): LyricLine[] => {
  return text.split('\n').filter(line => line.trim()).map((line, index) => ({
    time: -1, // No timing info
    text: line.trim()
  }));
};

export const SyncedLyrics = ({ 
  lrcFile, 
  fallbackLyrics, 
  currentTime, 
  isPlaying 
}: SyncedLyricsProps) => {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [isLrcLoaded, setIsLrcLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Load LRC file
  useEffect(() => {
    const loadLyrics = async () => {
      if (lrcFile) {
        try {
          const response = await fetch(lrcFile);
          if (response.ok) {
            const content = await response.text();
            const parsed = parseLRC(content);
            if (parsed.length > 0) {
              setLyrics(parsed);
              setIsLrcLoaded(true);
              return;
            }
          }
        } catch (error) {
          console.log('LRC file not found, using fallback lyrics');
        }
      }
      
      // Fall back to plain lyrics
      if (fallbackLyrics) {
        setLyrics(parsePlainLyrics(fallbackLyrics));
        setIsLrcLoaded(false);
      }
    };

    loadLyrics();
  }, [lrcFile, fallbackLyrics]);

  // Update current line based on time (only for synced lyrics)
  useEffect(() => {
    if (!isLrcLoaded || lyrics.length === 0) return;

    let newIndex = -1;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        newIndex = i;
        break;
      }
    }
    
    if (newIndex !== currentLineIndex) {
      setCurrentLineIndex(newIndex);
    }
  }, [currentTime, lyrics, isLrcLoaded, currentLineIndex]);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current && isLrcLoaded) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentLineIndex, isLrcLoaded]);

  if (lyrics.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No lyrics available
      </div>
    );
  }

  // Plain lyrics display (no sync)
  if (!isLrcLoaded) {
    return (
      <div className="bg-muted/50 p-4 rounded-lg max-h-64 overflow-y-auto">
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {fallbackLyrics}
        </p>
      </div>
    );
  }

  // Synced lyrics display
  return (
    <div 
      ref={containerRef}
      className="bg-gradient-to-b from-muted/30 to-muted/50 p-4 rounded-lg max-h-72 overflow-y-auto scroll-smooth"
    >
      <div className="space-y-3 py-8">
        {lyrics.map((line, index) => (
          <div
            key={index}
            ref={index === currentLineIndex ? activeLineRef : null}
            className={`text-center transition-all duration-300 px-2 py-1 rounded ${
              index === currentLineIndex
                ? 'text-primary font-semibold text-lg scale-105 bg-primary/10'
                : index < currentLineIndex
                ? 'text-muted-foreground/60 text-sm'
                : 'text-muted-foreground text-sm'
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
};
