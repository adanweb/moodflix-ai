
import { Chat } from "@google/genai";

export enum View {
  Quiz,
  Results,
  Chat,
}

export interface Answer {
  text: string;
  value: string;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

export interface MovieRecommendation {
  title: string;
  year: number;
  synopsis: string;
  director: string;
  actors: string[];
}

export interface UserRating {
  [movieTitle: string]: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatbotProps {
  // no props
}
