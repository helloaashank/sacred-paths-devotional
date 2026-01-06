import { supabase } from '@/integrations/supabase/client';
import { IDatabaseService } from './DatabaseService';
import {
  Book,
  Bhajan,
  Reel,
  PanchangData,
  PoojaVidhi,
  UserProfile,
  DatabaseResult,
  PaginatedResult,
  QueryOptions,
  DatabaseError,
} from './types';

// Import local data as fallback (for features not yet in DB)
import booksData from '@/data/books.json';
import bhajansData from '@/data/bhajans.json';
import panchangData from '@/data/panchang.json';
import vidhisData from '@/data/vidhis.json';

/**
 * Supabase Implementation of DatabaseService
 * 
 * This class contains ALL Supabase-specific database logic.
 * Currently uses local JSON files as fallback until DB tables are created.
 * 
 * To replace Supabase, create a new implementation of IDatabaseService.
 */
export class SupabaseDatabaseService implements IDatabaseService {
  
  private mapError(error: unknown): DatabaseError {
    const err = error as { code?: string; message?: string };
    return {
      code: err?.code || 'unknown',
      message: err?.message || 'An unknown error occurred',
    };
  }

  private paginate<T>(items: T[], options?: QueryOptions): PaginatedResult<T> {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedItems = items.slice(start, end);

    return {
      data: paginatedItems,
      total: items.length,
      page,
      pageSize,
      hasMore: end < items.length,
    };
  }

