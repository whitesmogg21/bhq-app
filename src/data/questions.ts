
import { Question, QBank } from "../types/quiz";

export const qbanks: QBank[] = [
  {
    id: "general",
    name: "General Knowledge",
    description: "Test your general knowledge with these questions",
    tags: ["general", "knowledge"],
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        qbankId: "general",
        tags: ["geography", "capitals"]
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        qbankId: "general",
        tags: ["science", "astronomy"]
      },
      {
        id: 3,
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3,
        qbankId: "general",
        tags: ["geography", "oceans"]
      },
      {
        id: 4,
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correctAnswer: 1,
        qbankId: "general",
        tags: ["art", "history"]
      },
      {
        id: 5,
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Cu"],
        correctAnswer: 2,
        qbankId: "general",
        tags: ["science", "chemistry"]
      }
    ]
  },
  {
    id: "science",
    name: "Science",
    description: "Challenge yourself with science questions",
    tags: ["science"],
    questions: [
      {
        id: 6,
        question: "What is the chemical symbol for Oxygen?",
        options: ["O", "Ox", "Om", "On"],
        correctAnswer: 0,
        qbankId: "science",
        tags: ["science", "chemistry"]
      },
      {
        id: 7,
        question: "What is the speed of light?",
        options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
        correctAnswer: 0,
        qbankId: "science",
        tags: ["science", "physics"]
      }
    ]
  }
];
