import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateQuote, generateBackgroundVisual } from './services/geminiService';
import QuoteDisplay from './components/QuoteDisplay';
import ControlPanel from './components/ControlPanel';
import { AppState, Settings, VisualMode } from './types';

const DEFAULT_TOPIC = "Motivation & Discipline";
const UPDATE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    quote: null,
    backgroundImageUrl: null,
    isLoading: true,
    lastUpdated: 0,
  });

  const [settings, setSettings] = useState<Settings>({
    updateIntervalMinutes: 10,
    visualMode: VisualMode.TEXT_ONLY,
    topic: DEFAULT_TOPIC
  });

  const [controlsVisible, setControlsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(UPDATE_INTERVAL_MS / 1000);
  
  // Ref to keep track of the interval ID to clear it if needed
  const timerRef = useRef<number | null>(null);
  // Ref to track if we are currently fetching to prevent double fetches
  const isFetchingRef = useRef(false);

  const fetchContent = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const quoteData = await generateQuote(settings.topic);
      let bgImage = null;

      if (settings.visualMode === VisualMode.IMAGE_BACKGROUND) {
        bgImage = await generateBackgroundVisual(quoteData.text);
      }

      setState({
        quote: quoteData,
        backgroundImageUrl: bgImage,
        isLoading: false,
        lastUpdated: Date.now()
      });
      
      // Reset timer
      setTimeLeft(UPDATE_INTERVAL_MS / 1000);

    } catch (error) {
      console.error("Failed to fetch content", error);
      setState(prev => ({ ...prev, isLoading: false }));
    } finally {
      isFetchingRef.current = false;
    }
  }, [settings.topic, settings.visualMode]);

  // Initial load
  useEffect(() => {
    fetchContent();
    // Enable wake lock if available
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

  // Handle interaction to toggle controls
  const handleScreenTap = () => {
    setControlsVisible(prev => !prev);
  };

  // Hide controls automatically after inactivity
  useEffect(() => {
    if (controlsVisible) {
      const timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 5000); // Hide after 5 seconds of inactivity
      return () => clearTimeout(timeout);
    }
  }, [controlsVisible]);

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center select-none"
      onClick={handleScreenTap}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out">
        {state.backgroundImageUrl ? (
          <>
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 grayscale"
                style={{ backgroundImage: `url(${state.backgroundImageUrl})` }}
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
          </>
        ) : (
          <div className="absolute inset-0 bg-neutral-950">
             {/* Subtle Radial Gradient for Text Mode */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-50" />
          </div>
        )}
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