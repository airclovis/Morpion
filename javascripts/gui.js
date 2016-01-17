$(document).ready(function(){

	var pseudo = prompt('Choose your name');
	socket.emit('pseudo', pseudo);

	$('#pseudo').append(pseudo);

	$('td').click(function(){
		var coord = getCoord($(this).attr('id'));
		socket.emit('coord', coord);
	});


	function getCoord(value){
		var tab = value.split('_');
		for(var i = 0; i < tab.length; i++){
			tab[i] = +tab[i];
		}
		return tab;
	}

	function fill_grid(grid){
		console.log(grid);
		for(var i = 0; i < grid.length; i++){
			for(var j = 0; j < grid.length; j++){
				if(grid[i][j] == 1){
					$('#' + i + '_' + j).text('X');
					$('#' + i + '_' + j).css('color', 'red');
				}
				else if(grid[i][j] == 2){
					$('#' + i + '_' + j).text('O');
					$('#' + i + '_' + j).css('color', 'blue');
				}
			}
		}
	}

	socket.on('warning', function(msg){
		alert(msg);
	});

	socket.on('game_info',function(msg){
		$('#game_info').append(msg);
	});

	socket.on('plays', fill_grid);
});
