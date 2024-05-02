"use server";
import { client } from "@@/edgedb";
import e, { is } from "@@/dbschema/edgeql-js";
import { ConstraintViolationError } from "edgedb";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "./session-service";

export async function updateGame({
  gameId,
  gameState,
  move,
  index,
  isDraw,
  isWin,
}: {
  gameId: string;
  gameState: string[];
  move: string;
  index: number;
  isDraw: boolean;
  isWin: boolean;
}) {
  const { user, error } = getCurrentUser();

  if (!user) {
    return { error };
  }
  try {
    
    const player = e.select(e.User, () => ({
      filter_single: { id: user.id },
    }));

    const game = e.select(e.Game, () => ({
      filter_single: { id: gameId },
    }));

    const selectPlayerHistoryQuery = e.select(e.PlayersHistory, () => ({
      filter_single: { user: player, game },
    }));

    const  playersHistory =  e.insert(e.PlayersHistory, {
      user: player,
      game,
    }).unlessConflict(ph => ({
      on: e.tuple([ph.user, ph.game]),
      else: selectPlayerHistoryQuery,
    }));

    const gameMove = e.insert(e.GameMove, {
      symbol: move,
      position: index,
      playersHistory,
    });

    const transaction = await client.transaction(async tx => {
      const gameMoveResult = await gameMove.run(tx);
      const addedMoveQuery = e.select(e.GameMove, () => ({
        filter_single: { id: gameMoveResult.id },
      }));
      const updatedGameQuery = e.update(game, () => ({
        set: {
          gameState,
          draw: isDraw,
          prevPlayer: player,
          lastMove: (isWin || isDraw) ? addedMoveQuery : null,
          prevMove: addedMoveQuery,
        },
      }));
      const updatedGame = await e
        .select(updatedGameQuery, () => ({
          ...e.Game["*"],
          prevMove: {
            ...e.GameMove["*"],
          },
          prevPlayer: {
            ...e.User["*"],
          },
          lastMove: {
            ...e.GameMove["*"],
          }
        }))
        .run(tx);
      return { gameMoveResult, updatedGame };
    }); 

    return {
      game: transaction.updatedGame,
    };
  } catch (error) {
    console.log("error", error);
    return {
      error: "Error updating game",
    };
  }
}

export async function getGame(gameId: string) {
  try {
    const game = e.select(e.Game, () => ({
      filter_single: { id: gameId },
      ...e.Game["*"],
      prevMove: {
        ...e.GameMove["*"],
      },
      prevPlayer: {
        ...e.User["*"],
      },
      lastMove: {
        ...e.GameMove["*"],
      }
    }));

    return {
      game: await game.run(client),
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Error getting game",
    };
  }
}

export async function start(prevState: any, formData: FormData) {
  let { user } = getCurrentUser();
  if (!user) {
    const username = formData.get("username") as string;
    const response = await createUser({ username });
    if (!response.user) {
      return { error: response.error };
    }
    user = response.user;
  }
  const action = formData.get("action") as string;
  if (action === "create") {
    const { error, game } = await createGame(user.id);
    if (error) return { message: error };
    redirect(`/play/${game!.id}`);
  }
}

export async function startNewGame() {
  const { user, error: userError } = getCurrentUser();
  if (!user) {
    return { error: userError };
  }
  const { error, game } = await createGame(user.id);
  if (error) return { error };
  redirect(`/play/${game!.id}`);
}

export async function createUser({ username }: { username: string }) {
  try {
    const newUserQuery = e.insert(e.User, {
      username: username,
    });
    const query = e.select(newUserQuery, () => ({
      id: true,
      username: true,
    }));
    const newUser = await query.run(client);
    cookies().set("user", JSON.stringify(newUser));
    return {
      user: newUser,
    };
  } catch (error) {
    return {
      error: "Error creating user",
    };
  }
}

export async function createGame(creatorId: string) {
  try {
    const newGame = e.insert(e.Game, {
      createdBy: e.select(e.User, _ => ({ filter_single: { id: creatorId } })),
    });
    const query = e.select(newGame, () => ({ id: true }));
    return {
      game: await query.run(client),
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Error creating game",
    };
  }
}

export async function joinGame({ username }: { username: string }) {}
