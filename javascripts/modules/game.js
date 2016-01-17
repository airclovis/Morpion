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
  Check if the current player send the request to play
  @params socket the player's socket
  @return boolean
**/
Game.prototype.currentPlayer = function(socket) {
  return this.players[this.current_player_id].socket == socket;
};

/**
  Return the current player
  @return current player
**/
Game.prototype.getCurrentPlayer = function(){
  return this.players[current_player_id];
}

/**
  Send a message of type 'type' to all players
  @params type
  @params msg
**/
Game.prototype.sendAllMessage = function(type,msg) {
  for(var i = 0; i < this.players.length; i++){
    if(this.players[i] != null)
      this.players[i].socket.emit(type, msg);
  }
};

/**
  Send grid
**/
Game.prototype.sendGrid = function() {
  this.sendAllMessage('plays', this.grid);
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
        if(this.isFull){
          this.sendAllMessage('game_info','Game is full we can start the game');
          //this.getCurrentPlayer.sendMessage('You start !');
        }
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
  @params coord coord that the last user played
  @boolean 
  0,0 | 0,1 | 0,2
  1,0 | 1,1 | 1,2
  2,0 | 2,1 | 2,2
**/
Game.prototype.is_win = function(coord) {
  console.log(coord);
  console.log(this.grid);
  console.log(this.current_player_id + 1);

  var win = true;
  var x = coord[0];
  var y = coord[1];

  // Check Line
  for(var i = 0; i < this.grid.length; i++){
    if(this.grid[i][y] != this.current_player_id + 1)
      win = false;
  }
  if(win){
    this.players[this.current_player_id].score++;
    return true;
  }
    
  win = true;
  // Check Column
  for(var i = 0; i < this.grid.length; i++){
    if(this.grid[x][i] != this.current_player_id + 1)
      win = false;
  }
  if(win)
    return true;

  win = true;
  // Check diagonal
  for(var i = 0; i < this.grid.length; i++){
    if(this.grid[i][i] != this.current_player_id + 1)
      win = false;
  }
  if(win)
    return true;

  win = true;
  // Check antidiagonal
  for(var i = 0; i < this.grid.length; i++){
    if(this.grid[i][2-i] != this.current_player_id + 1)
      win = false;
  }

  return win;
};

/**
  Reset the grid with zeros
**/
Game.prototype.resetGame = function() {
  this.grid = initiate_grid(3);
};

/**
  Get the name of current player
**/
Game.prototype.getCurrentPlayerName = function() {
  return (this.players[this.current_player_id]).name;
};

module.exports = Game;