$(function(){
    
    // Only animate elements when using non-mobile devices
    if (jQuery.browser.mobile === false){
        
       
        
        /*-------------------------------------------------------------------*/
        /*  5. Section - Resume
        /*-------------------------------------------------------------------*/
        $('#education').find('.resume-item:not(:first)').each(function(i){            
            var element = $(this),
            itemsDelay   = ( isNaN($(this).data('animation-delay')) ? 50 : $(this).data('animation-delay'));
            element.css('opacity', 0).one('inview', function(isInView) {
                if (isInView){
                    setTimeout(function(){
                        element.addClass('animated bounceInUp').css('opacity', 1);
                    } , itemsDelay * (i * 2));
                }
            });
        });
        
        $('#work').find('.resume-item:not(:first)').each(function(i){            
            var element = $(this),
            itemsDelay   = ( isNaN($(this).data('animation-delay')) ? 50 : $(this).data('animation-delay'));
            element.css('opacity', 0).one('inview', function(isInView) {
                if (isInView){
                    setTimeout(function(){
                        element.addClass('animated bounceInUp').css('opacity', 1);
                    } , itemsDelay * (i * 2));
                }
            });
        });
        
        
        
        
        /*-------------------------------------------------------------------*/
        /*  8. Section - Contact
        /*-------------------------------------------------------------------*/
        $('.contact-details', '#contact').css('opacity', 0).one('inview', function(isInView){
            if (isInView) {$(this).addClass('animated flipInX').css('opacity', 1);}
        });
        
        
        /*-------------------------------------------------------------------*/
        /*  9. Footer
        /*-------------------------------------------------------------------*/
        /*$('.footer').find('.item').each(function(i){
            var element = $(this),
            itemsDelay   = ( isNaN($(this).data('animation-delay')) ? 50 : $(this).data('animation-delay'));
            
            element.css('opacity', 0).one('inview', function(isInView) {
                if (isInView){
                    setTimeout(function(){
                        element.addClass('animated bounceIn').css('opacity', 1);
                    } , itemsDelay * (i * 2));
                }
            });
        });*/
    }
});