import {useState} from 'react';
import Square from './Square';
import Red_Cannon from '../pieces/Red_Cannon.png';
import Red_Chariot from '../pieces/Red_Chariot.png';
import Red_Elephant from '../pieces/Red_Elephant.png';
import Red_Guard from '../pieces/Red_Guard.png';
import Red_Horse from '../pieces/Red_Horse.png';
import Red_King from '../pieces/Red_King.png';
import Red_Soldier from '../pieces/Red_Soldier.png';
import Green_Cannon from '../pieces/Green_Cannon.png';
import Green_Chariot from '../pieces/Green_Chariot.png';
import Green_Elephant from '../pieces/Green_Elephant.png';
import Green_Guard from '../pieces/Green_Guard.png';
import Green_Horse from '../pieces/Green_Horse.png';
import Green_King from '../pieces/Green_King.png';
import Green_Soldier from '../pieces/Green_Soldier.png';

// modulo function so for example mod(-1, 2) = 1 instead of -1 % 2 = -1.
function mod(m, n) {
  return ((m % n) + n) % n;
} 

// colors to use
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
const numRows = 10;
const numCols = 9;


// component to combine all the squares together
function Board() {
  // define state variables
  const [counter, setCounter] = useState(1);                          // counter to set up squares with different intervals
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

  // initial color object and grid list 
  // -- grid may not be necessary, I just use it to look up keys
  const initialColors = {};
  const grid = [];
  const keys = [];
  const textKeys = [];
  for (let i = 0; i < numRows; i++){
    let textKeyRow = [];
    for (let j = 0; j < numCols; j++){
      initialColors[String(i) + String(j)] = {
        backgroundColor: "",
        clicked: false,
        count: counter,
        colorIndex: -1,
        index: -1 // debug
      };
      grid.push([i, j]);
      keys.push(String(i) + String(j));
      textKeyRow.push({text: letters[j] + String(i)});
    }
    textKeys.push(textKeyRow);
  };

  textKeys[0][0].img = Red_Chariot;
  textKeys[0][0].imgAlt = "Red_Chariot";

  textKeys[0][1].img = Red_Elephant;
  textKeys[0][1].imgAlt = "Red_Elephant";

  textKeys[0][2].img = Red_Horse;
  textKeys[0][2].imgAlt = "Red_Horse";

  textKeys[0][3].img = Red_Guard;
  textKeys[0][3].imgAlt = "Red_Guard";

  textKeys[0][5].img = Red_Guard;
  textKeys[0][5].imgAlt = "Red_Guard";

  textKeys[0][6].img = Red_Elephant;
  textKeys[0][6].imgAlt = "Red_Elephant";

  textKeys[0][7].img = Red_Horse;
  textKeys[0][7].imgAlt = "Red_Horse";

  textKeys[0][8].img = Red_Chariot;
  textKeys[0][8].imgAlt = "Red_Chariot";

  textKeys[1][4].img = Red_King;
  textKeys[1][4].imgAlt = "Red_King";

  textKeys[2][1].img = Red_Cannon;
  textKeys[2][1].imgAlt = "Red_Cannon";

  textKeys[2][7].img = Red_Cannon;
  textKeys[2][7].imgAlt = "Red_Cannon";

  textKeys[3][0].img = Red_Soldier;
  textKeys[3][0].imgAlt = "Red_Soldier";
  textKeys[3][2].img = Red_Soldier;
  textKeys[3][2].imgAlt = "Red_Soldier";
  textKeys[3][4].img = Red_Soldier;
  textKeys[3][4].imgAlt = "Red_Soldier";
  textKeys[3][6].img = Red_Soldier;
  textKeys[3][6].imgAlt = "Red_Soldier";
  textKeys[3][8].img = Red_Soldier;
  textKeys[3][8].imgAlt = "Red_Soldier";

  // ------- green pieces

  textKeys[9][0].img = Green_Chariot;
  textKeys[9][0].imgAlt = "Green_Chariot";

  textKeys[9][1].img = Green_Elephant;
  textKeys[9][1].imgAlt = "Green_Elephant";

  textKeys[9][2].img = Green_Horse;
  textKeys[9][2].imgAlt = "Green_Horse";

  textKeys[9][3].img = Green_Guard;
  textKeys[9][3].imgAlt = "Green_Guard";

  textKeys[9][5].img = Green_Guard;
  textKeys[9][5].imgAlt = "Green_Guard";

  textKeys[9][6].img = Green_Elephant;
  textKeys[9][6].imgAlt = "Green_Elephant";

  textKeys[9][7].img = Green_Horse;
  textKeys[9][7].imgAlt = "Green_Horse";

  textKeys[9][8].img = Green_Chariot;
  textKeys[9][8].imgAlt = "Green_Chariot";

  textKeys[8][4].img = Green_King;
  textKeys[8][4].imgAlt = "Green_King";

  textKeys[7][1].img = Green_Cannon;
  textKeys[7][1].imgAlt = "Green_Cannon";

  textKeys[7][7].img = Green_Cannon;
  textKeys[7][7].imgAlt = "Green_Cannon";

  textKeys[6][0].img = Green_Soldier;
  textKeys[6][0].imgAlt = "Green_Soldier";
  textKeys[6][2].img = Green_Soldier;
  textKeys[6][2].imgAlt = "Green_Soldier";
  textKeys[6][4].img = Green_Soldier;
  textKeys[6][4].imgAlt = "Green_Soldier";
  textKeys[6][6].img = Green_Soldier;
  textKeys[6][6].imgAlt = "Green_Soldier";
  textKeys[6][8].img = Green_Soldier;
  textKeys[6][8].imgAlt = "Green_Soldier";

  // initial color object (all colors blank)
  let [squareColors, setColors] = useState(initialColors);
  let [textKeyState, setTextKeyState] = useState(textKeys);

  // change the color of a square to the next in line color
  function changeColor (key){
    // callback function for the onClick event:
    return function (){
      // get the current state
      let newSquareColors = {...squareColors};

      // update square as clicked, and initialize count parameter
      if (!squareColors[key].clicked){
        newSquareColors[key].count = counter;
        newSquareColors[key].clicked = true;
        setCounter(counter + 1);
      }

      // update each square's color if it's been clicked
      keys.forEach(key => {
        if (newSquareColors[key].clicked){
          // add the count to the current index (mod color length)
          let newColorIndex = mod(newSquareColors[key].colorIndex + newSquareColors[key].count, colors.length);
          // make sure the color will change, so we don't get fixed points
          if (newColorIndex === newSquareColors[key].colorIndex){
            newColorIndex = mod(newColorIndex + 1, colors.length);
          }
          // look up new color, set new index and color values
          let newColor = colors[newColorIndex];
          newSquareColors[key].backgroundColor = newColor;
          newSquareColors[key].colorIndex = newColorIndex;
        }
      });
      // update state with new values (this can't go in a loop since it's asynchronous or something)
      setColors(newSquareColors);
    }
  };
  const [pieceSelected, setPieceSelected] = useState(false);
  const [piecePlaced, setPiecePlaced] = useState(false);
  const [currentLoc, setCurrentLoc] = useState([0, 0]);
  const [desiredLoc, setDesiredLoc] = useState([0, 0]);

  function handleClick(i, j){
    return function (){
      let newTextKeyState = [...textKeyState];
      if (!pieceSelected){
        if (newTextKeyState[i][j].img){
          setPieceSelected(true);
          newTextKeyState[desiredLoc[0]][desiredLoc[1]].backgroundColor = "";
          newTextKeyState[i][j].backgroundColor = "blue";
          setCurrentLoc([i, j]);
        }
      } else if (!piecePlaced) {
        setPiecePlaced(true);
        newTextKeyState[i][j].backgroundColor = "red";
        let samePiece = true;
        if (i !== currentLoc[0] || j !== currentLoc[1]){
          samePiece = false;
          newTextKeyState[i][j].img = newTextKeyState[currentLoc[0]][currentLoc[1]].img;
          newTextKeyState[i][j].imgAlt = newTextKeyState[currentLoc[0]][currentLoc[1]].imgAlt;
          newTextKeyState[currentLoc[0]][currentLoc[1]].img = "";
          newTextKeyState[currentLoc[0]][currentLoc[1]].imgAlt = "";
        }
        setDesiredLoc([i, j]);
        setTimeout(() => {
          let timedOutTextKeyState = textKeyState;
          if (!samePiece){
            timedOutTextKeyState[currentLoc[0]][currentLoc[1]].backgroundColor = "";
          }
          // timedOutTextKeyState[i][j].backgroundColor = "";
          setPieceSelected(false);
          setPiecePlaced(false);
          setTextKeyState(timedOutTextKeyState);
        }, 500);
      } else {
      }
      console.log(textKeyState[i][j].text);
      setTextKeyState(newTextKeyState);
    }
  }

  // form square grid 
  // TODO: make this a flex box instead of absolutely positioning squares
  // TODO: use Object.keys(squareColors) instead of grid? 
  let squares = grid.map(([i, j], index) => {
    let key = String(i) + String(j);
    return (
      <Square 
        key={key}
        // backgroundColor={squareColors[key].backgroundColor}
        backgroundColor={textKeyState[i][j].backgroundColor}
        xPos={i} 
        yPos={j} 
        // changeColor={changeColor(key)}
        handleClick={handleClick(i, j)}
        img={textKeyState[i][j].img}
        alt={textKeyState[i][j].imgAlt}
        text={textKeyState[i][j].text}
      />
    );
  });

  let gridCols = `repeat(${numCols}, 1fr)`;
  let posString = `calc(50% - 200px)`

  return (
    <div> {/* wrapper div since JSX wants one element only */}
      {/* div just for squares */}
      <div style={{
        position: "absolute",
        top: posString,
        left: posString,
        display: "grid",
        gridTemplateColumns: gridCols,
        // gap: "0.5px",
      }}>
        {squares}
      </div>
    </div>
  )
}

export default Board;
