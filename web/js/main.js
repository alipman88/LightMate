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

  // initialize AI
  ai = new AI();
  ai.W.disabled = true;
  ai.init();

  // send move to AI
  const sendMoveToAI = (from, to) => {
    ai.makeMove(tapped[0], tapped[1], (ai) => {
      setTimeout(() => {
        tapped = [ai.from];
        render();
        light(tapped)
      }, 0);

      setTimeout(() => {
        board.move({ from: ai.from, to: ai.to, promotion: 'q' });
        tapped = [ai.from, ai.to];
        render();
        light(tapped)
      }, 500);
    });
  }

  // main input interface
  const tap = (ev) => {
    const square = ev.target.id; // 'e2'
    const moveablePiece = board.moves({ square: square }).length > 0;
    const legalMove = board.move({ from: tapped[0], to: square, promotion: 'q' });

    if (legalMove) {
      tapped.push(square);
      render();
      sendMoveToAI(tapped[0], tapped[1]);      
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
