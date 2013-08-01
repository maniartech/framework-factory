
    $(document).ready(function(){

        $(window).scroll(function(){
            if ($(this).scrollTop() > 100) {
                $('.scrollup').fadeIn();
            } else {
                $('.scrollup').fadeOut();
            }
        });

        $('.scrollup').click(function(){
            $("html, body").animate({ scrollTop: 0 }, 600);
            return false;
        });

      $('.navbar .dropdown').hover(function() {
            $(this).find('.dropdown-menu').first().stop(true, true).delay(50).slideDown();
                    }, function() {
                $(this).find('.dropdown-menu').first().stop(true, true).delay(100).slideUp();
                });

        });

