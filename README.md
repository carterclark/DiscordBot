
# DiscordBot

## Steps to use
1. Have git and node.js installed on your computer
2. Fork this repo then clone a copy using `git clone https://github.com/carterclark/DiscordBot.git`
3. Open a terminal and cd to the root directory of the project
4. If changing bot commands run `node deploy-commands.js` in the terminal
4. Run the command `node index.js`

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

### heroku
1. git add .
2. git commit -m"[COMMIT MESSAGE]"
3. heroku login. [Enter your Heroku credentials.](skip this step if already logged in)
4. heroku create (skip this step if already done once)
5. git push heroku main

## Technology
- [discord.js](https://discordjs.guide/#before-you-begin)
- [heroku](https://devcenter.heroku.com/categories/reference)

## Commands
- Start app: `node index.js`
- Deploy new commands for bot: `node deploy-commands.js`

- Check heroku configs: `heroku config`
- Update heroku configs: `heroku config:set {CONFIG_NAME}={CONFIG_VALUE}`
- Stop heroku: `heroku ps:scale web=0`
- Start heroku: `heroku ps:scale web=1`
- Reset heroku: `heroku repo:reset -a tranquil-oasis-25105`

### Links
[Discord Developer Portal](https://discord.com/developers/applications)