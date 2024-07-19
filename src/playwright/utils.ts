import { Page } from "playwright";
import { CardSuit } from "../poker/Card";

export const getName = async (page: Page, player: number): Promise<string> => {
  const elementHandle = await page.waitForSelector(
    `td.name-tag:nth-child(${player + 1})`
  );
  return elementHandle.innerHTML();
};

export const getCardRank = async (page: Page, player: number, card: number) => {
  const elementHandle = await page.waitForSelector(`#p${player}card${card}`);
  return (await elementHandle.innerHTML()).toUpperCase();
};

const imgUrlRegex = /url\("(.*?)\.svg"\)/;
const suitsRecord: Record<string, CardSuit> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};
export const getCardSuit = async (page: Page, player: number, card: number) => {
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

const positionRecord: Record<string, string> = {
  gold: "1",
  silver: "2",
  bronze: "3",
};

export const getPosition = async (
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

export const getPlayers = async (page: Page) => {
  const promises = [1, 2, 3].map(async (player) => ({
    name: await getName(page, player),
    cards: [
      `${await getCardRank(page, player, 1)}${await getCardSuit(
        page,
        player,
        1
      )}`,
      `${await getCardRank(page, player, 2)}${await getCardSuit(
        page,
        player,
        2
      )}`,
    ],
    positions: {
      flop: await getPosition(page, player, 1),
      turn: await getPosition(page, player, 2),
      river: await getPosition(page, player, 3),
    },
  }));
  return Promise.all(promises);
};
