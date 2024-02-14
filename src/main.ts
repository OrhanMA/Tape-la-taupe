"use strict";

const moles = document.querySelectorAll(
  ".mole"
) as NodeListOf<HTMLImageElement>;
const hills = document.querySelectorAll(".hill") as NodeListOf<HTMLDivElement>;
const scoreDisplay: HTMLParagraphElement | null =
  document.querySelector(".score");
const scoreEndGame = document.querySelector(
  ".score-display"
) as HTMLParagraphElement;
const startButton: HTMLButtonElement | null =
  document.querySelector("#startButton");
const reloadButton: HTMLButtonElement | null =
  document.querySelector("#reloadButton");
const welcome: HTMLDivElement | null = document.querySelector(".welcome");
const endgameContainer = document.querySelector(".endgame") as HTMLDivElement;
const gameContainer = document.querySelector(
  ".game-container"
) as HTMLDivElement;
const durationSelect: HTMLSelectElement | null =
  document.querySelector("#duration");
const difficultySelect: HTMLSelectElement | null =
  document.querySelector("#difficulty");
const nameInput: HTMLInputElement | null = document.querySelector("#name");

let minTime: number = 1000;
let maxTime: number = 2000;
let timeUp: boolean = false;
let lastSelectedHill: HTMLDivElement;
let score: number = 0;
let gameDuration: number = 10000;
let playerName: string;
let difficulty: string;
let lastMolePoints: number = 0;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlPlayerName = urlParams.get("player");
  if (urlPlayerName !== null && nameInput) {
    nameInput.value = urlPlayerName;
  }
  startButton?.addEventListener("click", () => {
    if (durationSelect?.value && difficultySelect?.value) {
      difficulty = difficultySelect.value;
      setGameDifficulty(difficultySelect.value);
      setGameDuration(durationSelect.value);
    }
    if (nameInput?.value) {
      playerName = nameInput.value;
      if (endgameContainer) {
        endgameContainer.style.display = "none";
      }
      if (welcome) {
        welcome.style.display = "none";
      }
      gameContainer.style.display = "block";
      startGame();
    } else {
      alert("Veuillez entrer un nom de joueur");
      window.location.reload();
    }
  });

  reloadButton?.addEventListener("click", () => {
    if (playerName) {
      window.location.href = `/?player=${playerName}`;
    } else {
      window.location.reload();
    }
  });

  moles.forEach((mole) => {
    mole.addEventListener("click", (e: MouseEvent) => {
      hitMole(e, mole);
    });
  });
});

function checkWinnablePoints(mole: HTMLImageElement) {
  if (mole.classList.contains("points-1")) return 1;
  else if (mole.classList.contains("points-2")) return 2;
  else if (mole.classList.contains("points-3")) return 3;
  else return 0;
}

function hitMole(e: MouseEvent, mole: HTMLImageElement): void {
  if (!e.isTrusted) return;
  score += checkWinnablePoints(mole);
  if (scoreDisplay) {
    scoreDisplay.textContent = `${score}`;
  }
  mole.classList.remove("up");
}

function getRandomHill(): HTMLDivElement {
  const index: number = Math.floor(Math.random() * hills.length);
  const hill: HTMLDivElement = hills[index];
  // pour que la taupe m'apparaisse pas deux fois d'affile dans le meme trou
  if (hill === lastSelectedHill) {
    return getRandomHill();
  }
  lastSelectedHill = hill;
  return hill;
}

function startGame(): void {
  score = 0;
  timeUp = false;
  if (scoreDisplay) {
    scoreDisplay.textContent = "0";
  }
  moleUp();
  setTimeout(() => {
    timeUp = true;
    gameContainer.style.display = "none";
    endgameContainer.style.display = "block";
    scoreEndGame.textContent = score.toString();
    saveGameData();
    displayLeaderboardData();
  }, gameDuration);
}

