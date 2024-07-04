import React from 'react';
import { ChessPiece as ChessPieceType } from '../types/chess';

interface ChessPieceProps {
  piece: ChessPieceType;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
  const getPieceSymbol = () => {
    switch (piece.type) {
      case 'pawn':
        return piece.color === 'white' ? '♙' : '♟';
      case 'rook':
        return piece.color === 'white' ? '♖' : '♜';
      case 'knight':
        return piece.color === 'white' ? '♘' : '♞';
      case 'bishop':
        return piece.color === 'white' ? '♗' : '♝';
      case 'queen':
        return piece.color === 'white' ? '♕' : '♛';
      case 'king':
        return piece.color === 'white' ? '♔' : '♚';
    }
  };

  return <div style={{ fontSize: '30px' }}>{getPieceSymbol()}</div>;
};

export default ChessPiece;
