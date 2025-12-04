export interface BhajanCredits {
  singers?: string[];
  label?: string;
  producer?: string;
  lyricist?: string;
  composer?: string;
  copyright?: string;
  year?: string;
  source?: string;
}

export interface Bhajan {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: string;
  language: string;
  deity: string;
  audioFile: string;
  thumbnail?: string;
  lrcFile?: string;
  lyrics?: string;
  credits?: BhajanCredits;
}
