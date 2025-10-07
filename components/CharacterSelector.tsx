import React from 'react';
import { characters } from '../data/characters';

interface CharacterSelectorProps {
  selectedCharacters: string[];
  onToggleCharacter: (name: string) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ selectedCharacters, onToggleCharacter }) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4">
      {characters.map((character) => {
        const isSelected = selectedCharacters.includes(character.name);
        return (
          <button
            key={character.name}
            type="button"
            onClick={() => onToggleCharacter(character.name)}
            className={`group relative aspect-square flex flex-col items-center justify-end p-1 rounded-lg focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-105 ${
              isSelected
                ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-indigo-500' 
                : 'ring-1 ring-gray-700 hover:ring-indigo-600'
            }`}
          >
            <img
              src={`https://picsum.photos/seed/${character.imageSeed}/100`}
              alt={character.name}
              className={`w-full h-full object-cover rounded-md transition-all duration-200 ${isSelected ? 'saturate-100 scale-105' : 'saturate-50 group-hover:saturate-100'}`}
            />
            <div className={`absolute inset-0 rounded-md transition-colors ${isSelected ? 'bg-black/30' : 'bg-gradient-to-t from-black/70 to-transparent'}`}></div>
            {isSelected && (
              <div className="absolute top-1 right-1 bg-indigo-600 rounded-full h-4 w-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <p className="relative text-xs sm:text-sm font-semibold text-white truncate z-10">
              {character.name}
            </p>
          </button>
        )
      })}
    </div>
  );
};
