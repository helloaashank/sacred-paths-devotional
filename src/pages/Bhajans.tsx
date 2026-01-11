import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiMusic, FiPlay, FiPause, FiDownload } from "react-icons/fi";
import bhajansData from "@/data/bhajans.json";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SyncedLyrics } from "@/components/SyncedLyrics";
import { BhajanCredits } from "@/components/BhajanCredits";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { PullToRefresh } from "@/components/PullToRefresh";
import { toast } from "sonner";

const Bhajans = () => {
  const [filter, setFilter] = useState<string>("all");
  const [thumbnailErrors, setThumbnailErrors] = useState<Set<string>>(new Set());
  const { t } = useLanguage();
  const { 
    currentBhajan, 
    isPlaying, 
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    currentTime,
    playBhajan, 
    togglePlay, 
    playNext, 
    playPrevious,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    setCurrentTime
  } = useAudio();

  const categories = ["all", ...Array.from(new Set(bhajansData.map((bhajan) => bhajan.category)))];

  const filteredBhajans = bhajansData.filter(
    (bhajan) => filter === "all" || bhajan.category === filter
  );

  const handleBhajanClick = (bhajan: any) => {
    if (currentBhajan?.id === bhajan.id) {
      togglePlay();
    } else {
      playBhajan(bhajan);
    }
  };

  const getThumbnail = (bhajan: any) => {
    if (thumbnailErrors.has(bhajan.id)) {
      return `/images/books/${bhajan.deity.toLowerCase()}.jpg`;
    }
    return bhajan.thumbnail || `/images/books/${bhajan.deity.toLowerCase()}.jpg`;
  };

  const handleThumbnailError = (bhajanId: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!thumbnailErrors.has(bhajanId)) {
      setThumbnailErrors(prev => new Set(prev).add(bhajanId));
      const bhajan = bhajansData.find(b => b.id === bhajanId);
      if (bhajan) {
        (e.target as HTMLImageElement).src = `/images/books/${bhajan.deity.toLowerCase()}.jpg`;
      }
    } else {
      (e.target as HTMLImageElement).src = '/placeholder.svg';
    }
  };

  const handleRefresh = useCallback(async () => {
    // Simulate refresh - in real app, this would refetch data
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Bhajans refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-full">
      <div className="px-4 py-4">
      {/* Compact Filter Pills - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4 snap-x">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
            className={`flex-shrink-0 text-xs h-8 px-3 snap-start ${
              filter === category ? "bg-gradient-hero" : ""
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Bhajans List - Compact Cards */}
      <div className="space-y-2">
        {filteredBhajans.map((bhajan) => (
          <Card
            key={bhajan.id}
            className={`overflow-hidden transition-all ${
              currentBhajan?.id === bhajan.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                {/* Thumbnail with play overlay */}
                <button
                  onClick={() => handleBhajanClick(bhajan)}
                  className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted"
                >
                  <img 
                    src={getThumbnail(bhajan)}
                    alt={bhajan.title}
                    className="w-full h-full object-cover"
                    onError={(e) => handleThumbnailError(bhajan.id, e)}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {currentBhajan?.id === bhajan.id && isPlaying ? (
                      <FiPause className="text-white text-lg" />
                    ) : (
                      <FiPlay className="text-white text-lg ml-0.5" />
                    )}
                  </div>
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0" onClick={() => handleBhajanClick(bhajan)}>
                  <h3 className="font-medium text-sm text-foreground truncate">
                    {bhajan.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {bhajan.artist} • {bhajan.duration}
                  </p>
                </div>

                {/* Category Badge */}
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-full flex-shrink-0">
                  {bhajan.deity}
                </span>
              </div>

              {/* Expanded Player Section */}
              {currentBhajan?.id === bhajan.id && (
                <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                  {/* Album Art & Credits */}
                  <div className="flex gap-4 mb-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shadow-soft flex-shrink-0">
                      <img 
                        src={getThumbnail(bhajan)} 
                        alt={bhajan.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground truncate">{bhajan.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{bhajan.artist}</p>
                      </div>
                      
                      {/* Download Button */}
                      <a 
                        href={bhajan.audioFile} 
                        download={`${bhajan.title}.mp3`}
                      >
                        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                          <FiDownload className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Credits */}
                  {(bhajan as any).credits && (
                    <div className="mb-4">
                      <BhajanCredits credits={(bhajan as any).credits} />
                    </div>
                  )}

                  {/* Synced Lyrics */}
                  <div className="mb-4">
                    <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      {t.bhajans.lyrics}
                    </h4>
                    <SyncedLyrics
                      lrcFile={bhajan.lrcFile}
                      fallbackLyrics={bhajan.lyrics}
                      currentTime={currentTime}
                      isPlaying={isPlaying}
                    />
                  </div>

                  {/* Audio Player */}
                  <AudioPlayer
                    audioFile={bhajan.audioFile}
                    isPlaying={isPlaying}
                    onPlayPause={togglePlay}
                    onNext={playNext}
                    onPrevious={playPrevious}
                    onEnded={playNext}
                    volume={volume}
                    onVolumeChange={setVolume}
                    isMuted={isMuted}
                    onMuteToggle={toggleMute}
                    isShuffled={isShuffled}
                    onShuffleToggle={toggleShuffle}
                    repeatMode={repeatMode}
                    onRepeatToggle={cycleRepeatMode}
                    coverImage={getThumbnail(bhajan)}
                    title={bhajan.title}
                    artist={bhajan.artist}
                    onTimeUpdate={setCurrentTime}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBhajans.length === 0 && (
        <div className="text-center py-12">
          <FiMusic className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t.bhajans.no_bhajans}</p>
        </div>
      )}
      </div>
    </PullToRefresh>
  );
};

export default Bhajans;
