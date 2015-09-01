/** 
	Module game for our node server
	created by: Clovis Delarue
	date: 28/08/2015
**/

/**
	Game constructor
	- grid 3 * 3 (fill with 0)
	- array of players
**/
function Game(){
	this.grid = initiate_grid(3);
	this.players = new Array(2);
	for(var i = 0; i < 2; i++){
		this.players[i] = null;
	}
	this.isFull = false;
	this.current_player_id = Math.floor((Math.random() * 2) + 0); 
}

/**
	Initiate grid with allocation and fill with zeros
	@params : int size of table
	@return : table double dimension (size*size)
**/
function initiate_grid(size){
	var result = new Array();
	for(var i = 0; i < size; i++){
		result[i] = new Array();
	}

	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			result[i][j] = 0;
		}
	}

	return result;
}

/**
	Test if the game is full
	@return : boolean true if game is full
					  else false
**/
Game.prototype.test_isFull = function() {
	var full = true;
	var i = 0;
	while(i < this.players.length && full){
		if(this.players[i] == null){
			full = false;
		}
		i++;
	}

	return full;
};

/**
	Add player in the game
	@params: Player player to add
	@return: boolean true if the player has been added
					 else false
**/
Game.prototype.addPlayer = function(player) {
	if(!this.isFull){
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i] == null)
			{
				this.players[i] = player;
				this.isFull = this.test_isFull();
				return true;
			}
		}
	}
	else{
		return false;
	}
};

/**
	Find player with his socket
	@params socket
	@return Player
**/
Game.prototype.findPlayer = function(socket) {
	for(var i = 0; i < this.players.length; i++){
		if(this.players[i] != null){
			if(this.players[i].socket === socket){
				return this.players[i];
			}
		}
	}
	return null;
};

/**
	Remove player in the game
	@params: Player player to remove
	@return: boolean true if the player has been removed
					 else false
**/
Game.prototype.removePlayer = function(player) {
	for(var i = 0; i < this.players.length; i++){
		if(this.players[i] === player){
			this.players[i] = null;
			this.isFull = false;
			return true;
		}
	}
	return false;
};


/**
	Fill the grid with player's coord
	@params array coord
	@return boolean
**/
Game.prototype.play = function(coord){
	if(this.grid[coord[0]][coord[1]] != 0)
		return false;
	else{
		this.grid[coord[0]][coord[1]] = this.current_player_id + 1;
		this.switch_player();
		return true;
	}
};

/**
	Switch current player
**/
Game.prototype.switch_player = function() {
	if(this.current_player_id == 0)
		this.current_player_id = 1;
	else
		this.current_player_id = 0;
};

/**
	Check if someone won the game
	@params coord
	@boolean 
**/
Game.prototype.is_win = function(coord) {
	// Check Line
	var win = true;
	for(var i = 0; i < 3; i++){
		if(this.grid[i][coord[1]] != this.current_player_id)
			win = false;
	}
	if(win)
		return win;

	// Check column
	win = true;
	for(var i = 0; i < 3; i++){
		if(this.grid[coord[0]][i] != this.current_player_id)
			win = false;
	}
	if(win)
		return win;

	// Check diagonal
	win = true;
	return false;
};

module.exports = Game;