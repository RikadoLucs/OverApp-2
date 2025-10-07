import React, { useState, useCallback } from 'react';
import { getTeamRecommendation, getStrategyForTeam } from './services/geminiService';
import { TeamRecommendation, TeamStrategy, Character } from './types';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { ErrorMessage } from './components/ErrorMessage';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { characters } from './data/characters';

type Mode = 'suggestion' | 'strategy';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('suggestion');
  const [enemies, setEnemies] = useState<string[]>([]);
  const [myTeam, setMyTeam] = useState<string[]>([]);
  const [mapName, setMapName] = useState('');
  const [result, setResult] = useState<TeamRecommendation | TeamStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleEnemy = useCallback((name: string) => {
    setEnemies(prev => {
      const isSelected = prev.includes(name);
      if (isSelected) {
        return prev.filter(n => n !== name);
      } else {
        return prev.length < 5 ? [...prev, name] : prev;
      }
    });
  }, []);

  const handleToggleMyTeam = useCallback((name: string) => {
    setMyTeam(prev => {
      const isSelected = prev.includes(name);
      if (isSelected) {
        return prev.filter(n => n !== name);
      }
      
      const characterToAdd = characters.find(c => c.name === name);
      if (!characterToAdd) return prev;

      const currentRoles = prev.map(heroName => characters.find(c => c.name === heroName)?.role);
      const tankCount = currentRoles.filter(r => r === 'Tank').length;
      const damageCount = currentRoles.filter(r => r === 'Damage').length;
      const supportCount = currentRoles.filter(r => r === 'Support').length;

      if (characterToAdd.role === 'Tank' && tankCount >= 1) return prev;
      if (characterToAdd.role === 'Damage' && damageCount >= 2) return prev;
      if (characterToAdd.role === 'Support' && supportCount >= 2) return prev;
      
      if (prev.length >= 5) return prev;

      return [...prev, name];
    });
  }, []);


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (enemies.length === 0 || !mapName) return;
    if (mode === 'strategy' && myTeam.length !== 5) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let apiResult;
      if (mode === 'suggestion') {
        apiResult = await getTeamRecommendation(enemies, mapName);
      } else {
        apiResult = await getStrategyForTeam(myTeam, enemies, mapName);
      }
      setResult(apiResult);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  }, [mode, enemies, myTeam, mapName]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{
          backgroundImage: 'url(https://picsum.photos/1920/1080?blur=10)', 
          opacity: 0.1,
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-gray-900"></div>
      
      <main className="relative z-10 flex flex-col items-center w-full">
        <header className="text-center my-8 animate-fade-in-down">
          <div className="flex items-center justify-center gap-4">
            <SparklesIcon className="h-10 w-10 text-indigo-400" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              Analisador de Composição
            </h1>
          </div>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Use a IA para montar a composição ideal ou analisar a estratégia do seu time.
          </p>
        </header>

        <InputForm
          mode={mode}
          setMode={setMode}
          enemies={enemies}
          onToggleEnemy={handleToggleEnemy}
          myTeam={myTeam}
          onToggleMyTeam={handleToggleMyTeam}
          mapName={mapName}
          setMapName={setMapName}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {error && <ErrorMessage message={error} />}
        
        {result && <ResultCard result={result} />}

        {!isLoading && !result && !error && (
            <div className="text-center mt-12 text-gray-500 max-w-lg animate-fade-in-up">
              <h3 className="text-xl font-semibold">Aguardando sua análise</h3>
              <p className="mt-2">Selecione os times e o mapa, depois clique no botão para receber uma recomendação estratégica completa da IA.</p>
            </div>
        )}

      </main>

      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.7s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;