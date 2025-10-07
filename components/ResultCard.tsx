import React from 'react';
import { TeamRecommendation, TeamStrategy, KeyMatchup } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { characters } from '../data/characters';

const roleColors: { [key: string]: string } = {
  Tank: 'border-blue-400 bg-blue-900/50 text-blue-300',
  Damage: 'border-red-400 bg-red-900/50 text-red-300',
  Support: 'border-green-400 bg-green-900/50 text-green-300',
};

const HeroPortrait: React.FC<{ name: string; role: 'Tank' | 'Damage' | 'Support' }> = ({ name, role }) => {
  const characterData = characters.find(c => c.name === name);
  const imageSeed = characterData ? characterData.imageSeed : name;
  return (
    <div className="flex flex-col items-center text-center p-2 rounded-lg bg-gray-900/50 w-full">
      <img 
        src={`https://picsum.photos/seed/${imageSeed}/150`} 
        alt={`Arte de ${name}`}
        className={`w-24 h-24 rounded-full border-4 object-cover shadow-lg ${roleColors[role] || 'border-gray-500'}`}
      />
      <h3 className="text-lg font-bold text-white mt-3 truncate w-full">{name}</h3>
      <p className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${roleColors[role] || 'bg-gray-700'}`}>{role}</p>
    </div>
  );
};

const RecommendationView: React.FC<{ recommendation: TeamRecommendation }> = ({ recommendation }) => (
  <>
    <h2 className="text-3xl font-bold text-white text-center mb-8">Composição de Time Recomendada</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
      {recommendation.recommendedTeam.map((hero) => (
        <HeroPortrait key={hero.character} name={hero.character} role={hero.role} />
      ))}
    </div>
    <div>
      <h3 className="text-2xl font-semibold text-white border-b-2 border-indigo-500 pb-2 mb-4">Estratégia da Composição</h3>
      <p className="text-gray-300 leading-relaxed">{recommendation.strategy}</p>
      <h3 className="text-2xl font-semibold text-white border-b-2 border-indigo-500 pb-2 mb-4 mt-8">Pontos-Chave</h3>
      <ul className="space-y-3">
        {recommendation.keyPoints.map((tip, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
            <span className="text-gray-300">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  </>
);

const StrategyView: React.FC<{ strategy: TeamStrategy }> = ({ strategy }) => (
  <>
    <h2 className="text-3xl font-bold text-white text-center mb-8">Análise Estratégica</h2>
    
    <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white border-b-2 border-indigo-500 pb-2 mb-4">Estratégia Geral</h3>
        <p className="text-gray-300 leading-relaxed">{strategy.overallStrategy}</p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <div>
        <h3 className="text-xl font-semibold text-green-400 mb-3">Pontos Fortes</h3>
        <ul className="space-y-2">
          {strategy.strengths.map((point, i) => (
            <li key={i} className="flex items-start text-gray-300"><span className="mr-2 text-green-400 font-bold">+</span>{point}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-red-400 mb-3">Pontos Fracos</h3>
        <ul className="space-y-2">
          {strategy.weaknesses.map((point, i) => (
            <li key={i} className="flex items-start text-gray-300"><span className="mr-2 text-red-400 font-bold">-</span>{point}</li>
          ))}
        </ul>
      </div>
    </div>
    
    <div>
        <h3 className="text-2xl font-semibold text-white border-b-2 border-indigo-500 pb-2 mb-4">Confrontos-Chave</h3>
        <div className="space-y-4">
            {strategy.keyMatchups.map((matchup, i) => (
                <div key={i} className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="font-bold text-indigo-400">{matchup.hero}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-bold text-red-400">{matchup.vs}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{matchup.tip}</p>
                </div>
            ))}
        </div>
    </div>
  </>
);


export const ResultCard: React.FC<{ result: TeamRecommendation | TeamStrategy }> = ({ result }) => {
  // Type guard to check which view to render
  const isRecommendation = 'recommendedTeam' in result;

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-indigo-900/20 overflow-hidden">
        <div className="p-8">
          {isRecommendation ? (
            <RecommendationView recommendation={result as TeamRecommendation} />
          ) : (
            <StrategyView strategy={result as TeamStrategy} />
          )}
        </div>
      </div>
    </div>
  );
};