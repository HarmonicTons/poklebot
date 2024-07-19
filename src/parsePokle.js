// use this script in the browser console to parse the pokle game

const getName = (player) => {
  return document.querySelector(`td.name-tag:nth-child(${player + 1})`)
    .innerHTML;
};

const getCardRank = (player, card) => {
  return document
    .querySelector(`#p${player}card${card}`)
    .innerHTML.toUpperCase();
};

const imgUrlRegex = /url\("(.*?)\.svg"\)/;
const suitsRecord = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};
const getCardSuit = (player, card) => {
  return suitsRecord[
    document
      .querySelector(`#p${player}card${card}`)
      .style.getPropertyValue("background-image")
      .match(imgUrlRegex)[1]
  ];
};

const positionRecord = {
  gold: "1",
  silver: "2",
  bronze: "3",
};

const getPosition = (player, stage) => {
  const trophy = document
    .querySelector(
      `#board > tbody:nth-child(1) > tr:nth-child(${
        stage + 3
      }) > td:nth-child(${player + 1}) > div:nth-child(1)`
    )
    .style.getPropertyValue("background-image")
    .match(imgUrlRegex)[1];

  return positionRecord[trophy];
};

const parsePokle = () => {
  return [1, 2, 3].map((player) => ({
    name: getName(player),
    cards: [
      `${getCardRank(player, 1)}${getCardSuit(player, 1)}`,
      `${getCardRank(player, 2)}${getCardSuit(player, 2)}`,
    ],
    positions: {
      flop: getPosition(player, 1),
      turn: getPosition(player, 2),
      river: getPosition(player, 3),
    },
  }));
};

console.log(JSON.stringify(parsePokle()));
