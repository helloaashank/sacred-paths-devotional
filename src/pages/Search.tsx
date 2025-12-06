import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiBook, FiMusic, FiVideo, FiCalendar, FiFileText, FiArrowLeft } from 'react-icons/fi';
import { searchService } from '@/services/search/SearchService';
import { SearchResults, SearchResult, SearchCategory } from '@/services/search/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
      setSearchInput(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const searchResults = await searchService.query(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
  };

  const getCategoryIcon = (category: SearchCategory) => {
    switch (category) {
      case 'books': return <FiBook className="h-5 w-5" />;
      case 'bhajans': return <FiMusic className="h-5 w-5" />;
      case 'videos': return <FiVideo className="h-5 w-5" />;
      case 'panchang': return <FiCalendar className="h-5 w-5" />;
      case 'vidhis': return <FiFileText className="h-5 w-5" />;
      default: return <FiFileText className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: SearchCategory) => {
    switch (category) {
      case 'books': return t.nav.books;
      case 'bhajans': return t.nav.bhajans;
      case 'videos': return t.nav.videos;
      case 'panchang': return t.nav.panchang;
      case 'vidhis': return t.nav.vidhis;
      default: return category;
    }
  };

  const getCategoryColor = (category: SearchCategory) => {
    switch (category) {
      case 'books': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'bhajans': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'videos': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'panchang': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'vidhis': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const categories: SearchCategory[] = ['books', 'bhajans', 'videos', 'panchang', 'vidhis'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="flex-shrink-0"
            >
              <FiArrowLeft className="h-5 w-5" />
            </Button>
            
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t.search?.placeholder || 'Search...'}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border
                             text-foreground placeholder:text-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                             transition-all text-lg"
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-24 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : results ? (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                {t.search?.results_for || 'Results for'} "{results.query}"
              </h1>
              <p className="text-muted-foreground mt-1">
                {results.totalCount} {results.totalCount === 1 ? 'result' : 'results'} {t.search?.found || 'found'}
              </p>
            </div>

            {results.totalCount === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                  <FiSearch className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {t.search?.no_results_found || 'No results found'}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {t.search?.no_results_description || 'Try adjusting your search terms or browse our categories'}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => {
                  const categoryResults = results.groupedResults[category];
                  if (!categoryResults || categoryResults.length === 0) return null;

                  return (
                    <section key={category}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${getCategoryColor(category)} border`}>
                          {getCategoryIcon(category)}
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          {getCategoryLabel(category)}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                          ({categoryResults.length})
                        </span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categoryResults.map((result) => (
                          <button
                            key={`${result.category}-${result.id}`}
                            onClick={() => handleResultClick(result)}
                            className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl
                                       hover:bg-muted/50 hover:border-primary/30 transition-all text-left
                                       group"
                          >
                            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-secondary overflow-hidden
                                            flex items-center justify-center">
                              {result.thumbnail ? (
                                <img
                                  src={result.thumbnail}
                                  alt={result.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="text-2xl">
                                  {category === 'books' && '📚'}
                                  {category === 'bhajans' && '🎵'}
                                  {category === 'videos' && '🎥'}
                                  {category === 'panchang' && '📆'}
                                  {category === 'vidhis' && '📜'}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground group-hover:text-primary 
                                             transition-colors truncate">
                                {result.title}
                              </h3>
                              {result.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {result.description}
                                </p>
                              )}
                              {result.metadata && Object.keys(result.metadata).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {Object.entries(result.metadata).slice(0, 2).map(([key, value]) => (
                                    value && (
                                      <span key={key} className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
                                        {value}
                                      </span>
                                    )
                                  ))}
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <FiSearch className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {t.search?.start_searching || 'Start searching'}
            </h2>
            <p className="text-muted-foreground">
              {t.search?.search_description || 'Find books, bhajans, videos and more'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
