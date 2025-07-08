import { Pokle } from "../pokle/Pokle";

export const postMessage = async (msg: string) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("Discord webhook URL is not set.");
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: parseMessage(msg) }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const parseMessage = (msg: string): string => {
  // Replace the white square emoji with the corresponding Discord emoji
  return msg.replaceAll("⬜️", ":white_large_square:");
};

export const postGame = async (pokle: Pokle) => {
  const discordMessage = `${pokle.toString()}\n\nGuesses:\n||${pokle.guessesToString()}||`;
  postMessage(discordMessage);
};
