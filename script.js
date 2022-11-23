"use strict";

const cells = [];
let grid;
const board = document.body;
const siblings = new Map();

let movesSelector;
let roundsSelector;
let newGame;
let btnScore;
let scoreBoard;
let gameWon;

let emptySpace = null;
let currentMoves = 0;
let currentRound = 1;

//Stop Watch
let timer = false;
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let t;

init();

// Selects all the cells and add event listeners

function init() {
  movesSelector = document.querySelector("#current-moves");
  roundsSelector = document.querySelector("#current-round");
  newGame = document.querySelector("#btn-new");
  scoreBoard = document.getElementById("myModal");
  btnScore = document.getElementById("myBtn");
  gameWon = document.getElementById("gameWon");

  for (let i = 0; i < 8 + 1; i++) {
    cells[i] = document.querySelector(`#cell-${i}`);
  }

  for (let i = 0; i < 8 + 1; i++) {
    cells[i].addEventListener("click", () => {
      moveCell(i, "");
    });
  }

  board.addEventListener("keydown", (e) => {
    moveCell(null, e);
  });

  newGame.addEventListener("click", () => {
    localStorage.clear();
    resetMoves();
    resetRounds();
    startGame();
  });
}

//Returns a randomly sorted array with an emptyIndex

function getRandomArray() {
  const randomArray = [];
  let random_number = Math.ceil(Math.random() * 8);

  while (randomArray.length < 8) {
    if (!randomArray.includes(random_number)) {
      randomArray.push(random_number);
    } else {
      random_number = Math.ceil(Math.random() * 8);
    }
  }

  const random_index = Math.floor(Math.random() * (8 + 1));
  randomArray.splice(random_index, 0, "");
  return randomArray;
}

//Displays the array on grid (Web-Page)

function populateGrid() {
  for (let i = 0; i <= 8; i++) {
    cells[i].innerText = grid[i];
    cells[i].classList.remove("empty-cell");
    if (cells[i].innerText == "") {
      cells[i].classList.add("empty-cell");
      emptySpace = i;
    }
  }
}

//Find the siblings of the emptyIndex
function setSiblings() {
  for (let i = 0; i <= 8; i++) {
    if (cells[i].innerText == "") {
      emptySpace = i;
    }
  }

  emptySpace - 3 >= 0
    ? siblings.set("top", emptySpace - 3)
    : siblings.set("top", "");

  emptySpace + 3 <= 8
    ? siblings.set("bottom", emptySpace + 3)
    : siblings.set("bottom", "");

  emptySpace % 3 == 0
    ? siblings.set("left", "")
    : siblings.set("left", emptySpace - 1);

  emptySpace % 3 == 2
    ? siblings.set("right", "")
    : siblings.set("right", emptySpace + 1);
}

const startGame = () => {
  grid = getRandomArray();
  resetTimer();
  startTimer();
  populateGrid();
  setSiblings();
};
//Count Moves
const countMoves = () => {
  currentMoves += 1;
  movesSelector.innerHTML = currentMoves;
};

//Moves cell into the empty space on grid

function moveCell(index, event) {
  if (index != null) {
    const values = [...siblings.values()];
    values.forEach((value) => {
      if (index === value) {
        [grid[index], grid[emptySpace]] = [grid[emptySpace], grid[index]];
        countMoves();
        populateGrid();
        setSiblings();
      }
    });
  } else {
    switch (event.code) {
      case "ArrowDown":
        if (siblings.get("top") !== "") {
          [grid[siblings.get("top")], grid[emptySpace]] = [
            grid[emptySpace],
            grid[siblings.get("top")],
          ];
          countMoves();
          populateGrid();
          setSiblings();
        }
        break;
      case "ArrowUp":
        if (siblings.get("bottom") !== "") {
          [grid[siblings.get("bottom")], grid[emptySpace]] = [
            grid[emptySpace],
            grid[siblings.get("bottom")],
          ];
          countMoves();
          populateGrid();
          setSiblings();
        }
        break;
      case "ArrowRight":
        if (siblings.get("left") !== "") {
          [grid[siblings.get("left")], grid[emptySpace]] = [
            grid[emptySpace],
            grid[siblings.get("left")],
          ];
          countMoves();
          populateGrid();
          setSiblings();
        }
        break;
      case "ArrowLeft":
        if (siblings.get("right") !== "") {
          [grid[siblings.get("right")], grid[emptySpace]] = [
            grid[emptySpace],
            grid[siblings.get("right")],
          ];
          countMoves();
          populateGrid();
          setSiblings();
        }
      default:
        break;
    }
  }

  if (check()) {
    setTimeout(() => {
      gameWon.style.display = "block";
    }, 100);
    saveData();
    countRounds();
    resetMoves();
    resetTimer();
    startGame();
  }
}

