'use strict';

//============================================
//============================================
//============================================
// Setup Globals
//============================================
//============================================
//============================================

var              fb = new Firebase('https://battlewhich.firebaseio.com'),
          gameBoard = [],
         guessBoard = gameBoard,
           shipsArr = [5,4,3,3,2],
         shipLength = shipsArr[0],
    shipsArrCounter = 0,
       shipValueArr = [9,8,7,6,5],
          shipValue = shipValueArr[0],
           isActive = true,
      isHorizontal,
          playerId,
            gameId,
       lastClicked,
               row,
               col;

//============================================
//============================================
//============================================
// Declare functions
//============================================
//============================================
//============================================


//   //function to toggle player turn to true or false
//   //also toggles whose turn it currently is in the game object

// function toggleTurn(turnCounter) {
//   if (turnCounter % 2 === 1) {
//     fb.child('players/' + playerId).update({
//       isTurn: true,
//       winner: playerId
//     });
//   }
//   fb.child('games/' + gameId).update({
//     player1Turn: ,
//     winner: playerId
//   });
// }

//============================================
//============================================
// GAME SETUP FUNCTIONS
//============================================
//============================================






//============================================
// creates an empty 2d arry 10 x 10.
//============================================

function clearBoard(boardToClear){
  boardToClear.splice(0, boardToClear.length);
  for(var i = 0; boardToClear.length < 10; i++) {
    boardToClear.unshift([0,0,0,0,0,0,0,0,0,0]);
  }
}

//============================================
// Creates the DOM representation of the boardArrays
//============================================


function renderBoards(board1, board2) {
  $('#table1,#table2').empty();
  var $tbody = $('<tbody></tbody>');
  var $tbody2 = $('<tbody></tbody>');

//create game board
  board1.forEach(function(row) {
    var $tr = $('<tr></tr>');
    row.forEach(function(cell) {
      if (cell) {
        $tr.append($('<td>' + cell + '</td>'));
      } else {
        $tr.append($('<td></td>'));
      }
    });
    $tbody.append($tr);
  });
  $('#table1').append($tbody);

//create guess board
  board2.forEach(function(row) {
    var $tr = $('<tr></tr>');
    row.forEach(function(cell) {
      if (cell === 1 || cell === 3) {
      $tr.append($('<td>' + cell + '</td>'));
      } else {
        $tr.append($('<td></td>'));
      }
    });
    $tbody2.append($tr);
  });
  $('#table2').append($tbody2);
}



//============================================
// checks for valid placement, populates gameArray and rerenders the board.
//============================================

function placeShip() {
  if (checkShipPlacement() && checkShipIntersection()) {
    if (gameBoard[row][col] === 0) {
      gameBoard[row][col] += 2;
      if (isHorizontal) {
        horizontalFill(shipLength);
      } else {
        vertFill(shipLength);
      }
      renderBoards(gameBoard, guessBoard);
      shipsArrCounter++;
      shipLength = shipsArr[shipsArrCounter];
      shipValue = shipValueArr[shipsArrCounter];
      noMoreShips();
    }
  } else {
    alert("Please pick another space!");
  }
}

//============================================
// check if ships intersect with each other.
//============================================

function checkShipIntersection(){
  var placementFootPrint = 0,
      rowForThisFunc     = row,
      colForThisFunc     = col;

  if (isHorizontal) {
    for(var i = 0; i < shipLength; i++) {
      placementFootPrint  += gameBoard[rowForThisFunc][colForThisFunc];
      colForThisFunc++;
    }
  } else {
    for(var i = 0; i < shipLength; i++) {
      placementFootPrint  += gameBoard[rowForThisFunc][colForThisFunc]
        rowForThisFunc++;
    }
  }
  if (placementFootPrint){
      return false;
  } else {
        return true;
  }
}

//============================================
// check if ship length overflows the board
//============================================

function checkShipPlacement() {
  if (isHorizontal) {
    if (shipLength + col > 10) {
      return false;
    } else {
      return true;
    }
  } else {
    if (shipLength + row > 10) {
      return false;
    } else {
      return true;
    }
  }
}

//============================================
// Hides Orientation buttons and indicates to commence guesses.
//============================================

