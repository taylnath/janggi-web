import {useState} from 'react';
import Square from './Square';
import { boardSetup, grid, numRows, numCols } from '../boardComponents/boardSetup';

// for converting from grid notation to location string (i.e. 'a5' vs (0, 4))
const letters = 'abcdefghi'.split('');
function posToLoc(i, j){
  return letters[j] + String(i + 1);
};

// component to combine all the squares together and manage game state
function Board() {
  // define state variables
  const [board, setBoard] = useState(boardSetup);                 // how the board currently looks
  const [pieceSelected, setPieceSelected] = useState(false);      // has the user selected a piece?
  const [selectedLoc, setSelectedLoc] = useState('');             // location string of selected piece (from location)
  const [desiredLoc, setDesiredLoc] = useState('');               // location string of desired piece (to location)
                                                                  // (in practice, just used as last location moved to)
                                                                  // TODO: change the name to more appropriate name
  const [possibleMoves, setPossibleMoves] = useState([]);         // list of possible moves (including current pos)
  const [player, setPlayer] = useState('B');                      // current player 'R' or 'B'
  const [processing, setProcessing] = useState(false);            // true when waiting for server response
  const [gameState, setGameState] = useState('UNFINISHED');       // game state -- "unfinished", "blue won" or "red won"
  const [message, setMessage] = useState('');                     // helper message for details on what is going on behind the scenes
  const [inCheck, setInCheck] = useState({'R': 'No', 'B': 'No'}); // object to track whether each player is in check or not

  // attempt to select a piece
  async function selectPiece (loc) {
    // copy of the board to update state with
    let newBoard = {...board};
    console.log('in select piece');

    // reset background for the old possible moves
    if (possibleMoves !== []){
      possibleMoves.forEach(moveLoc => {
        newBoard[moveLoc] = {...newBoard[moveLoc], backgroundColor: ''};
      });
    }

    // only look at this location if there is a piece there
    if (!newBoard[loc].img){
      console.log('no piece here');
      setMessage('no piece here');
      setPossibleMoves([]);
      setPieceSelected(false);
      return;
    }

    // only look at this location if the correct player owns the piece
    if (newBoard[loc].player !== player){
      console.log('wrong player');
      setMessage('wrong player');
      return;
    }

    // if we just made a move, clear the old background
    if (desiredLoc){
      newBoard[desiredLoc] = {...newBoard[desiredLoc], backgroundColor: ''};
    }

    setMessage('ok');

    // get moves from server
    setProcessing(true);
    let res = await fetch(`/api/game/get_moves?from=${loc}`).catch(err => console.err(err));
    let data = await res.json();
    setProcessing(false);
    let newMoves = data.moves;

    // set new background to denote selection
    newBoard[loc] = {...newBoard[loc], backgroundColor: 'blue'};

    setPieceSelected(true);

    // TODO: set newMoves = [loc] if it's not defined? -- that's probably a state disconnect issue though

    // set background for possible moves
    if (newMoves){
      newMoves.forEach(moveLoc => {
        newBoard[moveLoc] = {...newBoard[moveLoc], backgroundColor: 'green'};
        // newBoard[moveLoc].backgroundColor = 'green';
      });
      // add current location to possible moves
      newMoves = [...newMoves, loc]
      setPossibleMoves(newMoves);
    }

    // record we selected the piece
    setSelectedLoc(loc);

    // give a message on what happened
    if (newMoves && (newMoves.length > 1)){
      setMessage('found moves');
    } else if (newMoves && (newMoves.length <= 1)) {
      setMessage('no moves');
    } else {
      setMessage('system error -- try new game');
    }

    // update the board
    setBoard(newBoard);
  }

  // attempt to place a selected piece
  async function placePiece(loc) {
    // get copy of board to update state
    let newBoard = {...board};

    console.log('in place piece. Possible moves:', possibleMoves);

    // make sure we have an initial selected piece
    if (!selectedLoc){
      setMessage('system error -- no piece selected');
      return;
    }

    // if there are no moves or they aren't defined
    // TODO: add a return here? Or delete? Doesn't this get caught by selectPiece?
    if (!possibleMoves || !possibleMoves.length){
      setMessage('no moves available');
    };

    // if the desired location is not in the possible moves, send a message and return
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

    // ask server if move is allowed
    setProcessing(true);
    let res = await fetch(`/api/game/make_move?from=${selectedLoc}&to=${loc}`)
    let data = await res.json();
    setProcessing(false);

    // return if not allowed to make the move
    setMessage('move is allowed? ' + data.success);
    if (!data.success){
      return;
    }

    // update game status
    setGameState(data.state);

    // update in check
    setInCheck(data.in_check);

    // place the piece
    setPlayer((player === 'B') ? 'R' : 'B');
    newBoard[loc] = {...newBoard[loc], backgroundColor: 'red'};

    let samePiece = true;

    // update the image if the new location is different
    // TODO: re-structure this since now moves with the same from and to locations
    // get ignored
    // note samePiece is used by the setTimeout below
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
    };

    setDesiredLoc(loc); // take out?


    // erase old highlighted squares after a pause
    // TODO: is this currently working? 
    setTimeout(() => {
      let timedOutBoard = newBoard;
      if (!samePiece){
        timedOutBoard[selectedLoc] = {...timedOutBoard[selectedLoc], backgroundColor: ''};
      }

      // reset background for the old possible moves
      // console.log(possibleMoves); // debug
      if (possibleMoves !== []){
        possibleMoves.filter(mov => mov !== loc).forEach(moveLoc => {
          newBoard[moveLoc] = {...newBoard[moveLoc], backgroundColor: ''};
        });
      }
      setPieceSelected(false);
      setBoard(timedOutBoard);
    }, 500);
    setBoard(newBoard);
  }

  // deal with a click on one of the squares
  function handleClick (loc) {
    return function (){
      if (processing){
        setMessage('system processing!');
        return;
      }
      // if a piece has not already been selected, process the new 
      // selection
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
    return (
      <Square 
        key={loc}
        backgroundColor={board[loc].backgroundColor}
        // xPos={i} 
        // yPos={j} 
        handleClick={handleClick(loc)}
        img={board[loc].img}
        alt={board[loc].imgAlt}
        text={loc}
      />
    );
  });

  // TODO: move these down more (right above the return)
  let gridCols = `repeat(${numCols}, 1fr)`;
  let posString = `calc(50% - 200px)`;

  // TODO: move this up more (above the square grid)
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

  // TODO: put the state display in another component
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
