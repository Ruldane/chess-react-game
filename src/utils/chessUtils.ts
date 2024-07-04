import { ChessBoard, ChessPiece, PieceType, PieceColor } from '../types/chess';

export const createInitialBoard = (): ChessBoard => {
  const board: ChessBoard = Array(8)
    .fill(null)
    .map((_, rowIndex) =>
      Array(8)
        .fill(null)
        .map((_, colIndex) => ({
          piece: null,
          position: `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`,
        }))
    );

  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i].piece = { type: 'pawn', color: 'black' }; // Changed to black
    board[6][i].piece = { type: 'pawn', color: 'white' };
  }

  // Set up other pieces
  const setupPieces = (row: number, color: PieceColor) => {
    const pieceOrder: PieceType[] = [
      'rook',
      'knight',
      'bishop',
      'queen',
      'king',
      'bishop',
      'knight',
      'rook',
    ];
    pieceOrder.forEach((piece, col) => {
      board[row][col].piece = { type: piece, color };
    });
  };

  setupPieces(0, 'black'); // Changed to black
  setupPieces(7, 'white');

  return board;
};

const getCoordinates = (position: string): [number, number] => {
  const col = position.charCodeAt(0) - 97;
  const row = 8 - parseInt(position[1]);
  return [row, col];
};

const getPosition = (row: number, col: number): string => {
  return `${String.fromCharCode(97 + col)}${8 - row}`;
};

const isValidPawnMove = (
  board: ChessBoard,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  const piece = board[fromRow][fromCol].piece!;
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;

  console.log(
    `Checking pawn move from (${fromRow},${fromCol}) to (${toRow},${toCol})`
  );
  console.log(
    `Pawn color: ${piece.color}, Direction: ${direction}, Start row: ${startRow}`
  );

  // Move forward
  if (fromCol === toCol && board[toRow][toCol].piece === null) {
    if (toRow === fromRow + direction) {
      console.log('Valid pawn move: one square forward');
      return true;
    }
    if (
      fromRow === startRow &&
      toRow === fromRow + 2 * direction &&
      board[fromRow + direction][fromCol].piece === null
    ) {
      console.log('Valid pawn move: two squares forward from start');
      return true;
    }
  }

  // Capture diagonally
  if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
    if (
      board[toRow][toCol].piece !== null &&
      board[toRow][toCol].piece!.color !== piece.color
    ) {
      console.log('Valid pawn move: capture diagonally');
      return true;
    }
  }

  console.log('Invalid pawn move');
  return false;
};
const isValidRookMove = (
  board: ChessBoard,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  console.log(
    `Checking rook move from (${fromRow},${fromCol}) to (${toRow},${toCol})`
  );

  if (fromRow !== toRow && fromCol !== toCol) {
    console.log('Invalid rook move: not in a straight line');
    return false;
  }

  const rowStep =
    fromRow === toRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
  const colStep =
    fromCol === toCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);

  for (
    let i = 1;
    i < Math.max(Math.abs(toRow - fromRow), Math.abs(toCol - fromCol));
    i++
  ) {
    if (board[fromRow + i * rowStep][fromCol + i * colStep].piece !== null) {
      console.log('Invalid rook move: piece in the way');
      return false;
    }
  }

  console.log('Valid rook move');
  return true;
};

const isValidKnightMove = (
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  console.log(
    `Checking knight move from (${fromRow},${fromCol}) to (${toRow},${toCol})`
  );

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
    console.log('Valid knight move');
    return true;
  }

  console.log('Invalid knight move');
  return false;
};

const isValidBishopMove = (
  board: ChessBoard,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  console.log(
    `Checking bishop move from (${fromRow},${fromCol}) to (${toRow},${toCol})`
  );

  if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) {
    console.log('Invalid bishop move: not diagonal');
    return false;
  }

  const rowStep = (toRow - fromRow) / Math.abs(toRow - fromRow);
  const colStep = (toCol - fromCol) / Math.abs(toCol - fromCol);

  for (let i = 1; i < Math.abs(toRow - fromRow); i++) {
    if (board[fromRow + i * rowStep][fromCol + i * colStep].piece !== null) {
      console.log('Invalid bishop move: piece in the way');
      return false;
    }
  }

  console.log('Valid bishop move');
  return true;
};

const isValidQueenMove = (
  board: ChessBoard,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  console.log(
    `Checking queen move from (${fromRow},${fromCol}) to (${toRow},${toCol})`
  );

  if (
    isValidRookMove(board, fromRow, fromCol, toRow, toCol) ||
    isValidBishopMove(board, fromRow, fromCol, toRow, toCol)
  ) {
    console.log('Valid queen move');
    return true;
  }

  console.log('Invalid queen move');
  return false;
};

const isValidKingMove = (
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  console.log(
    `Checking king move from (${fromRow},${fromCol}) to (${toRow},${toCol})`
  );

  if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) {
    console.log('Valid king move');
    return true;
  }

  console.log('Invalid king move');
  return false;
};

export const isValidMove = (
  board: ChessBoard,
  from: string,
  to: string
): boolean => {
  const [fromRow, fromCol] = getCoordinates(from);
  const [toRow, toCol] = getCoordinates(to);
  const piece = board[fromRow][fromCol].piece;
  const targetSquare = board[toRow][toCol];

  console.log(`Checking move: ${piece?.type} from ${from} to ${to}`);

  if (!piece) {
    console.log('No piece at the starting position');
    return false;
  }

  if (targetSquare.piece && targetSquare.piece.color === piece.color) {
    console.log('Cannot capture own piece');
    return false;
  }

  let isValid = false;
  switch (piece.type) {
    case 'pawn':
      isValid = isValidPawnMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case 'rook':
      isValid = isValidRookMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case 'knight':
      isValid = isValidKnightMove(fromRow, fromCol, toRow, toCol);
      break;
    case 'bishop':
      isValid = isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case 'queen':
      isValid = isValidQueenMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case 'king':
      isValid = isValidKingMove(fromRow, fromCol, toRow, toCol);
      break;
    default:
      isValid = false;
  }

  console.log(`Move is ${isValid ? 'valid' : 'invalid'}`);
  return isValid;
};

export const getValidMoves = (
  board: ChessBoard,
  position: string
): string[] => {
  const validMoves: string[] = [];
  const [fromRow, fromCol] = getCoordinates(position);
  const piece = board[fromRow][fromCol].piece;

  console.log(`Getting valid moves for ${piece?.type} at ${position}`);

  if (!piece) {
    console.log('No piece at the given position');
    return validMoves;
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const toPosition = getPosition(row, col);
      if (isValidMove(board, position, toPosition)) {
        validMoves.push(toPosition);
      }
    }
  }

  console.log(`Valid moves: ${validMoves.join(', ')}`);
  return validMoves;
};

export const movePiece = (
  board: ChessBoard,
  from: string,
  to: string
): ChessBoard => {
  const newBoard = board.map((row) => row.map((square) => ({ ...square })));
  const [fromRow, fromCol] = getCoordinates(from);
  const [toRow, toCol] = getCoordinates(to);

  newBoard[toRow][toCol].piece = newBoard[fromRow][fromCol].piece;
  newBoard[fromRow][fromCol].piece = null;

  return newBoard;
};
