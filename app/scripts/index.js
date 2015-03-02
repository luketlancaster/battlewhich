'use strict';

var fb = new Firebase('https://battlewhich.firebaseio.com'),
    gameBoard = [],
   guessBoard = gameBoard,
  //TODO: add function that toggles isPlayer1 to true or false depending on whether the player is the first or second to join the game
  playerId,
  gameId,
  boardCounter = 1,
  row,
  col,
  isHorizontal,
  shipsArr = [5,4,3,3,2],
  shipLength = shipsArr[0],
  shipsArrCounter = 0;


$(document).ready(function(){
  clearBoard(gameBoard);
  clearBoard(guessBoard);
//  setNewGame();
  renderBoards(gameBoard, guessBoard);
  $('#shipSize').text('Current ship length: ' + shipLength);
});

function clearBoard(boardToClear){
  boardToClear.splice(0, boardToClear.length);
  for(var i = 0; boardToClear.length < 10; i++) {
    boardToClear.unshift([0,0,0,0,0,0,0,0,0,0]);
  }
}


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


//Create board

function renderBoards(board1, board2) {
  $('#table1,#table2').empty();
  var $tbody = $('<tbody></tbody>');
  var $tbody2 = $('<tbody></tbody>');

//create game board
  board1.forEach(function(row) {
    var $tr = $('<tr></tr>');
    row.forEach(function(cell) {
      if (cell) {
        $tr.append($('<td data-ship=' + shipsArrCounter + '>' + cell + '</td>'));
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


//Click to set peices

$('.gameWrapper').on('click', 'tbody tr td', function(){
  row = this.parentElement.sectionRowIndex,
  col = this.cellIndex;
  if (shipsArrCounter < 5){
    placeShip();
  }
});

$('.guessWrapper').on('click', 'tbody tr td', function(){
  row = this.parentElement.sectionRowIndex,
  col = this.cellIndex;
  hitDetector();
  renderBoards(gameBoard, guessBoard);
});

function hitDetector(){
  switch(true) {
    case (guessBoard[row][col] === 0):
      guessBoard[row][col] += 1;
      alert('Miss! You Suck');
      break;
    case (guessBoard[row][col] === 2):
      guessBoard[row][col] += 1;
      alert('Hit! You Rock!!!');
      sunkShip();
      gameOverCheck();
      break;
    default:
      alert('You guessed that already dummy!!!');
      break;
  }
}

function  placeShip() {
  if (checkShipPlacement() && checkShipIntersection()) {
    if (gameBoard[row][col] === 0) {
      gameBoard[row][col] += 2;
      if (isHorizontal) {
        horizontalFill(shipLength);
      } else {
        vertFill(shipLength);
      }
      renderBoards(gameBoard, guessBoard);
      ++shipsArrCounter;
      shipLength = shipsArr[shipsArrCounter];
      noMoreShips();
    }
  } else {
    alert("Please pick another space!");
  }
}

function noMoreShips () {
  if (shipsArrCounter > 4) {
    $('button').hide();
    $('#shipSize').text('No more ships! Fire Z Missiles!!!');
  } else {
    $('#shipSize').text('Current ship length: ' + shipLength);
  }
}

function sunkShip () {

}

//check if ship length overflows the board
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

//click to guess
//  vertFill(shipLength);
//  renderBoards(gameBoard, guessBoard);
//  shipLength--;




//vertical and horizontal click

$('#horizontal').click(function(){
  isHorizontal = true;
});

$('#vertical').click(function(){
  isHorizontal = false;
});

//update firebase board state

function sendBoardState() {
  fb.child('games/' + gameId).update({
      boardState: gameBoard
  });
}


//switch between players and increment turn counter.
function gameOverCheck () {
  var compactArr = _(gameBoard).flatten().compact().value();
  if (!_.includes(compactArr, 2)) {
    alert('You\'ve Won!!!');
  }
}




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


function gameIndexIterator (arg1) {
  return gameBoard[arg1];
  arg1++;
}

function horizontalFill (shipSize) {
  _.fill(gameBoard[row], 2, col, col + shipSize);
}

function vertFill (shipSize) {
  for(var i = 0; i < shipSize; i++) {
    _.fill(gameBoard[row], 2, col, col + 1);
    row++;
  }
}



//alternates between player turns

function playerTurn () {
  if (currPlayer === player1) {
    currPlayer = player2;
    return player1;
  } else {
    currPlayer = player1;
    return player2;
  }
}

//toggle stats for game on win event include game active winner and loser

function toggleCurrGameStats() {
  fb.child('games/' + gameId).update({
    isActive: false,
    winner: playerId
  });
}


//sets the current player's image based on whether isPlayer1 is true or false



//gets current player stats

// function getCurrentStat (data) {

//  $.getJSON('https://battlewhich.firebaseio.com/players/' + data + '.json', function(data){
//   return data;
//   })
// }

//modular function to get player data

// function getPlayerInfo () {
// var playerInfo = fb.getAuth(),
//       playerId = playerInfo.uid,
//       fb.child('players/' + playerId) = $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function (cb) {
//         return fb.child('players/' + playerId);
//       })
//       return fb.child('players/' + playerId);
// }
