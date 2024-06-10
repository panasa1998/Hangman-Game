let hangmanBox = document.querySelector(".hangman-box");
let figureParts = document.querySelectorAll(".figure-part");
let wordDisplay = document.querySelector(".word-display");
let KeyboardDiv = document.querySelector(".keyboard");
let guessesText = document.querySelector(".guesses-text b");
let gameModel = document.querySelector(".game-model");
let playAgainBtn = document.querySelector(".play-again");

let currentWord, wrongGuessesCount;
let correctLetters;
let maxGuesses = 6;

// Resetting all the game variables
const resetGame = () => {
  correctLetters = [];
  wrongGuessesCount = 0;
  updateFigureParts();
  guessesText.innerText = `${wrongGuessesCount}/${maxGuesses}`;
  KeyboardDiv.querySelectorAll("button").forEach(
    (btn) => (btn.disabled = false)
  );
  wordDisplay.innerHTML = currentWord
    .split("")
    .map(() => `<li class="letter"></li>`)
    .join("");
  gameModel.classList.remove("show");
};

let getRandomWord = () => {
  //Selecting random word and hint from the wordList
  let { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word;
  console.log(currentWord);
  document.querySelector(".hint-text b").innerText = hint;
  resetGame();
};

const gameOver = (isVictory) => {
  // Displaying the gamemodel box on completeing or reaching maximum guesses
  setTimeout(() => {
    let modelWord = isVictory ? `You found the word:` : `The correct word was:`;
    gameModel.querySelector("img").src = `${
      isVictory ? "success3.png" : "sad.png"
    }`;
    gameModel.querySelector("h4").innerText = `${
      isVictory ? "Congrats !" : "Game Over"
    }`;
    gameModel.querySelector(
      "p"
    ).innerHTML = `${modelWord} <b>${currentWord}</b>`;
    gameModel.classList.add("show");
  }, 500);
};

let startGame = (button, clickedLetter) => {
  //checking wheather clicked letter is present in word or not
  if (currentWord.includes(clickedLetter)) {
    [...currentWord].forEach((letter, index) => {
      // showing correct letters on the word dislplay
      if (letter === clickedLetter) {
        correctLetters.push(letter);
        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
      }
    });
    updateFigureParts();
  } else {
    wrongGuessesCount++;
    updateFigureParts();
  }

  button.disabled = true;
  guessesText.innerText = `${wrongGuessesCount}/${maxGuesses}`;
};

//Updating figureParts on clicking wrong letter
function updateFigureParts() {
  figureParts.forEach((part, index) => {
    if (index < wrongGuessesCount) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // Calling the gameOver function if any of the condition meets
  if (wrongGuessesCount === maxGuesses) {
    return gameOver(false);
  }
  if (correctLetters.length === currentWord.length) {
    return gameOver(true);
  }
}

//Creating keyboard buttons
for (let i = 97; i <= 122; i++) {
  let button = document.createElement("button");
  button.innerHTML = String.fromCharCode(i);
  KeyboardDiv.appendChild(button);
  button.addEventListener("click", (x) =>
    startGame(x.target, String.fromCharCode(i))
  );
}

// Adding event listener for physical keyboard input
document.addEventListener("keydown", (event) => {
  let key = event.key.toLowerCase();
  if (key >= "a" && key <= "z") {
    let button = [...KeyboardDiv.querySelectorAll("button")].find(
      (btn) => btn.innerHTML === key
    );
    if (button && !button.disabled) {
      startGame(button, key);
    }
  }
});

getRandomWord();

// adding event listener when the user clicks the playagain button
playAgainBtn.addEventListener("click", getRandomWord);
