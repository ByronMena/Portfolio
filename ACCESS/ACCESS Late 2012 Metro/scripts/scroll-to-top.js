$(function () {
	var scroll_timer;
	var displayed = false;
	var $message = $('#message a');
	var $window = $(window);
	var top = $('a[name="top"]').offset().top;
	$window.scroll(function () {
		window.clearTimeout(scroll_timer);
		scroll_timer = window.setTimeout(function () {
			if($window.scrollTop() <= top)
			{
				displayed = false;
				$message.fadeOut(500);
			}
			else if(displayed == false)
			{
				displayed = true;
				$message.stop(true, true).fadeIn().click(function () { $message.fadeOut(500); });
			}
		}, 100);
	});
	$('#message').click(function() {
			$message.fadeOut(900);
	});
});
