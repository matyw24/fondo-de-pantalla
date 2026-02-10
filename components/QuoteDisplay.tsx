import React from 'react';
import { QuoteData } from '../types';

interface QuoteDisplayProps {
  quote: QuoteData | null;
  isLoading: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLoading }) => {
  if (isLoading && !quote) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-pulse">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 tracking-widest text-sm uppercase">Generando inspiración...</p>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className={`flex flex-col items-center justify-center h-full p-8 text-center transition-opacity duration-1000 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
      
      {quote.category && (
        <span className="mb-8 text-xs font-bold tracking-[0.3em] text-gray-500 uppercase border-b border-gray-800 pb-2">
          {quote.category}
        </span>
      )}

      <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-tight md:leading-snug drop-shadow-lg max-w-4xl">
        "{quote.text}"
      </h1>
      
      <div className="mt-8 md:mt-12 flex items-center space-x-4">
        <div className="h-px w-8 bg-gray-600"></div>
        <p className="text-lg md:text-xl text-gray-400 font-light italic font-sans tracking-wide">
          {quote.author}
        </p>
        <div className="h-px w-8 bg-gray-600"></div>
      </div>

    </div>
  );
};

export default QuoteDisplay;