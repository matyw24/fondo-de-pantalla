export interface QuoteData {
  text: string;
  author: string;
  category?: string;
}

export interface AppState {
  quote: QuoteData | null;
  isLoading: boolean;
  lastUpdated: number;
}

export interface Settings {
  updateIntervalMinutes: number;
}