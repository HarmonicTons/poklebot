# Poklebot

This bot plays [Pokle](https://poklegame.com/) better than you do.

To start run: `npm ci` then `npm start -- unrestricted`.

The bot will:

- connect to the game (with Playwright)
- find all possible solutions for today's puzzle (by brut forcing all possible Boards)
- deduce the best first guess (by calculating the entropy of each possible play)
- input that guess and read the result
- filter out the solutions that are not longer valid
- repeat until victory

# Modes

The mode corresponds to the attribute given to `npm start -- <mode>` and will impact the strategy taken by the bot.

Fives modes are available:

- unrestricted
- restricted
- random
- greedy
- kamikaze

# Play a past game

Each day the game is saved to `src/history/games.json`. To replay a past game (offline) use the command `npm run past-game -- <gameId> <mode>`.
