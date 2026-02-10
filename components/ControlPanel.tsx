import React from 'react';
import { Settings } from '../types';

interface ControlPanelProps {
  isVisible: boolean;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  onRefresh: () => void;
  isLoading: boolean;
  nextUpdateIn: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  isVisible, 
  onRefresh, 
  isLoading,
  nextUpdateIn
}) => {
  if (!isVisible) return null;

  const minutesLeft = Math.floor(nextUpdateIn / 60);
  const secondsLeft = nextUpdateIn % 60;

  return (
    <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-gray-800 p-6 transition-transform duration-300 ease-out z-50">
      <div className="max-w-md mx-auto space-y-6">
        
        <div className="flex flex-col items-center space-y-4">
          <span className="text-sm text-gray-400">
            Siguiente frase en: {minutesLeft}:{secondsLeft.toString().padStart(2, '0')}
          </span>
          
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex justify-center items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
            <span>Cambiar Frase Ahora</span>
          </button>
        </div>

        <p className="text-xs text-center text-gray-600 pt-2">
          Toca el centro de la pantalla para ocultar este menú.
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;