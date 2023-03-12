const Game = function () {
  // useful constants
  const A = 'a',
        B = 'b',
        C = 'c',
        D = 'd',
        E = 'e',
        F = 'f',
        G = 'g',
        H = 'h',
        W = 'w';

  const ranks = [1,2,3,4,5,6,7,8];
  const files = [A,B,C,D,E,F,G,H];

  // flip coin to decide if playing as white or black
  const playerColor = Math.random() < 0.5 ? W : B;

  // track squares have been selected
  // used to input moves and light rank and file indicators
  let tapped = [];

  // initialize internal board API
  const board = new Chess();

  // render computer move, with slight delay
  const receiveAiMove = (move) => {
    setTimeout(() => {
      tapped = [move.from];
      render();
      light(tapped);
    }, 0);

    setTimeout(() => {
      board.move({ from: move.from, to: move.to, promotion: 'q' });
      tapped = [move.from, move.to];
      render();
      light(tapped);
    }, 500);
  }

  ai = new AI();

  playerColor === B && receiveAiMove(ai.forceMove());

  // main input interface
  const tap = (ev) => {
    const square = playerColor === B ? transpose(ev.target.id) : ev.target.id; // 'e2'
    const moveablePiece = board.moves({ square: square }).length > 0;
    const legalMove = board.move({ from: tapped[0], to: square, promotion: 'q' });

    if (legalMove) {
      tapped.push(square);
      render();
      receiveAiMove(ai.inputMove(tapped[0], tapped[1]));
      playerColor === B && receiveAiMove(ai.forceMove());
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

  // light the rank and file indicators of the selected squares
  const light = (squares) => {
    const indicators = ['f', 'r'];
    for (let i = 0; i < indicators.length; i++) {
      const type = indicators[i]; // 'r' or 'f'
      const rows = document.getElementsByClassName(type);

      for (let row of rows) {
        let lit = false;

        for (let square of squares) {
          if (playerColor === B) square = transpose(square);
          if (row.id[1] === square[i]) { lit = true; }
        }

        row.classList.toggle('lit', lit)
      }
    }
  }

  // rotation was first handled via CSS, but was not pixel perfect
  // this shim function rotates board coordinates in place of CSS.
  const transpose = (id) => {
    const r = 9 - parseInt(id[1]);
    const f = String.fromCharCode(201 - id.charCodeAt(0));
    return `${f}${r}`;
  }

  const render = () => {
    for (let rank of ranks) {
      for (let file of files) {
        const id = file + rank; // 'e2'
        const square = board.get(id);
        let piece = square ? square.color + square.type : ''; // 'wp'
        const docId = playerColor === W ? id : transpose(id)
        document.getElementById(docId).setAttribute('class', `${piece} s`);
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
