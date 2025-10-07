
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center animate-fade-in-up">
      <p className="font-semibold">Ocorreu um Erro</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};
