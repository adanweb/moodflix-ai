
import React from 'react';
import { MovieRecommendation, UserRating } from '../types';
import MovieCard from './MovieCard';

interface ResultsProps {
  recommendations: MovieRecommendation[];
  ratings: UserRating;
  onRateMovie: (title: string, rating: number) => void;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ recommendations, ratings, onRateMovie, onRestart }) => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Your AI-Curated Movie Night</h2>
        <p className="text-gray-400 mt-2">Based on your mood, here are 5 movies you might love.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {recommendations.map((movie, index) => (
          <MovieCard
            key={movie.title}
            movie={movie}
            rating={ratings[movie.title] || 0}
            onRate={(rating) => onRateMovie(movie.title, rating)}
            index={index}
          />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Take the Quiz Again
        </button>
      </div>
    </div>
  );
};

export default Results;
