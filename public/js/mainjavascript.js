/* Elements Fading In */

$(document).ready(function() {
	$("#black").fadeIn(1000);
	$("#main").fadeIn(2000);
	$("#socialMediaBox").delay(200).fadeIn(2000);

	$(".socialfade1").delay(1000).fadeIn(1000);
	$(".socialfade2").delay(2000).fadeIn(1000);
	$(".socialfade3").delay(3000).fadeIn(1000);
});


/* Fancy MouseHover Animation */

function hoverin() {
	var elem_val = $(this).val();
	$("#" + elem_val).animate({
		'margin-left': '400px'
	}, 600, 'easeOutBounce').fadeOut(500);

	$("#" + elem_val).animate({
		"opacity": "toggle",
		'margin-left': '0px'
	}, 0.01).fadeIn(0.01);	
}

$(".bullet").hoverIntent(hoverin, function(){} );


/* My Tale Section */

$(".activateTale").click(function () {
	$("#scrollup").delay(1000).animate({
		"opacity": "toggle"
	}, 1000);
	$("#myTale").animate({
		"height": "toggle", 
		"opacity": "toggle"
	}, 1000);
});


/* My Secret Button Section */

$(".activateSecret").click(function () {
	$("#scrollup2").delay(1000).animate({
		"opacity": "toggle"
	}, 1000);
	$("#secretButton").animate({
		"height": "toggle", 
		"opacity": "toggle"
	}, 1000);
});








