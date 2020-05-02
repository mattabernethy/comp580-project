$(document).ready(function () {
    let timer;  // Global question timer variable
    let difficulty;
    let streak = 0;
    let correctAns;
    let playerAttack = 10;
    let playerName = "Player";
    let playerHealth;
    let monsterHealth;
    let maxMonsterHealth = 40;
    let level;
    let questionType = 0;
    let currentEquation = "";
    let currentPage = "homePage";   // homePage, instructionsPage, battlePage, gameOverPage

    // Initializes focusable buttons on main menu
    $("#midSection").children(":not(#nameInputWrapper)").addClass("focusable");

    // Initialize sounds
    let buttonSwitchSound = new Audio("./assets/switch-button.mp3");
    buttonSwitchSound.playbackRate = 2.0;

    let buttonSelectSound = new Audio("./assets/select-button.mp3");

    // Initialize text-to-speech below
    voices = [
        {
            "name": "Alex",
            "lang": "en-US"
        },
        {
            "name": "Daniel",
            "lang": "en-GB"
        },
        {
            "name": "Fiona",
            "lang": "en"
        },
        {
            "name": "Fred",
            "lang": "en-US"
        },
        {
            "name": "Karen",
            "lang": "en-AU"
        },
        {
            "name": "Moira",
            "lang": "en-IE"
        },
        {
            "name": "Samantha",
            "lang": "en-US"
        },
        {
            "name": "Tessa",
            "lang": "en-ZA"
        },
        {
            "name": "Veena",
            "lang": "en-IN"
        },
        {
            "name": "Victoria",
            "lang": "en-US"
        }
    ];

    const voice1 = voices[1];
    const voice2 = voices[0];

    let narrator1 = new SpeechSynthesisUtterance();
    narrator1.volume = 1; // 0 to 1
    narrator1.rate = 1; // 0.1 to 10
    narrator1.pitch = 1; // 0 to 2      
    narrator1.voiceURI = voice1.name;
    narrator1.lang = voice1.lang;

    let narrator2 = new SpeechSynthesisUtterance();
    narrator2.volume = 1; // 0 to 1
    narrator2.rate = 1; // 0.1 to 10
    narrator2.pitch = 1; // 0 to 2      
    narrator2.voiceURI = voice2.name;
    narrator2.lang = voice2.lang;

    // Narrates the button currently focused
    function narrateFocusButton() {
        narrator1.text = $(".focused").text();

        // If narrateFocusButton is triggered while the narrator is still speaking, it cancels current utterance and all queued utterances
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        speechSynthesis.speak(narrator1);
    }

    // Narrates relevant information on current page
    function narrateCurrentPage() {
        console.log(currentPage);

        if (currentPage == "homePage") {
            narrator1.text = "Choose your difficulty"
        } else if (currentPage == "instructionsPage") {
            narrator1.text = $("#instructionHeaderWrapper").text() + " " + $("#instructionsContent").text();
        } else if (currentPage == "battlePage") {
            narrator1.text = currentEquation;
        } else {    // gameOverPage
            narrator1.text = "You Lost! You made it to level " + level;
        }

        // Immediately cancels any current or queued speech, then talks
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        speechSynthesis.speak(narrator1);
    }

    // Sets default Player Name to be "Player"
    setName();

    function monsterTakesDamage() {
        if (monsterHealth > 0) {
            streak += 1;

            if (streak >= 4) {
                playerAttack = 20;
            } else {
                playerAttack = 10;
            }

            monsterHealth -= playerAttack;

            if (monsterHealth <= 0) {
                //gets random type of monster
                let temp = Math.floor(Math.random() * 4);

                //look until you find a different monster
                while (temp === questionType) {
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
        if (playerHealth > 0) {
            streak = 0;
            playerHealth -= 10;

            // If the player's health is zero, then end the game
            if (playerHealth <= 0) {
                endGame();
            }

            $("#pHealthBar").val(playerHealth);
            $("#pHealthCounter").html("Health: " + playerHealth + "/100")
            console.log("You take damage. Your health is now " + playerHealth);
        }
    };

    function generateQuestion() {

        if (questionType === 0) {
            generateAddQuestion();
        } else if (questionType === 1) {
            generateSubQuestion();
        } else if (questionType === 2) {
            generateMultQuestion();
        } else {  // questionType == 3
            generateDivQuestion();
        }

        generateAnswerChoices();
    }

    // Input (nothing yet, maybe difficulty later?), Output (void: generates random addition question on screen)
    function generateAddQuestion() {
        const leftNum = Math.floor(Math.random() * 10) + 1;
        const rightNum = Math.floor(Math.random() * 10) + 1;
        const equation = leftNum + " + " + rightNum;
        currentEquation = "What is " + leftNum + " plus " + rightNum + "?";
        $("#question").find("p").text(equation);
        let name = "Addition Apparition";
        let imageURL = "assets/additionApparition.svg"
        generateMonster(name, imageURL);
    };

    function generateMonster(name, imageURL) {
        $("#eName").html(name);
        $("#ePic").attr("src", imageURL);
        $("#eHealthBar").attr("max", maxMonsterHealth);

    }

    function generateSubQuestion() {
        let leftNum = Math.floor(Math.random() * 10) + 1;
        let rightNum = Math.floor(Math.random() * 10) + 1;

        // Makes sure the answer is non-negative
        while (leftNum < rightNum) {
            // leftNum = rightNum + (Math.floor(Math.random() * (10 - rightNum)) + 1);
            leftNum = Math.floor(Math.random() * 10) + 1;
        }

        const equation = leftNum + " - " + rightNum;
        currentEquation = "What is " + leftNum + " minus " + rightNum + "?";
        $("#question").find("p").text(equation);

        let name = "SubtractionSerpent";
        let imageURL = "assets/subtractionSerpent.svg"
        generateMonster(name, imageURL);
    }

    function generateMultQuestion() {
        const leftNum = Math.floor(Math.random() * 10) + 1;
        const rightNum = Math.floor(Math.random() * 10) + 1;
        const equation = leftNum + " * " + rightNum;
        currentEquation = "What is " + leftNum + " times " + rightNum + "?";
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
        }

        const equation = leftNum + " / " + rightNum;
        currentEquation = "What is " + leftNum + " over " + rightNum + "?";
        $("#question").find("p").text(equation);

        let name = "Division Demon";
        let imageURL = "assets/divisionDemon.svg"
        generateMonster(name, imageURL);
    }

    // Input (nothing), Output (void: generates 1 correct answer and 2 random incorrect answers on screen)
    function generateAnswerChoices() {
        // Calculates correct answer of current question
        correctAns = eval($("#question").find("p").text());

        // Trigger narration of question
        narrateCurrentPage();

        // Returns random integer 0, 1, or 2 to decide correctAns location
        const correctAnsId = Math.floor(Math.random() * 3);

        // Generate incorrect answers
        let positiveOrNeg1 = Math.round(Math.random()) * 2 - 1;   // Returns either -1 or 1
        let positiveOrNeg2 = Math.round(Math.random()) * 2 - 1;

        let incorrectChoice1 = correctAns + (positiveOrNeg1 * (Math.floor(Math.random() * 5) + 1));

        // Makes sure it is not a negative answer choice
        while (incorrectChoice1 < 0) {
            console.log("loop1");
            positiveOrNeg1 = Math.round(Math.random()) * 2 - 1;
            incorrectChoice1 = correctAns + (positiveOrNeg1 * (Math.floor(Math.random() * 5) + 1));
        }

        let incorrectChoice2 = correctAns + (positiveOrNeg2 * (Math.floor(Math.random() * 5) + 1));
        console.log(incorrectChoice1 + " " + incorrectChoice2);

        // Makes sure it is not a duplicate incorrect choice, and not a negative answer choice
        while ((incorrectChoice2 == incorrectChoice1) || (incorrectChoice2 < 0)) {
            console.log("loop2");
            positiveOrNeg2 = Math.round(Math.random()) * 2 - 1;
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

        console.log("Generated answer choices");
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

                // New question and corresponding answer choices (only if still on battle page)
                if (currentPage == "battlePage") {
                    updateStreak();
                    generateQuestion();
                    generateQuestionTimer();
                }
            }
        }, 1000)

        console.log("New timer");
    };

    // Stops the current timer
    function stopQuestionTimer() {
        clearInterval(timer);
        console.log("Timer Stopped");
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
        console.log("Updated streak");
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
        difficulty = $(this).find("p").text();
        console.log(difficulty);

        currentPage = "battlePage";

        $("#frontPageOuterWrapper").fadeOut(500, function () {
            playerName = $("#nameInput").val();
            updateStreak();
            generateQuestion();
            generateQuestionTimer();
            setName();
            resetHealth();
            level = 1;
            $("#battlePageOuterWrapper").fadeIn("slow");

            // Removes difficulty buttons from being focusable after battlepage loaded, adds focusable into answer choices
            $(".focusable").removeClass("focusable focused");
            $(".answerButton").addClass("focusable");
        });
    });

    // Sets Player name to be what it was entered as on Home Page
    function setName() {
        if (playerName === "") {
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
        console.log("Submitted answer");

        // New question and corresponding answer choices (only if still on battle page)
        if (currentPage == "battlePage") {
            updateStreak();
            generateQuestion();
            generateQuestionTimer();
        }
    });

    // Interact with game with keyboard
    $(document).keydown(function (e) {
        // Sift through answer choices with left arrow key
        if (e.keyCode == 37) {
            if (!$(".focusable").hasClass("focused")) {
                // If no answer choice is currently selected, select rightmost choice
                $(".focusable").last().addClass("focused");
            } else if ($(".focused").prevAll(".focusable").length) {
                // If answer choice to left of current choice exists, select left choice
                $(".focused").removeClass("focused").prevAll(".focusable:first").addClass("focused");
            } else {
                // Else select rightmost answer choice (there is no other choice to left of current choice)
                $(".focused").removeClass("focused").siblings(".focusable").last().addClass("focused");
            }

            // Triggers narration event
            narrateFocusButton();
            // Switch button sound (makes a nicer sound when cloned)
            buttonSwitchSound.cloneNode().play();
        }

        // Sift through answer choices with right arrow key
        if (e.keyCode == 39) {
            if (!$(".focusable").hasClass("focused")) {
                // If no answer choice is currently selected, select leftmost choice
                $(".focusable").first().addClass("focused");
            } else if ($(".focused").nextAll(".focusable").length) {
                // If answer choice to right of current choice exists, select right choice
                $(".focused").removeClass("focused").nextAll(".focusable:first").addClass("focused");
            } else {
                // Else select leftmost answer choice (there is no other choice to right of current choice)
                $(".focused").removeClass("focused").siblings(".focusable").first().addClass("focused");
            }

            // Triggers narration event
            narrateFocusButton();
            // Switch button sound (makes a nicer sound when cloned)
            buttonSwitchSound.cloneNode().play();
        }

        // Down arrow key causes narrator to repeat text of currently focused button
        if (e.keyCode == 40) {
            narrateFocusButton();
        }

        // Up arrow causes narrator to repeat relevant information on current page
        if (e.keyCode == 38) {
            narrateCurrentPage();
        }

        // Submit answer choice (or currently focused button) currently selected with spacebar
        if (e.keyCode == 32) {
            // Select button sound (only triggers if something is currently focused)
            if ($(".focused").length) {
                buttonSelectSound.play();
            }

            // Spacebar simulates a click event on focused item
            $(".focused").click();
        }

        // Press Esc button to go back to main menu (only if main menu is not displayed)
        if (e.keyCode == 27 && $("#frontPageOuterWrapper").is(":hidden")) {
            $("#homeButton").click();
        }
    });


    // Focus button on mouse hover
    $(document).on("mouseenter", ".focusable", function () {
        $(".focusable").removeClass("focused");
        $(this).addClass("focused");

        // Triggers narration event
        narrateFocusButton();
    });

    // Return to front page when you click the left hand corner title or the home button
    $(document).on("click", "#battleLogo, #homeButton", function () {
        stopQuestionTimer()
        generateFrontPage();
    });

    // Generate the Front Page
    function generateFrontPage() {
        currentPage = "homePage";

        $("#battlePageOuterWrapper").fadeOut(500, function () {
            $("#frontPageOuterWrapper").fadeIn(500);
        });

        // Removes answer choices from being focusable after loading back into main menu, adds focusable back into difficulty buttons
        $(".focusable").removeClass("focusable focused");
        $("#midSection").children(":not(#nameInputWrapper)").addClass("focusable");

        // Narrates "Returned to main menu" upon pressing Esc
        narrator1.text = "Returned to main menu";
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        speechSynthesis.speak(narrator1);
    }

    // End Game and create end page
    function endGame() {
        stopQuestionTimer();
        currentPage = "gameOverPage";

        $("#battlePageOuterWrapper").fadeOut(500, function () {
            $("#score").html("You made it to Level " + level);
            $("#endPageOuterWrapper").fadeIn(500);
        });

        // Removes answer choices from being focusable after losing game, adds focusable into replay and home buttons
        $(".focusable").removeClass("focusable focused");
        $(".endButton").addClass("focusable");

        narrateCurrentPage();

        console.log("Endgame reached");
    }

    //when you click the replay button, replay the game
    $(document).on("click", "#replayButton", function () {
        replayGame();
    })

    //rebuild game on difficulty you had previously set
    function replayGame() {
        $("#frontPageOuterWrapper").fadeOut(500, function () {
            currentPage = "battlePage";

            playerName = $("#nameInput").val();
            resetHealth();
            updateStreak();
            generateQuestion();
            generateQuestionTimer();
            setName();
            level = 1;
            maxMonsterHealth = 40;

            $("#levelCounter").html("Level 1");
            $("#battlePageOuterWrapper").fadeIn("slow");

            // Adds focusable into answer buttons and removes focusable elsewhere
            $(".focusable").removeClass("focusable focused");
            $(".answerButton").addClass("focusable");
        });
    }

    //resets Health for player and monster
    function resetHealth() {
        $("#pHealthBar").val(100);
        $("#eHealthBar").val(40);
        playerHealth = $("#pHealthBar").val();
        monsterHealth = $("#eHealthBar").val();
        $("#pHealthCounter").html("Health: " + playerHealth + "/100")
        $("#eHealthCounter").html("Health: " + monsterHealth + "/40")
    }

    //updates Level
    function updateLevel() {
        level++;
        $("#levelCounter").html("Level " + level);
    }

    // Create Instructions Overlay
    $(document).on("click", "#instructionsButton", function () {
        currentPage = "instructionsPage";

        $("#instructionsOuterWrapper").css("display", "flex");

        // Instantly adds focused status to instructions page back button, removes focusable elsewhere
        $(".focusable").removeClass("focusable focused");
        $("#instructionsReturnButton").addClass("focusable");

        narrateCurrentPage();
    });

    // Remove Instructions Overlay
    $(document).on("click", "#instructionsReturnButton", function () {
        currentPage = "homePage";

        $("#instructionsOuterWrapper").css("display", "none");

        // Adds focusable back to main menu buttons, removes focusable elsewhere
        $(".focusable").removeClass("focusable focused");
        $("#midSection").children(":not(#nameInputWrapper)").addClass("focusable");
        $("#instructionsButton").addClass("focused");
    });

});

