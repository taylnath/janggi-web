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
  const [currentLoc, setCurrentLoc] = useState('');
  const [desiredLoc, setDesiredLoc] = useState('');
  const [player, setPlayer] = useState('B');


  function handleClick(loc){
    return function (){
      // console.log('in handleclick with loc=', loc, typeof(loc));
      // console.log('board is', board);
      // console.log('board at loc is', board[loc]);
      let newBoard = {...board};
      // console.log('newboard is', newBoard);
      // console.log('newboard at loc is', newBoard[loc]);
      if (!pieceSelected){
        if (newBoard[loc].img){
          setPieceSelected(true);
          if (desiredLoc){
            newBoard[desiredLoc].backgroundColor = '';
          }
          newBoard[loc].backgroundColor = 'blue';
          setCurrentLoc(loc);
        }
      } else if (!piecePlaced) {
        setPiecePlaced(true);
        newBoard[loc].backgroundColor = 'red';
        let samePiece = true;
        if (loc !== currentLoc){
          samePiece = false;
          newBoard[loc].img = newBoard[currentLoc].img;
          newBoard[loc].imgAlt = newBoard[currentLoc].imgAlt;
          newBoard[currentLoc].img = '';
          newBoard[currentLoc].imgAlt = '';
        }
        setDesiredLoc(loc);
        setTimeout(() => {
          let timedOutBoard = board;
          if (!samePiece){
            timedOutBoard[currentLoc].backgroundColor = '';
          }
          setPieceSelected(false);
          setPiecePlaced(false);
          setBoard(timedOutBoard);
        }, 500);
      } else {
      }
      console.log(loc);
      setBoard(newBoard);
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
