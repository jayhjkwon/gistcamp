$(function(){
 
  var gistUrl = "http://gistcamp.com";

  var popupWindow = function(url, title, w, h){
    var left, top, newWindow, dualScreenLeft, dualScreenTop;

    dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    left = ((screen.width / 2) - (w / 2)) + dualScreenLeft;
    top = ((screen.height / 2) - (h / 2)) + dualScreenTop;
    newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    if (window.focus) {
      newWindow.focus();
    }
  }; 

  $(".span-linkedin").on("click", function(e){
    e.preventDefault();
    var url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(gistUrl);
    var title = 'GistCamp';
    popupWindow(url, title, '626', '496'); 
  });

  $(".span-google").on("click", function(e){
    e.preventDefault(); 
    var url = 'https://plus.google.com/share?url=' + encodeURIComponent(gistUrl);
    var title = 'GistCamp';
    popupWindow(url, title, '473', '216');  
  });

  $(".span-facebook").on("click", function(e){
    e.preventDefault();
    var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(gistUrl);
    var title = 'GistCamp';
    popupWindow(url, title, '626', '436');   
  });

  $(".span-twitter").on("click", function(e){
    e.preventDefault();
    var url = 'https://twitter.com/intent/tweet?via=GistCamp&url=' + encodeURIComponent(gistUrl) + '&text=The Best Open Web Interface for Gist';
    var title = 'GistCamp';
    popupWindow(url, title, '473', '258'); 
  });
});