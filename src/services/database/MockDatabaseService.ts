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
} from './types';

// Import local data for mocks
import booksData from '@/data/books.json';
import bhajansData from '@/data/bhajans.json';
import panchangData from '@/data/panchang.json';
import vidhisData from '@/data/vidhis.json';

/**
 * Mock Implementation of DatabaseService
 * 
 * Use this for:
 * - Development without backend
 * - Unit testing
 * - Demos
 */
export class MockDatabaseService implements IDatabaseService {
  private mockReels: Reel[] = [];
  private mockProfiles: Map<string, UserProfile> = new Map();

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
    await this.delay();
    const books = booksData as Book[];
    return { data: this.paginate(books, options), error: null };
  }

  async getBook(id: string): Promise<DatabaseResult<Book>> {
    await this.delay();
    const books = booksData as Book[];
    const book = books.find(b => b.id === id);
    if (!book) {
      return { data: null, error: { code: 'not_found', message: 'Book not found' } };
    }
    return { data: book, error: null };
  }

  async searchBooks(query: string): Promise<DatabaseResult<Book[]>> {
    await this.delay();
    const books = booksData as Book[];
    const lowerQuery = query.toLowerCase();
    const results = books.filter(b => 
      b.title.toLowerCase().includes(lowerQuery) ||
      b.author.toLowerCase().includes(lowerQuery)
    );
    return { data: results, error: null };
  }

  // ============ BHAJANS ============
  async getBhajans(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<Bhajan>>> {
    await this.delay();
    const bhajans = bhajansData as Bhajan[];
    return { data: this.paginate(bhajans, options), error: null };
  }

  async getBhajan(id: string): Promise<DatabaseResult<Bhajan>> {
    await this.delay();
    const bhajans = bhajansData as Bhajan[];
    const bhajan = bhajans.find(b => b.id === id);
    if (!bhajan) {
      return { data: null, error: { code: 'not_found', message: 'Bhajan not found' } };
    }
    return { data: bhajan, error: null };
  }

  async getBhajansByCategory(category: string): Promise<DatabaseResult<Bhajan[]>> {
    await this.delay();
    const bhajans = bhajansData as Bhajan[];
    const results = bhajans.filter(b => b.category === category);
    return { data: results, error: null };
  }

  async getBhajansByDeity(deity: string): Promise<DatabaseResult<Bhajan[]>> {
    await this.delay();
    const bhajans = bhajansData as Bhajan[];
    const results = bhajans.filter(b => b.deity === deity);
    return { data: results, error: null };
  }

  async searchBhajans(query: string): Promise<DatabaseResult<Bhajan[]>> {
    await this.delay();
    const bhajans = bhajansData as Bhajan[];
    const lowerQuery = query.toLowerCase();
    const results = bhajans.filter(b => 
      b.title.toLowerCase().includes(lowerQuery) ||
      b.artist?.toLowerCase().includes(lowerQuery)
    );
    return { data: results, error: null };
  }

  // ============ REELS ============
  async getReels(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<Reel>>> {
    await this.delay();
    return { data: this.paginate(this.mockReels, options), error: null };
  }

  async getReel(id: string): Promise<DatabaseResult<Reel>> {
    await this.delay();
    const reel = this.mockReels.find(r => r.id === id);
    if (!reel) {
      return { data: null, error: { code: 'not_found', message: 'Reel not found' } };
    }
    return { data: reel, error: null };
  }

  async getUserReels(userId: string): Promise<DatabaseResult<Reel[]>> {
    await this.delay();
    const reels = this.mockReels.filter(r => r.userId === userId);
    return { data: reels, error: null };
  }

  async createReel(reel: Omit<Reel, 'id' | 'createdAt' | 'likes' | 'views'>): Promise<DatabaseResult<Reel>> {
    await this.delay();
    const newReel: Reel = {
      ...reel,
      id: `reel-${Date.now()}`,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    this.mockReels.unshift(newReel);
    return { data: newReel, error: null };
  }

  async deleteReel(id: string): Promise<DatabaseResult<void>> {
    await this.delay();
    this.mockReels = this.mockReels.filter(r => r.id !== id);
    return { data: undefined, error: null };
  }

  async likeReel(id: string): Promise<DatabaseResult<void>> {
    await this.delay();
    const reel = this.mockReels.find(r => r.id === id);
    if (reel) reel.likes++;
    return { data: undefined, error: null };
  }

  async incrementReelViews(id: string): Promise<DatabaseResult<void>> {
    await this.delay();
    const reel = this.mockReels.find(r => r.id === id);
    if (reel) reel.views++;
    return { data: undefined, error: null };
  }

  // ============ PANCHANG ============
  async getPanchangData(date: string, city: string): Promise<DatabaseResult<PanchangData>> {
    await this.delay();
    
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
    await this.delay();
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
    await this.delay();
    const vidhis = vidhisData as PoojaVidhi[];
    return { data: this.paginate(vidhis, options), error: null };
  }

  async getPoojaVidhi(id: string): Promise<DatabaseResult<PoojaVidhi>> {
    await this.delay();
    const vidhis = vidhisData as PoojaVidhi[];
    const vidhi = vidhis.find(v => v.id === id);
    if (!vidhi) {
      return { data: null, error: { code: 'not_found', message: 'Pooja Vidhi not found' } };
    }
    return { data: vidhi, error: null };
  }

  async getPoojaVidhisByDeity(deity: string): Promise<DatabaseResult<PoojaVidhi[]>> {
    await this.delay();
    const vidhis = vidhisData as PoojaVidhi[];
    const results = vidhis.filter(v => v.deity === deity);
    return { data: results, error: null };
  }

  async getPoojaVidhisByDifficulty(difficulty: string): Promise<DatabaseResult<PoojaVidhi[]>> {
    await this.delay();
    const vidhis = vidhisData as PoojaVidhi[];
    const results = vidhis.filter(v => v.difficulty === difficulty);
    return { data: results, error: null };
  }

  // ============ USER PROFILE ============
  async getUserProfile(userId: string): Promise<DatabaseResult<UserProfile>> {
    await this.delay();
    const profile = this.mockProfiles.get(userId);
    if (!profile) {
      return { data: null, error: { code: 'not_found', message: 'Profile not found' } };
    }
    return { data: profile, error: null };
  }

  async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseResult<UserProfile>> {
    await this.delay();
    const newProfile: UserProfile = {
      ...profile,
      id: `profile-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mockProfiles.set(profile.userId, newProfile);
    return { data: newProfile, error: null };
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<DatabaseResult<UserProfile>> {
    await this.delay();
    const profile = this.mockProfiles.get(userId);
    if (!profile) {
      return { data: null, error: { code: 'not_found', message: 'Profile not found' } };
    }
    const updatedProfile = { ...profile, ...updates, updatedAt: new Date().toISOString() };
    this.mockProfiles.set(userId, updatedProfile);
    return { data: updatedProfile, error: null };
  }

  private delay(ms = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
