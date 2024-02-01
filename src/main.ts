"use strict";

const moles = document.querySelectorAll(
  ".mole"
) as NodeListOf<HTMLImageElement>;

const hills = document.querySelectorAll(".hill") as NodeListOf<HTMLDivElement>;

const scoreDisplay: HTMLParagraphElement | null =
  document.querySelector(".score");

const startButton: HTMLButtonElement | null =
  document.querySelector(".startButton");

const minTime: number = 200;
const maxTime: number = 2000;
let timeUp: boolean = false;
let lastSelectedHill: HTMLDivElement;
let score: number = 0;
let gameTime: number = 10000;

startButton?.addEventListener("click", () => {
  setTimeout(startGame, 2000);
});

function startGame(): void {
  score = 0;
  timeUp = false;
  if (scoreDisplay) {
    scoreDisplay.textContent = "0";
  }
  moleUp();
  setTimeout(() => {
    timeUp = true;
    alert(`La partie est terminée. Vous avez ${score} points`);
  }, gameTime);
}

function moleUp(): void {
  const time = getRandomTime(minTime, maxTime);
  const hill: HTMLDivElement = getRandomHill();
  const mole: HTMLImageElement | null = hill.querySelector(".mole");

  mole?.classList.add("up");
  setTimeout(() => {
    mole?.classList.remove("up");
    if (!timeUp) {
      moleUp();
    }
  }, time);
}

function hitMole(e: MouseEvent, mole: HTMLImageElement): void {
  if (!e.isTrusted) return;
  score++;
  if (scoreDisplay) {
    scoreDisplay.textContent = `${score}`;
  }
  mole.classList.remove("up");
}
moles.forEach((mole) => {
  mole.addEventListener("click", (e: MouseEvent) => {
    hitMole(e, mole);
  });
});

function getRandomHill(): HTMLDivElement {
  const index: number = Math.floor(Math.random() * hills.length);
  const hill: HTMLDivElement = hills[index];
  if (hill === lastSelectedHill) {
    return getRandomHill();
  }
  lastSelectedHill = hill;
  return hill;
}

function getRandomTime(min: number = 200, max: number = 2000): number {
  return Math.round(Math.random() * (max - min) + min);
}
