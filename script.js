$(document).ready(function () {
    let timer;  // Global question timer variable
    let difficulty;
    let streak = 0;
    let playerHealth = 3;
    let monsterHealth = 4;
    let playerAttack = 1;

    function monsterTakesDamage() {
        streak += 1;

        if (streak >= 4) {
            playerAttack = 2;
        } else {
            playerAttack = 1;
        }

        monsterHealth -= playerAttack;
        console.log("Monster takes damage!");
        console.log("Monster health remaining: " + monsterHealth);
    };

    function playerTakesDamage() {
        streak = 0;
        playerHealth -= 1;
        console.log("You take damage.");
        console.log("Your health remaining: " + playerHealth);
    };

    // Input (nothing yet, maybe difficulty later?), Output (void: generates random addition question on screen)
    function generateAdditionQuestion() {
        const leftNum = Math.floor(Math.random() * 10) + 1;
        const rightNum = Math.floor(Math.random() * 10) + 1;
        const equation = leftNum + " + " + rightNum;
        $("#question").find("p").text(equation);
    };

    // Input (nothing), Output (void: generates 1 correct answer and 2 random incorrect answers on screen)
    function generateAnswerChoices() {
        // Calculates correct answer of current displayed question
        const correctAns = eval($("#question").find("p").text());

        // Returns random integer 0, 1, or 2 to decide correctAns location
        const correctAnsId = Math.floor(Math.random() * 3);

        // Generate incorrect answers
        const positiveOrNeg1 = Math.round(Math.random()) * 2 - 1;   // Returns either -1 or 1
        const positiveOrNeg2 = Math.round(Math.random()) * 2 - 1;

        let incorrectChoice1 = correctAns + (positiveOrNeg1 * (Math.floor(Math.random() * 5) + 1));

        // Makes sure it is not a negative answer choice
        while (incorrectChoice1 < 0) {
            incorrectChoice1 = correctAns + (positiveOrNeg1 * (Math.floor(Math.random() * 5) + 1));
        }

        let incorrectChoice2 = correctAns + (positiveOrNeg2 * (Math.floor(Math.random() * 5) + 1));

        // Makes sure it is not a duplicate incorrect choice, and not a negative answer choice
        while ((incorrectChoice2 == incorrectChoice1) || (incorrectChoice2 < 0)) {
            incorrectChoice2 = correctAns + (positiveOrNeg2 * (Math.floor(Math.random() * 5) + 1));
        }

        // Display new answer choices
        if (correctAnsId == 0) {
            $("#answerOne").find("span").text(correctAns);
            $("#answerTwo").find("span").text(incorrectChoice1);
            $("#answerThree").find("span").text(incorrectChoice2);

        } else if (correctAnsId == 1) {
            $("#answerTwo").find("span").text(correctAns);
            $("#answerOne").find("span").text(incorrectChoice1);
            $("#answerThree").find("span").text(incorrectChoice2);

        } else {
            $("#answerThree").find("span").text(correctAns);
            $("#answerOne").find("span").text(incorrectChoice1);
            $("#answerTwo").find("span").text(incorrectChoice2);
        }
    };


    // Input (nothing), Output (void: sets time limit based on difficulty, starts question timer countdown on screen)
    function generateQuestionTimer() {
        let startTime = Date.now();
        let timeLimit;

        // Adjust difficulty based on difficulty button selected
        if (difficulty == "Easy") {
            timeLimit = 30;
        } else if (difficulty == "Medium") {
            timeLimit = 15;
        } else {  // Hard
            timeLimit = 5;
        }

        let timeRemaining = timeLimit;

        $("#timerCountDown").text(timeRemaining);
        console.log(timeRemaining);

        timer = setInterval(function () {
            timeRemaining = timeLimit - Math.floor((Date.now() - startTime) / 1000);
            $("#timerCountDown").text(timeRemaining);
            console.log(timeRemaining);

            // If time runs out, you take damage. Then generate next question.
            if (Math.floor(timeRemaining) <= 0) {
                clearInterval(timer);

                playerTakesDamage();

                updateStreak();
                generateAdditionQuestion();
                generateAnswerChoices();
                generateQuestionTimer();
            }
        }, 1000)
    };

    // Stops the current timer
    function stopQuestionTimer() {
        clearInterval(timer);
    };


    // Updates player hit streak displayed on screen
    function updateStreak() {
        if (streak >= 4) {
            $("#comboNumber").text("Combo x" + streak + "!");
            $("#damageNumber").text("Damage x2!");
        } else {
            $("#comboNumber").text("Combo x" + streak);
            $("#damageNumber").empty();
        }
    };


    // Submits answer denoted by class of "chosenAnswer"
    function submitAnswer() {
        const correctAns = eval($("#question").find("p").text());
        const yourAns = $(".chosenAnswer").find("span").text();
        console.log("Your Answer: " + yourAns + "    Correct Answer: " + correctAns);

        $(".chosenAnswer").removeClass("chosenAnswer");

        const isCorrect = (yourAns == correctAns);
        // If correct, monster takes damage. If incorrect, you take damage.
        if (isCorrect) {
            monsterTakesDamage();
        } else {
            playerTakesDamage();
        }
    };



    // Transitions to battle page upon clicking a difficulty on main menu
    $(".difficultyButton").click(function () {
        console.log(this);
        difficulty = $(this).find("p").text();
        console.log(difficulty);

        // Turn frontPageWrapper from index.html into battlePageWrapper from battle.html
        $.ajax({
            url: "battle.html",
            success: function (data) {
                $("#frontPageWrapper").fadeOut(250, function () {
                    // Get only the html underneath #battlePageWrapper
                    const newPage = $(data).filter("#battlePageWrapper").html();

                    // Set HTML of #frontPageWrapper to HTML underneath #battlePageWrapper
                    $("#frontPageWrapper").html(newPage);

                    // Change id of frontPageWraper to battlePageWrapper
                    $("#frontPageWrapper").attr("id", "battlePageWrapper");

                    // Generate first question and its answer choices
                    updateStreak();
                    generateAdditionQuestion();
                    generateAnswerChoices();
                    generateQuestionTimer();

                    $("#battlePageWrapper").fadeIn(250);
                })
            }
        })


    });


    // Submits answer choice that was clicked on
    $(document).on("click", ".answerButton", function () {
        stopQuestionTimer();  // Stop timer for current question

        // Clicked answer choice becomes chosen answer and submitted
        $(this).addClass("chosenAnswer");
        submitAnswer();

        // New question and corresponding answer choices
        updateStreak();
        generateAdditionQuestion();
        generateAnswerChoices();
        generateQuestionTimer();
    });


    // Interact with game with keyboard
    $(document).keydown(function (e) {
        // Sift through answer choices with left arrow key
        if (e.keyCode == 37) {
            if (!$(".focusable").hasClass("focused")) {
                // If no answer choice is currently selected, select rightmost choice
                $(".focusable").last().addClass("focused");
            } else if ($(".focused").prev(".focusable").length) {
                // If answer choice to left of current choice exists, select left choice
                $(".focused").removeClass("focused").prev(".focusable").addClass("focused");
            } else {
                // Else select rightmost answer choice (there is no other choice to left of current choice)
                $(".focused").removeClass("focused").siblings(":last").addClass("focused");
            }
        }

        // Sift through answer choices with right arrow key
        if (e.keyCode == 39) {
            if (!$(".focusable").hasClass("focused")) {
                // If no answer choice is currently selected, select leftmost choice
                $(".focusable").first().addClass("focused");
            } else if ($(".focused").next(".focusable").length) {
                // If answer choice to right of current choice exists, select right choice
                $(".focused").removeClass("focused").next(".focusable").addClass("focused");
            } else {
                // Else select leftmost answer choice (there is no other choice to right of current choice)
                $(".focused").removeClass("focused").siblings(":first").addClass("focused");
            }
        }

        // Submit answer choice currently selected with spacebar
        if (e.keyCode == 32) {
            stopQuestionTimer();    // Stop timer for current question

            // Answer choice selected by spacebar is submitted
            $(".focused").addClass("chosenAnswer");
            submitAnswer();

            // New question and corresponding answer choices
            updateStreak();
            generateAdditionQuestion();
            generateAnswerChoices();
            generateQuestionTimer();
        }
    });


    // Focus answer choice on mouse hover
    $(document).on("mouseenter", ".focusable", function () {
        $(".focusable").removeClass("focused");
        $(this).addClass("focused");
    });

});