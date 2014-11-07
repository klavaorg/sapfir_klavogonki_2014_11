$(document).ready(function() {
	// fix iframe
	$('.left .btn').click(function(e){
		e.preventDefault();
		$('iframe').attr( 'src', $(this).attr('href') );
	});

	// TEAMS
	var red = ['AvtandiLine', 'ibnteo', 'PROFI', 'Alkhor', 'Софья_Андреевна'];
	var green = ['Reset82', 'Felicia555', 'GoodLoki', 'FreeAvenger', 'SnowMen'];

	// EXERSIZES
	// var data = [];
	var data = {};

	// PARSING
	$('.right .btn').click(function(e){
		e.preventDefault();
		$('#players .player').each(function(){
			var $this = $(this);
			$('#players .player').each(function() {
				// data.push({
				// 	name: $(this).find('.nick_content').text(), // ник
				// 	speed: $(this).find('.bitmore').text() // скорость
				// });
				data[$(this).find('.nick_content').text()] = $(this).find('.bitmore').text();
			});

		});
		console.log(data);
	});
});
