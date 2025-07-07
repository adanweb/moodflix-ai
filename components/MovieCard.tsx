import React, { useState, useCallback } from 'react';
import { MovieRecommendation } from '../types';
import { getMovieContext } from '../services/geminiService';
import StarRating from './StarRating';
import LoadingSpinner from './LoadingSpinner';

interface MovieCardProps {
  movie: MovieRecommendation;
  rating: number;
  onRate: (rating: number) => void;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, rating, onRate, index }) => {
  const [showContext, setShowContext] = useState(false);
  const [contextText, setContextText] = useState('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  const fetchContext = useCallback(async () => {
    if (showContext) {
      setShowContext(false);
      return;
    }
    
    if(contextText) {
        setShowContext(true);
        return;
    }

    setIsLoadingContext(true);
    setShowContext(true);
    try {
      const result = await getMovieContext(movie.title);
      setContextText(result);
    } catch (error) {
      setContextText("Could not load viewing tips at this time.");
      console.error(error);
    } finally {
      setIsLoadingContext(false);
    }
  }, [showContext, contextText, movie.title]);

  const cardStyle = {
    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
    opacity: 0,
  };

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col border border-gray-700/50 transition-transform transform hover:scale-105 hover:shadow-blue-500/20"
      style={cardStyle}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <img
        src={`https://picsum.photos/seed/${movie.title.replace(/\s/g, '')}/300/450`}
        alt={`Poster for ${movie.title}`}
        className="w-full h-64 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white">{movie.title} <span className="text-gray-400 font-normal">({movie.year})</span></h3>
        <p className="text-sm text-gray-500 mb-2">Directed by {movie.director}</p>
        
        <p className="text-sm text-gray-300 flex-grow mb-3">
          {movie.synopsis}
        </p>

        <div className="mb-3">
            <h4 className="text-xs text-gray-500 uppercase font-semibold mb-1">Starring</h4>
            <p className="text-sm text-gray-400">{movie.actors.join(', ')}</p>
        </div>
        
        <div className="mt-auto space-y-3">
          <div className="border-t border-b border-gray-700 py-2">
            <p className="text-xs text-gray-400 text-center mb-1">Rate this movie</p>
            <StarRating rating={rating} onRate={onRate} />
          </div>

          <button
            onClick={fetchContext}
            className="w-full text-center px-3 py-2 text-sm bg-gray-700/80 text-blue-300 rounded-md hover:bg-gray-700 transition-colors"
          >
            {showContext ? 'Hide Viewing Tips' : 'Show Viewing Tips'}
          </button>

          {showContext && (
            <div className="p-3 bg-gray-900/50 rounded-md text-sm text-gray-300 transition-all">
              {isLoadingContext ? <LoadingSpinner message="" /> : <p>{contextText}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
