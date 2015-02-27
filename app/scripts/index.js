'use strict';

var fb = new Firebase('https://battlewhich.firebaseio.com'),
  fbPlayer = new Firebase('https://battlewhich.firebaseio.com/players/' + playerId),
  fbGame = new Firebase('https://battlewhich.firebaseio.com/games/' + currGameId),
  gameArr = [['','',''],['','',''],['','','']],
  currPlayer = '',
  turnCounter = 0,
  player1 = '', // '/images/tack.jpg',
  player2 = '/images/tick.jpg', // '/images/tick.jpg';
  //TODO: add function that toggles isPlayer1 to true or false depending on whether the player is the first or second to join the game
  playerId,
  row,
  col,
  currGameId;

//login register logout features

$('#registerButton').click(function() {
  var user     = $('#userEmail').val(),
      password = $('#userPassword').val();

  fb.createUser({
    email: user,
    password: password
  }, function(error, userData) {
    if (error) {
    switch (error.code) {
      case 'EMAIL_TAKEN':
        alert('This email is already in use.');
        break;
      case 'INVALID_EMAIL':
        alert('The specified email is not valid.');
        break;
      default:
        alert('Error creating user:', error);
      }
    } else {
      fb.authWithPassword({
        'email': user,
        'password': password
      }, function(error, authData) {
          if (error) {
            alert('Login Failed!', error);
          } else {
            $('#loginForm').hide('slow');
            console.log(authData);
            sendToFb(authData);
          }
      });
      $('#loginForm').hide('slow');
      playerId = fb.getAuth().uid,
      //$('#boardWrapper').toggle();
      clearGame();
      renderBoard(gameArr);
    }
  });
});


$('#loginButton').click(function() {
  var user     = $('#userEmail').val(),
      password = $('#userPassword').val();
  fb.authWithPassword({
    'email': user,
    'password': password
  }, function(error, authData) {
    if (error) {
      alert('Login Failed!', error);
    } else {
      $('#loginForm').hide('slow');
      playerId = fb.getAuth().uid,
      clearGame();
      createNewGameObj(user);
      setPlayerCurrGame();
      setPlayerImg();
      renderBoard(gameArr);
    }
  });
});


$('#logoutButton').click(function() {
  fb.unauth();
  $('#boardWrapper').empty();
  alert('Logout successful! Come back soon!');
  $('#loginForm').show('slow');
});


function sendToFb(data) {
  fb.child('players').child(data.uid).set({
    userName: data.uid,
    wins: 0,
    losses: 0,
    gamesPlayed: 1,
    opponentsPlayed: [''],
    isPlayer1: true,
    accountExpiration: data.expires,
    wonCurrGame: false,
    currGame: '',
    email: data.password.email
  });
}


function clearGame () {
  gameArr     = [['','',''],['','',''],['','','']];
  turnCounter =  0;
  currPlayer  = player1;
}

//Create new game object in firebase on player login

function createNewGameObj(data) {
//generate random game number
  var num        = Math.random(),
      num2       = num * 10000,
      gameNum    = Math.floor(num2);
      currGameId = gameNum;

//create and send new game object
  fbGame.set({
    boardState: [['','',''],['','',''],['','','']],
    winner: '',
    loser: '',
    player1: data,
    player2: '',
    gameId: gameNum,
    isActive: true
  });
}

//Create board

function renderBoard(x) {
  $('table').empty();
	var $tbody = $('<tbody></tbody>');

	x.forEach(function(row) {
		var $tr = $('<tr></tr>');
	 row.forEach(function(cell) {
		$tr.append($('<td><img src=' + cell + '></img></td>'));
  });
    $tbody.append($tr);
  });
  $('table').append($tbody);
}


//Click to select move

$('#boardWrapper').on('click', 'tbody tr td', function(){
  row = this.parentElement.sectionRowIndex;
  col  = this.cellIndex;
  if (gameArr[row][col] === '') {
    gameArr[row][col] = currPlayer;
    sendBoardState();
    checkForWin(gameArr);
    playerTurn();
    renderBoard(gameArr);
    gameOverCheck();
  } else {
    alert('That space is taken please choose another:)');
  }
});

