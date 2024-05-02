import GameBoard from "@/components/gameboard";
import { getGame } from "@/server/services/game-service";
import { Game } from "@@/dbschema/interfaces";

export default async function Play({ params: { id } }: { params: { id: string } }) {

  const { game, error } = await getGame(id)
  
  return (
    <div className="min-h-svh gap-10 flex flex-col items-center justify-center bg-tik-bg">
     
      <h1 className="text-4xl md:text-6xl lg:text-8xl uppercase text-tik-orange font-finger text-center">
        Tik Tak Too
      </h1>
      {game ? <GameBoard data={game as Game} /> : <p>{error}</p>}
    </div>
  );
}
