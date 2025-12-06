import { SearchAdapter, SearchResult, SearchCategory } from './types';
import booksData from '@/data/books.json';
import bhajansData from '@/data/bhajans.json';
import vidhisData from '@/data/vidhis.json';
import panchangData from '@/data/panchang.json';
import youtubeLinks from '@/data/youtubeLinks.json';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 10;

// Fuzzy match function
function fuzzyMatch(text: string, query: string): boolean {
  const normalizedText = text.toLowerCase().trim();
  const normalizedQuery = query.toLowerCase().trim();
  
  // Exact match
  if (normalizedText.includes(normalizedQuery)) return true;
  
  // Word-based partial match
  const queryWords = normalizedQuery.split(/\s+/);
  const textWords = normalizedText.split(/\s+/);
  
  return queryWords.every(qWord => 
    textWords.some(tWord => tWord.includes(qWord) || qWord.includes(tWord))
  );
}

// Calculate relevance score
function getRelevanceScore(text: string, query: string): number {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  
  if (normalizedText === normalizedQuery) return 100;
  if (normalizedText.startsWith(normalizedQuery)) return 80;
  if (normalizedText.includes(normalizedQuery)) return 60;
  
  const queryWords = normalizedQuery.split(/\s+/);
  const matchedWords = queryWords.filter(w => normalizedText.includes(w));
  return (matchedWords.length / queryWords.length) * 40;
}

export class LocalSearchAdapter implements SearchAdapter {
  private cache: Map<string, SearchResult[]> = new Map();
  
  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];
    
    const cacheKey = query.toLowerCase().trim();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const results: SearchResult[] = [];
    
    // Search Books
    results.push(...this.searchBooks(query));
    
    // Search Bhajans
    results.push(...this.searchBhajans(query));
    
    // Search Videos
    results.push(...this.searchVideos(query));
    
    // Search Vidhis
    results.push(...this.searchVidhis(query));
    
    // Search Panchang
    results.push(...this.searchPanchang(query));
    
    // Sort by relevance
    results.sort((a, b) => {
      const scoreA = getRelevanceScore(a.title, query);
      const scoreB = getRelevanceScore(b.title, query);
      return scoreB - scoreA;
    });
    
    this.cache.set(cacheKey, results);
    
    // Clear cache after 5 minutes
    setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);
    
    return results;
  }
  
  private searchBooks(query: string): SearchResult[] {
    return (booksData as any[])
      .filter(book => 
        fuzzyMatch(book.title, query) ||
        fuzzyMatch(book.author || '', query) ||
        fuzzyMatch(book.description || '', query) ||
        fuzzyMatch(book.category || '', query)
      )
      .map(book => ({
        id: book.id,
        title: book.title,
        description: book.description?.substring(0, 100) + '...',
        category: 'books' as SearchCategory,
        thumbnail: book.coverImage,
        url: `/books/${book.id}`,
        metadata: {
          author: book.author,
          language: book.language
        }
      }));
  }
  
  private searchBhajans(query: string): SearchResult[] {
    return (bhajansData as any[])
      .filter(bhajan => 
        fuzzyMatch(bhajan.title, query) ||
        fuzzyMatch(bhajan.artist || '', query) ||
        fuzzyMatch(bhajan.lyrics || '', query) ||
        fuzzyMatch(bhajan.deity || '', query) ||
        fuzzyMatch(bhajan.category || '', query)
      )
      .map(bhajan => ({
        id: bhajan.id,
        title: bhajan.title,
        description: bhajan.artist,
        category: 'bhajans' as SearchCategory,
        thumbnail: bhajan.thumbnail,
        url: '/bhajans',
        metadata: {
          artist: bhajan.artist,
          duration: bhajan.duration,
          deity: bhajan.deity
        }
      }));
  }
  
  private searchVideos(query: string): SearchResult[] {
    return (youtubeLinks as any[])
      .filter(video => 
        fuzzyMatch(video.title || '', query) ||
        fuzzyMatch(video.description || '', query) ||
        fuzzyMatch(video.channelName || '', query)
      )
      .map(video => ({
        id: video.id,
        title: video.title || 'YouTube Video',
        description: video.description?.substring(0, 100),
        category: 'videos' as SearchCategory,
        thumbnail: undefined,
        url: `/videos/${video.id}`,
        metadata: {
          channel: video.channelName
        }
      }));
  }
  
  private searchVidhis(query: string): SearchResult[] {
    return (vidhisData as any[])
      .filter(vidhi => 
        fuzzyMatch(vidhi.title, query) ||
        fuzzyMatch(vidhi.description || '', query) ||
        fuzzyMatch(vidhi.deity || '', query) ||
        vidhi.steps?.some((step: any) => fuzzyMatch(step.title || '', query))
      )
      .map(vidhi => ({
        id: vidhi.id,
        title: vidhi.title,
        description: vidhi.description?.substring(0, 100) + '...',
        category: 'vidhis' as SearchCategory,
        thumbnail: undefined,
        url: '/vidhis',
        metadata: {
          deity: vidhi.deity,
          duration: vidhi.duration,
          difficulty: vidhi.difficulty
        }
      }));
  }
  
  private searchPanchang(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const data = panchangData.data as Record<string, any>;
    
    Object.entries(data).forEach(([date, cities]) => {
      Object.entries(cities as Record<string, any>).forEach(([city, info]) => {
        const panchangInfo = info as any;
        const festivals = panchangInfo.festivals || [];
        
        const matchesFestival = festivals.some((f: string) => fuzzyMatch(f, query));
        const matchesTithi = fuzzyMatch(panchangInfo.tithi || '', query);
        const matchesNakshatra = fuzzyMatch(panchangInfo.nakshatra || '', query);
        
        if (matchesFestival || matchesTithi || matchesNakshatra) {
          results.push({
            id: `${date}-${city}`,
            title: festivals.length > 0 ? festivals[0] : panchangInfo.tithi,
            description: `${date} - ${city}`,
            category: 'panchang' as SearchCategory,
            thumbnail: undefined,
            url: '/panchang',
            metadata: {
              date,
              city,
              tithi: panchangInfo.tithi,
              nakshatra: panchangInfo.nakshatra
            }
          });
        }
      });
    });
    
    return results;
  }
  
  getRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  addRecentSearch(query: string): void {
    const searches = this.getRecentSearches();
    const filtered = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    filtered.unshift(query);
    const limited = filtered.slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limited));
  }
  
  clearRecentSearches(): void {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }
}
