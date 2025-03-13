export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Cell = 0 | 1 | 2; // 0: empty, 1: snake, 2: food
export type Position = {
  x: number;
  y: number;
};

export interface GameBoardProps {
  boardSize: number;

}