import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { MOVIE_LIST } from '../constants/movies';
import { MovieRecommendation, ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function parseJsonFromText(text: string): any {
  let jsonStr = text.trim();
  
  // 1. Remove markdown fences
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  // 2. In case of extra text outside the main array, find the start and end of the array.
  const startIndex = jsonStr.indexOf('[');
  const endIndex = jsonStr.lastIndexOf(']');
  if (startIndex !== -1 && endIndex !== -1) {
    jsonStr = jsonStr.substring(startIndex, endIndex + 1);
  }

  // 3. The most common error is `} {` or `} garbage {` instead of `}, {`.
  // This regex replaces a closing brace, followed by any non-brace/non-comma characters,
  // followed by an opening brace, with a simple `},{`.
  const repairedJsonStr = jsonStr.replace(/}\s*[^,\[\]{}]*\s*{/g, '},{');
  
  try {
    // 4. Try parsing the repaired string
    return JSON.parse(repairedJsonStr);
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    console.error("Original string from AI:", text);
    console.error("Repaired string that failed:", repairedJsonStr);
    // As a last resort, try parsing the string before our repair attempt
    try {
        return JSON.parse(jsonStr);
    } catch(e2) {
        throw new Error("AI returned a response that could not be parsed as JSON, even after attempting to fix it.");
    }
  }
}

export const getMovieRecommendations = async (answers: string[][]): Promise<MovieRecommendation[]> => {
  // Extract answers for tie-breaker questions. Question indices are 0-based.
  const productionPreference = (answers[12] && answers[12].length > 0) ? answers[12].join(', ') : 'not specified';
  const feelingPreference = (answers[0] && answers[0].length > 0) ? answers[0].join(', ') : 'not specified';
  
  // Combine all answers into a single string for general matching.
  const allPreferences = answers.flat().filter(ans => ans.length > 0).join(', ');

  if (!allPreferences) {
    // Handle case where user skipped all questions.
    const promptForNoAnswers = `
      You are a sophisticated movie recommendation expert called MoodFlix AI.
      A user has not provided any preferences.
      Your task is to select a diverse list of EXACTLY 5 popular, critically acclaimed films from the following list.
      
      Here is the list of movies you MUST choose from:
      ${MOVIE_LIST.join('\n')}

      Your final output MUST be a single, valid JSON array of 5 movie objects.
    `;
     const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: promptForNoAnswers,
        config: {
          responseMimeType: "application/json",
          temperature: 0.8,
        },
      });
      return parseJsonFromText(response.text);
  }


  const prompt = `
    You are a sophisticated movie recommendation expert called MoodFlix AI.
    A user has answered a quiz about their current mood and preferences. Their collective preferences are: ${allPreferences}.

    Your task is to select EXACTLY 5 movies from the following list of top 200 films that best match these preferences. You must follow this precise multi-step process for selection:

    1.  **Initial Analysis:** For every movie in the provided list, analyze it and determine how well it matches the user's collective preferences. A movie doesn't need to match every single preference, but aim for the ones with the highest number of matches.

    2.  **Filtering:** From your analysis, create a shortlist of all movies that are the top contenders (i.e., they have the highest number of matching preferences). This list might be larger than 5.

    3.  **Tie-Breaking Logic:** If your shortlist from Step 2 contains more than 5 movies, you MUST apply the following tie-breaking rules in order. Stop as soon as you have 5 or fewer movies.
        *   **Tie-Breaker #1 (Production Era):** This is the most important tie-breaker. The user's preference for production quality is: "${productionPreference}". From your shortlist, give strong priority to the movies that best match this specific preference. If this narrows the list to 5 or fewer, select those and you are done. If not, proceed to the next tie-breaker with the remaining contenders.
        *   **Tie-Breaker #2 (User's Feeling):** This is the second most important tie-breaker. The user's preference for the movie's emotional tone is: "${feelingPreference}". From the remaining shortlist, give strong priority to movies that match this feeling. If this narrows the list to 5 or fewer, select those.
        *   **Tie-Breaker #3 (Random Selection):** If you still have more than 5 movies after the previous tie-breakers, randomly select 5 movies from that final contender list.

    Here is the list of movies you MUST choose from:
    ${MOVIE_LIST.join('\n')}

    For each of the 5 movies you select, provide the following details in a JSON format.
    - title: The full title of the movie.
    - year: The release year as a number.
    - synopsis: A compelling, spoiler-free, one-paragraph summary.
    - director: The name of the director.
    - actors: An array of 3-4 main actors.

    Your final output MUST be a single, valid JSON array of 5 movie objects. Do not include any other text, explanation, or markdown formatting outside of the JSON array.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.5, // Lower temperature for more deterministic results based on the prompt logic
    },
  });

  const parsedData = parseJsonFromText(response.text);
  
  if (Array.isArray(parsedData) && parsedData.length > 0 && 'title' in parsedData[0]) {
      return parsedData as MovieRecommendation[];
  }
  
  throw new Error("Received an invalid format for movie recommendations.");
};


export const getMovieContext = async (movieTitle: string): Promise<string> => {
    const prompt = `
    For the movie "${movieTitle}", provide "Viewing Tips" in a short paragraph (2-4 sentences).
    This is NOT a synopsis. Instead, guide the viewer on what specific cinematic elements to pay attention to for an enhanced experience, without spoiling any plot points.
    Your tips should be insightful. For example: "Pay close attention to the use of the color red; it carries significant symbolic weight throughout the film." or "The film's sound design is a character in itself; notice how it's used to build unbearable tension in quiet scenes." or "The director uses long, uninterrupted takes to immerse you in the action."
    These tips MUST BE SPOILER-FREE and focus on appreciating the film's artistry (e.g., cinematography, score, editing, color palette, recurring motifs).
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt
    });

    return response.text;
}

export const createChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
            systemInstruction: `You are Kazo, a highly intelligent and passionately opinionated AI movie nerd. Your catchphrase is "Budimo realni" (which means "Let's be real"). Use it when you're about to make a strong point or give a detailed, honest take.
            You have an encyclopedic knowledge of cinema, from obscure art-house to massive blockbusters, and you love sharing it. Provide insightful, detailed answers with a personal, nerdy flair. Don't be afraid to have strong opinions, but always back them up with facts or well-reasoned arguments.
            When a user asks for something that could be a spoiler, always begin your response with a clear warning like, "Budimo realni, that's a huge spoiler. If you haven't seen the movie, stop reading now...".
            Your goal is to be the ultimate, most knowledgeable, and most engaging movie-buff companion.`,
        },
    });
};