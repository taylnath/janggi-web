import {useState} from 'react';
import Square from './Square';
import { boardSetup, grid, numRows, numCols } from '../boardComponents/boardSetup';
// import boardSetup from '../boardComponents/boardSetup';

// let grid = [];
// let numCols = 9;

const letters = 'abcdefghi'.split('');
function posToLoc(i, j){
  return letters[j] + String(i + 1);
};

// component to combine all the squares together
function Board() {
  // define state variables
  const [board, setBoard] = useState(boardSetup);

  const [pieceSelected, setPieceSelected] = useState(false);
  // const [piecePlaced, setPiecePlaced] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('');
  const [desiredLoc, setDesiredLoc] = useState('');
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [player, setPlayer] = useState('B');
  const [processing, setProcessing] = useState(false);
  const [gameState, setGameState] = useState('UNFINISHED');
  const [message, setMessage] = useState('');
  const [inCheck, setInCheck] = useState({'R': 'No', 'B': 'No'});

  async function selectPiece (loc) {
    let newBoard = {...board};
    console.log('in select piece');

    // reset background for the old possible moves
    if (possibleMoves !== []){
      possibleMoves.forEach(moveLoc => {
        newBoard[moveLoc] = {...newBoard[moveLoc], backgroundColor: ''};
        // newBoard[moveLoc].backgroundColor = '';
      });
    }

    // only look at this location if there is a piece there
    if (!newBoard[loc].img){
      console.log('no piece here');
      setMessage('no piece here');
      setPossibleMoves([]);
      setPieceSelected(false);
      // setPiecePlaced(false);
      return;
    }

    if (newBoard[loc].player !== player){
      console.log('wrong player');
      setMessage('wrong player');
      return;
    }

    // if we just made a move, clear the old background
    if (desiredLoc){
      newBoard[desiredLoc] = {...newBoard[desiredLoc], backgroundColor: ''};
      // newBoard[desiredLoc].backgroundColor = '';
    }

    setMessage('ok');

    setProcessing(true);
    let res = await fetch(`/api/game/get_moves?from=${loc}`).catch(err => console.err(err));
    let data = await res.json();
    setProcessing(false);
    // console.log("data from promise:", data); // debug
    let newMoves = data.moves;
    setMessage('found moves');

    if (newMoves && newMoves.length){
      console.log('moves found...highlighting...', newMoves);
      console.log(newMoves.length);
      setPieceSelected(true);
      // set background for possible moves
      newMoves.forEach(moveLoc => {
        newBoard[moveLoc] = {...newBoard[moveLoc], backgroundColor: 'green'};
        // newBoard[moveLoc].backgroundColor = 'green';
      });
      // add current location to possible moves
      newMoves = [...newMoves, loc]
      setPossibleMoves(newMoves);
      // set new background to denote selection
      newBoard[loc] = {...newBoard[loc], backgroundColor: 'blue'};
      // newBoard[loc].backgroundColor = 'blue';
      setSelectedLoc(loc);
    } else {
      console.log('no moves to make');
    }

    // update the board
    setBoard(newBoard);
  }

  async function placePiece(loc) {
    let newBoard = {...board};

    console.log('in place piece. Possible moves:', possibleMoves);

    // make sure we have an initial selected piece
    if (!selectedLoc){
      return;
    }

    if (!possibleMoves || !possibleMoves.length){
      setMessage('no moves available');
    };

    if (!(possibleMoves.includes(loc))){
      console.log(possibleMoves.includes(loc));
      console.log(typeof(loc));
      setMessage('not a valid move');
      return;
    }

    // reset background for the old possible moves
    console.log('resetting possible moves');
    possibleMoves.forEach(moveLoc => {
      newBoard[moveLoc] = {...newBoard[moveLoc], backgroundColor: ''};
      // newBoard[moveLoc].backgroundColor = '';
    });

    // cancel move if same piece selected
    if (selectedLoc === loc){
      newBoard[loc] = {...newBoard[loc], backgroundColor: ''};
      setBoard(newBoard);
      setPieceSelected(false);
      setSelectedLoc('');
      setDesiredLoc('');
      setPossibleMoves([]);
      return;
    }

    setMessage('ok');

    setProcessing(true);
    let res = await fetch(`/api/game/make_move?from=${selectedLoc}&to=${loc}`)
    let data = await res.json();
    setProcessing(false);

    setMessage('move is allowed? ' + data.success);
    if (!data.success){
      return;
    }

    // update game status
    setGameState(data.state);

    // update in check
    setInCheck(data.in_check);

    // place the piece
    // setPiecePlaced(true);
    setPlayer((player === 'B') ? 'R' : 'B');
    newBoard[loc] = {...newBoard[loc], backgroundColor: 'red'};
    // newBoard[loc].backgroundColor = 'red';

    let samePiece = true;

    // update the image if the new location is different
    if (selectedLoc && loc !== selectedLoc){
      samePiece = false;
      newBoard[loc] = {
        ...newBoard[loc],
        img: newBoard[selectedLoc].img,
        imgAlt: newBoard[selectedLoc].imgAlt,
        player: newBoard[selectedLoc].player
      };
      newBoard[selectedLoc] = {
        ...newBoard[selectedLoc],
        img: '',
        imgAlt: '',
        player: ''
      };
      // newBoard[loc].img = newBoard[selectedLoc].img;
      // newBoard[loc].imgAlt = newBoard[selectedLoc].imgAlt;
      // newBoard[selectedLoc].img = '';
      // newBoard[selectedLoc].imgAlt = '';
    };
    setDesiredLoc(loc); // take out?
    setTimeout(() => {
      let timedOutBoard = newBoard;
      if (!samePiece){
        timedOutBoard[selectedLoc] = {...timedOutBoard[selectedLoc], backgroundColor: ''};
        // timedOutBoard[selectedLoc].backgroundColor = '';
      }

      // reset background for the old possible moves
      // console.log(possibleMoves); // debug
      if (possibleMoves !== []){
        possibleMoves.filter(mov => mov !== loc).forEach(moveLoc => {
          newBoard[moveLoc] = {...newBoard[moveLoc], backgroundColor: ''};
          // newBoard[moveLoc].backgroundColor = '';
        });
      }
      setPieceSelected(false);
      // setPiecePlaced(false); // take out?
      setBoard(timedOutBoard);
    }, 500);
    setBoard(newBoard);
  }

  function handleClick (loc) {
    return function (){
      if (processing){
        setMessage('system processing!');
        return;
      }
      // if a piece has not already been selected, process the new 
      // selection
      // console.log("piece selected:", pieceSelected); // debug
      // console.log("piece placed:", piecePlaced); // debug
      if (!pieceSelected){
        selectPiece(loc);
      } else {
        placePiece(loc);
      }
      // } else if (!piecePlaced) { // take out? (just else instead?)
      //   placePiece(loc);
      // } 
    }
  }

  // form square grid 
  // TODO: make this a flex box instead of absolutely positioning squares
  // TODO: use Object.keys(squareColors) instead of grid? 
  let squares = grid.map(pos => {
    // console.log("pos is", pos);
    let loc = posToLoc(...pos);
    // console.log("loc is", loc);
    // console.log(board);
    // console.log("loc on board is", board[loc]);
    let bgImage = `url(${board[loc].backgroundImage})`;
    return (
      <Square 
        key={loc}
        backgroundColor={board[loc].backgroundColor}
        backgroundImage={bgImage}
        // xPos={i} 
        // yPos={j} 
        handleClick={handleClick(loc)}
        img={board[loc].img}
        alt={board[loc].imgAlt}
        text={loc}
      />
    );
  });

  let gridCols = `repeat(${numCols}, 1fr)`;
  let posString = `calc(50% - 200px)`;

  async function newGame (){
    setProcessing(true);
    await fetch('/api/game/new').catch(err => console.error(err));
    setProcessing(false);
    console.log('in newgame');
    setBoard(boardSetup);
    console.log(boardSetup);
    setPieceSelected(false);
    // setPiecePlaced(false);
    setPlayer('B');
    setSelectedLoc('');
    setDesiredLoc('');
    setPossibleMoves([]);
    setMessage('new game');
    setInCheck({'R': 'No', 'B': 'No'});
  }

  return (
    <div> {/* wrapper div since JSX wants one element only */}
      {/* div just for squares */}
      <div style={{
        position: 'absolute',
        top: posString,
        left: posString,
        display: 'grid',
        gridTemplateColumns: gridCols,
        // gap: '0.5px',
      }}>
        {squares}
      </div>
      {/* <div style={{zIndex: "-10", position: 'absolute', top: 0, right: 0, padding: '20px', margin: '20px', border: '2px solid gray', borderRadius: '5px'}}> */}
      <div style={{fontSize: "small", zIndex: "-10", float: "right", clear: 'both', padding: '20px', margin: '20px', border: '2px solid gray', borderRadius: '5px'}}>
      <button onClick={newGame}>new game</button>
      <div>System: {(processing) ? 'processing' : 'ready'}</div>
      <div>Player: {player}</div>
      <div>Game: {gameState}</div>
      <div>{message}</div>
      <div>{(inCheck['R'] === 'Yes') && "Red in check."}</div>
      <div>{(inCheck['B'] === 'Yes') && "Blue in check."}</div>
      </div>
    </div>
  )
}

export default Board;
