//
//New bug in IE11 -- scrolling position:fixed + background-image elements jitters badly
//https://social.msdn.microsoft.com/Forums/ie/en-US/9567fc32-016e-48e9-86e2-5fe51fd67402/new-bug-in-ie11-scrolling-positionfixed-backgroundimage-elements-jitters-badly?forum=iewebdevelopment
//You can see it in action on my site @ zachpatrick.com 
//
// NOTE: See '_bg-image-container.scss' for details
//
if (navigator.userAgent.match(/MSIE 10/i) || navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.match(/Edge\/12\./)) {
    $('body').on("mousewheel", function() {
        event.preventDefault();
        var wd = event.wheelDelta;
        var csp = window.pageYOffset;
        window.scrollTo(0, csp - wd);
    });
}