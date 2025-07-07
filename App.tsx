import React, { useState, useCallback } from 'react';
import { View, MovieRecommendation, UserRating } from './types';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Chatbot from './components/Chatbot';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import { getMovieRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Quiz);
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
  const [ratings, setRatings] = useState<UserRating>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuizSubmit = useCallback(async (answers: string[][]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMovieRecommendations(answers);
      setRecommendations(result);
      setView(View.Results);
    } catch (e) {
      console.error(e);
      setError('Failed to get recommendations. The AI might be busy. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRateMovie = useCallback((title: string, rating: number) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [title]: rating,
    }));
  }, []);

  const resetToQuiz = () => {
    setView(View.Quiz);
    setRecommendations([]);
    setError(null);
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Our AI is curating your movie list..." />;
    }

    if (error) {
      return (
        <div className="text-center text-red-400">
          <p>{error}</p>
          <button
            onClick={resetToQuiz}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (view) {
      case View.Quiz:
        return <Quiz onSubmit={handleQuizSubmit} />;
      case View.Results:
        return <Results recommendations={recommendations} ratings={ratings} onRateMovie={handleRateMovie} onRestart={resetToQuiz} />;
      case View.Chat:
        return <Chatbot />;
      default:
        return <Quiz onSubmit={handleQuizSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header currentView={view} setView={setView} />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-7xl">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Gemini AI. Movie data is for demonstration purposes only.</p>
      </footer>
    </div>
  );
};

export default App;