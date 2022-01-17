
# DiscordBot

## Steps to use
1. Open a terminal and cd to the root directory of the project
2. Run the command `node index.js`

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
- Start herkou: `heroku ps:scale web=1`

### Links
[Discord Developer Portal](https://discord.com/developers/applications)