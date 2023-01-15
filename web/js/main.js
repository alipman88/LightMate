const Game = function () {
  // useful constants
  const A = 'a',
        B = 'b',
        C = 'c',
        D = 'd',
        E = 'e',
        F = 'f',
        G = 'g',
        H = 'h';

  const ranks = [1,2,3,4,5,6,7,8];
  const files = [A,B,C,D,E,F,G,H];

  // track squares have been selected
  // used to input moves and light rank and file indicators
  let tapped = [];

  // initialize internal board API
  const board = new Chess();

  // main input interface
  const tap = (ev) => {
    const square = ev.target.id; // 'e2'
    const moveablePiece = board.moves({ square: square }).length > 0;
    const legalMove = board.move({ from: tapped[0], to: square });

    if (legalMove) {
      tapped.push(square);
      render();
      aiMove();
    } else if (moveablePiece) {
      tapped = [square];
    } else {
      tapped = [];
    }

    light(tapped);
  }

  // initialize onclick events
  const squares = document.getElementsByClassName('s');
  for (let square of squares) {
    square.onclick = tap;
  }

  // tell the AI to make a move
  const aiMove = () => {
    const moves = game.board.moves({ verbose: true });
    if (moves.length === 0) return;

    const move = moves[Math.floor(Math.random() * moves.length)];

    setTimeout(() => {
      tapped = [move.from];
      render();
      light(tapped)
    }, 1000);

    setTimeout(() => {
      board.move(move);
      tapped = [move.from, move.to];
      render();
      light(tapped)
    }, 1500);
  }

  // light the rank and file indicators of the selected squares
  const light = (squares) => {
    const indicators = ['f', 'r'];
    for (let i = 0; i < indicators.length; i++) {
      const type = indicators[i]; // 'r' or 'f'
      const rows = document.getElementsByClassName(type);

      for (let row of rows) {
        let lit = false;

        for (let square of squares) {
          if (row.id[1] === square[i]) { lit = true; }
        }

        row.classList.toggle('lit', lit)
      }
    }
  }

  const render = () => {
    for (let rank of ranks) {
      for (let file of files) {
        const id = file + rank; // 'e2'
        const square = board.get(id);
        let piece = square ? square.color + square.type : ''; // 'wp'
        document.getElementById(id).setAttribute('class', `${piece} s`);
      }
    }

    document.getElementById('check').classList.toggle('lit', board.in_check());
    document.getElementById('mate').classList.toggle('lit', board.in_checkmate());
  }

  return {
    render: render,
    board: board,
  }
}
