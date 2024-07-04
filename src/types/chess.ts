// src/types/chess.ts

export type PieceType =
  | 'pawn'
  | 'rook'
  | 'knight'
  | 'bishop'
  | 'queen'
  | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface ChessSquare {
  piece: ChessPiece | null;
  position: string;
}

export type ChessBoard = ChessSquare[][];

export interface ChessBoardProps {
  board: ChessBoard;
  onSquareClick: (position: string) => void;
  selectedSquare: string | null;
  validMoves: string[];
}

export interface ChessSquareProps {
  square: ChessSquare;
  onClick: () => void;
  isSelected: boolean;
  isValidMove: boolean;
}

export interface ChessPieceProps {
  piece: ChessPiece;
}
