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

/**
 * Abstract Database Service Interface
 * 
 * This interface defines ALL database operations.
 * UI components should ONLY use this interface, never the implementation directly.
 * 
 * To swap backends:
 * 1. Create a new implementation (e.g., FirebaseDatabaseService)
 * 2. Update ServiceProvider to use the new implementation
 * 3. No UI changes required
 */
export interface IDatabaseService {
  // Books
  getBooks(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<Book>>>;
  getBook(id: string): Promise<DatabaseResult<Book>>;
  searchBooks(query: string): Promise<DatabaseResult<Book[]>>;

  // Bhajans
  getBhajans(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<Bhajan>>>;
  getBhajan(id: string): Promise<DatabaseResult<Bhajan>>;
  getBhajansByCategory(category: string): Promise<DatabaseResult<Bhajan[]>>;
  getBhajansByDeity(deity: string): Promise<DatabaseResult<Bhajan[]>>;
  searchBhajans(query: string): Promise<DatabaseResult<Bhajan[]>>;

  // Reels
  getReels(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<Reel>>>;
  getReel(id: string): Promise<DatabaseResult<Reel>>;
  getUserReels(userId: string): Promise<DatabaseResult<Reel[]>>;
  createReel(reel: Omit<Reel, 'id' | 'createdAt' | 'likes' | 'views'>): Promise<DatabaseResult<Reel>>;
  deleteReel(id: string): Promise<DatabaseResult<void>>;
  likeReel(id: string): Promise<DatabaseResult<void>>;
  incrementReelViews(id: string): Promise<DatabaseResult<void>>;

  // Panchang
  getPanchangData(date: string, city: string): Promise<DatabaseResult<PanchangData>>;
  getUpcomingFestivals(city: string, limit?: number): Promise<DatabaseResult<PanchangData[]>>;

  // Pooja Vidhis
  getPoojaVidhis(options?: QueryOptions): Promise<DatabaseResult<PaginatedResult<PoojaVidhi>>>;
  getPoojaVidhi(id: string): Promise<DatabaseResult<PoojaVidhi>>;
  getPoojaVidhisByDeity(deity: string): Promise<DatabaseResult<PoojaVidhi[]>>;
  getPoojaVidhisByDifficulty(difficulty: string): Promise<DatabaseResult<PoojaVidhi[]>>;

  // User Profile
  getUserProfile(userId: string): Promise<DatabaseResult<UserProfile>>;
  createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseResult<UserProfile>>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<DatabaseResult<UserProfile>>;
}
