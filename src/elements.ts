export const moles = document.querySelectorAll(
  ".mole"
) as NodeListOf<HTMLImageElement>;
export const hills = document.querySelectorAll(
  ".hill"
) as NodeListOf<HTMLDivElement>;
export const scoreDisplay: HTMLParagraphElement | null =
  document.querySelector(".game-score");
export const scoreEndGame = document.querySelector(
  ".score-display"
) as HTMLParagraphElement;
export const startButton: HTMLButtonElement | null =
  document.querySelector("#startButton");
export const reloadButton: HTMLButtonElement | null =
  document.querySelector("#reloadButton");
export const welcome: HTMLDivElement | null =
  document.querySelector(".welcome");
export const endgameContainer = document.querySelector(
  ".endgame"
) as HTMLDivElement;
export const gameContainer = document.querySelector(
  ".game-container"
) as HTMLDivElement;
export const durationSelect: HTMLSelectElement | null =
  document.querySelector("#duration");
export const difficultySelect: HTMLSelectElement | null =
  document.querySelector("#difficulty");
export const nameInput: HTMLInputElement | null =
  document.querySelector("#name");
export const timeDisplay = document.querySelector(
  ".game-time"
) as HTMLParagraphElement;
export const introSound = document.querySelector(
  ".intro-sound"
) as HTMLAudioElement;
export const gameSound = document.querySelector(
  ".game-sound"
) as HTMLAudioElement;
export const endSound = document.querySelector(
  ".end-sound"
) as HTMLAudioElement;
export const allowSoundButton = document.querySelector(
  ".allow-sound-button"
) as HTMLButtonElement;
export const blockSoundButton = document.querySelector(
  ".block-sound-button"
) as HTMLButtonElement;