//update firebase board state

function sendBoardState() {

  fbGame.update({
      boardState: gameArr
  });
}


//Increment turn counter.
function gameOverCheck () {
  if (turnCounter < 8) {
    turnCounter++;
  }
  else {
    alert('SORRY GUY\'S THIS IS A CAT\'S GAME OVER!');
  }
}


function checkForWin (x) {
  switch(true) {
    //---------------------
    //check winning columns
    //---------------------
    case ((x[0][0] !== '') && (x[0][0] === x[1][0]) && (x[0][0] === x[2][0])):
      alert('Player ' + currPlayer + ' Wins!!!');
      toggleCurrGameStats();
      toggleCurrGameWin();
      break;
    case ((x[0][1] !== '') && (x[0][1] === x[1][1]) && (x[0][1] === x[2][1])):
      alert('Player ' + currPlayer + ' Wins!!!');
      toggleCurrGameStats();
      toggleCurrGameWin();
      break;
    case ((x[0][2] !== '') && (x[0][2] === x[1][2]) && (x[0][2] === x[2][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      toggleCurrGameStats();
      toggleCurrGameWin();
      break;
    //---------------------
    //Check winning rows
    //---------------------
    case ((x[0][0] !== '') && (x[0][0] === x[0][1]) && (x[0][0] === x[0][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      toggleCurrGameStats();
      toggleCurrGameWin();
      break;
    case ((x[1][0] !== '') && (x[1][0] === x[1][1]) && (x[1][0] === x[1][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      toggleCurrGameStats();
      toggleCurrGameWin();
      break;
    case ((x[2][0] !== '') && (x[2][0] === x[2][1]) && (x[2][0] === x[2][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      toggleCurrGameStats();
      toggleCurrGameWin();
      break;
    //---------------------
    //Check winning diagonals
    //---------------------
    case ((x[0][0] !== '') && (x[0][0] === x[1][1]) && (x[0][0] === x[2][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      toggleCurrGameStats();
      toggleCurrGameWin();
      break;
    case ((x[0][2] !== '') && (x[0][2] === x[1][1]) && (x[0][2] === x[2][0])):
      alert('Player ' + currPlayer + ' Wins!!!');
      toggleCurrGameStats();
      toggleCurrGameWin();
      break;
    default:
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
  fbGame.update({
    isActive: false,
    winner: playerId
  });
}


//sets the current player's image based on whether isPlayer1 is true or false

function setPlayerImg() {
  //----------------------------------------------
  //??? Why use $.getJson if we have the fbPlayer ???
  //----------------------------------------------

  var fbPlayer = $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function () {

    if (fbPlayer.responseJSON.isPlayer1 === true) {
      currPlayer = '/images/tack.jpg';
      player1 = '/images/tack.jpg';
      sendImg(player1);
    } else {
      currPlayer = '/images/tick.jpg';
      player2 = '/images/tick.jpg';
      sendImg(player2);
    }
  });
}

function sendImg(data) {
  fbPlayer.child('img').set(data);
}


//sets player's current game and games played in firebase

function setPlayerCurrGame() {
  //----------------------------------------------
  //??? Why use $.getJson if we have the fbPlayer ???
  //----------------------------------------------
  $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function(data){
    fbPlayer.update({
      currGame: currGameId,
      gamesPlayed: data.gamesPlayed + 1
    });
  });
}

//toggles whether player won the current game to true or false

function toggleCurrGameWin() {
  $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function(data){
    if (data.img === gameArr[row][col]) {
      fbPlayer.child('wonCurrGame').set(true);
      sendWinLoss();
    } else {
      fbPlayer.child('wonCurrGame').set(false);
      sendWinLoss();
    }
  });
}


//updates the player's number of wins and losses

function sendWinLoss () {
  $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function(data){
    var playerWins = data.wins,
        playerLosses = data.losses;
    if (data.img === gameArr[row][col]) {
     	playerWins++;
  	  fbPlayer.child('wins').set(playerWins);
    } else {
     	playerLosses++;
     	fbPlayer.child('losses').set(playerLosses);
    }
  });
}