function noMoreShips () {
  if (shipsArrCounter > 4) {
    $('button').hide();
    $('#shipSize').text('No more ships! Fire Z Missiles!!!');
  } else {
    $('#shipSize').text('Current ship length: ' + shipLength);
  }
}

//============================================
// Filling the array  with ships at players chosen location.
//============================================

function horizontalFill (shipSize) {
  _.fill(gameBoard[row], shipValue, col, col + shipSize);
}

function vertFill (shipSize) {
  for(var i = 0; i < shipSize; i++) {
    _.fill(gameBoard[row], shipValue, col, col + 1);
    row++;
  }
}



//============================================
//============================================
// GAME PLAY FUNCTIONS
//============================================
//============================================



//============================================
// detects whether a selection is a hit or miss
//============================================

function hitDetector(){
  switch(true) {
    case (guessBoard[row][col] === 0):
      guessBoard[row][col] += 1;
      alert('Miss! You Suck');
      break;
    case (guessBoard[row][col] > 4):
      guessBoard[row][col] = 3;
      alert('Hit! You Rock!!!');
      shipSunkCheck();
      gameOverCheck();
      break;
    default:
      alert('You guessed that already dummy!!!');
      break;
  }
}

//============================================
// checks which ships have been sunk.
//============================================

function shipSunkCheck() {
  var compactArr = _(gameBoard).flatten().compact().value();
  switch(true) {
    case (!_.includes(compactArr, 5) && lastClicked === 5):
      alert('You\'ve sunk my bship');
      _.pull(compactArr, 5);
      break;
    case (!_.includes(compactArr, 6) && lastClicked === 6):
      alert('You\'ve sunk my cruiser');
      break;
    case (!_.includes(compactArr, 7) && lastClicked === 7):
      alert('You\'ve sunk my destroyer');
      break;
    case (!_.includes(compactArr, 8) && lastClicked === 8):
      alert('You\'ve sunk my submarine');
      break;
    case (!_.includes(compactArr, 9) && lastClicked === 9):
      alert('You\'ve sunk my tanker');
      break;
    default:
      break;
  }
}

//============================================
// checks if all ships are sunk
//============================================

function gameOverCheck () {
  var compactArr = _(gameBoard).flatten().compact().value();
  if (!_.includes(compactArr, 5) &&
      !_.includes(compactArr, 6) &&
      !_.includes(compactArr, 7) &&
      !_.includes(compactArr, 8) &&
      !_.includes(compactArr, 9)) {
    alert('You\'ve Won!!!');
    isActive = false;
  }
}




//============================================
// update firebase board state
//============================================

function sendBoardState() {
  fb.child('games/' + gameId).update({
      boardState: gameBoard
  });
}


//============================================
// toggle stats for game on win event include game active winner and loser
//============================================

function toggleCurrGameStats() {
  fb.child('games/' + gameId).update({
    isActive: false,
    winner: playerId
  });
}

//============================================
// sets a couple firebase objects
//============================================

function setNewGame() {
  var playerObj = {
    isPlayer1: true,
    isTurn: true
  };
  var gameObj = {
    boardState: gameBoard,
    winner: '',
    loser: '',
    player1: '',
    player2: '',
    isActive: true,
    player1Turn: true
  };
  playerId = fb.child('players').push(playerObj).key();
  gameId = fb.child('games').push(gameObj).key();
}

//============================================
//============================================
//============================================
// Setup a fresh board on page load.
//============================================
//============================================
//============================================



$(document).ready(function(){
  clearBoard(gameBoard);
  clearBoard(guessBoard);
  renderBoards(gameBoard, guessBoard);
  $('#shipSize').text('Current ship length: ' + shipLength);
});

//============================================
// Clicks to set peices
//============================================

$('.gameWrapper').on('click', 'tbody tr td', function(){
  if(isActive) {
    row = this.parentElement.sectionRowIndex,
    col = this.cellIndex;
    if (shipsArrCounter < 5){
      placeShip();
    }
  }
});

$('.guessWrapper').on('click', 'tbody tr td', function(){
  if(isActive) {
    row = this.parentElement.sectionRowIndex,
    col = this.cellIndex;
    lastClicked = gameBoard[row][col];
    hitDetector();
    renderBoards(gameBoard, guessBoard);
  }
});


$('#horizontal').click(function(){
  isHorizontal = true;
});

$('#vertical').click(function(){
  isHorizontal = false;
});