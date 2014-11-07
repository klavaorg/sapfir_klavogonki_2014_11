$(document).ready(function() {
	$('.left .btn').click(function(e){
		e.preventDefault();
		$('iframe').attr( 'src', $(this).attr('href') );
	});
});
