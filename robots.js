var lineReader = require("line-reader");

const initialGrid = [];
let actualPos = {};
const scentLog = [];
const toReturn = [];
let lineNo = 1;

let actionTimes = 0;

//Loops on every line of the .txt file
lineReader.eachLine("test.txt", function (line, last) {
  //Check even, odd or first line to set the type of data to be passed to each function
  if (lineNo == 1) {
    initialGridSet(line);
  } else if (lineNo % 2 == 0) {
    actualPos = {};
    travelLog = [];
    initialPosSet(line);
  } else {
    actions(line);
  }

  lineNo++;

  if (last) {
    console.log('Output', toReturn);
  }
}
);

//Set size of the grid and filter out too big ones, coming from the first line of the .txt file
function initialGridSet(firstLine) {

  let x = firstLine.split(" ")[0] * 1;
  let y = firstLine.split(" ")[1] * 1;

  if (x <= 50 && y <= 50) {
    initialGrid.x = x;
    initialGrid.y = y;
  } else {
    console.log("Grid size bigger than allowed");
  }
}

//Set initial position, coming from every even line from the .txt file
function initialPosSet(evenLines) {
  actualPos.x = evenLines.split(" ")[0] * 1;
  actualPos.y = evenLines.split(" ")[1] * 1;
  actualPos.direction = evenLines.split(" ")[2];
}

let i;

//Actions string coming from every odd line of the .txt file
function actions(moves) {
  for (i = 0; i < moves.length; i++) {

    //If the robot is LOST, this line breaks the loop
    actualPos.lost == 'LOST' ? i = moves.length : null;

    //Redirect every action of the array (L R F) to each function 
    switch (moves[i]) {
      case "L":
        turnLeft();
        break;
      case "R":
        turnRight();
        break;
      case "F":
        moveForward();
    }
  }

 
    toReturn.push(actualPos);
  
}

function moveForward() {
  //Checks function checkScent, if true skips the action, otherwise it executes it modifying X and Y depending on the direction the robot is facing. 
  //In case the robot would go outside the grid, the function pushes the position to the scent log (scentLog var), and adds "LOST".
  if (checkScent()) {
    return null;
  } else {
    switch (actualPos.direction) {
      case "N":
        if (actualPos.y < initialGrid.y) {
          actualPos.y++;
        } else {
          actualPos.lost = "LOST";
          scentLog.push({ ...actualPos });
        }
        break;
      case "E":
        if (actualPos.x < initialGrid.x) {
          actualPos.x++;
        } else {
          actualPos.lost = "LOST";
          scentLog.push({ ...actualPos });
        }
        break;
      case "S":
        if (actualPos.y > 0) {
          actualPos.y--;
        } else {
          actualPos.lost = "LOST";
          scentLog.push({ ...actualPos });
        }
        break;
      case "W":
        if (actualPos.x > 0) {
          actualPos.x--;
        } else {
          actualPos.lost = "LOST";
          scentLog.push({ ...actualPos });
        }
        break;
    }
  }
}

function checkScent() {
  //Checks if the actual position is scented (in scentLog array) by previous robots, in case it does, it returns true that will make ignore the movement in moveForward()
  const inScentLog = scentLog.find(
    (e) => e.x == actualPos.x && e.y == actualPos.y &&
    e.direction == actualPos.direction
  );
  if (inScentLog != undefined) {
    return true;
  } else {
    return false;
  }
}

//Handles left turns
function turnLeft() {
  switch (actualPos.direction) {
    case "N":
      actualPos.direction = "W";
      break;
    case "W":
      actualPos.direction = "S";
      break;
    case "S":
      actualPos.direction = "E";
      break;
    case "E":
      actualPos.direction = "N";
      break;
  }
}

//Handles right turns
function turnRight() {
  switch (actualPos.direction) {
    case "N":
      actualPos.direction = "E";
      break;
    case "E":
      actualPos.direction = "S";
      break;
    case "S":
      actualPos.direction = "W";
      break;
    case "W":
      actualPos.direction = "N";
      break;
  }
}

