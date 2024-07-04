import { ChessBoard, ChessSquare, ChessPiece } from '../types/chess';
import { getValidMoves, movePiece } from './chessUtils';

export enum AIDifficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

const PIECE_VALUES: { [key: string]: number } = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

const PAWN_POSITION_SCORES = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_POSITION_SCORES = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_POSITION_SCORES = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_POSITION_SCORES = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_POSITION_SCORES = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_POSITION_SCORES = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

export const makeAIMove = (
  board: ChessBoard,
  difficulty: AIDifficulty
): ChessBoard => {
  const aiColor = 'black'; // Assuming AI always plays as black
  const depth = getDifficultyDepth(difficulty);

  const bestMove = minimaxRoot(depth, board, true, aiColor);

  if (bestMove) {
    return movePiece(board, bestMove.from, bestMove.to);
  }
  return board;
};

const getDifficultyDepth = (difficulty: AIDifficulty): number => {
  switch (difficulty) {
    case AIDifficulty.Easy:
      return 2;
    case AIDifficulty.Medium:
      return 3;
    case AIDifficulty.Hard:
      return 4;
    default:
      return 2;
  }
};

const minimaxRoot = (
  depth: number,
  board: ChessBoard,
  isMaximizingPlayer: boolean,
  aiColor: 'white' | 'black'
) => {
  const newGameMoves = getAllValidMoves(board, aiColor);
  let bestMove = null;
  let bestMoveValue = isMaximizingPlayer ? -9999 : 9999;

  for (let i = 0; i < newGameMoves.length; i++) {
    const newGameMove = newGameMoves[i];
    const newBoard = movePiece(board, newGameMove.from, newGameMove.to);
    const value = minimax(
      depth - 1,
      newBoard,
      !isMaximizingPlayer,
      -10000,
      10000,
      aiColor
    );
    if (isMaximizingPlayer) {
      if (value >= bestMoveValue) {
        bestMoveValue = value;
        bestMove = newGameMove;
      }
    } else {
      if (value <= bestMoveValue) {
        bestMoveValue = value;
        bestMove = newGameMove;
      }
    }
  }
  return bestMove;
};

const minimax = (
  depth: number,
  board: ChessBoard,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number,
  aiColor: 'white' | 'black'
): number => {
  if (depth === 0) {
    return -evaluateBoard(board, aiColor);
  }

  const newGameMoves = getAllValidMoves(
    board,
    isMaximizingPlayer ? aiColor : aiColor === 'white' ? 'black' : 'white'
  );

  if (isMaximizingPlayer) {
    let bestMove = -9999;
    for (let i = 0; i < newGameMoves.length; i++) {
      const newBoard = movePiece(
        board,
        newGameMoves[i].from,
        newGameMoves[i].to
      );
      bestMove = Math.max(
        bestMove,
        minimax(depth - 1, newBoard, !isMaximizingPlayer, alpha, beta, aiColor)
      );
      alpha = Math.max(alpha, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  } else {
    let bestMove = 9999;
    for (let i = 0; i < newGameMoves.length; i++) {
      const newBoard = movePiece(
        board,
        newGameMoves[i].from,
        newGameMoves[i].to
      );
      bestMove = Math.min(
        bestMove,
        minimax(depth - 1, newBoard, !isMaximizingPlayer, alpha, beta, aiColor)
      );
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  }
};

const evaluateBoard = (
  board: ChessBoard,
  aiColor: 'white' | 'black'
): number => {
  let totalEvaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation += getPieceValue(board[i][j].piece, i, j, aiColor);
    }
  }
  return totalEvaluation;
};

const getPieceValue = (
  piece: ChessPiece | null,
  row: number,
  col: number,
  aiColor: 'white' | 'black'
): number => {
  if (piece === null) {
    return 0;
  }

  const absoluteValue = getAbsoluteValue(piece, row, col);
  return piece.color === aiColor ? absoluteValue : -absoluteValue;
};

const getAbsoluteValue = (
  piece: ChessPiece,
  row: number,
  col: number
): number => {
  let positionScore = 0;
  switch (piece.type) {
    case 'pawn':
      positionScore = PAWN_POSITION_SCORES[row][col];
      break;
    case 'knight':
      positionScore = KNIGHT_POSITION_SCORES[row][col];
      break;
    case 'bishop':
      positionScore = BISHOP_POSITION_SCORES[row][col];
      break;
    case 'rook':
      positionScore = ROOK_POSITION_SCORES[row][col];
      break;
    case 'queen':
      positionScore = QUEEN_POSITION_SCORES[row][col];
      break;
    case 'king':
      positionScore = KING_POSITION_SCORES[row][col];
      break;
  }
  return PIECE_VALUES[piece.type] + positionScore;
};

const getAllValidMoves = (
  board: ChessBoard,
  color: 'white' | 'black'
): { from: string; to: string }[] => {
  const allMoves: { from: string; to: string }[] = [];
  board.forEach((row, i) => {
    row.forEach((square, j) => {
      if (square.piece && square.piece.color === color) {
        const validMoves = getValidMoves(board, square.position);
        validMoves.forEach((move) => {
          allMoves.push({ from: square.position, to: move });
        });
      }
    });
  });
  return allMoves;
};
