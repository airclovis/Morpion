var Game = require('./game.js');
var Player = require('./player.js');

var current_game = new Game();
var player1 = new Player('Jean luc');

console.log(current_game.grid);

current_game.addPlayer(player1);

console.log(current_game);