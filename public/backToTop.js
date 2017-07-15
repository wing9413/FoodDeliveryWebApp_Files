$(function(){
	$('#backTop').on("click",function(){
		$('body,html').animate({scrollTop:0},400,'swing');
		return false;
									  
	});
    if(sizeFlg=="pc"){
    }
    else if(sizeFlg=="smp"){
    }

    $(window).scroll(function(){
        if($(window).scrollTop()>100){
			  $('#backTop').stop().animate({"opacity":1},1000,'easeOutExpo');
		}
		else{
			  $('#backTop').stop().animate({"opacity":0},1000,'easeOutExpo');
		}
    });
});