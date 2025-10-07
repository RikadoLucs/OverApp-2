import React from 'react';
import { maps } from '../data/maps';

interface MapSelectorProps {
  selectedMap: string;
  onSelectMap: (name: string) => void;
}

export const MapSelector: React.FC<MapSelectorProps> = ({ selectedMap, onSelectMap }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
      {maps.map((map) => (
        <button
          key={map.name}
          type="button"
          onClick={() => onSelectMap(map.name)}
          className={`group relative aspect-video flex flex-col items-center justify-end p-1 rounded-lg focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-105 ${
            selectedMap === map.name 
              ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-indigo-500' 
              : 'ring-1 ring-gray-700 hover:ring-indigo-600'
          }`}
        >
          <img
            src={`https://picsum.photos/seed/${map.imageSeed}/200/113`}
            alt={map.name}
            className={`w-full h-full object-cover rounded-md transition-all duration-200 ${selectedMap === map.name ? 'saturate-100' : 'saturate-50 group-hover:saturate-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-md"></div>
          <p className="relative text-xs sm:text-sm font-semibold text-white truncate z-10 p-1 text-center">
            {map.name}
          </p>
        </button>
      ))}
    </div>
  );
};
