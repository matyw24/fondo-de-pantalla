import { QuoteData } from "../types";

const STATIC_QUOTES: QuoteData[] = [
  {
    text: "La disciplina es el puente entre metas y logros.",
    author: "Jim Rohn",
    category: "Disciplina"
  },
  {
    text: "No cuentes los días, haz que los días cuenten.",
    author: "Muhammad Ali",
    category: "Motivación"
  },
  {
    text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    author: "Robert Collier",
    category: "Éxito"
  },
  {
    text: "Todo lo que siempre has querido está al otro lado del miedo.",
    author: "George Addair",
    category: "Valentía"
  },
  {
    text: "Cae siete veces, levántate ocho.",
    author: "Proverbio Japonés",
    category: "Resiliencia"
  },
  {
    text: "La única forma de hacer un gran trabajo es amar lo que haces.",
    author: "Steve Jobs",
    category: "Pasión"
  },
  {
    text: "No te detengas cuando estés cansado, detente cuando hayas terminado.",
    author: "Marilyn Monroe",
    category: "Persistencia"
  },
  {
    text: "El dolor es temporal. La renuncia dura para siempre.",
    author: "Lance Armstrong",
    category: "Fortaleza"
  },
  {
    text: "Si puedes soñarlo, puedes hacerlo.",
    author: "Walt Disney",
    category: "Visión"
  },
  {
    text: "La mejor venganza es un éxito masivo.",
    author: "Frank Sinatra",
    category: "Ambición"
  },
  {
    text: "Sé el cambio que quieres ver en el mundo.",
    author: "Mahatma Gandhi",
    category: "Liderazgo"
  },
  {
    text: "No busques el momento perfecto, solo busca el momento y hazlo perfecto.",
    author: "Melanie Salmi",
    category: "Acción"
  },
  {
    text: "Tus hábitos forjan tu futuro.",
    author: "Anónimo",
    category: "Hábitos"
  },
  {
    text: "El que conquista a otros es fuerte; el que se conquista a sí mismo es poderoso.",
    author: "Lao-Tse",
    category: "Estoicismo"
  },
  {
    text: "Sufriremos más a menudo en la imaginación que en la realidad.",
    author: "Séneca",
    category: "Estoicismo"
  },
  {
    text: "Haz cada día tu obra maestra.",
    author: "John Wooden",
    category: "Excelencia"
  },
  {
    text: "Cree que puedes y ya estarás a medio camino.",
    author: "Theodore Roosevelt",
    category: "Confianza"
  }
];

export const getRandomQuote = async (): Promise<QuoteData> => {
  const randomIndex = Math.floor(Math.random() * STATIC_QUOTES.length);
  // Simulación de carga mínima para efecto visual
  await new Promise(resolve => setTimeout(resolve, 500));
  return STATIC_QUOTES[randomIndex];
};