import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomQuote } from './services/geminiService';
import QuoteDisplay from './components/QuoteDisplay';
import ControlPanel from './components/ControlPanel';
import { AppState, Settings } from './types';

const UPDATE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    quote: null,
    isLoading: true,
    lastUpdated: 0,
  });

  const [settings, setSettings] = useState<Settings>({
    updateIntervalMinutes: 10,
  });

  const [controlsVisible, setControlsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(UPDATE_INTERVAL_MS / 1000);
  
  const timerRef = useRef<number | null>(null);
  const isFetchingRef = useRef(false);

  const fetchContent = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Get static quote
      const quoteData = await getRandomQuote();

      setState({
        quote: quoteData,
        isLoading: false,
        lastUpdated: Date.now()
      });
      
      setTimeLeft(UPDATE_INTERVAL_MS / 1000);

    } catch (error) {
      console.error("Failed to fetch content", error);
      setState(prev => ({ ...prev, isLoading: false }));
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchContent();
    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                // @ts-ignore
                await navigator.wakeLock.request('screen');
            }
        } catch (err) {
            console.log("Wake lock not supported or denied");
        }
    };
    requestWakeLock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer logic
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
           fetchContent();
           return UPDATE_INTERVAL_MS / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchContent]);

  const handleScreenTap = () => {
    setControlsVisible(prev => !prev);
  };

  useEffect(() => {
    if (controlsVisible) {
      const timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 5000); 
      return () => clearTimeout(timeout);
    }
  }, [controlsVisible]);

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center select-none"
      onClick={handleScreenTap}
    >
      {/* Background Layer - Simple Gradient since AI is removed */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-neutral-950">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80" />
          </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-4xl h-full mx-auto">
        <QuoteDisplay quote={state.quote} isLoading={state.isLoading} />
      </div>

      {/* Controls Layer */}
      <ControlPanel 
        isVisible={controlsVisible} 
        settings={settings}
        onSettingsChange={setSettings}
        onRefresh={fetchContent}
        isLoading={state.isLoading}
        nextUpdateIn={timeLeft}
      />
    </div>
  );
};

export default App;