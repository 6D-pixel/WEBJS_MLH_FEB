"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { sendFlow } from "@/lib/flow/tx";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const botAddress = "0x254cc842174ec9d4";
  const userAddress = "0x3f6d0a02d7aa2baa";

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) {
      return;
    }

    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  //bot logic
  useEffect(() => {
    // Bot's move
    if (!isXNext && !calculateWinner(board)) {
      const emptySquares = board.reduce((acc, value, index) => {
        if (!value) {
          acc.push(index);
        }
        return acc;
      }, []);

      if (emptySquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        const botMove = emptySquares[randomIndex];

        const newBoard = board.slice();
        newBoard[botMove] = "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);
      }
    }
  }, [board, isXNext]);

  const renderSquare = (index) => (
    <button className="square" onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  const winner = calculateWinner(board);
  let message;
  
    // ? `You won, Humans are better`
    // : `Next player: ${isXNext ? "X" : "O"}`;
    if(winner === "X"){
      message = `won, I will save humanity`
    }
    else if(winner === "O"){
       message = `haha... I will rule humans`
    }
    else{
      message = `your turn 'X' `
    }

  return (
    <div>
      <div className="status text-center mt-5 text-lg font-mono">
        {message}
      </div>
      <div className="flex justify-center gap-1">
        <div className="">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <div>
        {winner === "X" ? (
          <center>
            <Button onClick={sendFlow} className="bg-violet-500 mt-5">get token</Button>
          </center>
        ) : (
          <center>
            <Button
              onClick={() => window.location.reload()}
              className="bg-violet-500 mt-5"
            >
              retry
            </Button>
          </center>
        )}
      </div>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};

export default TicTacToe;
