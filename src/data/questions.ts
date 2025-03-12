export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const questionsData: Question[] = [
  {
    id: 1,
    question:
      "በተከታተላችሁት የህልም ጉልበት ለእመርታዊ እድገት ስልጠና በቀጣይ ትኩረት የሚሹ ጉዳዮች ናቸው ተብለው የቀመጡት ጥቀስ፡-",
    options: [
      "የህልም ጉልበትን ለዕምርታዊ ዕድገት መጠቀም፣ ",
      "የተጀመረውን የፖለቲካ ሪፎርም ወደ እምርታ ማሸጋገር",
      "የተጀመረውን የሠላም ግንባታ አጠናክሮ በማስቀጠል የህዝቦችን ሠላምና አብሮነት ማስቀጠል",
    ],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Da Vinci", "Picasso", "Michelangelo"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
  },
  {
    id: 8,
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "South Korea", "Thailand", "Japan"],
    correctAnswer: 3,
  },
  {
    id: 9,
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "Jane Austen",
      "William Shakespeare",
      "Mark Twain",
    ],
    correctAnswer: 2,
  },
];
