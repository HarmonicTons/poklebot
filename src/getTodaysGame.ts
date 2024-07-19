import playwright from "playwright";

const getName = async (
  page: playwright.Page,
  player: number
): Promise<string> => {
  const elem = await page.waitForSelector(
    `td.name-tag:nth-child(${player + 1})`
  );
  return elem.innerHTML();
};

const main = async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://poklegame.com/");
  const p1Name = await getName(page, 1);
  console.log(p1Name);

  await browser.close();
};

main();
