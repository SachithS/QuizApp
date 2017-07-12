$(document).ready(function () {

    $('.complete').hide();
    $("#success_img").hide();
    $("#alertMsg").hide();
    $("#start_text").hide();
    $("#quiz").hide();
    $("#button_bar").hide();
    var level;

    var questions;
    var questionCounter = 0;
    var selections = [];
    var quiz = $('#quiz');

    $("#dropdown_level li").click(function() {

        $("#levelDropdown").hide();
        $("#start_text").show();
        level = $(this).attr('id');
        $('#level_selected').html($(this).text());
        
    });

    function displayNext() {
        quiz.fadeOut(function () {
            $('#question').remove();

            if (questionCounter < questions.length) {
                var nextQuestion = createQuestionElement(questionCounter);
                quiz.append(nextQuestion).fadeIn();
                if (!(isNaN(selections[questionCounter]))) {
                    $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
                }

                // Controls display of 'prev' button
                if (questionCounter === 1) {
                    $('#prev').show();
                } else if (questionCounter === 0) {

                    $('#prev').hide();
                    $('#next').show();
                }
            } else {
                $("#userName").val("");
                $('.userModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });


            }
        });
    }

    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
        var score = $('<p class="score">', {id: 'question'});

        $.get("/questions/validate?level=" + level, function (data) {
            if (data) {

                var numCorrect = 0;
                for (var i = 0; i < selections.length; i++) {
                    console.log(selections[i] + "    " + data[i].answer);
                    if (selections[i] === data[i].answer) {
                        numCorrect++;
                    }
                }

                score.html('Hey ' + $('#userName').val() + '! You got ' + numCorrect + ' questions out of ' +
                    questions.length + ' right!!!');
                quiz.append(score).fadeIn();

                if (numCorrect == questions.length) {
                    $('#success_img').fadeIn();
                }

                $.ajax({
                    contentType: 'application/json',
                    data: JSON.stringify({ "user": $('#userName').val(), "count":numCorrect }),
                    dataType: 'json',
                    success: function(data){
                        console.log("Record saved!");
                    },
                    error: function(){
                        console.log("Recording failed");
                    },
                    processData: false,
                    type: 'POST',
                    url: '/questions/user/report'
                });

                $('#start').show();


            } else {
                alert('Error occurred when validating!')
                return 0;
            }
        });
    }

    $('#userForm').on('submit', function (e) {
        e.preventDefault();

        $('.userModal').modal('toggle');
        $('.complete').fadeIn();
        $('#next').hide();
        $('#prev').hide();

        setTimeout(function () {
            $('.complete').hide();
            var scoreElem = displayScore();
        }, 1000);
    });



    $('#start_quiz').on('click', function (e) {
        e.preventDefault();
        $("#quiz").show();
        $("#start_text").hide();

        $.get("/questions?level=" + level, function (data) {

            questions = data;
        });

        displayNext();
        $("#button_bar").show();

    });



    $('#next').on('click', function (e) {
        e.preventDefault();
        choose();
        $("#alertMsg").hide();

        console.log(questions[questionCounter].ans);
        console.log(selections[questionCounter]);

        if(questions[questionCounter].ans == selections[questionCounter]){

            alert('Your answer is correct! Proceeding to next question..');

            // Suspend click listener during fade animation
            if (quiz.is(':animated')) {
                return false;
            }


            // If no user selection, progress is stopped
            if (isNaN(selections[questionCounter])) {
                alert('කරුණාකර නිවැරදි පිළිතුර තෝරන්න!');
            } else {
                questionCounter++;
                displayNext();
            }

        }else{


            // Suspend click listener during fade animation
            if (quiz.is(':animated')) {
                return false;
            }


            // If no user selection, progress is stopped
            if (isNaN(selections[questionCounter])) {
                alert('කරුණාකර නිවැරදි පිළිතුර තෝරන්න!');
            } else {
                alert('Your answer is wrong! Proceeding to next question..');
                questionCounter++;
                displayNext();
            }
        }

    });

    $('#prev').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        choose();
        questionCounter--;
        displayNext();
    });

    $('#start').on('click', function (e) {

        e.preventDefault();
        $(".score").remove();
        $("#success_img").remove();

        if (quiz.is(':animated')) {
            return false;
        }
        questionCounter = 0;
        selections = [];
        displayNext();
        $('#start').hide();
    });

    $('.button').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    function createQuestionElement(index) {
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<p class="qustions">ප්‍රශ්නය ' + (index + 1) + ':</p>');
        qElement.append(header);

        var question = $('<p class="qustion_title">').append(questions[index].question);
        qElement.append(question);

        var radioButtons = createRadios(index);
        qElement.append(radioButtons);

        return qElement;
    }

    function choose() {
        selections[questionCounter] = +$('input[name="answer"]:checked').val() + 1;
    }

    function createRadios(index) {
        var radioList = $('<ul class="radio">');
        var item;
        var input = '';
        for (var i = 0; i < questions[index].answers.length; i++) {
            item = $('<li>');
            input = '<input type="radio" name="answer" value=' + i + ' />';
            input += questions[index].answers[i];
            item.append(input);
            radioList.append(item);
        }
        return radioList;
    }


});
