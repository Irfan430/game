export interface Puzzle {
  id: string;
  type: 'math' | 'typing';
  question: string;
  answer: string;
  timeLimit: number; // in seconds
}

// Math puzzle generators
const generateMathPuzzle = (): Puzzle => {
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number, num2: number, answer: number, question: string;
  
  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 50) + 25;
      num2 = Math.floor(Math.random() * 25) + 1;
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      break;
    case '*':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    default:
      num1 = 5;
      num2 = 5;
      answer = 10;
      question = '5 + 5 = ?';
  }
  
  return {
    id: Date.now().toString(),
    type: 'math',
    question,
    answer: answer.toString(),
    timeLimit: 15,
  };
};

// Typing puzzle generators
const typingPhrases = [
  'hack the matrix',
  'access granted',
  'firewall bypassed',
  'system breach detected',
  'decryption complete',
  'neural network activated',
  'quantum encryption',
  'cyber security protocol',
  'data stream intercepted',
  'mainframe compromised',
  'digital fortress',
  'code injection successful',
  'backdoor established',
  'root access obtained',
  'vulnerability exploited',
];

const generateTypingPuzzle = (): Puzzle => {
  const phrase = typingPhrases[Math.floor(Math.random() * typingPhrases.length)];
  
  return {
    id: Date.now().toString(),
    type: 'typing',
    question: `Type: "${phrase}"`,
    answer: phrase,
    timeLimit: 20,
  };
};

// Binary conversion puzzles
const generateBinaryPuzzle = (): Puzzle => {
  const number = Math.floor(Math.random() * 255) + 1;
  const binary = number.toString(2);
  
  const puzzleType = Math.random() > 0.5 ? 'toBinary' : 'fromBinary';
  
  if (puzzleType === 'toBinary') {
    return {
      id: Date.now().toString(),
      type: 'math',
      question: `Convert ${number} to binary:`,
      answer: binary,
      timeLimit: 25,
    };
  } else {
    return {
      id: Date.now().toString(),
      type: 'math',
      question: `Convert binary ${binary} to decimal:`,
      answer: number.toString(),
      timeLimit: 25,
    };
  }
};

// Hex conversion puzzles
const generateHexPuzzle = (): Puzzle => {
  const number = Math.floor(Math.random() * 255) + 1;
  const hex = number.toString(16).toUpperCase();
  
  return {
    id: Date.now().toString(),
    type: 'math',
    question: `Convert ${number} to hexadecimal:`,
    answer: hex,
    timeLimit: 20,
  };
};

// Main puzzle generator
export const generateRandomPuzzle = (): Puzzle => {
  const puzzleTypes = [
    generateMathPuzzle,
    generateTypingPuzzle,
    generateBinaryPuzzle,
    generateHexPuzzle,
  ];
  
  const generator = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
  return generator();
};

// Validate puzzle answer
export const validateAnswer = (puzzle: Puzzle, userAnswer: string): boolean => {
  const cleanAnswer = userAnswer.trim().toLowerCase();
  const correctAnswer = puzzle.answer.toLowerCase();
  
  if (puzzle.type === 'typing') {
    return cleanAnswer === correctAnswer;
  } else {
    // For math puzzles, allow for different formats
    return cleanAnswer === correctAnswer || 
           parseInt(cleanAnswer) === parseInt(correctAnswer);
  }
};

// Get difficulty-based puzzle
export const getPuzzleByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Puzzle => {
  switch (difficulty) {
    case 'easy':
      return Math.random() > 0.5 ? generateMathPuzzle() : generateTypingPuzzle();
    case 'medium':
      return Math.random() > 0.3 ? generateBinaryPuzzle() : generateMathPuzzle();
    case 'hard':
      return Math.random() > 0.3 ? generateHexPuzzle() : generateBinaryPuzzle();
    default:
      return generateMathPuzzle();
  }
};