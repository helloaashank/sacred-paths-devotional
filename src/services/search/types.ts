export type SearchCategory = 
  | 'books' 
  | 'bhajans' 
  | 'videos' 
  | 'panchang' 
  | 'vidhis';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: SearchCategory;
  thumbnail?: string;
  url: string;
  metadata?: Record<string, string>;
}

export interface SearchResults {
  query: string;
  results: SearchResult[];
  groupedResults: Record<SearchCategory, SearchResult[]>;
  totalCount: number;
}

export interface SearchAdapter {
  search(query: string): Promise<SearchResult[]>;
  getRecentSearches(): string[];
  addRecentSearch(query: string): void;
  clearRecentSearches(): void;
}

export interface SearchAnalytics {
  query: string;
  timestamp: number;
  resultsCount: number;
  clickedItem?: string;
}
