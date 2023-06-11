const { Client, Intents } = require('discord.js');

const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

// Rest of your code...


// Define regions and their corresponding Pokemon
const regions = {
  kanto: ['Pikachu', 'Charmander', 'Squirtle'],
  johto: ['Chikorita', 'Cyndaquil', 'Totodile'],
  hoenn: ['Treecko', 'Torchic', 'Mudkip']
};

// Define available commands
const commands = {
  start: 'start',
  catch: 'catch',
  heal: 'heal',
  feed: 'feed',
  info: 'info'
};

// Define user data structure
const userData = {
  pokeballs: 0,
  food: 0,
  healer: 0,
  energy: 100,
  region: '',
  pokemon: ''
};

// Command to start the game and choose a region and starter Pokemon
const startGame = (message, args) => {
  const chosenRegion = args[0].toLowerCase();
  
  if (!regions[chosenRegion]) {
    message.channel.send('Invalid region. Available regions: Kanto, Johto, Hoenn.');
    return;
  }
  
  userData.region = chosenRegion;
  
  const regionPokemon = regions[chosenRegion];
  const randomIndex = Math.floor(Math.random() * regionPokemon.length);
  userData.pokemon = regionPokemon[randomIndex];
  
  message.channel.send(`You chose ${chosenRegion} region and your starter Pokemon is ${userData.pokemon}!`);
};

// Command to catch a Pokemon
const catchPokemon = (message) => {
  if (userData.pokeballs === 0) {
    message.channel.send('You do not have any Pokeballs. Buy some from the shop!');
    return;
  }
  
  if (Math.random() < 0.5) {
    message.channel.send(`Congratulations! You caught a wild ${userData.pokemon}!`);
  } else {
    message.channel.send(`Oh no! The wild ${userData.pokemon} escaped!`);
  }
  
  userData.pokeballs--;
};

// Command to heal the Pokemon
const healPokemon = (message) => {
  if (userData.healer === 0) {
    message.channel.send('You do not have any healers. Buy some from the shop!');
    return;
  }
  
  userData.healer--;
  userData.energy = 100;
  
  message.channel.send(`Your ${userData.pokemon} has been healed and its energy is fully restored!`);
};

// Command to feed the Pokemon
const feedPokemon = (message) => {
  if (userData.food === 0) {
    message.channel.send('You do not have any food. Buy some from the shop!');
    return;
  }
  
  userData.food--;
  userData.energy += 20;
  if (userData.energy > 100) {
    userData.energy = 100;
  }
  
  message.channel.send(`You fed your ${userData.pokemon}. Its energy increased!`);
};

// Command to display Pokemon information
const displayPokemonInfo = (message) => {
  message.channel.send(`Your Pokemon: ${userData.pokemon}`);
  message.channel.send(`Energy: ${userData.energy}`);
  message.channel.send(`Pokeballs: ${userData.pokeballs}`);
  message.channel.send(`Food: ${userData.food}`);
  message.channel.send(`Healers: ${userData.healer}`);
};

// Listen for bot ready event
client.once('ready', () => {
  console.log('Bot is ready!');
});

// Listen for message event
client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case commands.start:
      startGame(message, args);
      break;
    case commands.catch:
      catchPokemon(message);
      break;
    case commands.heal:
      healPokemon(message);
      break;
    case commands.feed:
      feedPokemon(message);
      break;
    case commands.info:
      displayPokemonInfo(message);
      break;
  }
});

// Login the bot with your Discord bot token
client.login(token);
