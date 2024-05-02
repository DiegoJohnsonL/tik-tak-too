"use client";

import { updateGame } from "@/server/services/game-service";
import { Move } from "@/types/turn";
import { getWinningCombinations } from "@/utils";
import { Game } from "@@/dbschema/interfaces";
import { useEffect, useReducer, useState } from "react";


function reducer(state: Move[], action: { type: Move; index: number }) {
  const newState = [...state];
  newState[action.index] = action.type;
  return newState;
}

function checkWin(state: Move[], move: Move) {
  return getWinningCombinations().find((combination) => combination.every((i) => state[i] === move)) || null;
}

function checkDraw(state: Move[]){
  return state.every((s) => s !== Move.None);
}

export default function GameBoard({ turn, game }: { turn: Move; game: Game }) {
  
  const [state, dispatch] = useReducer(reducer, game.gameState as Move[]);
  const [winningIndices, setWinningIndices] = useState<number[]>([]);
  const [won, setWon] = useState(false);
  const [draw, setDraw] = useState(false);
  const [lastIndex, setLastIndex] = useState<number>();


  function onMovePlayed(index: number) {
    if (state[index] === Move.None && !won && !draw) {
      dispatch({ type: turn, index });
      setLastIndex(index);
    }
  }

  useEffect(() => {
    const winningCombination = checkWin(state, turn);
    if (winningCombination) {
      setWon(true);
      setWinningIndices(winningCombination);
      setTimeout(() => {
        alert(`${turn} won!`);
      }, 200);
    }
    else if(checkDraw(state)) {
      setDraw(true);
      setTimeout(() => {
        alert(`It's a draw!`);
      }, 200);
    }

    if (lastIndex !== undefined) {
      updateGame({
        gameId: game.id,
        gameState: state.map((s) => s === Move.None ? "" : s),
        move: turn,
        index: lastIndex,
        isDraw: draw,
        isWin: won,
      }).then((res) => {
        console.log("res", res);
      });
    }

  }, [draw, game.id, lastIndex, state, turn, won]);


  return (
    <div className="grid grid-cols-3 w-full max-w-2xl px-4 md:px-8 gap-[2px]">
      {state.map((s, i) => (
        <div
          key={i}
          className={`w-full aspect-square outline outline-2 outline-tik-orange flex justify-center items-center group select-none cursor-pointer ${
            winningIndices.includes(i) && won ? "bg-tik-winning" : ""
          }`}
          onClick={() => onMovePlayed(i)}>
          <p
            className={`text-tik-orange text-[13vw] md:text-[11vw] lg:text-[9vw] leading-none ${
              s === Move.None && "invisible opacity-40"
            } group-hover:visible ease-in duration-100`}>
            {s ? s : turn}
          </p>
        </div>
      ))}
    </div>
  );
}