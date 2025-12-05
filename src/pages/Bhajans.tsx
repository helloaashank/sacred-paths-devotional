import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiMusic, FiPlay, FiPause, FiDownload } from "react-icons/fi";
import bhajansData from "@/data/bhajans.json";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SyncedLyrics } from "@/components/SyncedLyrics";
import { BhajanCredits } from "@/components/BhajanCredits";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";

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

  // Get thumbnail with fallback logic
  const getThumbnail = (bhajan: any) => {
    if (thumbnailErrors.has(bhajan.id)) {
      // Fall back to deity image
      return `/images/books/${bhajan.deity.toLowerCase()}.jpg`;
    }
    // Try custom thumbnail first, then deity image
    return bhajan.thumbnail || `/images/books/${bhajan.deity.toLowerCase()}.jpg`;
  };

  const handleThumbnailError = (bhajanId: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!thumbnailErrors.has(bhajanId)) {
      setThumbnailErrors(prev => new Set(prev).add(bhajanId));
      // Try deity fallback
      const bhajan = bhajansData.find(b => b.id === bhajanId);
      if (bhajan) {
        (e.target as HTMLImageElement).src = `/images/books/${bhajan.deity.toLowerCase()}.jpg`;
      }
    } else {
      // Final fallback to placeholder
      (e.target as HTMLImageElement).src = '/placeholder.svg';
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-12 px-2 sm:px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
            <FiMusic className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            {t.bhajans.title}
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t.bhajans.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2 flex-wrap justify-center bg-card p-3 sm:p-4 rounded-lg shadow-soft">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className={`text-xs sm:text-sm ${filter === category ? "bg-gradient-hero shadow-soft" : ""}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Bhajans List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredBhajans.map((bhajan) => (
            <Card
              key={bhajan.id}
              className={`group hover:shadow-elevated transition-all duration-300 ${
                currentBhajan?.id === bhajan.id ? "ring-2 ring-primary shadow-elevated" : ""
              }`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shadow-soft flex-shrink-0 bg-muted">
                    <img 
                      src={getThumbnail(bhajan)}
                      alt={bhajan.title}
                      className="w-full h-full object-cover"
                      onError={(e) => handleThumbnailError(bhajan.id, e)}
                    />
                    {/* Play overlay */}
                    <button
                      onClick={() => handleBhajanClick(bhajan)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {currentBhajan?.id === bhajan.id && isPlaying ? (
                        <FiPause className="text-white text-lg sm:text-xl" />
                      ) : (
                        <FiPlay className="text-white text-lg sm:text-xl ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                      {bhajan.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{bhajan.artist}</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                      <span className="bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">{bhajan.category}</span>
                      <span className="bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">{bhajan.deity}</span>
                    </div>
                  </div>

                  {/* Play Button & Duration */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium hidden sm:block">
                      {bhajan.duration}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleBhajanClick(bhajan)}
                      className={`rounded-full h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 shadow-soft ${
                        currentBhajan?.id === bhajan.id && isPlaying
                          ? "bg-gradient-hero animate-pulse"
                          : "bg-gradient-hero"
                      }`}
                    >
                      {currentBhajan?.id === bhajan.id && isPlaying ? (
                        <FiPause className="text-base sm:text-lg text-primary-foreground" />
                      ) : (
                        <FiPlay className="text-base sm:text-lg text-primary-foreground ml-0.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Player Section */}
                {currentBhajan?.id === bhajan.id && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border animate-fade-in">
                    {/* Large Thumbnail & Info */}
                    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6">
                      <div className="w-full md:w-48 lg:w-56 flex-shrink-0">
                        <div className="aspect-square rounded-xl overflow-hidden shadow-elevated">
                          <img 
                            src={getThumbnail(bhajan)} 
                            alt={bhajan.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground">{bhajan.title}</h3>
                          <p className="text-base sm:text-lg text-muted-foreground">{bhajan.artist}</p>
                        </div>
                        
                        {/* Credits Section */}
                        {(bhajan as any).credits && (
                          <BhajanCredits 
                            credits={(bhajan as any).credits} 
                          />
                        )}
                        
                        {/* Download Button */}
                        <a 
                          href={bhajan.audioFile} 
                          download={`${bhajan.title}.mp3`}
                          className="inline-flex"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            <FiDownload className="h-4 w-4" />
                            Download Audio
                          </Button>
                        </a>
                      </div>
                    </div>

                    {/* Synced Lyrics */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3">{t.bhajans.lyrics}:</h4>
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
          <div className="text-center py-12 sm:py-16">
            <p className="text-lg sm:text-xl text-muted-foreground">{t.bhajans.no_bhajans}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bhajans;
