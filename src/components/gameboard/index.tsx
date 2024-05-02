"use client"

import { startNewGame, updateGame } from "@/server/services/game-service";
import { Move } from "@/types/turn";
import { checkDraw, checkWin, getRandomTurn } from "@/utils";
import { Game } from "@@/dbschema/interfaces";
import { useEffect, useState } from "react";


export default function GameBoard({ data }: { data: Partial<Game> }) {
    const [game, setGame] = useState(data);
    const [winningIndices, setWinningIndices] = useState<number[]>([]);
    const [move, setMove] = useState(Move.None);
    const [isLoading, setIsLoading] = useState(true);
    const prevPlayer = game.prevPlayer;
    const prevMove = game.prevMove;

    useEffect(() => {
      const move = prevMove?.symbol === Move.X ? Move.O : Move.X ?? getRandomTurn();
      setMove(move);
      setIsLoading(false);
    }, [game, prevMove])

    const onMovePlayed = async (index: number) => {
      if (isLoading || game.gameState?.[index] !== Move.None && game.draw && game.lastMove)
        return;
      setIsLoading(true);
      const gameState = [...game.gameState!] as Move[];
      gameState[index] = move;
      const winningCombination = checkWin(gameState, move);
      const draw = checkDraw(gameState);
      const updatedGame = await updateGame({
        gameId: game.id!,
        gameState: gameState,
        move,
        index,
        isDraw: draw,
        isWin: winningCombination ? true : false,
      })
      if (updatedGame && updatedGame.error) {
        alert(updatedGame.error);
        setIsLoading(false);
        return;
      }
      if (winningCombination) {
        setWinningIndices(winningCombination); 
        setTimeout(() => {
          alert(`${move} won!`);
        }, 250);
      }
      if (draw) {
        setTimeout(() => {
          alert(`It's a draw!`);
        }, 250);
      }
      console.log("game", updatedGame.game);
      setGame({...game, ...updatedGame.game} as Game);
      setIsLoading(false);
    };

    return (
      <>
        <div className="flex justify-between gap-6 md:gap-12 text-tik-orange items-center">
          <p>Your move is: {move}</p> <p>Last Player: {prevPlayer ?  prevPlayer?.username : "You're first 🫡"}</p>{" "}
          {game.draw ||
            (game.lastMove && (
              <button
                className="px-4 py-2 text-md md:text-lg lg:text-xl text-tik-orange font-finger text-center bg-tik-winning border border-tik-orange rounded-lg"
                onClick={() => {
                  setIsLoading(true);
                  startNewGame().then(() => setIsLoading(false));
                }}>
                Start new game
              </button>
            ))}
        </div>
        <div className="grid grid-cols-3 w-full max-w-2xl px-4 md:px-8 gap-[2px]">
          {game.gameState?.map((s, i) => (
            <div
              key={i}
              className={`w-full aspect-square outline outline-2 outline-tik-orange flex justify-center items-center group select-none ${
                isLoading ? "cursor-wait" : "cursor-pointer"
              } ${
                winningIndices.includes(i) && game.lastMove ? "bg-tik-winning" : ""
              }`}
              onClick={() => onMovePlayed(i)}>
              <p
                className={`text-tik-orange text-[13vw] md:text-[11vw] lg:text-[9vw] leading-none ${
                  s === Move.None && "invisible opacity-40"
                } group-hover:visible ease-in duration-100`}>
                {s ? s : move}
              </p>
            </div>
          ))}
        </div>
      </>
    ); 

}