var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Player = require('./javascripts/modules/player.js');
var Game = require('./javascripts/modules/game.js');

var current_game = new Game();

app.use('/css', express.static(__dirname + '/css'));
app.use('/javascripts', express.static(__dirname + '/javascripts'));


app.get('/', function(req, res){
	res.sendFile( __dirname + '/index.html');
});

function play(coord){
	console.log(current_game);
	var player_socket = current_game.players[current_game.current_player_id];
	if(!current_game.isFull)
		player_socket.emit(
			"warning",
			"Still waiting for an other player");
	else{
		if(current_game.play(coord))
		{
			console.log(current_game.grid);
		}
	}
}

function addPlayer(pseudo, socket){
	current_game.addPlayer(new Player(pseudo, socket));
	console.log(current_game);
}


io.on('connection', function(socket){
	console.log('connect');
	socket.on('disconnect', function(socket){
		console.log(socket);
		io.emit('warning', "A user has disconnected from the game");
		//console.log('Remove ' + (current_game.findPlayer(socket)).name);
		current_game.removePlayer(current_game.findPlayer(socket));
	});
	
	if(current_game.isFull){
		socket.emit('warning', "The current game is full");
	}
	else{
		socket.on('pseudo', function(pseudo){
			addPlayer(pseudo, socket);
		});
		socket.on('coord', play);
	}
});

http.listen(3000, function(){
	console.log('Listening on *:3000');
});