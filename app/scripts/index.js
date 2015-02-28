'use strict';

var fb = new Firebase('https://battlewhich.firebaseio.com'),
    gameArr = [ ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''] ],
  player1 = 'h',
  player2 = 'm',
  currPlayer = player1,
  //TODO: add function that toggles isPlayer1 to true or false depending on whether the player is the first or second to join the game
  playerId,
  gameId;

$(document).ready(function(){
  setNewGame();
  renderBoard(gameArr);
});



function setNewGame() {
  var playerObj = {
    isPlayer1: true,
    isTurn: true
  };
  var gameObj = {
    boardState: gameArr,
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

function renderBoard(data) {
  $('table').empty();
  var $tbody = $('<tbody></tbody>');

  data.forEach(function(row) {
    var $tr = $('<tr></tr>');
    row.forEach(function(cell) {
      $tr.append($('<td>' + cell + '</td>'));
    });
    $tbody.append($tr);
  });
  $('table').append($tbody);
}


//Click to select move

$('#boardWrapper').on('click', 'tbody tr td', function(){
  var row = this.parentElement.sectionRowIndex,
      col = this.cellIndex;
  if (gameArr[row][col] === '') {
    gameArr[row][col] = currPlayer;
    sendBoardState();
    if(checkForWin(gameArr) === true) {
      alert('Hooray!!! ' + currPlayer + ' wins!!!');
      _.fill(gameArr, ['','','','','','','','','',''] , [start=0], [end=gameArr.length]);
      setNewGame();
      renderBoard(gameArr);
    };
    playerTurn();
    renderBoard(gameArr);
    gameOverCheck();
  } else {
    alert('That space is taken please choose another:)');
  }
});

//update firebase board state

function sendBoardState() {

  fb.child('games/' + gameId).update({
      boardState: gameArr
  });
}


//switch between players and increment turn counter.
function gameOverCheck () {
  var compactArr = _(gameArr).flatten().compact().value();
  if (_.difference(compactArr, ['m']).length === 4) {
    alert('You sunk my BS');
    _.fill(gameArr, ['','','','','','','','','',''] , [start=0], [end=gameArr.length]);
    setNewGame();
    renderBoard(gameArr);
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


function checkForWin (data) {
  switch(true) {
    //---------------------
    //check winning columns
    //---------------------
    case  ((data[0][0] !== '') && (data[0][0] === data[1][0]) && (data[0][0] === data[2][0])) ||
          ((data[0][1] !== '') && (data[0][1] === data[1][1]) && (data[0][1] === data[2][1])) ||
          ((data[0][2] !== '') && (data[0][2] === data[1][2]) && (data[0][2] === data[2][2])): return true;
      break;
    //---------------------
    //Check winning rows
    //---------------------
    case  ((data[0][0] !== '') && (data[0][0] === data[0][1]) && (data[0][0] === data[0][2])) ||
          ((data[1][0] !== '') && (data[1][0] === data[1][1]) && (data[1][0] === data[1][2])) ||
          ((data[2][0] !== '') && (data[2][0] === data[2][1]) && (data[2][0] === data[2][2])): return true;
      break;
    //---------------------
    //Check winning diagonals
    //---------------------
    case  ((data[0][0] !== '') && (data[0][0] === data[1][1]) && (data[0][0] === data[2][2])) ||
          ((data[0][2] !== '') && (data[0][2] === data[1][1]) && (data[0][2] === data[2][0])): return true;
      break;
    default: return false;
      break;
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
