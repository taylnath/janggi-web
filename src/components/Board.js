import {useState} from 'react';
import Square from './Square'

// modulo function so for example mod(-1, 2) = 1 instead of -1 % 2 = -1.
function mod(m, n) {
  return ((m % n) + n) % n;
} 

// colors to use
let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]

// component to combine all the squares together
function Board() {
  // define state variables
  const [counter, setCounter] = useState(1);                          // counter to set up squares with different intervals
  const [currentlyClicking, setCurrentlyClicking] = useState(false);  // is the board auto-clicking?
  const [currentInterval, setCurrentInterval] = useState("");         // stores the interval key if currently clicking
  const [clickingFast, setClickingFast] = useState(false);            // is the board auto-clicking quickly?

  // initial color object and grid list 
  // -- grid may not be necessary, I just use it to look up keys
  const initialColors = {};
  const grid = [];
  const keys = [];
  for (let i = 0; i < 5; i++){
    for (let j = 0; j < 5; j++){
      initialColors[String(i) + String(j)] = {
        backgroundColor: "",
        clicked: false,
        count: counter,
        colorIndex: -1,
        index: -1 // debug
      };
      grid.push([i, j]);
      keys.push(String(i) + String(j));
    }
  };
  // initial color object (all colors blank)
  let [squareColors, setColors] = useState(initialColors);

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

  // auto clicker -- clicks on random squares every second
  function keepClicking() {
    // clear old state variables
    setClickingFast(false);
    clearInterval(currentInterval);

    // click every second
    let interval = setInterval(() => {
      // choose a random square from the remaining un-clicked squares, or the first square
      let indices = [...Array(keys.length).keys()];
      let newIndices = indices.filter(i => !squareColors[keys[i]].clicked);
      let index = Math.max(0, Math.floor(Math.random() * (newIndices.length - 1)));
      let thisKey = keys[newIndices[index]] || keys[0];
      // the index was getting messed up, so it's in a try/catch for debugging. 
      // not necessary anymore
      try {
        changeColor(thisKey)();
      } catch (e) {
        console.log('bad index?');
        console.log(index);
      }
    }, 1000);
    // update state
    setCurrentlyClicking(true);
    setCurrentInterval(interval);
  };

  // stop either auto-clickers
  function stopClicking () {
    clearInterval(currentInterval);
    setCurrentlyClicking(false);
    setCurrentInterval("");
  }

  // fast auto-clicker
  let clickFaster = function () {
    // clear old state
    setClickingFast(true);
    clearInterval(currentInterval);

    // click every 1/10 of a second
    let interval = setInterval(() => {
      // choose random square that hasn't been clicked, or the first square
      let indices = [...Array(keys.length).keys()];
      let newIndices = indices.filter(i => !squareColors[keys[i]].clicked);
      let index = Math.max(0, Math.floor(Math.random() * (newIndices.length - 1)));
      let thisKey = keys[newIndices[index]] || keys[0];
      // debug try/catch
      try {
        changeColor(thisKey)();
      } catch (e) {
        console.log('bad index?');
        console.log(index);
      }
    }, 100);
    // update state
    setCurrentlyClicking(true);
    setCurrentInterval(interval);
  }

  // reset both auto-clickers and board
  function reset () {
    setCurrentlyClicking(false);
    setCounter(1);
    clearInterval(currentInterval);
    setCurrentInterval("");
    setClickingFast(false);
    setColors(initialColors);
  }

  // form square grid 
  // TODO: make this a flex box instead of absolutely positioning squares
  // TODO: use Object.keys(squareColors) instead of grid? 
  let squares = grid.map(([i, j]) => {
    let key = String(i) + String(j);
    return (
      <Square 
        key={key}
        backgroundColor={squareColors[key].backgroundColor}
        xPos={i} 
        yPos={j} 
        changeColor={changeColor(key)}
        transitionTime={clickingFast ? 0.1 : 0.5}
      />
    );
  });

  return (
    <div> {/* wrapper div since JSX wants one element only */}
      {/* div just for squares */}
      <div style={{
        position: "absolute",
        top: "calc(50% - 180px)",
        left: "calc(50% - 180px)"
      }}>
        {squares}
      </div>
      {/* button div */}
      <div style={{margin: "100px"}}>
        <button 
          onClick={currentlyClicking ? stopClicking : keepClicking} 
          style={{float:"right", clear:"left"}}
        >
          {currentlyClicking ? "stop clicking" : "auto click"}
        </button>
        <button 
          onClick={clickingFast ? keepClicking : clickFaster}
          style={{float:"right", clear:"both"}}
        >
          {clickingFast ? "click slower" : "click faster"}
        </button>
        <button 
          onClick={reset}
          style={{float:"right", clear:"both"}}
        >
          reset
        </button>
      </div>
    </div>
  )
}

export default Board;
