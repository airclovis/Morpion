/** 
	Module player for our node server
	created by: Clovis Delarue
	date: 28/08/2015
**/

function Player(name, socket){
	this.name = name;
	this.score = 0;
	this.socket = socket;
}

Player.prototype.sendMessage = function(message) {
	this.socket.emit('message', message);
};

Player.prototype.setPatern = function(patern) {
	this.patern = patern;
};

module.exports = Player;