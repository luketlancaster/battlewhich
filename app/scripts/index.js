'use strict';

var fb = new Firebase('https://battlewhich.firebaseio.com'),
  gameArr = [['','',''],['','',''],['','','']],
  currPlayer = '',
  turnCounter = 0,
  player1 = '', // '/images/tack.jpg',
  player2 = '/images/tick.jpg', // '/images/tick.jpg';
  //TODO: add function that toggles isPlayer1 to true or false depending on whether the player is the first or second to join the game
  cellImg,
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
      case "EMAIL_TAKEN":
        alert('This email is already in use.');
        break;
      case "INVALID_EMAIL":
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
            alert("Login Failed!", error);
          } else {
            $('#loginForm').hide("slow");
            console.log(authData);
            sendToFb(authData);
          }
      });
      $('#loginForm').hide("slow");
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
      alert("Login Failed!", error);
    } else {
      $('#loginForm').hide("slow");
      clearGame();
      createNewGameObj(user);
      setPlayerCurrGame();
      setPlayerImg();
      renderBoard(gameArr);
    }
  });
});


$('#logoutButton').click(function() {
  var playerInfo = fb.getAuth(),
    playerId = playerInfo.uid,
    fbPlayer = new Firebase('https://battlewhich.firebaseio.com/players/' + playerId);
    fbPlayer.child('wonCurrGame').set(false);
  fb.unauth();
  $('#boardWrapper').empty();
  alert('Logout successful! Come back soon!');
  $('#loginForm').show("slow");
});


function sendToFb(data) {
  console.log(data)
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
    email: data.password.email,
    isTurn: true
  });
}


function clearGame () {
  gameArr = [['','',''],['','',''],['','','']];
  turnCounter =  0;
  currPlayer = player1;
}

//Create new game object in firebase on player login

function createNewGameObj(data) {
//generate random game number
  var num = Math.random(),
      num2 = num * 10000,
      gameNum = Math.floor(num2);
      currGameId = gameNum;

//create and send new game object
   var fbGame = new Firebase('https://battlewhich.firebaseio.com/games/' + gameNum);
      fbGame.set({
      boardState: [['','',''],['','',''],['','','']],
      winner: '',
      loser: '',
      player1: data,
      player2: '',
      gameId: gameNum,
      isActive: true,
      player1Turn: true
  });

}

//Create board

function renderBoard(x) {
  $('table').empty();
	var $tbody = $('<tbody></tbody>');

	x.forEach(function(row) {
		var $tr = $('<tr></tr>');
	 row.forEach(function(cell) {
		$tr.append($('<td><img src="' + cell + '"></img></td>'));
  });
    $tbody.append($tr);
  });
  $('table').append($tbody);
}
var row,
    col;

//Click to select move

$('#boardWrapper').on('click', 'tbody tr td', function(){
  row = this.parentElement.sectionRowIndex;
  col  = this.cellIndex;
  if (gameArr[row][col] === '') {
    gameArr[row][col] = currPlayer;
    cellImg = gameArr[row][col];
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

  var fbGame = new Firebase('https://battlewhich.firebaseio.com/games/' + currGameId);
  fbGame.update({
      boardState: gameArr
  })
}


//switch between players and increment turn counter.
function gameOverCheck () {
  if (turnCounter < 9) {
    turnCounter++
    // toggleTurn();
  }
  else {
    alert('GAME OVER!');
  }
}



//   //function to toggle player turn to true or false
//   //also toggles whose turn it currently is in the game object

// function toggleTurn(turnCounter) {
//   console.log(turnCounter)
//   var playerInfo = fb.getAuth(),
//       playerId = playerInfo.uid,
//       fbPlayer = new Firebase('https://battlewhich.firebaseio.com/players/' + playerId);
//   var playerInfo = fb.getAuth(),
//       playerId = playerInfo.uid,
//       fbGame = new Firebase('https://battlewhich.firebaseio.com/games/' + currGameId);
 
//  if (turnCounter % 2 === 1)
//       fbPlayer.update({ 
//       isTurn: true,
//       winner: playerId
//     });


 
//      fbGame.update({ 
//       player1Turn: ,
//       winner: playerId
//     });
// }



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

  var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid,
      fbPlayer = new Firebase('https://battlewhich.firebaseio.com/players/' + playerId);
  var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid,
      fbGame = new Firebase('https://battlewhich.firebaseio.com/games/' + currGameId);
 
     fbGame.update({ 
      isActive: false,
      winner: playerId
    });
}


//sets the current player's image based on whether isPlayer1 is true or false

function setPlayerImg() {
  var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid,
      fbPlayer = $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function () {
        console.log(fbPlayer)
        console.log(fbPlayer.responseJSON)

      if (fbPlayer.responseJSON.isPlayer1 === true) {
        currPlayer = '/images/tack.jpg';
        player1 = '/images/tack.jpg';
        sendImg(player1)
      } else {
        currPlayer = '/images/tick.jpg';
        player2 = '/images/tick.jpg';
        sendImg(player2)
      }
  });
}

function sendImg(data) {
    var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid,
      fbPlayer = new Firebase('https://battlewhich.firebaseio.com/players/' + playerId);
    fbPlayer.child('img').set(data);
}


//sets player's current game and games played in firebase

function setPlayerCurrGame() {
   var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid,
      fbPlayer = new Firebase('https://battlewhich.firebaseio.com/players/' + playerId);
      $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function(data){

    fbPlayer.update({
      currGame: currGameId,
      gamesPlayed: data.gamesPlayed+1
    });
  });
}

//toggles whether player won the current game to true or false

function toggleCurrGameWin() {
  var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid,
      fbPlayer = new Firebase('https://battlewhich.firebaseio.com/players/' + playerId);
  var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid;
      $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function(data){
      console.log(data);
 
 if (data.img === cellImg) {

      fbPlayer.child('wonCurrGame').set(true);
      sendWinLoss()
    } else {
      fbPlayer.child('wonCurrGame').set(false);
      sendWinLoss()
    }
  })
}


//updates the player's number of wins and losses

function sendWinLoss () {
	var playerInfo = fb.getAuth(),
	    playerId = playerInfo.uid;
	    $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function(data){
      console.log(data);
 
  var playerWins = data.wins,
      playerLosses = data.losses,
      fbPlayer = new Firebase('https://battlewhich.firebaseio.com/players/' + playerId);
 if (data.img === cellImg) {
  console.log(playerWins)
 	playerWins++
  console.log(playerWins)
	  fbPlayer.child('wins').set(playerWins);
 } else {
  console.log(playerLosses)
 	playerLosses++
  console.log(playerLosses)
 	fbPlayer.child('losses').set(playerLosses);
 }
})
}

//gets current player stats

// function getCurrentStat (data) {

// 	$.getJSON('https://battlewhich.firebaseio.com/players/' + data + '.json', function(data){
//   return data;
//   })
// }

//modular function to get player data

// function getPlayerInfo () {
// var playerInfo = fb.getAuth(),
//       playerId = playerInfo.uid,
//       fbPlayer = $.getJSON('https://battlewhich.firebaseio.com/players/' + playerId + '.json', function (cb) {
//         console.log(fbPlayer)
//         console.log(fbPlayer.responseJSON)
//         return fbPlayer;
//       })
//       return fbPlayer;
// }
