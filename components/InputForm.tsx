import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CharacterSelector } from './CharacterSelector';
import { MapSelector } from './MapSelector';
import { characters } from '../data/characters';
import { Character } from '../types';

type Mode = 'suggestion' | 'strategy';

interface InputFormProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  enemies: string[];
  onToggleEnemy: (name: string) => void;
  myTeam: string[];
  onToggleMyTeam: (name: string) => void;
  mapName: string;
  setMapName: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-1/2 py-2.5 text-sm font-semibold rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
      isActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

const SelectedPortraits: React.FC<{ title: string; names: string[] }> = ({ title, names }) => {
  const portraits = names.map(name => {
    const character = characters.find(c => c.name === name);
    return character ? { name: character.name, imageSeed: character.imageSeed } : null;
  }).filter(Boolean);

  if (portraits.length === 0) return null;

  return (
    <div className="mb-4 p-3 bg-gray-900/50 rounded-lg flex flex-wrap gap-2 items-center">
      <span className="text-xs font-semibold text-gray-400 mr-2">{title}:</span>
      {portraits.map(e => e && (
        <div key={e.name} className="flex items-center gap-2 bg-gray-700/50 rounded-full pr-3">
          <img src={`https://picsum.photos/seed/${e.imageSeed}/40`} alt={e.name} className="w-6 h-6 rounded-full object-cover"/>
          <span className="text-xs text-white font-medium">{e.name}</span>
        </div>
      ))}
    </div>
  );
};


export const InputForm: React.FC<InputFormProps> = ({ mode, setMode, enemies, onToggleEnemy, myTeam, onToggleMyTeam, mapName, setMapName, onSubmit, isLoading }) => {
  
  const isSubmitDisabled = isLoading || enemies.length === 0 || !mapName || (mode === 'strategy' && myTeam.length !== 5);
  const buttonText = mode === 'suggestion' ? 'Sugerir Composição Ideal' : 'Analisar Estratégia';

  const getRoleCounts = (team: string[]) => {
    const counts = { Tank: 0, Damage: 0, Support: 0 };
    team.forEach(name => {
      const char = characters.find(c => c.name === name);
      if (char) counts[char.role]++;
    });
    return counts;
  };
  
  const myTeamRoleCounts = getRoleCounts(myTeam);

  return (
    <form onSubmit={onSubmit} className="w-full max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-2xl shadow-indigo-900/10">
      <div className="flex bg-gray-900/70 p-1 rounded-lg mb-8">
        <TabButton isActive={mode === 'suggestion'} onClick={() => setMode('suggestion')}>Sugerir Composição</TabButton>
        <TabButton isActive={mode === 'strategy'} onClick={() => setMode('strategy')}>Estratégia para Meu Time</TabButton>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Selecione a Composição Inimiga (até 5 heróis)
          </label>
          <SelectedPortraits title="INIMIGOS" names={enemies} />
          <CharacterSelector 
            selectedCharacters={enemies}
            onToggleCharacter={onToggleEnemy}
          />
        </div>

        {mode === 'strategy' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Selecione Sua Composição (1 Tanque, 2 Danos, 2 Suportes)
            </label>
             <SelectedPortraits title="SEU TIME" names={myTeam} />
             <div className="text-xs text-gray-400 mb-3 flex gap-4">
                <span>Tanque: {myTeamRoleCounts.Tank}/1</span>
                <span>Dano: {myTeamRoleCounts.Damage}/2</span>
                <span>Suporte: {myTeamRoleCounts.Support}/2</span>
             </div>
            <CharacterSelector 
              selectedCharacters={myTeam}
              onToggleCharacter={onToggleMyTeam}
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Selecione o Mapa
          </label>
          <MapSelector 
            selectedMap={mapName}
            onSelectMap={setMapName}
          />
        </div>
      </div>
      <button 
        type="submit"
        disabled={isSubmitDisabled}
        className="mt-8 w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analisando...
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5 mr-2" />
            {buttonText}
          </>
        )}
      </button>
    </form>
  );
};