  // ============ BOOKS ============
  async getBooks(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<Book>>> {
    // Using local data - replace with Supabase query when table exists
    const books = booksData as Book[];
    return { data: this.paginate(books, options), error: null };
  }

  async getBook(id: string): Promise<DatabaseResult<Book>> {
    const books = booksData as Book[];
    const book = books.find(b => b.id === id);
    if (!book) {
      return { data: null, error: { code: 'not_found', message: 'Book not found' } };
    }
    return { data: book, error: null };
  }

  async searchBooks(query: string): Promise<DatabaseResult<Book[]>> {
    const books = booksData as Book[];
    const lowerQuery = query.toLowerCase();
    const results = books.filter(b => 
      b.title.toLowerCase().includes(lowerQuery) ||
      b.author.toLowerCase().includes(lowerQuery) ||
      b.description?.toLowerCase().includes(lowerQuery)
    );
    return { data: results, error: null };
  }

  // ============ BHAJANS ============
  async getBhajans(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<Bhajan>>> {
    const bhajans = bhajansData as Bhajan[];
    return { data: this.paginate(bhajans, options), error: null };
  }

  async getBhajan(id: string): Promise<DatabaseResult<Bhajan>> {
    const bhajans = bhajansData as Bhajan[];
    const bhajan = bhajans.find(b => b.id === id);
    if (!bhajan) {
      return { data: null, error: { code: 'not_found', message: 'Bhajan not found' } };
    }
    return { data: bhajan, error: null };
  }

  async getBhajansByCategory(category: string): Promise<DatabaseResult<Bhajan[]>> {
    const bhajans = bhajansData as Bhajan[];
    const results = bhajans.filter(b => b.category === category);
    return { data: results, error: null };
  }

  async getBhajansByDeity(deity: string): Promise<DatabaseResult<Bhajan[]>> {
    const bhajans = bhajansData as Bhajan[];
    const results = bhajans.filter(b => b.deity === deity);
    return { data: results, error: null };
  }

  async searchBhajans(query: string): Promise<DatabaseResult<Bhajan[]>> {
    const bhajans = bhajansData as Bhajan[];
    const lowerQuery = query.toLowerCase();
    const results = bhajans.filter(b => 
      b.title.toLowerCase().includes(lowerQuery) ||
      b.artist?.toLowerCase().includes(lowerQuery)
    );
    return { data: results, error: null };
  }

  // ============ REELS ============
  // Note: Reels require database tables to be created first
  async getReels(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<Reel>>> {
    // Return empty result until reels table is created
    return {
      data: {
        data: [],
        total: 0,
        page: options?.page || 1,
        pageSize: options?.pageSize || 20,
        hasMore: false,
      },
      error: null,
    };
  }

  async getReel(id: string): Promise<DatabaseResult<Reel>> {
    return { data: null, error: { code: 'not_found', message: 'Reel not found' } };
  }

  async getUserReels(userId: string): Promise<DatabaseResult<Reel[]>> {
    return { data: [], error: null };
  }

  async createReel(reel: Omit<Reel, 'id' | 'createdAt' | 'likes' | 'views'>): Promise<DatabaseResult<Reel>> {
    return { 
      data: null, 
      error: { code: 'not_implemented', message: 'Reels table not yet created' } 
    };
  }

  async deleteReel(id: string): Promise<DatabaseResult<void>> {
    return { data: undefined, error: null };
  }

  async likeReel(id: string): Promise<DatabaseResult<void>> {
    return { data: undefined, error: null };
  }

  async incrementReelViews(id: string): Promise<DatabaseResult<void>> {
    return { data: undefined, error: null };
  }

  // ============ PANCHANG ============
  async getPanchangData(date: string, city: string): Promise<DatabaseResult<PanchangData>> {
    const dateDataAll = panchangData.data as Record<string, Record<string, {
      tithi: string;
      nakshatra: string;
      yoga: string;
      karana: string;
      sunrise: string;
      sunset: string;
      moonrise: string;
      moonset: string;
      festivals?: string[];
      muhurtas?: Record<string, string>;
    }>>;
    
    const cityDataRaw = dateDataAll[date]?.[city];
    if (!cityDataRaw) {
      return { data: null, error: { code: 'not_found', message: 'Panchang data not found' } };
    }

    return {
      data: {
        date,
        city,
        tithi: cityDataRaw.tithi,
        nakshatra: cityDataRaw.nakshatra,
        yoga: cityDataRaw.yoga,
        karana: cityDataRaw.karana,
        sunrise: cityDataRaw.sunrise,
        sunset: cityDataRaw.sunset,
        moonrise: cityDataRaw.moonrise,
        moonset: cityDataRaw.moonset,
        festivals: cityDataRaw.festivals || [],
        muhurtas: cityDataRaw.muhurtas || {},
      },
      error: null,
    };
  }

  async getUpcomingFestivals(city: string, limit = 10): Promise<DatabaseResult<PanchangData[]>> {
    const today = new Date().toISOString().split('T')[0];
    const results: PanchangData[] = [];
    
    const dateDataAll = panchangData.data as Record<string, Record<string, {
      tithi: string;
      nakshatra: string;
      yoga: string;
      karana: string;
      sunrise: string;
      sunset: string;
      moonrise: string;
      moonset: string;
      festivals?: string[];
      muhurtas?: Record<string, string>;
    }>>;

    for (const [date, cities] of Object.entries(dateDataAll)) {
      if (date >= today && cities[city]?.festivals && cities[city].festivals!.length > 0) {
        const cityData = cities[city];
        results.push({
          date,
          city,
          tithi: cityData.tithi,
          nakshatra: cityData.nakshatra,
          yoga: cityData.yoga,
          karana: cityData.karana,
          sunrise: cityData.sunrise,
          sunset: cityData.sunset,
          moonrise: cityData.moonrise,
          moonset: cityData.moonset,
          festivals: cityData.festivals || [],
          muhurtas: cityData.muhurtas || {},
        });
      }
      if (results.length >= limit) break;
    }

    return { data: results, error: null };
  }

  // ============ POOJA VIDHIS ============
  async getPoojaVidhis(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<PoojaVidhi>>> {
    const vidhis = vidhisData as PoojaVidhi[];
    return { data: this.paginate(vidhis, options), error: null };
  }

  async getPoojaVidhi(id: string): Promise<DatabaseResult<PoojaVidhi>> {
    const vidhis = vidhisData as PoojaVidhi[];
    const vidhi = vidhis.find(v => v.id === id);
    if (!vidhi) {
      return { data: null, error: { code: 'not_found', message: 'Pooja Vidhi not found' } };
    }
    return { data: vidhi, error: null };
  }

  async getPoojaVidhisByDeity(deity: string): Promise<DatabaseResult<PoojaVidhi[]>> {
    const vidhis = vidhisData as PoojaVidhi[];
    const results = vidhis.filter(v => v.deity === deity);
    return { data: results, error: null };
  }

  async getPoojaVidhisByDifficulty(difficulty: string): Promise<DatabaseResult<PoojaVidhi[]>> {
    const vidhis = vidhisData as PoojaVidhi[];
    const results = vidhis.filter(v => v.difficulty === difficulty);
    return { data: results, error: null };
  }

  // ============ USER PROFILE ============
  // Note: Profile operations require profiles table to be created
  async getUserProfile(userId: string): Promise<DatabaseResult<UserProfile>> {
    return { data: null, error: { code: 'not_found', message: 'Profile not found' } };
  }

  async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseResult<UserProfile>> {
    return { 
      data: null, 
      error: { code: 'not_implemented', message: 'Profiles table not yet created' } 
    };
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<DatabaseResult<UserProfile>> {
    return { 
      data: null, 
      error: { code: 'not_implemented', message: 'Profiles table not yet created' } 
    };
  }
}
