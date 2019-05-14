$(document).ready(function () {

    var startPosition =  $('#spaceShuttle').position().left;
    var speed = 3.5;

    $(window).scroll(function () {
        var move = $(this).scrollTop();
        var newPos = (move * speed) + startPosition;
        $('#spaceShuttle').css({
            'left': newPos,
        });

        $("#iss").css({
            'right': move
        })
    });

});