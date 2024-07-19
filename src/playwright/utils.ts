import { Page } from "playwright";
import { Card, CardRank, CardSuit } from "../poker/Card";
import {
  BoardPattern,
  CardPattern,
  Player,
  PlayerPosition,
  Players,
} from "../pokle/Pokle";
import { BoardCards } from "../poker/Poker";

export const getPlayerName = async (
  page: Page,
  player: number
): Promise<string> => {
  const elementHandle = await page.waitForSelector(
    `td.name-tag:nth-child(${player + 1})`
  );
  return elementHandle.innerHTML();
};

export const getPlayerCardRank = async (
  page: Page,
  player: number,
  card: number
): Promise<CardRank> => {
  const elementHandle = await page.waitForSelector(`#p${player}card${card}`);
  const rawRank = await elementHandle.innerHTML();
  return rawRank.toUpperCase() as CardRank;
};

const imgUrlRegex = /url\("(.*?)\.svg"\)/;
const suitsRecord: Record<string, CardSuit> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};
export const getPlayerCardSuit = async (
  page: Page,
  player: number,
  card: number
): Promise<CardSuit> => {
  const elementHandle = await page.waitForSelector(`#p${player}card${card}`);
  const bgImage = await elementHandle.evaluate((element) =>
    element.style.getPropertyValue("background-image")
  );
  const regexResult = bgImage.match(imgUrlRegex);
  if (!regexResult) {
    throw new Error("Failed to match regex");
  }
  return suitsRecord[regexResult[1]];
};

const positionRecord: Record<string, PlayerPosition> = {
  gold: 1,
  silver: 2,
  bronze: 3,
};

export const getPlayerPosition = async (
  page: Page,
  player: number,
  stage: number
) => {
  const elementHandle = await page.waitForSelector(
    `#board > tbody:nth-child(1) > tr:nth-child(${stage + 3}) > td:nth-child(${
      player + 1
    }) > div:nth-child(1)`
  );
  const bgImage = await elementHandle.evaluate((element) =>
    element.style.getPropertyValue("background-image")
  );
  const regexResult = bgImage.match(imgUrlRegex);
  if (!regexResult) {
    throw new Error("Failed to match regex");
  }
  return positionRecord[regexResult[1]];
};

export const getPlayers = async (page: Page): Promise<Players> => {
  const promises = [1, 2, 3].map(
    async (player): Promise<Player> => ({
      name: await getPlayerName(page, player),
      cards: [
        new Card(
          await getPlayerCardRank(page, player, 1),
          await getPlayerCardSuit(page, player, 1)
        ),
        new Card(
          await getPlayerCardRank(page, player, 2),
          await getPlayerCardSuit(page, player, 2)
        ),
      ],
      positions: {
        flop: await getPlayerPosition(page, player, 1),
        turn: await getPlayerPosition(page, player, 2),
        river: await getPlayerPosition(page, player, 3),
      },
    })
  );
  const players = await Promise.all(promises);
  return players as Players;
};

export const closeAllModals = async (page: Page) => {
  const introBtn = await page.waitForSelector("#intro-end-button");
  await introBtn.click();
  const tutoBtn1 = await page.waitForSelector("#tut-more-button-1");
  await tutoBtn1.click();
  const tutoBtn2 = await page.waitForSelector("#tut-more-button-2");
  await tutoBtn2.click();
  const tutoBtn3 = await page.waitForSelector("#tut-end-button");
  await tutoBtn3.click();
};

const getCardBtnSelector = (
  cardIndex: 1 | 2 | 3 | 4 | 5,
  guessNumber: 1 | 2 | 3 | 4 | 5 | 6
) =>
  `#${
    cardIndex < 4 ? "flop" : cardIndex === 4 ? "turn" : "river"
  }-table > tr:nth-child(${1 + guessNumber}) > td:nth-child(${
    cardIndex < 4 ? cardIndex : 1
  }) > div:nth-child(1) > button:nth-child(1)`;

const rankSelector: Record<CardRank, string> = {
  "2": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > button:nth-child(1)",
  "3": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > button:nth-child(1)",
  "4": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > button:nth-child(1)",
  "5": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4) > button:nth-child(1)",
  "6": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(5) > button:nth-child(1)",
  "7": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(6) > button:nth-child(1)",
  "8": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(7) > button:nth-child(1)",
  "9": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > button:nth-child(1)",
  "10": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3) > button:nth-child(1)",
  J: "#keyboard-table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4) > button:nth-child(1)",
  Q: "#keyboard-table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(5) > button:nth-child(1)",
  K: "#keyboard-table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(6) > button:nth-child(1)",
  A: "#keyboard-table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(7) > button:nth-child(1)",
};

const suitSelector: Record<CardSuit, string> = {
  "♠": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(8) > button:nth-child(1)",
  "♣": "#keyboard-table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(9) > button:nth-child(1)",
  "♦": "#diamonds-kb-button",
  "♥": "#hearts-kb-button",
};

export const inputCard = async (
  page: Page,
  cardIndex: 1 | 2 | 3 | 4 | 5,
  cardRank: CardRank,
  cardSuit: CardSuit,
  guessNumber: 1 | 2 | 3 | 4 | 5 | 6
) => {
  const cardBtn = await page.waitForSelector(
    getCardBtnSelector(cardIndex, guessNumber)
  );
  await cardBtn.click();

  const rankBtn = await page.waitForSelector(rankSelector[cardRank]);
  await rankBtn.click();

  const suitBtn = await page.waitForSelector(suitSelector[cardSuit]);
  await suitBtn.click();
};

const cardPatternRecord: Record<string, CardPattern> = {
  darkgreen: "🟩",
  gold: "🟨",
  grey: "⬜️",
};

export const readCardPattern = async (
  page: Page,
  cardIndex: 1 | 2 | 3 | 4 | 5,
  guessNumber: 1 | 2 | 3 | 4 | 5 | 6
): Promise<CardPattern> => {
  const cardBtn = await page.waitForSelector(
    getCardBtnSelector(cardIndex, guessNumber)
  );
  const bgColor = await cardBtn.evaluate((element) =>
    element.style.getPropertyValue("background-color")
  );
  return cardPatternRecord[bgColor];
};

const submitBtnSelector = "#submit-button";

export const timeout = (n: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, n));

export const submitGuess = async (
  page: Page,
  guess: BoardCards,
  guessNumber: 1 | 2 | 3 | 4 | 5 | 6
): Promise<BoardPattern> => {
  await inputCard(page, 1, guess[0].rank, guess[0].suit, guessNumber);
  await inputCard(page, 2, guess[1].rank, guess[1].suit, guessNumber);
  await inputCard(page, 3, guess[2].rank, guess[2].suit, guessNumber);
  await inputCard(page, 4, guess[3].rank, guess[3].suit, guessNumber);
  await inputCard(page, 5, guess[4].rank, guess[4].suit, guessNumber);

  const submitBtn = await page.waitForSelector(submitBtnSelector);
  await submitBtn.click();

  await timeout(3000);

  const card1Pattern = await readCardPattern(page, 1, guessNumber);
  const card2Pattern = await readCardPattern(page, 2, guessNumber);
  const card3Pattern = await readCardPattern(page, 3, guessNumber);
  const card4Pattern = await readCardPattern(page, 4, guessNumber);
  const card5Pattern = await readCardPattern(page, 5, guessNumber);

  return [card1Pattern, card2Pattern, card3Pattern, card4Pattern, card5Pattern];
};
