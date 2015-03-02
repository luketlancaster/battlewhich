'use strict';

var fb = new Firebase('https://battlewhich.firebaseio.com'),
    gameBoard = [],
   guessBoard = [],
  //TODO: add function that toggles isPlayer1 to true or false depending on whether the player is the first or second to join the game
  playerId,
  gameId,
  boardCounter = 1,
  row,
  col;


$(document).ready(function(){
  clearBoard(gameBoard)
  clearBoard(guessBoard)
//  setNewGame();
  renderBoards(gameBoard, guessBoard);
});

function clearBoard(boardToClear){
  boardToClear.splice(0, boardToClear.length);
  for(var i = 0; boardToClear.length < 10; i++) {boardToClear.unshift([0,0,0,0,0,0,0,0,0,0])}
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
  }
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
      $tr.append($('<td>' + cell + '</td>'));
    });
    $tbody.append($tr);
  });
  $('#table1').append($tbody);

//create guess board
  board2.forEach(function(row) {
    var $tr = $('<tr></tr>');
    row.forEach(function(cell) {
      $tr.append($('<td>' + cell + '</td>'));
    });
    $tbody2.append($tr);
  });
  $('#table2').append($tbody2);
}


//Click to set peices

$('.gameWrapper').on('click', 'tbody tr td', function(){
      row = this.parentElement.sectionRowIndex,
      col = this.cellIndex;
  if (gameBoard[row][col] === 0) {
    gameBoard[row][col] += 2;
    renderBoards(gameBoard, guessBoard);
  } else {
    alert('That space is taken please choose another:)');
  }
});

//click to guess

$('.guessWrapper').on('click', 'tbody tr td', function(){
      row = this.parentElement.sectionRowIndex,
      col = this.cellIndex;
  if (gameBoard[row][col] === '') {
    gameBoard[row][col] = currPlayer;
    sendBoardState();
    if(checkForWin(gameBoard) === true) {
      alert('Hooray!!! ' + currPlayer + ' wins!!!');
      _.fill(gameBoard, ['','','','','','','','','',''] , [start=0], [end=gameBoard.length]);
      setNewGame();
      renderBoard(gameBoard);
    };
    playerTurn();
    renderBoard(gameBoard);
    gameOverCheck();
  } else {
    alert('That space is taken please choose another:)');
  }
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
  if (_.difference(compactArr, ['m']).length === 4) {
    alert('You sunk my BS');
    _.fill(gameBoard, [0,0,0,0,0,0,0,0,0,0] , [start=0], [end=gameBoard.length]);
    setNewGame();
    renderBoard(gameBoard);
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

function horizontalFill () {
  _.fill(gameBoard[row], 2, col, col + 5);
}

function vertFill () {
  for(var i = 0; i < 5; i++) {
    _.fill(gameBoard[row], 2, col, col + 1);
    row++
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
