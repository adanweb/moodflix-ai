import { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How are you feeling right now?",
    answers: [
      { text: "Happy and energetic", value: "seeking a joyful, upbeat movie" },
      { text: "Calm and thoughtful", value: "in the mood for a thought-provoking, deep film" },
      { text: "A bit down, need a pick-me-up", value: "wanting a heartwarming and inspiring story" },
      { text: "Stressed and need an escape", value: "looking for a total escape into another world" },
    ],
  },
  {
    id: 2,
    text: "What kind of world do you want to dive into?",
    answers: [
      { text: "A gritty, realistic city", value: "preferring a realistic, urban setting" },
      { text: "The vastness of outer space", value: "interested in science fiction and space" },
      { text: "A historical period", value: "wanting a film set in the past" },
      { text: "A magical, fantastical realm", value: "looking for a fantasy or magical world" },
    ],
  },
  {
    id: 3,
    text: "How much thinking do you want to do?",
    answers: [
      { text: "I want a complex, mind-bending plot", value: "desiring a complex plot that requires attention" },
      { text: "Something engaging but not overly complicated", value: "wanting a balanced, engaging story" },
      { text: "Pure entertainment, please!", value: "looking for an easy-to-watch, fun movie" },
      { text: "I'm open to an emotional journey", value: "ready for an emotionally deep experience" },
    ],
  },
  {
    id: 4,
    text: "What's your preferred pace?",
    answers: [
      { text: "Fast-paced and full of action", value: "preferring a high-octane, action-packed movie" },
      { text: "A slow-burn with building tension", value: "in the mood for a suspenseful, slow-burn film" },
      { text: "A steady, character-driven story", value: "wanting a story focused on character development" },
      { text: "Doesn't matter, as long as it's good", value: "open to any pace if the story is compelling" },
    ],
  },
  {
    id: 5,
    text: "Choose a dominant emotion for your movie:",
    answers: [
      { text: "Laughter", value: "wants a comedy" },
      { text: "Tension", value: "wants a thriller or horror" },
      { text: "Inspiration", value: "wants an uplifting story" },
      { text: "Nostalgia", value: "wants a classic or feel-good movie" },
    ],
  },
  {
    id: 6,
    text: "Are you watching alone or with company?",
    answers: [
      { text: "Alone, I can get fully immersed", value: "watching alone, open to intense or complex films" },
      { text: "With a partner", value: "looking for a movie suitable for a couple, perhaps a romance or drama" },
      { text: "With friends", value: "wanting a fun, crowd-pleasing movie for a group" },
      { text: "With family", value: "needing a family-friendly or universally appealing film" },
    ],
  },
  {
    id: 7,
    text: "Do you want a story that feels...",
    answers: [
      { text: "...larger than life and epic?", value: "prefers an epic-scale story" },
      { text: "...intimate and personal?", value: "prefers a small-scale, personal story" },
      { text: "...chaotic and unpredictable?", value: "enjoys chaotic and unpredictable plots" },
      { text: "...structured and classic?", value: "enjoys classic, well-structured storytelling" },
    ],
  },
  {
    id: 8,
    text: "How do you feel about endings?",
    answers: [
      { text: "I need a happy, satisfying ending", value: "prefers a happy ending" },
      { text: "A thought-provoking or ambiguous ending is great", value: "enjoys ambiguous or thoughtful endings" },
      { text: "I can handle a tragic or bittersweet ending", value: "is open to sad or bittersweet endings" },
      { text: "Surprise me with a twist!", value: "loves a good plot twist" },
    ],
  },
  {
    id: 9,
    text: "Pick a visual style:",
    answers: [
      { text: "Visually stunning with beautiful cinematography", value: "values strong cinematography and visual beauty" },
      { text: "Gritty and realistic", value: "prefers a raw, realistic visual style" },
      { text: "Colorful and imaginative animation", value: "is in the mood for an animated film" },
      { text: "Classic black and white", value: "appreciates black and white films" },
    ],
  },
  {
    id: 10,
    text: "What kind of protagonist are you looking for?",
    answers: [
      { text: "A heroic and inspiring figure", value: "wants a classic hero protagonist" },
      { text: "A morally complex anti-hero", value: "is interested in anti-heroes" },
      { text: "An ordinary person in extraordinary circumstances", value: "likes relatable, everyday protagonists" },
      { text: "A clever and witty character", value: "enjoys smart and witty characters" },
    ],
  },
  {
    id: 11,
    text: "Do you prefer dialogue-heavy or action-heavy films?",
    answers: [
      { text: "Sharp, witty dialogue is key", value: "prefers dialogue-driven movies" },
      { text: "Let the action tell the story", value: "prefers action-oriented storytelling" },
      { text: "A good balance of both", value: "wants a balance of action and dialogue" },
      { text: "More visual storytelling, less talk", value: "prefers visual storytelling with minimal dialogue" },
    ],
  },
  {
    id: 12,
    text: "What is your tolerance for on-screen intensity?",
    answers: [
      { text: "Bring on the intense action and drama", value: "has a high tolerance for intensity" },
      { text: "Some tension is fine, but not too graphic", value: "prefers moderate intensity" },
      { text: "I'd prefer something light and easygoing", value: "wants a low-intensity, lighthearted film" },
      { text: "I'm okay with emotional intensity, but not violence", value: "prefers emotional intensity over physical violence" },
    ],
  },
  {
    id: 13,
    text: "How important is modern production quality to you?",
    answers: [
      { text: "I want the latest high-resolution and amazing sound", value: "prefers modern, high-tech productions with top-tier visuals and sound" },
      { text: "I love the charm and grain of older movies", value: "enjoys classic films and is not concerned with modern technical specs" },
      { text: "Story is king, I don't care about production age", value: "is indifferent to production quality, focusing only on story and characters" },
    ],
  },
  {
    id: 14,
    text: "Do you want to laugh or cry?",
    answers: [
      { text: "Definitely laugh", value: "is explicitly looking for a comedy" },
      { text: "A good cry can be cathartic", value: "is open to a tearjerker or emotional drama" },
      { text: "A mix of both would be perfect", value: "wants a dramedy with both humor and emotion" },
      { text: "Neither, I'm looking for thrills", value: "prefers suspense and thrills over comedy or drama" },
    ],
  },
  {
    id: 15,
    text: "Finally, what's more important to you?",
    answers: [
      { text: "A powerful message or theme", value: "prioritizes a strong message or theme" },
      { text: "An intricate and clever plot", value: "prioritizes a well-crafted plot" },
      { text: "Deep and memorable characters", value: "prioritizes character development" },
      { text: "Pure cinematic style and spectacle", value: "prioritizes visual style and spectacle" },
    ],
  },
];
