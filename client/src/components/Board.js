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
  const [piecePlaced, setPiecePlaced] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('');
  const [desiredLoc, setDesiredLoc] = useState('');
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [player, setPlayer] = useState('B');

  function selectPiece (loc) {

    let newBoard = {...board};
    // only look at this location if there is a piece there
    if (newBoard[loc].img){
      // if we just made a move, clear the old background
      if (desiredLoc){
        newBoard[desiredLoc].backgroundColor = '';
      }

      // reset background for the old possible moves
      if (possibleMoves !== []){
        possibleMoves.forEach(moveLoc => {
          newBoard[moveLoc].backgroundColor = '';
        });
      }
      fetch(`/api/game/get_moves?from=${loc}`)
        .then(res => res.json())
        .then(data => {
          console.log("data in promise:", data);
          let newMoves = data.moves;

          if (newMoves){
            setPieceSelected(true);
            // set background for possible moves
            newMoves.forEach(moveLoc => {
              newBoard[moveLoc].backgroundColor = 'green';
            });
            setPossibleMoves(newMoves);
            // set new background to denote selection
            newBoard[loc].backgroundColor = 'blue';
            setSelectedLoc(loc);

          }

          // update the board
          setBoard(newBoard);
        });
    }
  }

  function placePiece(loc) {
    if (!selectedLoc){
      return;
    }
    let newBoard = {...board};
    fetch(`/api/game/make_move?from=${selectedLoc}&to=${loc}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success){
          return;
        }
        setPiecePlaced(true);
        newBoard[loc].backgroundColor = 'red';
        let samePiece = true;
        if (selectedLoc && loc !== selectedLoc){
          samePiece = false;
          newBoard[loc].img = newBoard[selectedLoc].img;
          newBoard[loc].imgAlt = newBoard[selectedLoc].imgAlt;
          newBoard[selectedLoc].img = '';
          newBoard[selectedLoc].imgAlt = '';
        }
        setDesiredLoc(loc);
        setTimeout(() => {
          let timedOutBoard = board;
          if (!samePiece){
            timedOutBoard[selectedLoc].backgroundColor = '';
          }

          // reset background for the old possible moves
          console.log(possibleMoves);
          if (possibleMoves !== []){
            possibleMoves.filter(mov => mov !== loc).forEach(moveLoc => {
              newBoard[moveLoc].backgroundColor = '';
            });
          }
          setPieceSelected(false);
          setPiecePlaced(false);
          setBoard(timedOutBoard);
        }, 500);
        setBoard(newBoard);
      });
  }

  function handleClick (loc) {
    return function (){
      // if a piece has not already been selected, process the new 
      // selection
      console.log("piece selected:", pieceSelected);
      console.log("piece placed:", piecePlaced);
      if (!pieceSelected){
        selectPiece(loc);
      } else if (!piecePlaced) {
        placePiece(loc);
      } 
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

  let gridCols = `repeat(${numCols}, 1fr)`;
  let posString = `calc(50% - 200px)`

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
    </div>
  )
}

export default Board;
