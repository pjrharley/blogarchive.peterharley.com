"use strict";

$(document).ready(function(){
    $('a.archive_collapse').each(function(i) {
        $(this).click(function(e) {
            $(this).toggleClass('hidden');
            $('ul.archive').eq(i).slideToggle('fast');
            var clickedLink = $(this);
            if (clickedLink.hasClass('hidden')) {
                clickedLink.text('▶');
            } else {
                clickedLink.text('▼');
            }
            e.preventDefault();
        })
    });
    $('ul.archive').slice(1).hide();
    var hideLinks = $('a.archive_collapse').slice(1);
    hideLinks.addClass('hidden');
    hideLinks.text('▶');
});

