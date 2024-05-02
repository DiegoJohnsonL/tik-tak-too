import { Move } from "@/types/turn";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const winingCombination = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6], // diagonals
];

export function getWinningCombinations() {
  return winingCombination;
} 

export function getRandomTurn() {
  return Math.random() > 0.5 ? "X" : "O";
}

export function checkWin(state: Move[], move: Move) {
  return getWinningCombinations().find((combination) => combination.every((i) => state[i] === move)) || null;
}

export function checkDraw(state: Move[]){
  return state.every((s) => s !== Move.None);
}