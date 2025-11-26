import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiMusic, FiPlay, FiPause, FiSkipForward, FiSkipBack } from "react-icons/fi";
import bhajansData from "@/data/bhajans.json";

const Bhajans = () => {
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(bhajansData.map((bhajan) => bhajan.category)))];

  const filteredBhajans = bhajansData.filter(
    (bhajan) => filter === "all" || bhajan.category === filter
  );

  const togglePlay = (id: string) => {
    setCurrentPlaying(currentPlaying === id ? null : id);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <FiMusic className="text-primary" />
            Divine Bhajans
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Listen to devotional music and connect with the divine
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
                      currentPlaying === bhajan.id
                        ? "bg-gradient-hero animate-pulse"
                        : "bg-gradient-hero"
                    }`}
                  >
                    {currentPlaying === bhajan.id ? (
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
                    <h4 className="font-semibold text-foreground mb-3">Lyrics:</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {bhajan.lyrics}
                      </p>
                    </div>

                    {/* Player Controls */}
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <Button size="sm" variant="ghost" className="rounded-full">
                        <FiSkipBack />
                      </Button>
                      <div className="flex-1 max-w-md">
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-hero w-1/3 animate-pulse" />
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="rounded-full">
                        <FiSkipForward />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBhajans.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No bhajans found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bhajans;