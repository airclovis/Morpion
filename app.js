var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Player = require('./javascripts/modules/player.js');
var Game = require('./javascripts/modules/game.js');
var allClient = [];

var current_game = new Game();

app.use('/css', express.static(__dirname + '/css'));
app.use('/javascripts', express.static(__dirname + '/javascripts'));


app.get('/', function(req, res){
  res.sendFile( __dirname + '/index.html');
});


function play(coord, socket){
  if(!current_game.isFull)
    socket.emit(
      "warning",
      "Still waiting for an other player");
  else{
    if(!current_game.currentPlayer(socket))
      socket.emit('warning','Please wait your turn');
    else{
      if(current_game.play(coord))
      {
        current_game.sendGrid();
        if(current_game.is_win(coord)){
          current_game.sendAllMessage('warning', current_game.getCurrentPlayerName() + ' won');
          current_game.resetGame();
          current_game.sendGrid();
        }
        current_game.switch_player();
      }  
      else{
        socket.emit('warning','This slot is already taken');
      }
    }
  }
}

function addPlayer(pseudo, socket){
  current_game.addPlayer(new Player(pseudo, socket));
}


io.on('connection', function(socket){
  
  socket.on('disconnect', function(socket){
    io.emit('warning', "A user has disconnected from the game");
    var i = allClient.indexOf(socket);
    current_game.removePlayer(current_game.findPlayer(socket));

    allClient.splice(i, 1);
  });
  
  if(current_game.isFull){
    socket.emit('warning', "The current game is full");
  }
  else{
    allClient.push(socket);
    socket.on('pseudo', function(pseudo){
      addPlayer(pseudo, socket);
    });
    socket.on('coord', function(coord){
      play(coord, socket);
    });
  }
});

http.listen(3000, function(){
  console.log('Listening on *:3000');
});