# Poklebot

This bot plays [Pokle](https://poklegame.com/) better than you do.

To start run: `npm ci` then `npm start`.

The bot will:

- connect to the game (with Playwright)
- find all possible solutions for today's puzzle (by brut forcing all possible Boards)
- deduce the best first guess (by calculating the entropy of each possible play)
- input that guess and read the result
- filter out the solutions that are not longer valid
- repeat until victory
