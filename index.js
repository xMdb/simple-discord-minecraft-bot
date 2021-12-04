require('dotenv').config();
const mineflayer = require('mineflayer');
const Discord = require('discord.js');

const discordBot = new Discord.Client({
   allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
   intents: [Discord.Intents.FLAGS.GUILD_MESSAGES],
});
const minecraftBot = mineflayer.createBot({
   host: 'localhost',
   username: 'bot',
});

const discordServerID = '829678508585648138';
const chatChannelID = '916599650079870977';

// Console log bot logins and disconnects
discordBot.on('ready', () => {
   console.log(`The Discord bot ${discordBot.user.username} is ready!`);
});

minecraftBot.on('login', () => {
   console.log('Minecraft bot has logged in!');
});

minecraftBot.on('end', () => {
   console.log('Minecraft bot disconnected from the server.');
});

// Send message to channel in server
async function toDiscordChat(msg) {
   await discordBot.guilds.cache.get(discordServerID).channels.fetch();
   return discordBot.guilds.cache.get(discordServerID).channels.cache.get(chatChannelID).send({
      content: msg,
   });
}

// Discord chat to Minecraft chat
discordBot.on('messageCreate', async (message) => {
   try {
      if (message.author.id === discordBot.user.id || message.channel.id !== chatChannelID || message.author.bot) return;
      minecraftBot.chat(`${message.author.username}: ${message.content}`);
      toDiscordChat(`[DISCORD] ${message.author.username}: ${message.content}`);
      await message.delete();
   } catch (err) {
      console.error(err);
   }
});

// Minecraft chat to Discord chat
minecraftBot.on('chat', (username, message) => {
   if (username === minecraftBot.username) return;
   toDiscordChat(`[MC] ${username}: ${message}`);
});

discordBot.login(process.env.BOT_TOKEN);
