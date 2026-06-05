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

# Automation

This bot run daily in restricted mode through Github actions and publish its result to a discord channel:

<img width="851" height="222" alt="Screenshot 2026-06-05 at 14 11 34" src="https://github.com/user-attachments/assets/3fc55d45-100f-4038-9e07-b3ef210a3c98" />


# Play a past game

Each day the game is saved to `src/history/games.json`. To replay a past game (offline) use the command `npm run past-game -- <gameId> <mode>`.
