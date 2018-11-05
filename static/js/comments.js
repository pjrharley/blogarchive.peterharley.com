"use strict";

$(document).ready(function() {

    jQuery.fn.extend({
      hideV: function(speed, completefn) {
        return this.animate({height: 0}, {duration: speed, complete: completefn});
      },
      showV: function(speed, completefn) {
        return this.animate({height: '100%'}, {duration: speed, complete: completefn});
      },
    });

    var wholeform = $('#comments-form-all');
    var form = $('#comments-form');
    var comment_link = $('#comments-link');

    var ajax_loading_image = $('<img>');

    var static_base = $('#media_url').attr('href');

    ajax_loading_image.attr('src', static_base + "img/ajax-loader.gif");
    ajax_loading_image.hide();
    form.find('[name=submit_button]').after(ajax_loading_image);

    var ajax_loading_preview = ajax_loading_image.clone();
    form.find('[name=_preview]').before(ajax_loading_preview);

    if ((location.hash !== '#form')&&(location.hash !== '#submitted')){
      wholeform.hide();
    }

    var init = function() {
        //Register event on form submit
        form.submit(submit_comment_func);
        comment_link.click(show_form_func);
        $('a.form-link').click(show_form_func);
    }

    var show_form_func = function(e) {
        e.preventDefault();
        show_form();
    }

    var go_to_form = function(e) {
        window.location = "#form";
    }

    var submit_comment_func = function(e) {
        e.preventDefault();

        if (form.data('submitting')) {
            console.log('Preventing double submission');
            return;
        }

        form.data('submitting', true);
        var button_used = form.find("input[type=submit]:focus");

        if (button_used.attr('name') == '_preview') {
            ajax_loading_preview.show();
        }
        else {
            ajax_loading_image.show();
        }
        form.fadeTo('fast', 0.5, function() {
            var postData = form.serializeArray();
            postData.push({name:button_used.attr('name'), value:'true'});
            var formURL = form.attr("action");
            $.ajax({
                url: formURL,
                type: 'POST',
                data: postData,
                success: comment_form_callback.success,
                error: comment_form_callback.failure,
            }).always(function() {
                form.data('submitting', false);
            });
        });
    }

    var show_comment = function(comment_data) {
        //hide the new comment
        //ajax inserted new comment
        var new_comment = $('#newcomment');
        new_comment.hideV();
        new_comment.html(comment_data.html);
        new_comment.showV('slow');
    }

    var show_preview = function(comment_data) {
        $('#comment-preview').fadeOut('slow', function() {
            var comment_preview = $(this).clone();
            comment_preview.html(comment_data.html);
            comment_preview.hide();
            $(this).replaceWith(comment_preview);
            comment_preview.fadeIn('slow');
        });
    }

    var hide_preview = function() {
        $('#comment-preview').hideV('fast');
    }

    var show_form = function() {
        wholeform.show('slow', go_to_form);
    }

    var comment_form_callback = {
        success: function(data, textStatus, jqXHR) {
            form.fadeTo('fast', 1);

            ajax_loading_image.hide();
            ajax_loading_preview.hide();

            //if theres a message, draw it
            if (data.message.length > 0){
                $('#message').html("<ul class=\"messagelist\"><li>" + data.message + "</li></ul>");
                //move up to the form
                window.location = "#message";
            }

            if ((data.errors === '')&&(!data.preview)){
                //alert("this is a valid NON preview");
                //hide the form
                comment_link.hide();
                wholeform.hideV('slow', function() {
                    show_comment(data);
                });
            }
            else if ((data.errors === '')&&(data.preview)){
                //alert("this is a valid preview");
                $('div.errordiv').hideV('fast', function() {
                    $(this).html('');
                });
                show_preview(data);
            }
            else{//there were problems with the submission
                //fill in each error message
                $.when($('div.errordiv').hideV('fast')).then(function() {
                    $(this).html('');
                    for (var key in data.errors) {
                        if (data.errors.hasOwnProperty(key)) {
                            var errordiv;
                            if (key === '__all__'){
                                errordiv = $("#ALLerr");
                            }
                            else {
                                errordiv = $('#' + key + "err");
                            }
                            var ul = $('<ul>');
                            ul.attr('class', 'errorlist');
                            errordiv.append(ul);
                            for (var i=0; i < data.errors[key].length; i++){
                                var li = $('<li>');
                                li.html(data.errors[key][i]);
                                ul.append(li);
                            }
                        }
                    }
                    $('div.errordiv').showV('slow');
                });

                //give them a new captcha
                try{
                    Recaptcha.reload();
                }
                catch(e){
                    //Doesnt matter
                }
            }
        },
           
        failure: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + errorThrown);
            ajax_loading_image.hide();
            ajax_loading_preview.hide();
            form.unbind('submit');
            $('div.errordiv').hideV('fast');
            $('#message').html("<ul class=\"errorlist\"><li>An error has occurred with your submission, please try again.</li></ul>");
            //move up to the message
            window.location = "#message";
        }
    }
    init();
});