import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import ChessBoard from './components/ChessBoard';
import { ChessBoard as ChessBoardType } from './types/chess';
import {
  createInitialBoard,
  isValidMove,
  movePiece,
  getValidMoves,
} from './utils/chessUtils';
import { makeAIMove, AIDifficulty } from './utils/ChessAI';

const App: React.FC = () => {
  const [board, setBoard] = useState<ChessBoardType>(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>(
    'white'
  );

  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(
    AIDifficulty.Easy
  );
  const [isAITurn, setIsAITurn] = useState(false);

  useEffect(() => {
    console.log(
      'Effect triggered. isAITurn:',
      isAITurn,
      'currentPlayer:',
      currentPlayer
    );
    if (gameStarted && isAITurn && currentPlayer !== playerColor) {
      console.log('AI is making a move');
      const aiColor = playerColor === 'white' ? 'black' : 'white';
      const newBoard = makeAIMove(board, aiDifficulty);
      setBoard(newBoard);
      setCurrentPlayer(playerColor);
      setIsAITurn(false);
    }
  }, [gameStarted, isAITurn, playerColor, board, aiDifficulty, currentPlayer]);

  const handleSquareClick = useCallback(
    (position: string) => {
      console.log('Square clicked:', position);
      if (!gameStarted || currentPlayer !== playerColor || isAITurn) {
        console.log(
          'Click ignored. gameStarted:',
          gameStarted,
          'currentPlayer:',
          currentPlayer,
          'isAITurn:',
          isAITurn
        );
        return;
      }

      const clickedSquare = board
        .flat()
        .find((square) => square.position === position);
      if (!clickedSquare) return;

      if (selectedSquare === null) {
        if (
          clickedSquare.piece &&
          clickedSquare.piece.color === currentPlayer
        ) {
          setSelectedSquare(position);
          setValidMoves(getValidMoves(board, position));
        }
      } else {
        if (position === selectedSquare) {
          setSelectedSquare(null);
          setValidMoves([]);
        } else if (validMoves.includes(position)) {
          console.log('Making a move from', selectedSquare, 'to', position);
          const newBoard = movePiece(board, selectedSquare, position);
          setBoard(newBoard);
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
          setSelectedSquare(null);
          setValidMoves([]);
          setIsAITurn(true);
          console.log('Player move complete. isAITurn set to true.');
        } else if (
          clickedSquare.piece &&
          clickedSquare.piece.color === currentPlayer
        ) {
          setSelectedSquare(position);
          setValidMoves(getValidMoves(board, position));
        } else {
          setSelectedSquare(null);
          setValidMoves([]);
        }
      }
    },
    [
      board,
      selectedSquare,
      currentPlayer,
      validMoves,
      gameStarted,
      playerColor,
      isAITurn,
    ]
  );

  const handleStartGame = () => {
    if (playerName && playerColor && aiDifficulty) {
      setGameStarted(true);
      setCurrentPlayer('white');
      setBoard(createInitialBoard());
      setIsAITurn(playerColor === 'black');
      console.log(
        'Game started. Player color:',
        playerColor,
        "AI's turn:",
        playerColor === 'black'
      );
    }
  };

  if (!gameStarted) {
    return (
      <Box sx={{ maxWidth: 300, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Chess Game Setup
        </Typography>
        <TextField
          fullWidth
          label="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Your Color</InputLabel>
          <Select
            value={playerColor}
            onChange={(e) =>
              setPlayerColor(e.target.value as 'white' | 'black')
            }
          >
            <MenuItem value="white">White</MenuItem>
            <MenuItem value="black">Black</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>AI Difficulty</InputLabel>
          <Select
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(e.target.value as AIDifficulty)}
          >
            <MenuItem value={AIDifficulty.Easy}>Easy</MenuItem>
            <MenuItem value={AIDifficulty.Medium}>Medium</MenuItem>
            <MenuItem value={AIDifficulty.Hard}>Hard</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleStartGame}
          fullWidth
          sx={{ mt: 2 }}
        >
          Start Game
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Chess Game
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        {playerName} ({playerColor}) vs AI ({aiDifficulty})
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Current Player: {currentPlayer}
      </Typography>
      <ChessBoard
        board={board}
        onSquareClick={handleSquareClick}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
      />
    </Box>
  );
};

export default App;
