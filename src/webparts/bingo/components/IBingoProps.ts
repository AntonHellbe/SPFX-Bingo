export interface IBingoProps {
  description: string;
  context: any;
}

export interface IBingoState {
  bingoTiles: IBingoTile[];
  currentUser: any;
  bingo: boolean;
  isModalOpen: boolean;
}

export interface IBingoTile {
  title: string;
  tileId: number;
  completed: boolean;
  position: string;
}
