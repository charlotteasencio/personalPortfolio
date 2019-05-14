$(document).ready(function () {

    //move space shuttle, saturn, and iss images across the screen on scroll once
    $(window).scroll(function () {
        $('#spaceShuttle').css({
           'left': 1000 + 'px',
           'bottom': 100 + '%',
           'transition': 4 + 's'
        });

        $('#saturn').css({
            'left': -20 + 'px',
            'top': 100 + '%',
            'transition': 7 + 's'
         });

        $('#iss').css({
            'bottom': 100 + '%',
            'right': 100 + '%',
            'transition': 2.5 + 's'
        })
    });

});