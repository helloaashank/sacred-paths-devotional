import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiMusic, FiPlay, FiPause } from "react-icons/fi";
import bhajansData from "@/data/bhajans.json";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useLanguage } from "@/contexts/LanguageContext";

const Bhajans = () => {
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useLanguage();

  const categories = ["all", ...Array.from(new Set(bhajansData.map((bhajan) => bhajan.category)))];

  const filteredBhajans = bhajansData.filter(
    (bhajan) => filter === "all" || bhajan.category === filter
  );

  const togglePlay = (id: string) => {
    if (currentPlaying === id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPlaying(id);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const currentIndex = filteredBhajans.findIndex((b) => b.id === currentPlaying);
    if (currentIndex < filteredBhajans.length - 1) {
      setCurrentPlaying(filteredBhajans[currentIndex + 1].id);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    const currentIndex = filteredBhajans.findIndex((b) => b.id === currentPlaying);
    if (currentIndex > 0) {
      setCurrentPlaying(filteredBhajans[currentIndex - 1].id);
      setIsPlaying(true);
    }
  };

  const currentBhajan = bhajansData.find((b) => b.id === currentPlaying);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <FiMusic className="text-primary" />
            {t.bhajans.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.bhajans.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center gap-2 flex-wrap justify-center bg-card p-4 rounded-lg shadow-soft">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className={filter === category ? "bg-gradient-hero shadow-soft" : ""}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Bhajans List */}
        <div className="space-y-4">
          {filteredBhajans.map((bhajan, index) => (
            <Card
              key={bhajan.id}
              className={`group hover:shadow-elevated transition-all duration-300 ${
                currentPlaying === bhajan.id ? "ring-2 ring-primary shadow-elevated" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Play Button */}
                    <Button
                      size="lg"
                      onClick={() => togglePlay(bhajan.id)}
                      className={`rounded-full h-14 w-14 flex-shrink-0 shadow-soft ${
                        currentPlaying === bhajan.id && isPlaying
                          ? "bg-gradient-hero animate-pulse"
                          : "bg-gradient-hero"
                      }`}
                    >
                      {currentPlaying === bhajan.id && isPlaying ? (
                        <FiPause className="text-xl text-primary-foreground" />
                      ) : (
                        <FiPlay className="text-xl text-primary-foreground ml-1" />
                      )}
                    </Button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                      {bhajan.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{bhajan.artist}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span className="bg-muted px-2 py-1 rounded">{bhajan.category}</span>
                      <span className="bg-muted px-2 py-1 rounded">{bhajan.language}</span>
                      <span className="bg-muted px-2 py-1 rounded">{bhajan.deity}</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-muted-foreground font-medium">
                    {bhajan.duration}
                  </div>
                </div>

                {/* Lyrics Preview */}
                {currentPlaying === bhajan.id && (
                  <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                    <h4 className="font-semibold text-foreground mb-3">{t.bhajans.lyrics}:</h4>
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {bhajan.lyrics}
                      </p>
                    </div>

                    {/* Audio Player */}
                    <AudioPlayer
                      audioFile={bhajan.audioFile}
                      isPlaying={isPlaying}
                      onPlayPause={() => setIsPlaying(!isPlaying)}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBhajans.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{t.bhajans.no_bhajans}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bhajans;