  Matt Abernethy
  Michael Qi
  COMP 580

  Final Report 

  Math Cruncher 2000 is a math-based fighting game. The goal of this game is to train proficiency in basic math skills (addition, 
  subtraction, division, multiplication) for all children, but in an exciting gamified way. The player will fight through monsters 
  with each monster corresponding to a type out of 4 types (types are addition, subtraction, division, or multiplication). The goal 
  is to drain the opponent’s health bar with your attacks, except in this game, attacks from the player’s avatar are delivered through 
  correctly answering math questions (e.g. “What is 3*4?”) within a time limit. The time limit is determined by the difficulty level 
  the player selects on the main menu. If the player responds correctly within the time limit, then the player’s avatar delivers a 
  successful attack on the monster. If the player responds incorrectly or exceeds the time limit, then the monster successfully delivers 
  an attack on the player. Combo streaks are implemented for extra damage against the monster when the player gets a streak of at least 
  4 correct answers in a row. When the player defeats the monster in one level, they move on to the monster in the next level, with 
  each world being a randomly generated monster (from a set of 4 monsters each corresponding to either addition, subtraction, 
  multiplication, or division). However, with every level, the monster’s maximum health will increase. The game continues until the 
  player runs out of health, in which their score will be displayed on-screen.

  However, the unique twist with this project is that it is accessible for individuals with visual impairment. Although there is a 
  user-interface showing the action on-screen, what is happening on-screen can also be delivered intuitively through narration and 
  auditory cues. The player can then respond to in-game math questions with the keyboard by selecting from three answer choices for 
  each question. Upon cycling each answer choice or button (using left and right arrow keys), text-to-speech narration will narrate 
  out loud the value of the current button selected. The player can then press the spacebar to confirm their response. Additionally, 
  down arrow key repeats the narration of the value of the current button selected, and up arrow repeats the narration of relevant 
  information on each screen (i.e. repeat question on battle screen). The Escape button can be used anytime to quit and exit back 
  to the main menu. This narrated, button-based process allows players with visual impairment to easily navigate the game with sound 
  and keyboard alone. Therefore, our general audience with this game is for all children, but especially for individuals with visual 
  impairment.

  We used HTML, CSS, and JavaScript (with extensive use of the jQuery library) to build Math Cruncher 2000. For text-to-speech 
  narration, we used JavaScript’s speech synthesis API. We also used mp3 sound effects downloaded from the Internet for some of 
  our auditory cues (ex. “Ding” to signal correct answer, “Beep” to signal wrong answer, “Ticking Clock” to signal 10 seconds 
  remaining, etc.). Deploying and playing the game is very simple: simply click the URL hosted by GitHub Pages in our GitHub 
  Readme file and enjoy! Google Chrome is the best, most compatible browser to play the game in its current state. 

  One of the problems we encountered during development was the classic infinite loop problem. It took a very long time to debug 
  this problem because there were several while loops in our code, not to mention that our jQuery code became hard to keep track 
  after enough lines of code had been written (which is a criticism of jQuery vs. using a framework like Angular). Another problem 
  is that the game is only most compatible with Google Chrome (as mentioned above). Browsers like Firefox or Internet Explorer may 
  display information on-screen at the wrong time and/or the speech synthesizer won’t work.

  Future work on this project includes making the game compatible with other browsers as well. In the game’s current state, “dings” 
  and “beeps” indicate whether the player takes damage or the opponent takes damage respectively. This design is functional, but 
  is kind of boring in the context of a fighting game, so adding more “fighting” sound effects and custom voiceover would greatly 
  improve the fun factor of the game. Furthermore, we can work on bringing a more fleshed-out narration system where after the player 
  answers a question, the game would pause, and the speech synthesizer will narrate the player's remaining health, monster’s name 
  and remaining health, and combo streak before resuming the game with the next question. This was our original goal, but due to 
  limits of the JavaScript speech synthesizer as well as time constraints, we couldn’t bring it into fruition yet. Though that goal 
  is definitely within reach in the future!
