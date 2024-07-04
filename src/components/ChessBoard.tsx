import React from 'react';
import { Grid, Box } from '@mui/material';
import ChessSquare from './ChessSquare';
import { ChessBoard as ChessBoardType } from '../types/chess';

interface ChessBoardProps {
  board: ChessBoardType;
  onSquareClick: (position: string) => void;
  selectedSquare: string | null;
  validMoves: string[];
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  onSquareClick,
  selectedSquare,
  validMoves,
}) => {
  return (
    <Box
      sx={{
        width: '400px',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {board.map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', flex: 1 }}>
          {row.map((square, colIndex) => (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              square={square}
              onClick={() => onSquareClick(square.position)}
              isSelected={square.position === selectedSquare}
              isValidMove={validMoves.includes(square.position)}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ChessBoard;