const saveData = () => {
  let roundTime = document.getElementById("time").innerText;
  let data = {
    round: currentRound,
    moves: currentMoves,
    time: roundTime,
  };
  localStorage.setItem(`Round ${currentRound}`, JSON.stringify(data));
};
//Reset Timer
const resetTimer = () => {
  timer = false;
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;
  document.getElementById("hr").innerHTML = "00";
  document.getElementById("min").innerHTML = "00";
  document.getElementById("sec").innerHTML = "00";
};

//Start Timer
const startTimer = () => {
  timer = true;
  stopWatch();
};
//Stop Timer

const stopTimer = () => {
  timer = false;
};
//Reset Moves
const resetMoves = () => {
  currentMoves = 0;
  movesSelector.innerHTML = currentMoves;
};

//Count Rounds
const countRounds = () => {
  currentRound += 1;
  roundsSelector.innerHTML = currentRound;
};

//Reset Rounds
const resetRounds = () => {
  currentRound = 1;
  roundsSelector.innerHTML = currentRound;
};
//Checks if the puzzle is completed

function check() {
  let pivot = false;
  return compareBoxes(pivot);
}
function compareBoxes(pivot = false) {
  for (let i = 1; i <= 8; i++) {
    if (!(cells[i - 1].innerText == i)) {
      pivot = false;
      break;
    } else {
      pivot = true;
    }
  }
  return pivot;
}

//Stop Watch Function

function stopWatch() {
  if (timer) {
    count++;

    if (count == 100) {
      second++;
      count = 0;
    }

    if (second == 60) {
      minute++;
      second = 0;
    }

    if (minute == 60) {
      hour++;
      minute = 0;
      second = 0;
    }

    let hrString = hour;
    let minString = minute;
    let secString = second;
    let countString = count;

    if (hour < 10) {
      hrString = "0" + hrString;
    }

    if (minute < 10) {
      minString = "0" + minString;
    }

    if (second < 10) {
      secString = "0" + secString;
    }

    if (count < 10) {
      countString = "0" + countString;
    }

    document.getElementById("hr").innerHTML = hrString;
    document.getElementById("min").innerHTML = minString;
    document.getElementById("sec").innerHTML = secString;
    if (t) {
      clearTimeout(t);
    }
    t = setTimeout(stopWatch, 10);
  }
}

//Show Scoreboard
btnScore.onclick = function () {
  let tbody = document.getElementById("rounds-info");
  tbody.innerText = "";

  if (localStorage.length <= 0) {
    tbody.style.fontWeight = "bold";
    tbody.style.fontSize = "30px";
    tbody.style.textAlign = "center";
    tbody.style.lineHeight = "100px";
    tbody.innerText = "Scoreboard is empty !!!";
    scoreBoard.style.display = "block";
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      let data = JSON.parse(localStorage.getItem(`Round ${i + 1}`));
      let tr = "<tr>";
      tr +=
        "<td> Round  " +
        data.round +
        "</td>" +
        "<td> Moves  " +
        data.moves +
        "</td> <td> Time  (" +
        data.time +
        ")</td></tr>";
      tbody.innerHTML += tr;
    }
    scoreBoard.style.display = "block";
  }
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == gameWon) {
    gameWon.style.display = "none";
  }
  if (event.target == scoreBoard) {
    scoreBoard.style.display = "none";
  }
};
