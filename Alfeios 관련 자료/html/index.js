$('.menuBox').click(function() {

    var openState = $(this).attr('openState');

    if (openState == "0") {
        $(this).addClass('open');
        $(this).attr('openState', '1');
        $('#customButton').css('background-color', 'white')
        $('.outScreen').fadeIn();
        justifyToMiddle($('.listBox'));
        $('html, body').css('overflow', 'hidden');

    } else {
        $(this).removeClass('open');
        $(this).attr('openState', '0');
        $('#customButton').css('background-color', 'black')
        $('.outScreen').fadeOut();
        $('html, body').css('overflow', 'auto');
    }
})


function justifyToMiddle(jqueryObject) {
    var w_height = $(window).height();
    var o_height = jqueryObject.height();

    var o_paddingTop = (w_height - o_height - 32) / 2;

    //console.log(w_height + '/' + o_height + '/' + o_paddingTop);
    jqueryObject.css('padding-top', o_paddingTop);
}



/* scroll시 헤더 숨김 */

var didScroll;
var lastScrollTop = 0;
var h_height = $('.menuBox').height();

$(window).scroll(function(e) {
    didScroll = true;
})

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {

	var st = $(this).scrollTop();

	if(st > 50){
		$('.pageTitle').animate({
			opacity:0
		},100)
	} else {
		$('.pageTitle').animate({
			opacity:1
		})
	}
}

/* 위로 가는 버튼 */

$('.topButtonBox').click(function(){
	$('html,body').animate({
		scrollTop:0
	})
})
