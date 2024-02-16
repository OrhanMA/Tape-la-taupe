"use strict";
import * as elements from "./elements.ts";
import {
  getGameSettings,
  checkGameStageAudio,
  controlSound,
  hitMole,
  updateTimeDisplay,
  startGame,
  endGame,
  checkForUsername,
  displayGameScreen,
} from "./helper.ts";

let minTime: number = 1000;
let maxTime: number = 2000;
let timeUp: boolean = false;
let lastSelectedHill: HTMLDivElement;
let score: number = 0;
let gameDuration: number = 10000;
let playerName: string;
let difficulty: string;

// Les navigateurs bloquent par défaut l'audio et il faut donc donner aux utilisateurs un bouton pour autoriser/bloquer l'audio.
// Cette variable va garder état de l'audio dans l'app
let audioPaused: boolean = true;

// Garde l'état de la partie (début, partie en cours, fin de partie)
let gameStage: 1 | 2 | 3 = 1;

document.addEventListener("DOMContentLoaded", () => {
  checkForUsername();

  elements.startButton?.addEventListener("click", () => {
    start();
  });

  // Les deux boutons pour autoriser/bloquer l'audio
  elements.allowSoundButton.addEventListener("click", () => {
    if (audioPaused === true) {
      controlSound(checkGameStageAudio(gameStage));
      audioPaused = false;
    }
  });

  elements.blockSoundButton.addEventListener("click", () => {
    if (audioPaused === false) {
      elements.introSound.pause();
      elements.gameSound.pause();
      elements.endSound.pause();
      elements.allowSoundButton.style.display = "block";
      elements.blockSoundButton.style.display = "none";
      audioPaused = true;
    }
  });

  // Bouton pour rejouer
  // Envoi en paramètre d'url le nom du joueur pour un pré-remplissage du champ
  elements.reloadButton?.addEventListener("click", () => {
    if (playerName) {
      window.location.href = `/?player=${playerName}`;
    } else {
      window.location.reload();
    }
  });

  elements.moles.forEach((mole) => {
    mole.addEventListener("click", (e: MouseEvent) => {
      score = hitMole(e, mole, score);
      if (elements.scoreDisplay) {
        elements.scoreDisplay.textContent = score.toString();
      }
    });
  });
});

function startGameTimer() {
  let startTime = Date.now();
  const chrono = setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    let timeLeft = gameDuration - elapsedTime;
    if (timeLeft < 0) {
      clearInterval(chrono);
      timeUp = true;
      endGame(score, playerName, difficulty, gameDuration);
      gameStage = 3;
      controlSound(checkGameStageAudio(gameStage));
      audioPaused = false;
    } else {
      updateTimeDisplay(Math.round(timeLeft / 1000), gameDuration);
    }
  }, 1000);
}

function start() {
  const settings = getGameSettings();
  if (settings !== undefined) {
    difficulty = settings?.difficulty;
    minTime = settings?.minTime;
    maxTime = settings?.maxTime;
    gameDuration = settings?.gameDuration;
    playerName = settings?.playerName;
  }
  displayGameScreen();
  gameStage = 2;
  controlSound(checkGameStageAudio(gameStage));
  audioPaused = false;
  score = 0;
  timeUp = false;
  startGame(timeUp, minTime, maxTime, lastSelectedHill);
  startGameTimer();
}
