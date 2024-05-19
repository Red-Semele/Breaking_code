export type GameClass = {
  new (canvas: HTMLCanvasElement, players: Array<NetplayPlayer>): Game;

  timestep: number;
  numPlayers?: number | { min: number; max: number }; // Add this line
  canvasSize: { width: number; height: number };
  highDPI?: boolean;
  pointerLock?: boolean;
  preventContextMenu?: boolean;
  //touchControls?: { [name: string]: TouchControl };
  deterministic?: boolean;
};