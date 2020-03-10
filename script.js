$(document).ready(function () {
    $(".difficultyButton").click(function (event) {
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

                    $("#battlePageWrapper").fadeIn(250);
                })
            }
        })


    })




});