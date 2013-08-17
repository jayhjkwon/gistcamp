$(document).ready(
			function() {  
				$("html").niceScroll();
			}
		);

$(".img-power").on("click", function() {
  
  $('.contents').scrollTo('#div-power'
  	,{duration:'slow', offsetTop : '50'});
 
});

$(".menu-features").on("click", function() {
  
  $('.contents').scrollTo('#div-features'
  	,{duration:'slow', offsetTop : '50'});
 
});


$(".img-video").on("click", function() {
  
  $('.contents').scrollTo('#div-video'
  	,{duration:'slow', offsetTop : '50'});
 
});

$(".img-person").on("click", function() {
  
  $('.contents').scrollTo('#div-person'
  	,{duration:'slow', offsetTop : '50'});
 
});


$(".power-font4").on("click", function() {
  
  $('.contents').scrollTo('#div-features'
    ,{duration:'slow', offsetTop : '50'});
 
});


$("#features-friends").on("mouseover", function(){
 
  // $(".features-friends-contents-hidden").addClass("features-friends-contents-show").removeClass("features-friends-contents-hidden")
  $("#features-friends-contents").removeClass("features-contents-hidden features-contents-show")
  .addClass("features-contents-show");

});

$("#features-friends").on("mouseleave", function(){
 
  // $(".features-friends-contents-show").addClass("features-friends-contents-hidden").removeClass("features-friends-contents-show")
  $("#features-friends-contents").removeClass("features-contents-hidden features-contents-show")
  .addClass("features-contents-hidden");
});
 



$("#features-tagging").on("mouseover", function(){
 
  $("#features-tagging-contents").removeClass("features-contents-hidden features-contents-show")
  .addClass("features-contents-show");

});

$("#features-tagging").on("mouseleave", function(){
 
 
  $("#features-tagging-contents").removeClass("features-contents-hidden features-contents-show")
  .addClass("features-contents-hidden");
});




$("#features-alert").on("mouseover", function(){
 
  $("#features-alert-contents").removeClass("features-contents-hidden features-contents-show")
  .addClass("features-contents-show");

});

$("#features-alert").on("mouseleave", function(){
 
 
  $("#features-alert-contents").removeClass("features-contents-hidden features-contents-show")
  .addClass("features-contents-hidden");
});





$("#features-chatting").on("mouseover", function(){
 
  $("#features-chatting-contents").removeClass("features-contents-hidden features-contents-show2")
  .addClass("features-contents-show2");

});

$("#features-chatting").on("mouseleave", function(){
 
 
  $("#features-chatting-contents").removeClass("features-contents-hidden features-contents-show2")
  .addClass("features-contents-hidden");
});






$("#features-share").on("mouseover", function(){
 
  $("#features-share-contents").removeClass("features-contents-hidden features-contents-show2")
  .addClass("features-contents-show2");

});

$("#features-share").on("mouseleave", function(){
 
 
  $("#features-share-contents").removeClass("features-contents-hidden features-contents-show2")
  .addClass("features-contents-hidden");
});





$("#features-opensource").on("mouseover", function(){
 
  $("#features-opensource-contents").removeClass("features-contents-hidden features-contents-show2")
  .addClass("features-contents-show2");

});

$("#features-opensource").on("mouseleave", function(){
 
 
  $("#features-opensource-contents").removeClass("features-contents-hidden features-contents-show2")
  .addClass("features-contents-hidden");
});