function moleUp(): void {
  const time = getRandomTime(minTime, maxTime);
  const hill: HTMLDivElement = getRandomHill();
  const mole: HTMLImageElement | null = hill.querySelector(".mole");

  let moleClass: string;

  const range = maxTime - minTime;
  const rangeFor3Points = range * 0.2 + minTime;
  const rangeFor2Points = range * 0.5 + minTime;

  if (mole) {
    if (time <= rangeFor3Points) {
      moleClass = "points-3";
      mole.style.filter = "brightness(1.2)";
    } else if (time > rangeFor3Points && time <= rangeFor2Points) {
      moleClass = "points-2";
      mole.style.filter = "brightness(1.5)";
    } else {
      moleClass = "points-1";
      mole.style.filter = "brightness(1)";
    }

    mole?.classList.add("up");
    mole?.classList.add(moleClass);
  }

  setTimeout(() => {
    if (mole) {
      mole.classList.remove("up");
      mole.classList.remove(moleClass);
      mole.style.filter = "brightness(1)";
    }
    if (!timeUp) {
      moleUp();
    }
  }, time);
}

function getRandomTime(min: number = 1000, max: number = 2000): number {
  return Math.round(Math.random() * (max - min) + min);
}

function setGameDifficulty(difficulty: string) {
  switch (difficulty) {
    case "facile":
      minTime = 1000;
      maxTime = 2000;
      break;
    case "normal":
      minTime = 500;
      maxTime = 1500;
      break;
    case "difficile":
      minTime = 200;
      maxTime = 1000;
      break;
    case "impossible":
      minTime = 150;
      maxTime = 500;
      break;
    default:
      minTime = 1000;
      maxTime = 2000;
      break;
  }
}

function setGameDuration(durationString: string) {
  switch (durationString) {
    case "10":
      gameDuration = 10000;
      break;
    case "20":
      gameDuration = 20000;
      break;
    case "30":
      gameDuration = 30000;
      break;
    default:
      gameDuration = 10000;
      break;
  }
}

function saveGameData(): void {
  if (
    playerName &&
    difficulty &&
    (gameDuration === 10000 || gameDuration === 20000 || gameDuration === 30000)
  ) {
    // objet avec les données de la partie jouée
    const gameData = {
      playerName,
      score,
      gameDuration: durationSelect?.value,
      difficulty,
    };
    // vérifie si il y a des parties enregistrées dans le localstorage sinon crée un objet vide
    const savedGames = JSON.parse(localStorage.getItem("savedGames") || "{}");
    // crée une clé correspondant à la catégorie de la partie jouée par exemple 10000-facile
    const key = `${gameData.gameDuration}-${gameData.difficulty}`;

    // si il n'y a pas des parties sauvegardées pour ce type de parties, crée un tableau vide avec la clé
    if (!savedGames[key]) {
      savedGames[key] = [];
    }

    // ajoute la partie dans le tableau correspondant et save dans le localstorage
    savedGames[key].push(gameData);
    localStorage.setItem("savedGames", JSON.stringify(savedGames));
  }
}

function displayLeaderboardData(): void {
  const difficultyDisplay =
    difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1);
  // met le mode de jeu avec la première lettre en majuscule
  const leaderboardContainer = document.querySelector(
    ".endgame-leaderboard ul"
  );
  if (leaderboardContainer) {
    leaderboardContainer.innerHTML = "";
  }

  // récupère les parties enregistrées avec la durée et difficulté correspondante
  const savedGames = JSON.parse(localStorage.getItem("savedGames") || "{}");
  const key = `${durationSelect?.value}-${difficultySelect?.value}`;

  if (savedGames[key]) {
    // tri des parties par nombre de points
    savedGames[key].sort((a: any, b: any) => b.score - a.score);
    savedGames[key].forEach(
      (
        game: {
          playerName: string;
          score: number;
          difficulty: string;
          gameDuration: string;
        },
        index: number
      ) => {
        const listItem = document.createElement("li");
        // la durée est en string puisque c'était dans le localstorage, parseInt transforme la string en integer
        const gameDurationSeconds = parseInt(game.gameDuration);
        listItem.innerHTML = `
        <p>${index + 1 + "."}</p>
        <p>${game.playerName}</p>
        <p>${game.score} points </p>
        <p>${difficultyDisplay}</p>
        <p>${gameDurationSeconds} s</p>
      `;
        leaderboardContainer?.appendChild(listItem);
      }
    );
  }
}
