import React, { useState } from 'react';
import { Settings, VisualMode } from '../types';

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
  settings, 
  onSettingsChange, 
  onRefresh, 
  isLoading,
  nextUpdateIn
}) => {
  // Use local state to manage inputs before saving/applying if needed, 
  // but for this simple app, direct updates feel snappier.
  
  if (!isVisible) return null;

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, topic: e.target.value });
  };

  const toggleVisualMode = () => {
    const newMode = settings.visualMode === VisualMode.TEXT_ONLY 
      ? VisualMode.IMAGE_BACKGROUND 
      : VisualMode.TEXT_ONLY;
    onSettingsChange({ ...settings, visualMode: newMode });
  };

  const minutesLeft = Math.floor(nextUpdateIn / 60);
  const secondsLeft = nextUpdateIn % 60;

  return (
    <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-gray-800 p-6 transition-transform duration-300 ease-out z-50">
      <div className="max-w-md mx-auto space-y-6">
        
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Próxima actualización: {minutesLeft}:{secondsLeft.toString().padStart(2, '0')}</span>
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 text-white hover:text-gray-200 disabled:opacity-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
            <span>Actualizar ahora</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Tema / Inspiración</label>
          <input 
            type="text" 
            value={settings.topic}
            onChange={handleTopicChange}
            placeholder="Ej: Estoicismo, Éxito, Naturaleza..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="flex items-center justify-between">
           <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Modo Visual (IA Imagen)</span>
           <button 
             onClick={toggleVisualMode}
             className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.visualMode === VisualMode.IMAGE_BACKGROUND ? 'bg-white' : 'bg-gray-800'}`}
           >
             <div className={`w-4 h-4 bg-black rounded-full shadow-md transform transition-transform duration-300 ${settings.visualMode === VisualMode.IMAGE_BACKGROUND ? 'translate-x-6' : 'translate-x-0'}`}></div>
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