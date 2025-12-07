import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiClock } from 'react-icons/fi';
import { searchService } from '@/services/search/SearchService';
import { SearchResult } from '@/services/search/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  expanded?: boolean;
  onClose?: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ expanded = false, onClose, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setRecentSearches(searchService.getRecentSearches());
  }, []);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchService.query(searchQuery);
      setResults(searchResults.results.slice(0, 8)); // Limit dropdown results
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    performSearch(search);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'books': return '📚';
      case 'bhajans': return '🎵';
      case 'videos': return '🎥';
      case 'panchang': return '📆';
      case 'vidhis': return '📜';
      default: return '📄';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'books': return t.nav.books;
      case 'bhajans': return t.nav.bhajans;
      case 'videos': return t.nav.videos;
      case 'panchang': return t.nav.panchang;
      case 'vidhis': return t.nav.vidhis;
      default: return category;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 h-4 w-4 text-[hsl(0,0%,99%)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={t.search?.placeholder || 'Search books, bhajans, videos...'}
            className="w-full h-10 pl-10 pr-10 rounded-full bg-[hsl(0,0%,0%)] border border-border/50 
                       text-[hsl(0,0%,99%)] placeholder:text-[hsl(0,0%,70%)]
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                       transition-all duration-200"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <FiX className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl 
                        shadow-lg overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          {!isLoading && query.length < 2 && recentSearches.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-2">
                <FiClock className="h-3 w-3" />
                <span>{t.search?.recent || 'Recent Searches'}</span>
              </div>
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg transition-colors text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <p>{t.search?.no_results || 'No results found'}</p>
              <p className="text-xs mt-1">{t.search?.try_different || 'Try different keywords'}</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={`${result.category}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                    {result.thumbnail ? (
                      <img 
                        src={result.thumbnail} 
                        alt={result.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className={result.thumbnail ? 'hidden' : ''}>
                      {getCategoryIcon(result.category)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{result.title}</p>
                    {result.description && (
                      <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                    )}
                  </div>
                  <span className="flex-shrink-0 text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                    {getCategoryLabel(result.category)}
                  </span>
                </button>
              ))}
              
              {query.trim() && (
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 p-3 mt-2 
                             bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary"
                >
                  <FiSearch className="h-4 w-4" />
                  <span>{t.search?.see_all || 'See all results'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
