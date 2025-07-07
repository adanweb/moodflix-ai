
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItemClasses = "px-4 py-2 rounded-md text-sm md:text-base font-medium transition-colors duration-300";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              <span className="text-blue-400">Mood</span>Flix AI
            </h1>
          </div>
          <nav className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setView(View.Quiz)}
              className={`${navItemClasses} ${currentView === View.Quiz || currentView === View.Results ? activeClasses : inactiveClasses}`}
            >
              Recommender
            </button>
            <button
              onClick={() => setView(View.Chat)}
              className={`${navItemClasses} ${currentView === View.Chat ? activeClasses : inactiveClasses}`}
            >
              AI Chat
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
