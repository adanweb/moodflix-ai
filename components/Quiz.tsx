import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../constants/questions';
import { Answer } from '../types';

interface QuizProps {
  onSubmit: (answers: string[][]) => void;
}

const Quiz: React.FC<QuizProps> = ({ onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allAnswers, setAllAnswers] = useState<string[][]>(() => Array(QUESTIONS.length).fill([]));
  const [currentSelections, setCurrentSelections] = useState<Set<string>>(() => new Set(allAnswers[0]));

  useEffect(() => {
    // When question changes, load the stored answers for that question
    setCurrentSelections(new Set(allAnswers[currentQuestionIndex]));
  }, [currentQuestionIndex, allAnswers]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / QUESTIONS.length) * 100;

  const handleAnswerToggle = (answerValue: string) => {
    const newSelections = new Set(currentSelections);
    if (newSelections.has(answerValue)) {
      newSelections.delete(answerValue);
    } else {
      newSelections.add(answerValue);
    }
    setCurrentSelections(newSelections);
  };
  
  const persistAndGoTo = (nextIndex: number) => {
    const newAllAnswers = [...allAnswers];
    newAllAnswers[currentQuestionIndex] = Array.from(currentSelections);
    setAllAnswers(newAllAnswers);

    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      onSubmit(newAllAnswers);
    }
  };
  
  const handleNext = () => persistAndGoTo(currentQuestionIndex + 1);
  const handleBack = () => persistAndGoTo(currentQuestionIndex - 1);

  const handleSkip = () => {
    // Clear selections for this question and save it as an empty array
    const newAllAnswers = [...allAnswers];
    newAllAnswers[currentQuestionIndex] = [];
    setAllAnswers(newAllAnswers);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      onSubmit(newAllAnswers);
    }
  }

  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-gray-400">
          <span>Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          {currentQuestion.text}
        </h2>
        <p className="text-gray-400 mt-2 text-sm">You can select one or more answers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {currentQuestion.answers.map((answer, index) => {
          const isSelected = currentSelections.has(answer.value);
          return (
            <button
              key={index}
              onClick={() => handleAnswerToggle(answer.value)}
              className={`
                p-4 rounded-lg text-left transition-all duration-200 ease-in-out transform 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500
                border-2 
                ${isSelected 
                  ? 'bg-blue-600 border-blue-400 scale-105 shadow-lg' 
                  : 'bg-gray-700 border-gray-700 hover:bg-gray-600/50 hover:border-gray-500'
                }
              `}
            >
              <p className="text-lg font-medium text-white">{answer.text}</p>
            </button>
          )
        })}
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-4 border-t border-gray-700">
         <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="mt-4 sm:mt-0 px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
           <button
            onClick={handleSkip}
            className="px-6 py-2 text-gray-400 font-semibold rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
          >
            {isLastQuestion ? 'Skip & Finish' : 'Skip Question'}
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isLastQuestion ? 'Get Recommendations' : 'Next'}
          </button>
      </div>
    </div>
  );
};

export default Quiz;