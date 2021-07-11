// TODO move to a separate package later when hot reloading and all that works.

enum GameState {
  Created = 1,
  InProgress = 2,
  Finished = 3,
}

enum Winner {
  Cross = 1,
  Circle = 2,
}

export { GameState, Winner };
