# DiscordBot

## Steps to use

1. Have [git](https://git-scm.com/downloads) and [node.js](https://nodejs.org/en/download/) installed on your computer
2. Fork this repo then clone a copy using `git clone https://github.com/carterclark/DiscordBot.git`
3. Open a terminal and cd to the root directory of the project which containes the index.js file
4. Run `npm install` to download dependancies
5. Make a `.env` file in the root directory and enter the secrets for:
   - `BOT_AUTH_TOKEN`, can be found in the discord develeper portal. After selecting the app go to Bot.
   - `CLIENT_ID`, can be found in the discord develeper portal. After selecting the app go to OAuth2.
   - `SERVER_ID`, can be found under `widget` in the server settings on discord
6. If running the bot for the first time or changing bot commands, enter the termainal and cd to the root directory then run `node deploy-commands.js`.
7. Run the command `node index.js`

### Making Discord Bot

1. Open [discord developer portal](https://discord.com/developers/applications)
2. Create new application and bot
3. under bot, check `PRESENCE INTENT` and `SERVER MEMBERS INTENT`
4. Go to `OAuth2` and under `Redirects` enter `https://localhost:8080/auth/discord/redirect`
5. Go to `URL Generator` and check `bot` and `applications.commands`
6. Under `Bot Permissions` for simplicity just check `Administrator`
7. Copy URL, paste it in a new tab, press enter
8. Complete forms and add to server

## Workflow

### github

1. git add .
2. git commit -m"[COMMIT MESSAGE]"
3. git push

## Technology

- [node.js](https://nodejs.org/en/docs/)
- [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome)

## Commands

- Start app: `node index.js`
- Deploy new commands for bot: `node deploy-commands.js`
- Run tests: `npm run test`

### Links

- [Discord Developer Portal](https://discord.com/developers/applications)
- [discord.js tutorial](https://discordjs.guide/#before-you-begin)
