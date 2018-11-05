"use strict";
$(document).ready(function(){
    $('#sidebar_hide').slideUp('fast');
    $('#sidebar_show').append('<li><a id="show_more_link" href="#">More...</a></li>');
    $('#show_more_link').click(function(e) {
        e.preventDefault();
        $('#sidebar_hide').slideDown('fast');
        $(this).parent().slideUp('fast');
    });
});


