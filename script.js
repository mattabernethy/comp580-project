$(document).ready(function () {
    let timer;  // Global question timer variable

    // Input (nothing yet, maybe difficulty later?), Output (void: generates random addition question on screen)
    function generateAdditionQuestion() {
        const leftNum = Math.floor(Math.random() * 6) + 1;
        const rightNum = Math.floor(Math.random() * 6) + 1;
        const equation = leftNum + " + " + rightNum;
        $("#question").find("p").text(equation);
    }

    // Input (nothing), Output (void: generates 1 correct answer and 2 random incorrect answers on screen)
    function generateAnswerChoices() {
        // Calculates correct answer of current displayed question
        const correctAns = eval($("#question").find("p").text());

        // Returns random integer 0, 1, or 2 to decide correctAns location
        const correctAnsId = Math.floor(Math.random() * 3);
        // Returns either -1 or 1
        const positiveOrNeg = Math.round(Math.random()) * 2 - 1;

        // New answer choices
        if (correctAnsId == 0) {
            $("#answerOne").find("span").text(correctAns);
            if (positiveOrNeg == -1) {
                // Then first non-correct choice is multiplied by -1
                $("#answerTwo").find("span").text(correctAns + (Math.floor(Math.random() * 5) + 1) * -1);
                $("#answerThree").find("span").text(correctAns + Math.floor(Math.random() * 5) + 1);
            } else {
                // Else second non-correct choice is multiplied by -1
                $("#answerTwo").find("span").text(correctAns + Math.floor(Math.random() * 5) + 1);
                $("#answerThree").find("span").text(correctAns + (Math.floor(Math.random() * 5) + 1) * -1);
            }
        } else if (correctAnsId == 1) {
            $("#answerTwo").find("span").text(correctAns);
            if (positiveOrNeg == -1) {
                // Then first non-correct choice is multiplied by -1
                $("#answerOne").find("span").text(correctAns + (Math.floor(Math.random() * 5) + 1) * -1);
                $("#answerThree").find("span").text(correctAns + Math.floor(Math.random() * 5) + 1);
            } else {
                // Else second non-correct choice is multiplied by -1
                $("#answerOne").find("span").text(correctAns + Math.floor(Math.random() * 5) + 1);
                $("#answerThree").find("span").text(correctAns + (Math.floor(Math.random() * 5) + 1) * -1);
            }
        } else {
            $("#answerThree").find("span").text(correctAns);
            if (positiveOrNeg == -1) {
                // Then first non-correct choice is multiplied by -1
                $("#answerOne").find("span").text(correctAns + (Math.floor(Math.random() * 5) + 1) * -1);
                $("#answerTwo").find("span").text(correctAns + Math.floor(Math.random() * 5) + 1);
            } else {
                // Else second non-correct choice is multiplied by -1
                $("#answerOne").find("span").text(correctAns + Math.floor(Math.random() * 5) + 1);
                $("#answerTwo").find("span").text(correctAns + (Math.floor(Math.random() * 5) + 1) * -1);
            }
        }
    }


    // Input (nothing for now, maybe difficulty later?), Output (void: changes timer number on screen)
    function generateQuestionTimer() {
        let startTime = Date.now();
        let timeLimit = 3;
        let timeRemaining = timeLimit;

        $("#timerCountDown").text(timeRemaining);
        console.log(timeRemaining);

        timer = setInterval(function () {
            timeRemaining = timeLimit -  Math.floor((Date.now() - startTime) / 1000);
            $("#timerCountDown").text(timeRemaining);
            console.log(timeRemaining);

            // If time runs out, you take damage. Then generate next question.
            if (Math.floor(timeRemaining) <= 0) {
                clearInterval(timer);
                console.log("You take damage.");

                generateAdditionQuestion();
                generateAnswerChoices();
                generateQuestionTimer();
            }
        }, 1000)
    }



    // Transitions to battle page upon clicking a difficulty on main menu
    $(".difficultyButton").click(function () {
        console.log(this);
        const difficulty = $(this).find("p").text();
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

                    // Adjust difficulty based on difficulty button selected
                    if (difficulty == "Easy") {

                    } else if (difficulty == "Medium") {

                    } else {

                    }

                    // Generate first question and its answer choices
                    generateAdditionQuestion();
                    generateAnswerChoices();
                    generateQuestionTimer();

                    $("#battlePageWrapper").fadeIn(250);
                })
            }
        })


    });


    // Damage mechanics and change question upon clicking answer choice
    $(document).on("click", ".answerButton", function () {
        clearInterval(timer);  // Clears timer for previous question

        const correctAns = eval($("#question").find("p").text());
        const yourAns = $(this).find("span").text();
        console.log("Your Answer: " + yourAns);
        console.log("Correct Answer: " + correctAns);

        const isCorrect = (yourAns == correctAns);
        // If correct, monster takes damage. If incorrect, you take damage.
        if (isCorrect) {
            console.log("Monster takes damage!");
        } else {
            console.log("You take damage.");
        }

        // New question and corresponding answer choices
        generateAdditionQuestion();
        generateAnswerChoices();
        generateQuestionTimer();
    });




});