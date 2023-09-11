"use strict";
$(document).ready(function() {
    var padding = 20;
    var holderdiv = $('#imageholder');
    var imagelinks = $('.imagepop');

    var closeImageSrc = $('#media_url').attr('href') + 'img/close.png'
    var closebutton = $('<img>');
    closebutton.attr('src', closeImageSrc);
    imagelinks.click(function(e) {
        e.preventDefault();

        // Close previous image.
        holderdiv.children().remove();

        var imagePop = $("<img>");
        imagePop.attr('src', $(this).attr('href')).load(function() {
            var originalHeight = this.height;
            var originalWidth = this.width;

            var set_size = function() {
                if (Math.round($(window).width() - originalWidth - padding*2) < 10) {
                    var width = $(window).width() - padding * 2 -10;
                    var height = Math.round(width / originalWidth * originalHeight);
                    imagePop.width(width);
                    imagePop.height(height);
                }
                if (Math.round($(window).height() - originalHeight - padding*2) < 10) {
                    imagePop.height($(window).height() - padding * 2 -10);
                    imagePop.width(Math.round(imagePop.height() / originalHeight * originalWidth));
                }
                var topleft = [Math.round(($(window).width() - imagePop.width() - padding*2)/2),
                    Math.round(($(window).height() - imagePop.height() - padding*2)/2)];

                imagePop.css('left', topleft[0]+ 'px');
                imagePop.css('top', topleft[1]+ 'px');
                closebutton.css('left', (topleft[0] + imagePop.width() + padding) + 'px');
                closebutton.css('top', topleft[1]+ 'px');
            }

            set_size();

            imagePop.css('position', 'fixed');
            imagePop.css('padding', padding + 'px');

            imagePop.css('background', 'black');
            imagePop.css('z-index', '5');

            //sort out the close button
            closebutton.css('position', 'fixed');
            //closebutton.css('right', topleft[0]+ 'px');
            //YAHOO.util.Dom.setStyle(image_pops.closebutton, "top", topleft[1]+ 'px');

            closebutton.css('z-index', '6');

            // add the newly created element and it's content into the DOM
            holderdiv.append(imagePop);
            holderdiv.append(closebutton);

            $(window).resize(set_size);

            closebutton.click(function() {
                holderdiv.children().remove();
                $(window).unbind('resize', set_size);
            });

            imagePop.click(function() {
                holderdiv.children().remove();
                window.open(this.src,'','');
            });
       });
    });
});