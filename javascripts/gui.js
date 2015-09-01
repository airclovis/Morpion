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

	socket.on('warning', function(msg){
		$('#warning').append(msg);
		console.log(msg);
	})
});
