'use strict';

//============================================
//============================================
//============================================
// Setup Globals
//============================================
//============================================
//============================================

      var humanBoard = [],
         computerBoard = [],
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
      humanBoardNotYetSet = true,
            gameId,
       lastClicked,
               row,
               col,
          currGame,
          isHumanTurn,
          gameInfo;

//============================================
//============================================
//============================================
// Declare functions
//============================================
//============================================
//============================================

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
  return boardToClear
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
      } else if (cell === 1) {
        $tr.append($('<td><img src=' + missImg + '></td>'));
      } else if (cell === 3) {
        $tr.append($('<td><img src=' + hitImg + '></td>'));
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

function placeShip(board) {
  if (checkShipPlacement() && checkShipIntersection(board)) {
    if (board[row][col] === 0) {
      board[row][col] += 2;
      if (isHorizontal) {
        horizontalFill(shipLength, board);
      } else {
        vertFill(shipLength, board);
      }
      renderBoards(humanBoard, computerBoard);
      shipsArrCounter++;
      shipLength = shipsArr[shipsArrCounter];
      shipValue = shipValueArr[shipsArrCounter];
      if (_(humanBoard).flatten().compact().value().length === 17) {
        noMoreShips();
      }
    }
    } else {
      if (isHumanTurn) {
        alert("Please pick another space!");
      }
  }
}

//============================================
// check if ships intersect with each other.
//============================================

function checkShipIntersection(board){
  var placementFootPrint = 0,
      rowForThisFunc     = row,
      colForThisFunc     = col;

  if (isHorizontal) {
    for(var i = 0; i < shipLength; i++) {
      placementFootPrint += board[rowForThisFunc][colForThisFunc];
      colForThisFunc++;
    }
  } else {
    for(var i = 0; i < shipLength; i++) {
      placementFootPrint  += board[rowForThisFunc][colForThisFunc]
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

function horizontalFill (shipSize, board) {
  _.fill(board[row], shipValue, col, col + shipSize);
}

function vertFill (shipSize, board) {
  for(var i = 0; i < shipSize; i++) {
    _.fill(board[row], shipValue, col, col + 1);
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
  if (isHumanTurn) {
    switch(true) {
      case (computerBoard[row][col] === 0):
        computerBoard[row][col] += 1;
      $('#hitsOrMisses').text('Miss!');
      break;
      case (computerBoard[row][col] > 4):
        computerBoard[row][col] = 3;
      $('#hitsOrMisses').text('You hit a lil\' ship!');
      shipSunkCheck();
      gameOverCheck();
      break;
      default:
        $('#hitsOrMisses').text('Already tried that, chose another!');
      break;
    }
  } else {
    switch(true) {
      case (humanBoard[row][col] === 0):
        humanBoard[row][col] += 1;
      $('#hitsOrMisses').text('Miss!');
      break;
      case (humanBoard[row][col] > 4):
        humanBoard[row][col] = 3;
      $('#hitsOrMisses').text('Computer hit a lil\' ship!');
      shipSunkCheck();
      gameOverCheck();
      break;
      default:
        console.log('computer cannot move there!')
      break;
    }
  }
}

//============================================
// checks which ships have been sunk.
//============================================

function shipSunkCheck() {
  var compactArr = _(humanBoard).flatten().compact().value();
  switch(true) {
    case (!_.includes(compactArr, 5) && lastClicked === 5):
      $('#shipSunk').text('Sunk the lil\' sailboat!');
    _.pull(compactArr, 5);
    break;
    case (!_.includes(compactArr, 6) && lastClicked === 6):
      $('#shipSunk').text('Sunk the lil\' cruiser!');
    break;
    case (!_.includes(compactArr, 7) && lastClicked === 7):
      $('#shipSunk').text('Sunk the lil\' tanker!');
    break;
    case (!_.includes(compactArr, 8) && lastClicked === 8):
      $('#shipSunk').text('Sunk the lil\' cargo ship!');
    break;
    case (!_.includes(compactArr, 9) && lastClicked === 9):
      $('#shipSunk').text('Sunk the lil\' battleship!');
    break;
    default:
      break;
  }
}

//============================================
// checks if all ships are sunk
//============================================

function gameOverCheck () {
  var compactArr = _(humanBoard).flatten().compact().value();
  if (!_.includes(compactArr, 5) &&
      !_.includes(compactArr, 6) &&
        !_.includes(compactArr, 7) &&
          !_.includes(compactArr, 8) &&
            !_.includes(compactArr, 9)) {
    $('#infoBoard').text('The computer sunk all the lil\' ships! You suck!');
  isActive = false
  }
  var computerArr = _(computerBoard).flatten().compact().value();
  if (!_.includes(computerArr, 5) &&
      !_.includes(computerArr, 6) &&
        !_.includes(computerArr, 7) &&
          !_.includes(computerArr, 8) &&
            !_.includes(computerArr, 9)) {
    $('#infoBoard').text('You sunk all the computer\'s lil\' ships! You won!');
  isActive = false
  }
}

//============================================
//============================================
//============================================
// Setup a fresh board on page load.
//============================================
//============================================
//============================================



$(document).ready(function(){
  humanBoard = clearBoard(humanBoard);
  computerBoard = clearBoard(computerBoard);
  if (computerBoard.length === 10) {
    setComputerBoard(computerBoard);
  }
  renderBoards(humanBoard, computerBoard);
  $('#shipSize').text('Current ship length: ' + shipLength);
});

//============================================
// Set up computer board for new game
//============================================

function setComputerBoard(board) {
  isHumanTurn = false;

  for (var i = 0; i < 5; i++) {
    // choose either vertical or horizontal
    chooseDirection()
    // choose a ship location
    chooseShipLocation(board)
  }
  // reset values for human player turn
  shipsArrCounter = 0
  shipValue = shipValueArr[0]
  shipLength = shipsArr[0]
  isHumanTurn = true
}

function chooseDirection() {
  var horizontal = [true, false]
  var choice = horizontal[Math.round(Math.random())]
  isHorizontal = choice
}

function chooseShipLocation(board) {
  col = Math.floor(Math.random() * (10 - 0) + 0)
  row = Math.floor(Math.random() * (10 - 0) + 0)

  while (_(computerBoard).flatten().compact().sort().value().length !== 17) {
    col = Math.floor(Math.random() * (10 - 0) + 0)
    row = Math.floor(Math.random() * (10 - 0) + 0)
    placeShip(computerBoard)
  }
}

function computerMove() {
  col = Math.floor(Math.random() * (10 - 0) + 0)
  row = Math.floor(Math.random() * (10 - 0) + 0)

  while (humanBoard[row][col] === 1 || humanBoard[row][col] === 3) {
    col = Math.floor(Math.random() * (10 - 0) + 0)
    row = Math.floor(Math.random() * (10 - 0) + 0)
    console.log('computer looking')
  }
  if (humanBoard[row][col] !== 1 && humanBoard[row][col] !== 3) {
    hitDetector()
    renderBoards(humanBoard, computerBoard);
    isHumanTurn = true
  }
}

//============================================
// Clicks to set peices
//============================================

$('.gameWrapper').on('click', 'tbody tr td', function(){
  if(isActive && humanBoardNotYetSet) {
    row = this.parentElement.sectionRowIndex,
    col = this.cellIndex;
    if (shipsArrCounter < 5){
      placeShip(humanBoard);
    } else {
      humanBoardNotYetSet = false
    }
  }
});

$('.guessWrapper').on('click', 'tbody tr td', function(){
  if(isActive && isHumanTurn) {
    row = this.parentElement.sectionRowIndex,
    col = this.cellIndex;
    checkInput(row,col)
    renderBoards(humanBoard, computerBoard);
  }
});

function checkInput(row,col) {
    lastClicked = computerBoard[row][col];
    if (lastClicked === 1 || lastClicked === 3) {
      isHumanTurn = true
      alert('Choose again!')
    } else {
      hitDetector();
      isHumanTurn = false
      computerMove()
  }
}

$('#horizontal').click(function(){
  isHorizontal = true;
});

$('#vertical').click(function(){
  isHorizontal = false;
});
