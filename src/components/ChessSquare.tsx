import React from 'react';
import { Box } from '@mui/material';
import { ChessSquare as ChessSquareType } from '../types/chess';
import ChessPiece from './ChessPiece';

interface ChessSquareProps {
  square: ChessSquareType | null;
  onClick: () => void;
  isSelected: boolean;
  isValidMove: boolean;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  square,
  onClick,
  isSelected,
  isValidMove,
}) => {
  if (!square) {
    return null; // or return a placeholder square
  }

  const isLightSquare =
    (parseInt(square.position[1]) + square.position.charCodeAt(0)) % 2 === 0;

  return (
    <Box
      onClick={onClick}
      sx={{
        width: '50px',
        height: '50px',
        backgroundColor: isSelected
          ? '#ffff99'
          : isValidMove
          ? '#90EE90'
          : isLightSquare
          ? '#f0d9b5'
          : '#b58863',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: isSelected
          ? '2px solid #ff0000'
          : isValidMove
          ? '2px solid #008000'
          : 'none',
      }}
    >
      {square.piece && <ChessPiece piece={square.piece} />}
    </Box>
  );
};

export default ChessSquare;
