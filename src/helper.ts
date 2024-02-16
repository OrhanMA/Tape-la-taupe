import { SoundType } from "./types";
import * as elements from "./elements";

export function setGameDifficulty(difficulty: string): {
  minTime: number;
  maxTime: number;
} {
  switch (difficulty) {
    case "facile":
      return {
        minTime: 1000,
        maxTime: 2000,
      };
    case "normal":
      return {
        minTime: 750,
        maxTime: 1500,
      };
    case "difficile":
      return {
        minTime: 500,
        maxTime: 1250,
      };
    case "impossible":
      return {
        minTime: 250,
        maxTime: 1000,
      };
    default:
      return {
        minTime: 1000,
        maxTime: 2000,
      };
  }
}

export function setGameDuration(durationString: string): number {
  switch (durationString) {
    case "10":
      return 10000;
    case "20":
      return 20000;
    case "30":
      return 30000;
    default:
      return 10000;
  }
}

// Dirige vers le bon audio selon l'état de la partie
export function checkGameStageAudio(stage: number): SoundType {
  switch (stage) {
    case 1:
      return SoundType.Intro;
    case 2:
      return SoundType.Game;
    case 3:
      return SoundType.End;
    default:
      return SoundType.Intro;
  }
}

// Gère l'état de l'audio joué et change l'affichage des boutons de contrôle du son
export function controlSound(soundType: SoundType | undefined): void {
  elements.introSound.pause();
  elements.gameSound.pause();
  elements.endSound.pause();

  elements.allowSoundButton.style.display = "none";
  elements.blockSoundButton.style.display = "block";

  switch (soundType) {
    case SoundType.Intro:
      elements.introSound.play();
      elements.allowSoundButton.style.display = "none";
      elements.blockSoundButton.style.display = "block";
      break;
    case SoundType.Game:
      elements.gameSound.play();
      elements.allowSoundButton.style.display = "block";
      break;
    case SoundType.End:
      elements.endSound.play();
      elements.allowSoundButton.style.display = "block";
      break;
  }
}

export function checkWinnablePoints(mole: HTMLImageElement): number {
  if (mole.classList.contains("points-1")) return 1;
  else if (mole.classList.contains("points-2")) return 2;
  else if (mole.classList.contains("points-3")) return 3;
  else return 0;
}

export function getRandomTime(min: number = 1000, max: number = 2000): number {
  return Math.round(Math.random() * (max - min) + min);
}

// la fonction est recursive tant que la hill selectionnée est la même que la précédente (passée en paramètre)
export function getRandomDifferentHill(
  lastSelectedHill: HTMLDivElement
): HTMLDivElement {
  const index: number = Math.floor(Math.random() * elements.hills.length);
  const hill: HTMLDivElement = elements.hills[index];
  // pour que la taupe m'apparaisse pas deux fois d'affile dans le meme trou
  if (hill === lastSelectedHill) {
    return getRandomDifferentHill(lastSelectedHill);
  }
  return hill;
}

export function moleUp(
  timeUp: boolean,
  minTime: number,
  maxTime: number,
  lastSelectedHill: HTMLDivElement
): HTMLDivElement {
  const time = getRandomTime(minTime, maxTime);
  const hill: HTMLDivElement = getRandomDifferentHill(lastSelectedHill);
  // lastSelectedHill = hill;
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
      moleUp(timeUp, minTime, maxTime, hill);
    }
  }, time);

  return hill;
}

export function updateTimeDisplay(
  secondsLeft: number,
  gameDuration: number
): void {
  elements.timeDisplay.textContent = secondsLeft.toString();
  if (secondsLeft <= gameDuration / 3000) {
    elements.timeDisplay.style.color = "red";
  } else if (
    secondsLeft >= gameDuration / 3000 &&
    secondsLeft <= (gameDuration / 1000) * 0.67
  ) {
    elements.timeDisplay.style.color = "orange";
  } else {
    elements.timeDisplay.style.color = "lightgreen";
  }
}

export function startGame(
  timeUp: boolean,
  minTime: number,
  maxTime: number,
  lastSelectedHill: HTMLDivElement
): void {
  if (elements.scoreDisplay) {
    elements.scoreDisplay.textContent = "0";
  }
  moleUp(timeUp, minTime, maxTime, lastSelectedHill);
}

export function saveGameData(
  playerName: string,
  difficulty: string,
  gameDuration: number,
  score: number
): void {
  if (
    playerName &&
    difficulty &&
    (gameDuration === 10000 || gameDuration === 20000 || gameDuration === 30000)
  ) {
    // objet avec les données de la partie jouée
    const gameData = {
      playerName,
      score,
      gameDuration: elements.durationSelect?.value,
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

export function displayLeaderboardData(difficulty: string): void {
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
  const key = `${elements.durationSelect?.value}-${elements.difficultySelect?.value}`;
  // la durée est en string puisque c'était dans le localstorage, parseInt transforme la string en integer

  const gameDurationSeconds = parseInt(savedGames[key][0].gameDuration);
  const modeDisplay = document.querySelector(
    ".end-game-difficulty"
  ) as HTMLSpanElement;

  modeDisplay.innerHTML = difficultyDisplay + " - " + gameDurationSeconds;

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
        listItem.innerHTML = `
        <p>${index + 1 + "."}</p>
        <p>${game.playerName}</p>
        <p>${game.score} points </p>
      `;
        leaderboardContainer?.appendChild(listItem);
      }
    );
  }
}

export function endGame(
  score: number,
  playerName: string,
  difficulty: string,
  gameDuration: number
): void {
  elements.gameContainer.style.display = "none";
  elements.endgameContainer.style.display = "block";
  elements.scoreEndGame.textContent = score.toString();
  saveGameData(playerName, difficulty, gameDuration, score);
  displayLeaderboardData(difficulty);
}

export function hitMole(
  e: MouseEvent,
  mole: HTMLImageElement,
  score: number
): number {
  if (!e.isTrusted) return score;
  const newScore = score + checkWinnablePoints(mole);
  mole.classList.remove("up");
  return newScore;
}

export function checkForUsername() {
  // récupère le nom du joueur dans les paramètre d'url si il y en a un pour pré-remplir le champ automatiquement
  const urlParams = new URLSearchParams(window.location.search);
  const urlPlayerName = urlParams.get("player");
  if (urlPlayerName !== null && elements.nameInput) {
    elements.nameInput.value = urlPlayerName;
  }
}

export function getGameSettings():
  | {
      difficulty: string;
      minTime: number;
      maxTime: number;
      gameDuration: number;
      playerName: string;
    }
  | undefined {
  if (
    elements.durationSelect?.value &&
    elements.difficultySelect?.value &&
    elements.nameInput?.value
  ) {
    return {
      difficulty: elements.difficultySelect.value,
      minTime: setGameDifficulty(elements.difficultySelect.value).minTime,
      maxTime: setGameDifficulty(elements.difficultySelect.value).maxTime,
      gameDuration: setGameDuration(elements.durationSelect.value),
      playerName: elements.nameInput.value,
    };
  } else {
    alert("Veuillez entrer un nom de joueur");
    window.location.reload();
    return;
  }
}

export function displayGameScreen() {
  if (elements.endgameContainer) {
    elements.endgameContainer.style.display = "none";
  }
  if (elements.welcome) {
    elements.welcome.style.display = "none";
  }
  elements.gameContainer.style.display = "block";
}
