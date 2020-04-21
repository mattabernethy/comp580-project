$(document).ready(function () {
    let timer;  // Global question timer variable
    let difficulty;
    let world = "addition";   // The theme for each world
    let streak = 0;
    let correctAns;
    let playerAttack = 10;
    let playerName = "Player";
    let playerHealth;
    let monsterHealth;
    let maxMonsterHealth = 40;
    let level;
    let questionType = 0;
    let frontPage = $("#frontPageWrapper").html();
    let battlePage = $("#battlePageWrapper").html();

    // Sets default Player Name to be "Player"
    setName();

    function monsterTakesDamage() {
        if(monsterHealth > 0){
            streak += 1;

            if (streak >= 4) {
                playerAttack = 20;
            } else {
                playerAttack = 10;
            }

            monsterHealth -= playerAttack;

            if(monsterHealth <= 0){
                //gets random type of monster
                let temp = Math.floor(Math.random() * 4);

                //look until you find a different monster
                while(temp===questionType){
                    temp = Math.floor(Math.random() * 4);
                }

                questionType = temp;

                updateLevel();
                maxMonsterHealth += 5
                monsterHealth = maxMonsterHealth;
            }

            $("#eHealthBar").val(monsterHealth);
            $("#eHealthCounter").html("Health: " + monsterHealth + "/" + maxMonsterHealth)


            console.log("Monster takes damage!");
            console.log("Monster health remaining: " + monsterHealth);
        }
    };

  
    function playerTakesDamage() {
        if(playerHealth > 0){
            streak = 0;
            playerHealth -= 10;

            // If the player's health is zero, then end the game
            if(playerHealth === 0){
                endGame();
            }

            $("#pHealthBar").val(playerHealth);
            $("#pHealthCounter").html("Health: " + playerHealth + "/100")
            console.log("You take damage. Your health is now " + playerHealth);
        }
    };

    function generateQuestion() {
        // if (world === "addition") {
        //     generateAddQuestion();
        // } else if (world === "subtraction") {
        //     generateSubQuestion();
        // } else if (world === "multiplication") {
        //     generateMultQuestion();
        // } else if (world === "division") {
        //     generateDivQuestion();
        // } else {  // mixed math final boss
        //     // Returns random integer 0, 1, 2, or 3
        //     const questionType = Math.floor(Math.random() * 4);
        //
        //     if (questionType === 0) {
        //         generateAddQuestion();
        //     } else if (questionType === 1) {
        //         generateSubQuestion();
        //     } else if (questionType === 2) {
        //         generateMultQuestion();
        //     } else {  // questionType == 3
        //         generateDivQuestion();
        //     }
        // }
        if (questionType === 0) {
            generateAddQuestion();
        } else if (questionType === 1) {
            generateSubQuestion();
        } else if (questionType === 2) {
            generateMultQuestion();
        } else {  // questionType == 3
            generateDivQuestion();
        }

        // Calculates correct answer of current question
        correctAns = eval($("#question").find("p").text());

        generateAnswerChoices();
    }

    // Input (nothing yet, maybe difficulty later?), Output (void: generates random addition question on screen)
    function generateAddQuestion() {
        const leftNum = Math.floor(Math.random() * 10) + 1;
        const rightNum = Math.floor(Math.random() * 10) + 1;
        const equation = leftNum + " + " + rightNum;
        $("#question").find("p").text(equation);
        let name = "Addition Apparition";
        let imageURL = "assets/additionApparition.svg"
        generateMonster(name, imageURL);
    };

    function generateMonster(name, imageURL){
        $("#eName").html(name);
        $("#ePic").attr("src", imageURL);
    }

    function generateSubQuestion() {
        let leftNum = Math.floor(Math.random() * 10) + 1;
        let rightNum = Math.floor(Math.random() * 10) + 1;

        // Makes sure the answer is non-negative
        if (leftNum < rightNum) {
            // leftNum = rightNum + (Math.floor(Math.random() * (10 - rightNum)) + 1);
            leftNum = Math.floor(Math.random() * 10) + 1;
        }

        const equation = leftNum + " - " + rightNum;
        $("#question").find("p").text(equation);

        let name = "SubtractionSerpent";
        let imageURL = "assets/subtractionSerpent.svg"
        generateMonster(name, imageURL);
    }

    function generateMultQuestion() {
        const leftNum = Math.floor(Math.random() * 10) + 1;
        const rightNum = Math.floor(Math.random() * 10) + 1;
        const equation = leftNum + " * " + rightNum;
        $("#question").find("p").text(equation);

        let name = "Multiplication Mummy";
        let imageURL = "assets/multiplicationMummy.svg"
        generateMonster(name, imageURL);
    }

    function generateDivQuestion() {
        let leftNum = Math.floor(Math.random() * 10) + 1;
        let rightNum = Math.floor(Math.random() * 10) + 1;

        // Makes sure the answer is an integer
        while (!Number.isInteger(leftNum / rightNum)) {
            leftNum = Math.floor(Math.random() * 10) + 1;
            rightNum = Math.floor(Math.random() * 10) + 1;
            console.log("loop");
            console.log(leftNum + " / " + rightNum);
        }

        const equation = leftNum + " / " + rightNum;
        $("#question").find("p").text(equation);

        let name = "Division Demon";
        let imageURL = "assets/divisionDemon.svg"
        generateMonster(name, imageURL);
    }

    // Input (nothing), Output (void: generates 1 correct answer and 2 random incorrect answers on screen)
    function generateAnswerChoices() {
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
        while ((incorrectChoice2 === incorrectChoice1) || (incorrectChoice2 < 0)) {
            incorrectChoice2 = correctAns + (positiveOrNeg2 * (Math.floor(Math.random() * 5) + 1));
        }

        // Display new answer choices
        if (correctAnsId === 0) {
            $("#answerOne").find("span").text(correctAns);
            $("#answerTwo").find("span").text(incorrectChoice1);
            $("#answerThree").find("span").text(incorrectChoice2);

        } else if (correctAnsId === 1) {
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
        if (difficulty === "Easy") {
            timeLimit = 60;
        } else if (difficulty === "Medium") {
            timeLimit = 45;
        } else {  // Hard
            timeLimit = 30;
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
                generateQuestion();
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

        $("#frontPageOuterWrapper").fadeOut(500, function () {
            playerName = $("#nameInput").val();
            updateStreak();
            generateQuestion();
            generateQuestionTimer();
            setName();
            resetHealth();
            level = 1;
            $("#battlePageOuterWrapper").fadeIn("slow");

        });
    });

    // Sets Player name to be what it was entered as on Home Page
    function setName() {
        if(playerName === ""){
            playerName = "Player";
        }
        console.log("Player Name set to " + playerName);

        $("#pName").html(playerName);

    }


    // Submits answer choice that was clicked on
    $(document).on("click", ".answerButton", function () {
        stopQuestionTimer();  // Stop timer for current question

        // Clicked answer choice becomes chosen answer and submitted
        $(this).addClass("chosenAnswer");
        submitAnswer();

        // New question and corresponding answer choices
        updateStreak();
        generateQuestion();
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

            // Spacebar only submits answer if any one of the answer buttons is focused
            if ($(".focusable").hasClass("focused")) {
                stopQuestionTimer();    // Stop timer for current question

                // Answer choice selected by spacebar is submitted
                $(".focused").addClass("chosenAnswer");
                submitAnswer();

                // New question and corresponding answer choices
                updateStreak();
                generateQuestion();
                generateQuestionTimer();
            }
        }
    });


    // Focus answer choice on mouse hover
    $(document).on("mouseenter", ".focusable", function () {
        $(".focusable").removeClass("focused");
        $(this).addClass("focused");
    });

    // Return to front page when you click the left hand corner title or the home button
    $(document).on("click", "#battleLogo, #homeButton", function () {
        stopQuestionTimer()
        generateFrontPage();
    });

    // Generate the Front Page
    function generateFrontPage(){
       $("#battlePageOuterWrapper").fadeOut(500, function(){
           $("#frontPageOuterWrapper").fadeIn(500);
       });
    }

    // End Game and create end page
    function endGame(){
        $("#battlePageOuterWrapper").fadeOut(500, function(){
            $("#score").html("You made it to Level " + level);
            $("#endPageOuterWrapper").fadeIn(500);
        });
    }

    //when you click the replay button, replay the game
    $(document).on("click", "#replayButton", function () {
        replayGame();
    })

    //rebuild game on difficulty you had previously set
    function replayGame(){
        $("#frontPageOuterWrapper").fadeOut(500, function () {
            playerName = $("#nameInput").val();
            resetHealth();
            updateStreak();
            generateQuestion();
            generateQuestionTimer();
            setName();
            level = 1;
            $("#levelCounter").html("Level 1");
            $("#battlePageOuterWrapper").fadeIn("slow");

        });
    }

    //resets Health for player and monster
    function resetHealth(){
        $("#pHealthBar").val(100);
        $("#eHealthBar").val(40);
        playerHealth = $("#pHealthBar").val();
        monsterHealth = $("#eHealthBar").val();
        $("#pHealthCounter").html("Health: " + playerHealth + "/100")
        $("#eHealthCounter").html("Health: " + monsterHealth + "/40")
    }

    //updates Level
    function updateLevel(){
        level++;
        $("#levelCounter").html("Level " + level);
    }

    }

    // Create Instructions Overlay
    $(document).on("click", "#instructionsButton", function(){
        console.log("Pressed Instructions Button");
       $("#instructionsOuterWrapper").css("display", "flex");
    });

    // Remove Instructions Overlay
    $(document).on("click", "#instructionsReturnButton", function(){
        console.log("Pressed Instructions Button");

        $("#instructionsOuterWrapper").css("display", "none");
    });

});