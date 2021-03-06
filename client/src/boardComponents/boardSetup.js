import Red_Cannon from './pieces/Red_Cannon.png';
import Red_Chariot from './pieces/Red_Chariot.png';
import Red_Elephant from './pieces/Red_Elephant.png'
import Red_Guard from './pieces/Red_Guard.png';
import Red_Horse from './pieces/Red_Horse.png';
import Red_King from './pieces/Red_King.png';
import Red_Soldier from './pieces/Red_Soldier.png';
import Green_Cannon from './pieces/Green_Cannon.png';
import Green_Chariot from './pieces/Green_Chariot.png';
import Green_Elephant from './pieces/Green_Elephant.png';
import Green_Guard from './pieces/Green_Guard.png';
import Green_Horse from './pieces/Green_Horse.png';
import Green_King from './pieces/Green_King.png';
import Green_Soldier from './pieces/Green_Soldier.png';

// initial values
const numRows = 10;
const numCols = 9;
const grid = [];

// set up the grid
for (let i = 0; i < numRows; i++){
  for (let j = 0; j < numCols; j++){
    grid.push([i, j]); // describes letters[j] + String(i) position
  };
};

// set up the board object
const boardSetup = {};
const cols = {0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h', 8: 'i'}
const rows = {0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6', 6: '7', 7: '8', 8: '9', 9: '10'}
Object.keys(cols).forEach(col => {
  Object.keys(rows).forEach(row => {
    boardSetup[cols[col] + rows[row]] = {}
  });
});
console.log(boardSetup);

// populate the board with the images
// TODO: get this information from the server
boardSetup.a1.img = Red_Chariot;
boardSetup.a1.imgAlt = "Red_Chariot";
boardSetup.a1.player = "R";

boardSetup.b1.img = Red_Elephant;
boardSetup.b1.imgAlt = "Red_Elephant";
boardSetup.b1.player = "R";

boardSetup.c1.img = Red_Horse;
boardSetup.c1.imgAlt = "Red_Horse";
boardSetup.c1.player = "R";

boardSetup.d1.img = Red_Guard;
boardSetup.d1.imgAlt = "Red_Guard";
boardSetup.d1.player = "R";

boardSetup.f1.img = Red_Guard;
boardSetup.f1.imgAlt = "Red_Guard";
boardSetup.f1.player = "R";

boardSetup.g1.img = Red_Elephant;
boardSetup.g1.imgAlt = "Red_Elephant";
boardSetup.g1.player = "R";

boardSetup.h1.img = Red_Horse;
boardSetup.h1.imgAlt = "Red_Horse";
boardSetup.h1.player = "R";

boardSetup.i1.img = Red_Chariot;
boardSetup.i1.imgAlt = "Red_Chariot";
boardSetup.i1.player = "R";

boardSetup.e2.img = Red_King;
boardSetup.e2.imgAlt = "Red_King";
boardSetup.e2.player = "R";

boardSetup.b3.img = Red_Cannon;
boardSetup.b3.imgAlt = "Red_Cannon";
boardSetup.b3.player = "R";

boardSetup.h3.img = Red_Cannon;
boardSetup.h3.imgAlt = "Red_Cannon";
boardSetup.h3.player = "R";

boardSetup.a4.img = Red_Soldier;
boardSetup.a4.imgAlt = "Red_Soldier";
boardSetup.a4.player = "R";

boardSetup.c4.img = Red_Soldier;
boardSetup.c4.imgAlt = "Red_Soldier";
boardSetup.c4.player = "R";

boardSetup.e4.img = Red_Soldier;
boardSetup.e4.imgAlt = "Red_Soldier";
boardSetup.e4.player = "R";

boardSetup.g4.img = Red_Soldier;
boardSetup.g4.imgAlt = "Red_Soldier";
boardSetup.g4.player = "R";

boardSetup.i4.img = Red_Soldier;
boardSetup.i4.imgAlt = "Red_Soldier";
boardSetup.i4.player = "R";

// ------- green pieces

boardSetup.a10.img = Green_Chariot;
boardSetup.a10.imgAlt = "Green_Chariot";
boardSetup.a10.player = "B";

boardSetup.b10.img = Green_Elephant;
boardSetup.b10.imgAlt = "Green_Elephant";
boardSetup.b10.player = "B";

boardSetup.c10.img = Green_Horse;
boardSetup.c10.imgAlt = "Green_Horse";
boardSetup.c10.player = "B";

boardSetup.d10.img = Green_Guard;
boardSetup.d10.imgAlt = "Green_Guard";
boardSetup.d10.player = "B";

boardSetup.f10.img = Green_Guard;
boardSetup.f10.imgAlt = "Green_Guard";
boardSetup.f10.player = "B";

boardSetup.g10.img = Green_Elephant;
boardSetup.g10.imgAlt = "Green_Elephant";
boardSetup.g10.player = "B";

boardSetup.h10.img = Green_Horse;
boardSetup.h10.imgAlt = "Green_Horse";
boardSetup.h10.player = "B";

boardSetup.i10.img = Green_Chariot;
boardSetup.i10.imgAlt = "Green_Chariot";
boardSetup.i10.player = "B";

boardSetup.e9.img = Green_King;
boardSetup.e9.imgAlt = "Green_King";
boardSetup.e9.player = "B";

boardSetup.b8.img = Green_Cannon;
boardSetup.b8.imgAlt = "Green_Cannon";
boardSetup.b8.player = "B";

boardSetup.h8.img = Green_Cannon;
boardSetup.h8.imgAlt = "Green_Cannon";
boardSetup.h8.player = "B";

boardSetup.a7.img = Green_Soldier;
boardSetup.a7.imgAlt = "Green_Soldier";
boardSetup.a7.player = "B";

boardSetup.c7.img = Green_Soldier;
boardSetup.c7.imgAlt = "Green_Soldier";
boardSetup.c7.player = "B";

boardSetup.e7.img = Green_Soldier;
boardSetup.e7.imgAlt = "Green_Soldier";
boardSetup.e7.player = "B";

boardSetup.g7.img = Green_Soldier;
boardSetup.g7.imgAlt = "Green_Soldier";
boardSetup.g7.player = "B";

boardSetup.i7.img = Green_Soldier;
boardSetup.i7.imgAlt = "Green_Soldier";
boardSetup.i7.player = "B";

export {
  boardSetup,
  grid,
  numRows,
  numCols
};
