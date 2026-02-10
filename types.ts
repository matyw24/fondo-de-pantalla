export interface QuoteData {
  text: string;
  author: string;
  category?: string;
}

export interface AppState {
  quote: QuoteData | null;
  backgroundImageUrl: string | null;
  isLoading: boolean;
  lastUpdated: number;
}

export enum VisualMode {
  TEXT_ONLY = 'TEXT_ONLY',
  IMAGE_BACKGROUND = 'IMAGE_BACKGROUND'
}

export interface Settings {
  updateIntervalMinutes: number;
  visualMode: VisualMode;
  topic: string;
}