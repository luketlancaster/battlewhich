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
            missImg = 'http://cdn.flaticon.com/png/256/61072.png',
             hitImg = 'http://cdn.flaticon.com/png/256/2187.png',
         twoShipImg = 'http://cdn.flaticon.com/png/256/16489.png',
       threeShipImg = 'http://cdn.flaticon.com/png/256/62913.png',
        fourShipImg = 'http://cdn.flaticon.com/png/256/46053.png',
        fiveShipImg = 'http://cdn.flaticon.com/png/256/45783.png',
      isHorizontal,
            gameId,
       lastClicked,
               row,
               col,
          currGame,
          gameInfo;

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
      if (cell === 5) {
        $tr.append($('<td><img src=' + twoShipImg + '></td>'));
      } else if (cell === 6) {
        $tr.append($('<td><img src=' + threeShipImg + '></td>'));
      } else if (cell === 7) {
        $tr.append($('<td><img src=' + threeShipImg + '></td>'));
      } else if (cell === 8) {
        $tr.append($('<td><img src=' + fourShipImg + '></td>'));
      } else if (cell === 9) {
        $tr.append($('<td><img src=' + fiveShipImg + '></td>'));
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
      if (cell === 1) {
        $tr.append($('<td><img src=' + missImg + '></td>'));
      } else if (cell === 3) {
        $tr.append($('<td><img src=' + hitImg + '></td>'));
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
      findActiveGame(); //moved earlier so server has time to respond with current game info - BF
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
    fbSetNewGame()
    $('button').hide();
    $('#shipSize').toggleClass('hidden');
    $('#infoBoard').text('No more lil\' ships, fire away!');
    $('.guessesDiv').toggleClass('hidden');
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


//==============================================
// Finds active game after player sets all ships
//==============================================

function findActiveGame () {
  fb.once('value', function (data) {
    var allGames = data.val();
    currGame = _.findKey(allGames, {
      'isActive': true,
      'hasP2': false
    });
  })
}

//============================================
// sets a couple firebase objects
//============================================

function fbSetNewGame() {
 gameInfo = $.getJSON('https://battlewhich.firebaseio.com/' + currGame + '/.json/', function () {
        console.log(gameInfo);
        console.log(gameInfo.responseJSON);
      })

  if (!currGame) {
    console.log('you created a new game')
    // clearBoard(gameBoard);
    // clearBoard(guessBoard);

    var gameObj = {
      p1BoardState: guessBoard, //player 1 sends their guess board data to player 2 - BF
      p2BoardState: [],
      isActive: true,
      hasP1: true,
      hasP2: false,
      waitingForP2Board: true,
      waitingForP1Board: false
      //player1Turn: true
    };
    gameId = fb.push(gameObj).key();
    currGame = gameId; // so both player 1 and 2 have the current game id - BF

    //fb.child('gameId').on('value', function (data) {
    // renderBoards(gameBoard, guessBoard);
    } else {
      console.log('you should have joined an existing game')
      //joins existing game and adds P2 board to game object and sets waiting for p2 board to false and has p2 to true
      fb.child(currGame).update({
        'p2BoardState': guessBoard,
        'hasP2': true,
        'waitingForP2Board': false
      })
    }

       // fb.child(currGame).once('value', function(data) {
       // gameInfo = data.val();
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
  //fbSetNewGame();
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
