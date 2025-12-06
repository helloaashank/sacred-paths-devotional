import { SearchAdapter, SearchResult, SearchResults, SearchCategory } from './types';
import { LocalSearchAdapter } from './localSearchAdapter';

class SearchService {
  private adapter: SearchAdapter;
  private static instance: SearchService;
  
  private constructor() {
    // Default to local adapter - can be swapped for Supabase/ElasticSearch later
    this.adapter = new LocalSearchAdapter();
  }
  
  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }
  
  // Allow swapping adapters at runtime
  setAdapter(adapter: SearchAdapter): void {
    this.adapter = adapter;
  }
  
  async query(searchQuery: string): Promise<SearchResults> {
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery.length < 2) {
      return {
        query: trimmedQuery,
        results: [],
        groupedResults: {} as Record<SearchCategory, SearchResult[]>,
        totalCount: 0
      };
    }
    
    const results = await this.adapter.search(trimmedQuery);
    
    // Group results by category
    const groupedResults = results.reduce((acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    }, {} as Record<SearchCategory, SearchResult[]>);
    
    // Save to recent searches
    if (results.length > 0) {
      this.adapter.addRecentSearch(trimmedQuery);
    }
    
    return {
      query: trimmedQuery,
      results,
      groupedResults,
      totalCount: results.length
    };
  }
  
  getRecentSearches(): string[] {
    return this.adapter.getRecentSearches();
  }
  
  clearRecentSearches(): void {
    this.adapter.clearRecentSearches();
  }
}

export const searchService = SearchService.getInstance();
export default searchService;
