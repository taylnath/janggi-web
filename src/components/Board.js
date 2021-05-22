import {useState} from 'react';
import Square from './Square'

function mod(m, n) {
  return ((m % n) + n) % n;
} 

function Board() {
  let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
  let [counter, setCounter] = useState(1);
  let initialColors = {};
  let grid = [];
  let keys = [];
  for (let i = 0; i < 5; i++){
    for (let j = 0; j < 5; j++){
      initialColors[String(i) + String(j)] = {
        backgroundColor: "",
        clicked: false,
        count: counter,
        colorIndex: -1,
        index: -1
      };
      grid.push([i, j]);
      keys.push(String(i) + String(j));
    }
  };
  let [squareColors, setColors] = useState(initialColors);
  let changeColor = function (key){
    return function (){
      let newSquareColors = {...squareColors};
      if (!squareColors[key].clicked){
        newSquareColors[key].count = counter;
        newSquareColors[key].clicked = true;
        setCounter(counter + 1);
      }
      keys.forEach(key => {
        if (newSquareColors[key].clicked){
          let newColorIndex = mod(newSquareColors[key].colorIndex + newSquareColors[key].count, colors.length);
          if (newColorIndex === newSquareColors[key].colorIndex){
            newColorIndex = mod(newColorIndex + 1, colors.length);
          }
          let newColor = colors[newColorIndex];
          newSquareColors[key].backgroundColor = newColor;
          newSquareColors[key].colorIndex = newColorIndex;
        }
      });
      setColors(newSquareColors);
    }
  };

  let keepClicking = function() {
    // let index = Math.floor(Math.random())
    setInterval(() => {
      console.log('bleah');
      let indices = [...Array(keys.length).keys()];
      let newIndices = indices.filter(i => !squareColors[keys[i]].clicked);
      let index = Math.max(0, Math.floor(Math.random() * (newIndices.length - 1)));
      let thisKey = keys[newIndices[index]] || keys[0];
      try {
        changeColor(thisKey)();
      } catch (e) {
        console.log('bad index?');
        console.log(index);
      }
    }, 1000);
  };

  let side = 60;
  // let side = 30;
  let squares = grid.map(([i, j]) => {
    let key = String(i) + String(j);
    // let text = `${String(squareColors[key].count)} (${squareColors[key].colorIndex} ${squareColors[key].index})`
    return (
      <Square 
        key={key}
        backgroundColor={squareColors[key].backgroundColor}
        xPos={i*side} 
        yPos={j*side} 
        side={side}
        changeColor={changeColor(key)}
        // text={text}
        text=""
      />
    );
  });

  return (
    <div>
      {squares}
     {/* <button onClick={setAllClicked} style={{float:"right", clear:"left"}}>Click all {counter} </button> */}
     <button onClick={keepClicking} style={{float:"right", clear:"left"}}>keep click</button>
</div>
  )
}

export default Board;
