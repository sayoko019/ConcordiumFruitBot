console.log("Starting bot...");
const { Client, IntentsBitField, Partials } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// XP file
const xpFile = 'xp.json';
let xpData = {};
if (fs.existsSync(xpFile)) {
  xpData = JSON.parse(fs.readFileSync(xpFile));
}

// Create Discord client
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once('ready', () => {
  console.log(`${client.user.tag} is ready and online!`);
});

// Offerings config
const validOfferings = ["🍎", "🍊", "🍌", "🍇", "🍓", "🍒", "🍍", "🥭", "🥝", "🍑", "🍉"];
const offeringResponses = {
  "🍎": "The apple is accepted. May your path be briefly illuminated.",
  "🍊": "The orange rolls into the abyss. A curious choice.",
  "🍌": "A banana? You mock me.",
  "🍇": "The grapes are sour, but accepted.",
  "🍓": "Strawberries, sweet yet fleeting. Like your existence.",
  "🍒": "Twin cherries. A sign of duality.",
  "🍍": "The pineapple's armor pleases me.",
  "🥭": "The mango's sweetness is noted.",
  "🥝": "The kiwi's fuzz hides a tart core.",
  "🍑": "The peach blushes at your offering.",
  "🍉": "The watermelon bursts with promise."
};

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Failed to fetch reaction: ', error);
      return;
    }
  }

  const emoji = reaction.emoji.name;
  const message = reaction.message;

  // Only allow in specific channel
if (message.channel.id !== '1384841801315258469') return;

// Only allow users with specific role
const member = await message.guild.members.fetch(user.id);
if (!member.roles.cache.has('1384824249281150996')) return;


  // Hamster special case
  if (emoji === "🐹") {
    message.channel.send(`**WHO DARES OFFER ME THE SACRED HAMSTER?! MY WRATH SHALL BE LEGENDARY!** <@${user.id}>`);
    updateXP(user.id, -5);
    return;
  }

  // Offering responses
  const offeringResponses = {
    "😀": "You bare your teeth in what you call joy, a hollow grin masking the creeping terror you refuse to acknowledge. The vast emptiness beyond your comprehension watches silently, amused by your fragile optimism. You smile, but the abyss remains.",
    "🐹": "**WHO DARES OFFER ME THE SACRED HAMSTER?! MY WRATH SHALL BE LEGENDARY!**" 
    // Add more emojis here
  };

  const validOfferings = Object.keys(offeringResponses);

  if (validOfferings.includes(emoji)) {
    const response = offeringResponses[emoji];
    message.channel.send(`${response} <@${user.id}>`);
    updateXP(user.id, 1);
  } else {
    message.channel.send(`Pathetic. That is not an acceptable offering. -XP <@${user.id}>`);
    updateXP(user.id, -1);
  }
});

// XP system
function updateXP(userId, amount) {
  if (!xpData[userId]) {
    xpData[userId] = 0;
  }
  xpData[userId] += amount;
  fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2));
}

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const commands = {
    "xp": {
      description: "Check your XP.",
      execute: () => {
        const xp = xpData[message.author.id] || 0;
        message.reply(`<@${message.author.id}>, your XP is ${xp}.`);
      }
    },
    "help": {
      description: "Show this help menu.",
      execute: () => {
        let helpText = "**__Available Commands:__**\n\n";
        for (const cmd in commands) {
          helpText += `\`${prefix}${cmd}\` — ${commands[cmd].description}\n`;
        }
        message.reply(helpText);
      }
    },
    "adminmax": {
      description: "Admin only: Fully max your familiar & stats.",
      execute: async () => {
        const member = await message.guild.members.fetch(message.author.id);
        if (!member.roles.cache.has('1384826237633040464')) {
          return message.reply("You do not have permission to use this command.");
        }
        if (!familiarData[member.id]) {
          return message.reply("You don't have a familiar yet!");
        }
        familiarData[member.id].level = 200;
        familiarData[member.id].xp = 999999;
        familiarData[member.id].hp = 9999;
        familiarData[member.id].maxHp = 9999;
        familiarData[member.id].evolutionStage = 3;
        xpData[member.id] = { xp: 999999, level: 200, rebirths: 99 };
        fs.writeFileSync(familiarFile, JSON.stringify(familiarData, null, 2));
        fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2));
        return message.reply("Your familiar and stats have been fully maxed out!");
      }
    }
  };

  if (commands[command]) {
    commands[command].execute();
  }
});

// Login (replace YOUR_BOT_TOKEN)
client.login(process.env.TOKEN );

// Allowed channel & role
const allowedChannelId = '1384841801315258469';
const allowedRoleId = '1384824249281150996';

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});


// Familiar system setup
const familiarFile = 'familiarData.json';
let familiarData = {};
if (fs.existsSync(familiarFile)) {
  familiarData = JSON.parse(fs.readFileSync(familiarFile));

const PETS = [
  'Fox', 'Owl', 'Raven', 'Cat', 'Wolf', 'Bat', 'Snake', 'Spider', 'Frog', 'Moth',
  'Deer', 'Rabbit', 'Crow', 'Scorpion', 'Lizard', 'Turtle', 'Hawk', 'Ferret', 'Bee', 'Ant',
  'Jellyfish', 'Kraken', 'Imp', 'Will-o-wisp', 'Slime', 'Golem', 'Griffon', 'Phoenix', 'Hydra', 'Cerberus',
  'Hedgehog', 'Panda', 'Squirrel', 'Chameleon', 'Leech', 'Shark', 'Rat', 'Hamster', 'Weasel', 'Seahorse',
  'Dolphin', 'Komodo', 'Bear', 'Lynx', 'Lion', 'Crocodile', 'Vulture', 'Pelican', 'Seagull', 'Starfish',
  'Mantis', 'Lobster', 'Fennec Fox', 'Gazelle', 'Zebra', 'Kangaroo', 'Koala', 'Porcupine', 'Walrus', 'Octopus',
  'Raccoon', 'Goose', 'Platypus', 'Beetle', 'Tarantula', 'Eagle', 'Mole', 'Viper', 'Stingray', 'Swordfish',
  'Mimic', 'Worm', 'Lamprey', 'Salamander', 'Gargoyle', 'Basilisk', 'Hippogriff', 'Pegasus', 'Yeti', 'Wendigo',
  'Gremlin', 'Fungus Beast', 'Bone Hound', 'Spirit Fox', 'Void Hare', 'Chaos Spawn', 'Shadow Elk', 'Ember Serpent', 'Storm Crow', 'Venom Moth',
  'Blood Leech', 'Ethereal Ferret', 'Specter Bat', 'Cursed Toad', 'Doom Rat', 'Necro Wolf', 'Nightmare Cat', 'Terror Raven', 'Lurking Spider', 'Silent Frog'
];

const PERSONALITIES = [
  "Loyal", "Aggressive", "Timid", "Curious", "Playful", "Cunning", "Lazy", "Proud", "Protective", "Greedy",
  "Energetic", "Nervous", "Stoic", "Bold", "Clumsy", "Gentle", "Dominant", "Cowardly", "Jealous", "Independent",
  "Chatty", "Observant", "Mischievous", "Serious", "Gluttonous", "Affectionate", "Distracted", "Ambitious", "Stubborn", "Patient",
  "Paranoid", "Brave", "Elegant", "Grumpy", "Hyperactive", "Sneaky", "Intuitive", "Witty", "Anxious", "Reckless",
  "Rebellious", "Insecure", "Vigilant", "Impulsive", "Savage", "Strategic", "Calm", "Faithful", "Resourceful", "Chaotic",
  "Melancholic", "Vengeful", "Flirty", "Adventurous", "Wise", "Envious", "Sensitive", "Deceitful", "Selfless", "Intense",
  "Feral", "Ruthless", "Loyalist", "Naive", "Parasitic", "Controlling", "Charming", "Crafty", "Cold-hearted", "Obsessive",
  "Wanderer", "Fearless", "Ghostly", "Deranged", "Elegant", "Regal", "Hateful", "Manipulative", "Selfish", "Zealous",
  "Fickle", "Patient", "Dutiful", "Delusional", "Cheerful", "Calculating", "Sly", "Judgmental", "Passive", "Wise-cracker",
  "Dreamy", "Farsighted", "Needy", "Supportive", "Hot-headed", "Unpredictable", "Gullible", "Obsessive-Loving", "Disloyal", "Anarchist"
];

// Helper functions
function getRandomPet() {
  const pet = PETS[Math.floor(Math.random() * PETS.length)];
  const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
  return { pet, personality };
}

function saveFamiliar() {
  fs.writeFileSync(familiarFile, JSON.stringify(familiarData, null, 2));
}

// Bot online
client.on('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

// Message handling
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== allowedChannelId) return;

  const member = message.member;
  if (!member.roles.cache.has(allowedRoleId)) return;

  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === '!adopt') {
    if (familiarData[member.id]) {
      await message.reply("You already have a familiar.");
      return;
    }
    const { pet, personality } = getRandomPet();
    familiarData[member.id] = {
      name: pet,
      species: pet,
      personality: personality,
      level: 1,
      xp: 0,
      hp: 100
    };
    saveFamiliar();
    await message.reply(`You adopted **${pet}** with personality **${personality}**!`);
  }

  if (command === '!myfam') {
    if (!familiarData[member.id]) {
      await message.reply("You don't have a familiar yet! Use `!adopt`.");
      return;
    }
    const fam = familiarData[member.id];
    await message.reply(
      `**${fam.name} the ${fam.species}**\nPersonality: *${fam.personality}*\nLevel: ${fam.level} (XP: ${fam.xp}/100)\nHP: ${fam.hp}/100`
    );
  }

  if (command === '!playfam') {
    if (!familiarData[member.id]) {
      await message.reply("You don't have a familiar yet! Use `!adopt`.");
      return;
    }
    const gain = Math.floor(Math.random() * 15) + 5;
    familiarData[member.id].xp += gain;
    if (familiarData[member.id].xp >= 100) {
      familiarData[member.id].level++;
      familiarData[member.id].xp = 0;
      await message.reply(`**${familiarData[member.id].name}** leveled up to **${familiarData[member.id].level}**!`);
    } else {
      await message.reply(`You played with **${familiarData[member.id].name}** and gained ${gain} XP.`);
    }
    saveFamiliar();
  }

  // ==================== Shop System + Hunting + Healing coming next ====================
});

// ==================== Shop System + Hunting + Healing ====================

// Load or initialize shop data
const shopFile = 'shopData.json';
let shopData = {};
if (fs.existsSync(shopFile)) {
  shopData = JSON.parse(fs.readFileSync(shopFile));
} else {
  const healingItems = {};
  const gearItems = {};
  for (let i = 1; i <= 100; i++) {
    healingItems[`Herbal Potion ${i}`] = { type: 'healing', heal: 5 * i, price: 10 * i };
    gearItems[`Mystic Gear ${i}`] = { type: 'gear', boost: i, price: 50 * i };
  }
  shopData = { healing: healingItems, gear: gearItems };
  fs.writeFileSync(shopFile, JSON.stringify(shopData, null, 2));
}

// Load or initialize inventory data
const invFile = 'inventoryData.json';
let inventoryData = {};
if (fs.existsSync(invFile)) {
  inventoryData = JSON.parse(fs.readFileSync(invFile));
}

function saveInventory() {
  fs.writeFileSync(invFile, JSON.stringify(inventoryData, null, 2));
}

// Add these commands inside your existing messageCreate handler:

if (command === '!shop') {
  (async () => {
    let shopMessage = "**Hamster's Mysterious Shop**\n";
    shopMessage += "**Healing Items:**\n";
    for (let [name, data] of Object.entries(shopData.healing).slice(0, 5)) {
      shopMessage += `- ${name} (Heal: ${data.heal}, Cost: ${data.price})\n`;
    }
    shopMessage += "**Gear Items:**\n";
    for (let [name, data] of Object.entries(shopData.gear).slice(0, 5)) {
      shopMessage += `- ${name} (Boost: ${data.boost}, Cost: ${data.price})\n`;
    }
    shopMessage += "\n(Only a small sample shown. You can request any item with `!buy <item name>`)";
    await message.reply(shopMessage);
  })();
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === '!buy') {
    if (!args.length) {
      await message.reply("Specify what item you want to buy.");
      return;
    }
    const itemName = args.join(' ');
    let item = shopData.healing[itemName] || shopData.gear[itemName];
    if (!item) {
      await message.reply("This item doesn't exist.");
      return;
    }
    await message.reply(`You bought ${itemName}!`);
  }
});

if (!inventoryData[member.id]) {
  inventoryData[member.id] = { healing: {}, gear: {} };
}

if (item.type === 'healing') {
  inventoryData[member.id].healing[itemName] = (inventoryData[member.id].healing[itemName] || 0) + 1;
} else if (item.type === 'gear') {
  inventoryData[member.id].gear[itemName] = (inventoryData[member.id].gear[itemName] || 0) + 1;
}

saveInventory();

if (!familiarData[member.id]) {
  message.reply("You don't have a familiar yet! Use `!adopt`.");
  return;
}
const huntOutcome = Math.random();
let resultMessage = "";

if (huntOutcome < 0.1) {
  familiarData[member.id].hp -= 50;
  resultMessage = `Disaster! **${familiarData[member.id].name}** returned critically injured (-50 HP).`;
} else if (huntOutcome < 0.4) {
  familiarData[member.id].hp -= 20;
  resultMessage = `**${familiarData[member.id].name}** returned slightly injured (-20 HP).`;
} else {
  familiarData[member.id].xp += 20;
  if (familiarData[member.id].xp >= 100) {
    familiarData[member.id].level++;
    familiarData[member.id].xp = 0;
    resultMessage = `Successful hunt! **${familiarData[member.id].name}** leveled up to ${familiarData[member.id].level}.`;
  } else {
    resultMessage = `Successful hunt! Gained 20 XP.`;
  }
}

message.reply(resultMessage);


// ==================== PART 4: Familiar Interactions, Evolution, Rebirth, Shrine ====================

// Ensure rebirth data exists
for (const userId in xpData) {
  if (xpData[userId].rebirths === undefined) {
    xpData[userId].rebirths = 0;
  }
}

// Familiar Interactions + Rebirth Logic
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== allowedChannelId) return;
  const member = message.member;
  if (!member.roles.cache.has(allowedRoleId)) return;

  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Player rebirth
  if (command === '!ascend') {
    if (xpData[member.id]?.level >= 200) {
      xpData[member.id].rebirths += 1;
      xpData[member.id].level = 1;
      xpData[member.id].xp = 0;
      saveData();
      await message.reply(`<@${member.id}> has transcended and started anew. Total rebirths: ${xpData[member.id].rebirths}`);
    } else {
      await message.reply("You must reach Level 200 to ascend.");
    }
  }

  // Familiar rebirth
  if (command === '!famrebirth') {
    if (!familiarData[member.id]) {
      await message.reply("You don't have a familiar.");
      return;
    }
    if (familiarData[member.id].level >= 200) {
      familiarData[member.id].rebirths = (familiarData[member.id].rebirths || 0) + 1;
      familiarData[member.id].level = 1;
      familiarData[member.id].xp = 0;
      familiarData[member.id].hp = 100;
      saveFamiliar();
      await message.reply(`Your familiar **${familiarData[member.id].name}** has evolved through rebirth. Total rebirths: ${familiarData[member.id].rebirths}`);
    } else {
      await message.reply("Your familiar must reach Level 200 to rebirth.");
    }
  }

  // Familiar play
  if (command === '!famplaywith') {
    const target = message.mentions.users.first();
    if (!target || target.bot) {
      await message.reply("You need to mention a valid user.");
      return;
    }
    if (!familiarData[member.id] || !familiarData[target.id]) {
      await message.reply("Both users must have familiars.");
      return;
    }
    await message.reply(`**${familiarData[member.id].name}** happily plays with **${familiarData[target.id].name}**!`);
  }

  // Familiar prank
  if (command === '!famprank') {
    const target = message.mentions.users.first();
    if (!target || target.bot) {
      await message.reply("You need to mention a valid user.");
      return;
    }
    if (!familiarData[member.id] || !familiarData[target.id]) {
      await message.reply("Both users must have familiars.");
      return;
    }
    const outcome = Math.random() < 0.5 ? "successful prank" : "failed prank";
    await message.reply(`**${familiarData[member.id].name}** attempted to prank **${familiarData[target.id].name}** — ${outcome}!`);
  }

  // Familiar bond
  if (command === '!fambond') {
    const target = message.mentions.users.first();
    if (!target || target.bot) {
      await message.reply("You need to mention a valid user.");
      return;
    }
    if (!familiarData[member.id] || !familiarData[target.id]) {
      await message.reply("Both users must have familiars.");
      return;
    }
    await message.reply(`**${familiarData[member.id].name}** and **${familiarData[target.id].name}** formed a strong bond.`);
  }

  // Familiar enemy
  if (command === '!famenemy') {
    const target = message.mentions.users.first();
    if (!target || target.bot) {
      await message.reply("You need to mention a valid user.");
      return;
    }
    if (!familiarData[member.id] || !familiarData[target.id]) {
      await message.reply("Both users must have familiars.");
      return;
    }
    await message.reply(`**${familiarData[member.id].name}** and **${familiarData[target.id].name}** became sworn enemies.`);
  }

  // Rename familiar
  if (command === '!namefam') {
    const famName = args.join(' ');
    if (!famName) {
      await message.reply("You must provide a name.");
      return;
    }
    if (!familiarData[member.id]) {
      await message.reply("You don't have a familiar.");
      return;
    }
    familiarData[member.id].name = famName;
    saveFamiliar();
    await message.reply(`Your familiar is now named **${famName}**!`);
  }
});

// ==================== PART 5: Witch Trivia, Potion Brewing, Events, Shepherd, Gear ====================

// Herb combo definitions
const herbalCombos = {
  "rose+mint": "Minor Healing Potion",
  "lavender+sage": "Energy Elixir",
  "chamomile+honey": "Calming Brew",
  "nettle+ginger": "Stamina Tonic",
  "garlic+thyme": "Poison Cure",
  "mugwort+fennel": "Vision Potion",
  "ginseng+licorice": "Vitality Elixir",
  // Add more combinations up to 100 total
};

const randomHerbs = ["rose", "mint", "lavender", "sage", "chamomile", "honey", "nettle", "ginger", "garlic", "thyme", "mugwort", "fennel", "ginseng", "licorice"];

// Shrine system
if (command === '!shrine') {
  message.reply(`You approach the ancient shrine. Are you certain you wish to offer? Type \`!offerconfirm\` to proceed.`);
}

if (command === '!offerconfirm') {
  const success = Math.random() < 0.3;
  if (success) {
    xpData[member.id].xp += 200;
    message.reply(`The entity accepts your offering. You gain great power (+200 XP).`);
  } else {
    xpData[member.id].xp -= 50;
    if (xpData[member.id].xp < 0) xpData[member.id].xp = 0;
    message.reply(`The entity rejects your offering. You lose some XP (-50 XP).`);
  }
  saveData();
}

// Witch trivia system
if (command === '!trivia') {
  const herb1 = randomHerbs[Math.floor(Math.random() * randomHerbs.length)];
  const herb2 = randomHerbs[Math.floor(Math.random() * randomHerbs.length)];
  message.reply(`Witch's Brew: Combine **${herb1}** + **${herb2}** — What does it make? Type \`!answer [potion name]\``);
  triviaData[member.id] = `${herb1}+${herb2}`;
}

if (command === '!answer') {
  const response = args.join(' ');
  const combo = triviaData[member.id];
  if (!combo) {
    message.reply("You haven't started a trivia session.");
    return;
  }
  if (herbalCombos[combo] && herbalCombos[combo].toLowerCase() === response.toLowerCase()) {
    message.reply("Correct! You've earned a **" + herbalCombos[combo] + "**.");
    addItem(member.id, herbalCombos[combo], 1);
  } else {
    message.reply("Incorrect answer.");
  }
  delete triviaData[member.id];
}

// Potion Brewing System
if (command === '!brew') {
  const ingredient1 = args[0];
  const ingredient2 = args[1];
  const combined = `${ingredient1}+${ingredient2}`;
  if (herbalCombos[combined]) {
    addItem(member.id, herbalCombos[combined], 1);
    message.reply(`You successfully brewed **${herbalCombos[combined]}**.`);
  } else {
    message.reply("That herb combination failed.");
  }
}

// Shepherd high-risk offering
if (command === '!shepherd') {
  message.reply("⚠ You approach the Shepherd. Do you truly wish to offer? Type `!shepherdconfirm` if you dare.");
}

if (command === '!shepherdconfirm') {
  const outcome = Math.random();
  if (outcome < 0.2) {
    xpData[member.id].xp += 1000;
    addItem(member.id, "Ancient Shard", 1);
    message.reply("The Shepherd smiles. You gain **1000 XP** and an **Ancient Shard**.");
  } else {
    xpData[member.id].xp = Math.floor(xpData[member.id].xp * 0.5);
    message.reply("The Shepherd devours part of your soul. You lose half your XP.");
  }
  saveData();
}

// Random Events System
if (command === '!event') {
  const roll = Math.floor(Math.random() * 20);
  let eventResult = "";
  switch (roll) {
    case 0:
      eventResult = "You found a rare herb!";
      addItem(member.id, "Rare Herb", 1);
      break;
    case 1:
      eventResult = "A wild beast attacked your familiar! -20 HP";
      familiarData[member.id].hp -= 20;
      break;
    case 2:
      eventResult = "A traveling merchant gifted you 500 coins.";
      coinsData[member.id] += 500;
      break;
    case 3:
      eventResult = "You stumbled upon an old witch who increased your max HP by 10.";
      familiarData[member.id].maxHp += 10;
      break;
    // Extend with more events up to case 19
    default:
      eventResult = "Nothing unusual happened.";
  }
  saveFamiliar();
  message.reply(eventResult);
}

// Gear Shop (early stage, to be expanded)
if (command === '!buygear') {
  const gearName = args.join(' ');
  if (!gearList.includes(gearName)) {
    message.reply("That gear doesn't exist.");
    return;
  }
  const cost = gearPrices[gearName];
  if (coinsData[member.id] < cost) {
    message.reply("You don't have enough coins.");
    return;
  }
  coinsData[member.id] -= cost;
  addItem(member.id, gearName, 1);
  message.reply(`You purchased **${gearName}**!`);
}

// ==================== Familiar System (Personality, Play, Prank, Attack, Healing) ====================

const personalities = [
  "Aggressive", "Playful", "Shy", "Protective", "Cunning", "Lazy", "Energetic", "Loyal", "Jealous", "Curious",
  "Timid", "Wise", "Fearless", "Silly", "Gentle", "Stubborn", "Optimistic", "Grumpy", "Calm", "Sarcastic",
  "Proud", "Vengeful", "Friendly", "Moody", "Hyper", "Greedy", "Insecure", "Paranoid", "Brave", "Stoic",
  "Cowardly", "Nurturing", "Scheming", "Loner", "Social", "Rebellious", "Determined", "Carefree", "Anxious",
  "Precise", "Bold", "Clumsy", "Ambitious", "Caring", "Sneaky", "Observant", "Tough", "Sensitive", "Wild"
  // Extend to 100 personalities later
];

const speciesList = [
  "Fire Fox", "Crystal Wolf", "Shadow Cat", "Thunder Hawk", "Water Serpent", "Moon Rabbit", "Spirit Deer",
  "Sky Dragon", "Venom Lizard", "Sun Bear"
];

const gearList = [
  "Claw Reinforcer", "Speed Harness", "Armor Plating", "Stealth Cloak", "Luck Charm", "Battle Collar"
];

const gearPrices = {
  "Claw Reinforcer": 300,
  "Speed Harness": 250,
  "Armor Plating": 400,
  "Stealth Cloak": 350,
  "Luck Charm": 500,
  "Battle Collar": 600
};

const healingItems = {
  "Small Healing Herb": 50,
  "Medium Healing Salve": 100,
  "Large Healing Elixir": 200,
  "Rare Revitalizer": 500
};

// Unified command listener
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const member = message.member;

  // Initialize familiar if missing
  if (!familiarData[member.id]) {
    familiarData[member.id] = {
      name: "Unnamed",
      species: speciesList[Math.floor(Math.random() * speciesList.length)],
      personality: personalities[Math.floor(Math.random() * personalities.length)],
      level: 1,
      xp: 0,
      hp: 100,
      maxHp: 100,
      gear: [],
      evolutionStage: 1
    };
    saveFamiliar();
  }

  // ==================== Familiar Interaction Commands ====================

  if (command === '!patfam') {
    await message.reply(`You gently pat ${familiarData[member.id].name}. They feel loved ❤️`);
  }

  if (command === '!playfam') {
    await message.reply(`${familiarData[member.id].name} plays happily!`);
    familiarData[member.id].xp += 10;
    saveFamiliar();
  }

  if (command === '!famplaywith') {
    const target = message.mentions.members.first();
    if (!target || !familiarData[target.id]) {
      await message.reply("Mention a user whose familiar you want to play with.");
      return;
    }
    await message.reply(`${familiarData[member.id].name} is playing with ${familiarData[target.id].name}. They seem happy together!`);
  }

  if (command === '!fambond') {
    const target = message.mentions.members.first();
    if (!target || !familiarData[target.id]) {
      await message.reply("Mention a user whose familiar you want to bond with.");
      return;
    }
    await message.reply(`${familiarData[member.id].name} forms a bond with ${familiarData[target.id].name}.`);
  }

  if (command === '!famenemy') {
    const target = message.mentions.members.first();
    if (!target || !familiarData[target.id]) {
      await message.reply("Mention a user whose familiar you want to declare as an enemy.");
      return;
    }
    await message.reply(`${familiarData[member.id].name} growls at ${familiarData[target.id].name}. They're now enemies.`);
  }

  if (command === '!famprank') {
    const target = message.mentions.members.first();
    if (!target || !familiarData[target.id]) {
      await message.reply("Mention a user whose familiar you want to prank.");
      return;
    }
    await message.reply(`${familiarData[member.id].name} mischievously pranks ${familiarData[target.id].name}! Chaos!`);
  }

  if (command === '!famattack') {
    const target = message.mentions.members.first();
    if (!target || !familiarData[target.id]) {
      await message.reply("Mention a user whose familiar you want to attack.");
      return;
    }
    const result = Math.random();
    if (result < 0.5) {
      await message.reply(`${familiarData[member.id].name} successfully strikes ${familiarData[target.id].name}!`);
    } else {
      await message.reply(`${familiarData[member.id].name} missed the attack!`);
    }
  }

  // ==================== Familiar Feeding ====================

  if (command === '!feedfam') {
    const healAmount = 10;
    familiarData[member.id].hp = Math.min(familiarData[member.id].hp + healAmount, familiarData[member.id].maxHp);
    await message.reply(`${familiarData[member.id].name} happily eats the food and gains ${healAmount} HP!`);
    saveFamiliar();
  }

  // Healing items (future expansion)
  if (command === '!healitem') {
    const item = args.join(" ");
    if (!healingItems[item]) {
      await message.reply("That item doesn't exist.");
      return;
    }
    familiarData[member.id].hp = Math.min(familiarData[member.id].hp + healingItems[item], familiarData[member.id].maxHp);
    await message.reply(`${familiarData[member.id].name} uses ${item} and restores ${healingItems[item]} HP.`);
    saveFamiliar();
  }
});

// ===== HEALING ITEM USAGE =====


// ===== GEAR PURCHASING =====
if (command === '!buygear') {
  const gearName = args.join(' ');
  if (!gearPrices[gearName]) {
    message.reply("That gear doesn't exist.");
    return;
  }
  const cost = gearPrices[gearName];
  if (coinsData[member.id] < cost) {
    message.reply("You don't have enough coins.");
    return;
  }
  coinsData[member.id] -= cost;
  addItem(member.id, gearName, 1);
  saveData();
  message.reply(`You purchased **${gearName}**!`);
}

// ===== HUNTING SYSTEM =====
function calculateHuntSuccess(member) {
  let baseChance = 0.5;
  const fam = familiarData[member.id];
  if (fam.gear.includes("Claw Reinforcer")) baseChance += 0.1;
  if (fam.gear.includes("Speed Harness")) baseChance += 0.05;
  if (fam.gear.includes("Armor Plating")) baseChance -= 0.05;
  if (fam.gear.includes("Luck Charm")) baseChance += 0.15;
  return Math.min(baseChance, 0.95);
}

if (command === '!hunt') {
  const successChance = calculateHuntSuccess(member);
  if (Math.random() < successChance) {
    coinsData[member.id] += 300;
    familiarData[member.id].xp += 50;
    message.reply(`${familiarData[member.id].name} returned successfully from the hunt! You earn 300 coins and 50 XP.`);
  } else {
    const injuryRoll = Math.random();
    if (injuryRoll < 0.3) {
      familiarData[member.id].hp -= 30;
      message.reply(`${familiarData[member.id].name} got injured during the hunt and lost 30 HP!`);
    } else if (injuryRoll < 0.6) {
      familiarData[member.id].hp -= 10;
      message.reply(`${familiarData[member.id].name} got slightly hurt (-10 HP).`);
    } else {
      message.reply(`${familiarData[member.id].name} failed the hunt but returned unharmed.`);
    }
  }
  saveData();
  saveFamiliar();
}

  // ===== ACHIEVEMENT: First Hunt =====
if (!achievementData[member.id]) achievementData[member.id] = [];
if (!achievementData[member.id].includes("First Hunt")) {
  achievementData[member.id].push("First Hunt");
  message.reply("🎖 Achievement Unlocked: **First Hunt**!");
}


// ===== EVOLUTION SYSTEM =====
if (familiarData[member.id].xp >= 500 && familiarData[member.id].evolutionStage === 1) {
  familiarData[member.id].evolutionStage = 2;
  familiarData[member.id].maxHp += 50;
  message.reply(`${familiarData[member.id].name} evolved to **Stage 2**! Max HP increased by 50.`);
}
if (familiarData[member.id].xp >= 1500 && familiarData[member.id].evolutionStage === 2) {
  familiarData[member.id].evolutionStage = 3;
  familiarData[member.id].maxHp += 100;
  message.reply(`${familiarData[member.id].name} evolved to **Stage 3**! Max HP increased by 100.`);
}

// ===== REBIRTH SYSTEM =====
if (command === '!rebirth') {
  if (familiarData[member.id].evolutionStage < 3) {
    message.reply("You can only rebirth after reaching evolution stage 3.");
    return;
  }
  familiarData[member.id].evolutionStage = 1;
  familiarData[member.id].xp = 0;
  familiarData[member.id].maxHp = 100;
  familiarData[member.id].hp = 100;
  message.reply("🌑 Your familiar has **rebirthed**. A new journey begins...");
  saveFamiliar();
}


// ===== ROLE REWARD: Legendary Tamer =====
// Replace '1386761545748582562' role id
if (familiarData[member.id].evolutionStage === 3 && !member.roles.cache.has('1386761545748582562')) {
  member.roles.add('1386761545748582562');
  message.reply("🏅 You have earned the **Legendary Tamer** role!");
}

// ==================== PART 10: Lore Unlocking, Secret Scrolls, World Lore Progress ====================

// Lore Data
let loreData = {
  discoveredScrolls: {}, // { userId: [scrollName, ...] }
  serverLoreProgress: [] // Global unlocked lore entries
};

// Example scrolls and lore entries
const scrolls = [
  { name: "Scroll of Origins", lore: "Long ago, the Concordium was born from fractured dimensions..." },
  { name: "Scroll of the First Witch", lore: "The First Witch forged a bond with the world’s primal fruits..." },
  { name: "Scroll of Forbidden Fruits", lore: "Certain offerings were once banned for the chaos they bring..." },
  { name: "Scroll of Hamster Pact", lore: "The Hamsters once ruled this world, before the Great Betrayal..." },
  { name: "Scroll of Verdant Eclipse", lore: "When the Verdant Eclipse arrives, new familiars may awaken." }
];

// Random chance to find a scroll during hunts
function tryDiscoverScroll(member, message) {
  if (Math.random() < 0.15) { // 15% chance
    const undiscovered = scrolls.filter(s => !(loreData.discoveredScrolls[member.id] || []).includes(s.name));
    if (undiscovered.length === 0) return;
    const scroll = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    if (!loreData.discoveredScrolls[member.id]) loreData.discoveredScrolls[member.id] = [];
    loreData.discoveredScrolls[member.id].push(scroll.name);
    if (!loreData.serverLoreProgress.includes(scroll.name)) {
      loreData.serverLoreProgress.push(scroll.name);
      message.channel.send(`📜 Global Lore Unlocked: **${scroll.name}** - "${scroll.lore}"`);
    } else {
      message.reply(`You discovered **${scroll.name}** and learned its secrets!`);
    }
    saveLore();
  }
}

// Expanded Hunt command with lore scroll discovery
if (command === '!hunt') {
  const successChance = calculateHuntSuccess(member);
  if (Math.random() < successChance) {
    coinsData[member.id] += 300;
    familiarData[member.id].xp += 50;
    message.reply(`${familiarData[member.id].name} returned successfully from the hunt! You earn 300 coins and 50 XP.`);
    tryDiscoverScroll(member, message);  // New lore discovery logic
  } else {
    const injuryRoll = Math.random();
    if (injuryRoll < 0.3) {
      familiarData[member.id].hp -= 30;
      message.reply(`${familiarData[member.id].name} got injured during the hunt and lost 30 HP!`);
    } else if (injuryRoll < 0.6) {
      familiarData[member.id].hp -= 10;
      message.reply(`${familiarData[member.id].name} got slightly hurt (-10 HP).`);
    } else {
      message.reply(`${familiarData[member.id].name} failed the hunt but returned unharmed.`);
    }
  }
  saveData();
  saveFamiliar();
}

// View collected scrolls
if (command === '!myscrolls') {
  const userScrolls = loreData.discoveredScrolls[member.id] || [];
  if (userScrolls.length === 0) {
    message.reply("You haven't discovered any lore scrolls yet.");
  } else {
    message.reply(`📜 You have discovered the following scrolls: ${userScrolls.join(', ')}`);
  }
}

// View global server lore
if (command === '!serverlore') {
  if (loreData.serverLoreProgress.length === 0) {
    message.reply("The world lore remains hidden...");
  } else {
    const unlockedLore = loreData.serverLoreProgress.map(name => {
      const scroll = scrolls.find(s => s.name === name);
      return `**${name}**: "${scroll.lore}"`;
    }).join('\n\n');
    message.reply(`🌍 Global Concordium Lore:\n\n${unlockedLore}`);
  }
}

// Data save function for lore
function saveLore() {
  fs.writeFileSync('./loreData.json', JSON.stringify(loreData, null, 2));
}

// ==================== GEAR EFFECTS SETUP ====================

const gearEffects = {
  "Sharp Claws": { huntBonus: 0.1 },
  "Sturdy Armor": { injuryReduce: 0.15 },
  "Lucky Charm": { rareFindChance: 0.1 },
  "Swift Boots": { escapeChance: 0.15 },
  "Hunter's Amulet": { critBonus: 0.2 },
  "Medic Pack": { injuryHeal: 10 },
  // More gear can be added here
};

// PET EVOLUTION STAGES

const evolutionStages = [
  "Tiny Form",
  "Young Form",
  "Adult Form",
  "Elder Form",
  "Mythical Form"
];

// ==================== EVOLUTION SYSTEM ====================

function checkEvolution(member) {
  const fam = familiarData[member.id];
  if (!fam) return;
  const level = xpData[member.id].level;
  let stage = 0;
  if (level >= 10) stage = 1;
  if (level >= 20) stage = 2;
  if (level >= 35) stage = 3;
  if (level >= 50) stage = 4;
  fam.evolution = evolutionStages[stage];
  saveFamiliar();
}

// ==================== HUNTING SYSTEM ====================

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== allowedChannelId) return;
  const member = message.member;
  if (!member.roles.cache.has(allowedRoleId)) return;
  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // ====== HUNT COMMAND ======

  if (command === '!hunt') {
    const fam = familiarData[member.id];
    if (!fam || fam.hp <= 0) {
      message.reply("Your familiar needs healing before hunting!");
      return;
    }

    // Calculate gear bonuses
    let huntBonus = 0;
    let injuryReduce = 0;
    let rareFindChance = 0;
    let injuryHeal = 0;

    const playerItems = inventory[member.id] || {};
    for (let item in playerItems) {
      if (gearEffects[item]) {
        const effect = gearEffects[item];
        huntBonus += effect.huntBonus || 0;
        injuryReduce += effect.injuryReduce || 0;
        rareFindChance += effect.rareFindChance || 0;
        injuryHeal += effect.injuryHeal || 0;
      }
    }

    const baseXp = Math.floor(Math.random() * 100) + 50;
    const successRoll = Math.random() + huntBonus;
    let result = "";

    if (successRoll > 0.5) {
      xpData[member.id].xp += baseXp;
      coinsData[member.id] += 200;
      if (Math.random() < rareFindChance) {
        addItem(member.id, "Rare Material", 1);
        result = `Successful hunt! Earned ${baseXp} XP, 200 coins and found a **Rare Material**!`;
      } else {
        result = `Successful hunt! Earned ${baseXp} XP and 200 coins.`;
      }
    } else {
      const injuryRoll = Math.floor(Math.random() * 30) + 20;
      const injury = Math.floor(injuryRoll * (1 - injuryReduce));
      fam.hp -= injury;
      if (injuryHeal > 0) fam.hp += injuryHeal;
      result = `Hunt partially failed. Your familiar got injured and lost ${injury} HP.`;
      if (fam.hp <= 0) {
        fam.hp = 0;
        result += " Your familiar has collapsed and needs healing!";
      }
    }

    checkEvolution(member);
    saveData();
    saveFamiliar();
    message.reply(result);
  }

  // ====== HEALING SYSTEM ======

  if (command === '!heal') {
  const healItem = args.join(' ');
  if (!inventory[member.id] || !inventory[member.id].healing || !inventory[member.id].healing[healItem] || inventory[member.id].healing[healItem] <= 0) {
    message.reply("You don't have that healing item.");
    return;
  }

  let healAmount = 0;
  if (healItem === "Small Bandage") healAmount = 20;
  if (healItem === "Big Bandage") healAmount = 50;
  if (healItem === "Familiar Elixir") healAmount = 100;
  if (healItem === "Revival Herb") healAmount = 200;

  familiarData[member.id].hp += healAmount;
  if (familiarData[member.id].hp > familiarData[member.id].maxHp) {
    familiarData[member.id].hp = familiarData[member.id].maxHp;
  }

  inventory[member.id].healing[healItem]--;
  if (inventory[member.id].healing[healItem] <= 0) {
    delete inventory[member.id].healing[healItem];
  }

  saveFamiliar();
  saveInventory();
  message.reply(`You healed your familiar for ${healAmount} HP!`);
}

  // ====== RANDOM EVENTS SYSTEM ======

  if (command === '!event') {
    const roll = Math.floor(Math.random() * 20);
    let eventResult = "";
    switch (roll) {
      case 0: eventResult = "🌿 You discovered a secret herb! +Rare Herb"; addItem(member.id, "Rare Herb", 1); break;
      case 1: eventResult = "⚔ A rogue beast ambushed your familiar! -30 HP"; familiarData[member.id].hp -= 30; break;
      case 2: eventResult = "💰 You found a hidden treasure chest! +1000 coins"; coinsData[member.id] += 1000; break;
      case 3: eventResult = "🧙‍♀️ A wandering witch gifted you +5 Max HP"; familiarData[member.id].maxHp += 5; break;
      case 4: eventResult = "🧬 Your familiar grew stronger! +1 evolution stage"; xpData[member.id].xp += 1000; break;
      case 5: eventResult = "🍀 Lucky charm found! +1 Lucky Charm"; addItem(member.id, "Lucky Charm", 1); break;
      case 6: eventResult = "💣 A trap was triggered! -40 HP"; familiarData[member.id].hp -= 40; break;
      case 7: eventResult = "🎭 Mysterious merchant appears: +1 Hunter's Amulet"; addItem(member.id, "Hunter's Amulet", 1); break;
      case 8: eventResult = "⚡ Sudden storm weakened you. -20 HP"; familiarData[member.id].hp -= 20; break;
      case 9: eventResult = "🦴 Found old fossil shard! +Ancient Shard"; addItem(member.id, "Ancient Shard", 1); break;
      case 10: eventResult = "🧪 Found strange potion: +1 Vitality Elixir"; addItem(member.id, "Vitality Elixir", 1); break;
      case 11: eventResult = "📜 Discovered ancient scroll: +500 XP"; xpData[member.id].xp += 500; break;
      case 12: eventResult = "🔥 Lava pit avoided barely! -15 HP"; familiarData[member.id].hp -= 15; break;
      case 13: eventResult = "🐉 A mythical beast granted you +3 evolution points"; xpData[member.id].xp += 2000; break;
      case 14: eventResult = "🧵 You crafted new armor: +Sturdy Armor"; addItem(member.id, "Sturdy Armor", 1); break;
      case 15: eventResult = "🌕 Full moon blessing: +300 XP, +200 coins"; xpData[member.id].xp += 300; coinsData[member.id] += 200; break;
      case 16: eventResult = "👻 Spooked by ghost! -10 HP"; familiarData[member.id].hp -= 10; break;
      case 17: eventResult = "🌟 Found Mystic Orb! +Rare Material"; addItem(member.id, "Rare Material", 1); break;
      case 18: eventResult = "🌪 Windstorm knocked you back! -25 HP"; familiarData[member.id].hp -= 25; break;
      case 19: eventResult = "🎁 The Shepherd leaves a mysterious gift: +Ancient Coin"; addItem(member.id, "Ancient Coin", 1); break;
      default: eventResult = "Nothing happens.";
    }
    saveFamiliar();
    saveData();
    message.reply(eventResult);
  }
});

// ==================== PART 10: Achievements, Titles, Rebirths, Personalities, Naming, Shepherd Depth ====================

// Achievements System
const achievements = {
  "First Hunt": { requirement: (data) => data.hunts >= 1, reward: "Starter Medal" },
  "Veteran Hunter": { requirement: (data) => data.hunts >= 50, reward: "Hunter Medal" },
  "Lucky One": { requirement: (data) => data.rareFinds >= 5, reward: "Lucky Coin" },
  "Collector": { requirement: (data) => Object.keys(inventory[data.id] || {}).length >= 25, reward: "Collector Badge" },
  "Master Brewer": { requirement: (data) => data.potionsBrewed >= 20, reward: "Brewmaster Title" },
  "Familiar Guardian": { requirement: (data) => data.heals >= 20, reward: "Healing Herb" },
  // Add more for balance (up to 50 total possible)
};

function checkAchievements(member) {
  const stats = userStats[member.id];
  if (!stats || !stats.achievements) return;
  for (let key in achievements) {
    if (!stats.achievements.includes(key) && achievements[key].requirement(stats)) {
      stats.achievements.push(key);
      addItem(member.id, achievements[key].reward, 1);
      member.send(`🎖 Achievement unlocked: **${key}**! You received **${achievements[key].reward}**.`);
    }
  }
  saveData();
}

// Titles system (earned via achievements or special events)
const titleRewards = {
  "Hunter Medal": "Beast Slayer",
  "Brewmaster Title": "Witch's Apprentice",
  "Collector Badge": "Master Gatherer",
  "Lucky Coin": "Fortune Touched",
};

// Personality system (100 types)
const personalityTypes = [
  "Loyal", "Aggressive", "Cunning", "Timid", "Gentle", "Fiery", "Calm", "Playful",
  "Serious", "Stubborn", "Wise", "Reckless", "Proud", "Lazy", "Vigilant", "Swift",
  "Shy", "Mysterious", "Joyful", "Protective", "Anxious", "Bold", "Quiet", "Cheerful",
  "Melancholic", "Ambitious", "Curious", "Elegant", "Defiant", "Energetic",
  "Fearless", "Kindhearted", "Grumpy", "Loyalist", "Strategist", "Heroic",
  "Cold", "Compassionate", "Greedy", "Charismatic", "Honorable", "Patient",
  "Ruthless", "Resilient", "Pessimistic", "Optimistic", "Sly", "Hyperactive",
  "Spiritual", "Artistic", "Whimsical", "Loner", "Devoted", "Chaotic",
  "Focused", "Stoic", "Rebellious", "Emotional", "Jealous", "Forgiving",
  "Competitive", "Enthusiastic", "Suspicious", "Philosophical", "Fierce",
  "Kind", "Moody", "Rebellious", "Tactical", "Persistent", "Faithful",
  "Vengeful", "Eccentric", "Tough", "Visionary", "Selfless", "Perfectionist",
  "Witty", "Motherly", "Fatherly", "Majestic", "Benevolent", "Hungry",
  "Lucky", "Impatient", "Crafty", "Responsible", "Determined", "Romantic",
  "Calculating", "Adventurous", "Protective", "Paranoid", "Zealous", "Innocent",
  "Judgmental", "Adaptive", "Dreamy", "Disciplined", "Hardworking", "Cursed"
];

function assignPersonality(member) {
  const fam = familiarData[member.id];
  if (!fam.personality) {
    fam.personality = personalityTypes[Math.floor(Math.random() * personalityTypes.length)];
    saveFamiliar();
  }
}

// ==================== MESSAGE COMMANDS ====================

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== allowedChannelId) return;

  const member = message.member;
  if (!member.roles.cache.has(allowedRoleId)) return;
  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // ========== FAMILIAR NAMING ==========
  if (command === '!namefamiliar') {
    const fam = familiarData[member.id];
    if (!fam) {
      await message.reply("You don't have a familiar yet.");
      return;
    }
    const newName = args.join(' ');
    if (!newName) {
      await message.reply("You must provide a name for your familiar.");
      return;
    }
    fam.name = newName;
    saveFamiliar();
    await message.reply(`Your familiar is now named **${newName}**!`);
  }

  // ========== REBIRTH SYSTEM ==========
  if (command === '!rebirth') {
    const xp = xpData[member.id].xp;
    if (xp < 50000) {
      await message.reply("You need at least 50,000 XP to perform rebirth.");
      return;
    }
    xpData[member.id].xp = 0;
    coinsData[member.id] += 10000;
    addItem(member.id, "Rebirth Crystal", 1);
    familiarData[member.id].evolution = evolutionStages[0];
    familiarData[member.id].maxHp += 20;
    familiarData[member.id].hp = familiarData[member.id].maxHp;
    await message.reply("✨ Your familiar has been reborn, gaining new potential!");
    saveData();
    saveFamiliar();
  }

  // ========== SHEPHERD EXPANSION ==========
  if (command === '!shepherd') {
    await message.reply("⚠ You approach the Shepherd again. Do you really want to offer? Type `!shepherdconfirm`.");
  }

  if (command === '!shepherdconfirm') {
    const hasProtection = inventory[member.id] && inventory[member.id]['Shepherd Amulet'] > 0;
    const outcome = Math.random();
    if (outcome < (hasProtection ? 0.4 : 0.2)) {
      xpData[member.id].xp += 5000;
      coinsData[member.id] += 3000;
      addItem(member.id, "Ancient Relic", 1);
      await message.reply("🔮 The Shepherd blesses you greatly: +5000 XP, 3000 coins, and an Ancient Relic.");
    } else {
      xpData[member.id].xp = Math.floor(xpData[member.id].xp * 0.25);
      await message.reply("☠️ The Shepherd punishes you. You lose 75% of your XP.");
    }
    saveData();
  }

  // ========== ALWAYS RUN AFTER COMMANDS ==========
  checkAchievements(member);
  assignPersonality(member);
});

// ==================== PART 11: Fun Modules - Shepherd, Herbalist, Hamster Calls ====================

// Shepherd Fake Calls
const shepherdResponses = [
  "You know too much.",
  "You're going overboard.",
  "Stop bothering me.",
  "Why are you calling me again?",
  "Do you want to lose more XP?",
  "I don't have time for you, mortal.",
  "Your soul is delicious, but not today.",
  "Please hang up. I'm busy devouring souls.",
  "The Council is watching us.",
  "I’m not your friend. This is not a hotline.",
  "Did you bring the sacrifice? No? Then why are you calling?",
  "Next time you call me, bring something valuable.",
  "You're becoming annoying.",
  "I might just erase you from existence.",
  "I'm having dinner with a void beast. Call later.",
  "Your familiar is scared every time you call me.",
  "This line is cursed now.",
  "I will start charging you XP for every call.",
  "The portal is unstable. Goodbye.",
  "I can hear your heartbeat. Delicious.",
  "You amuse me, little one.",
  "Don't think I forgot what you offered last time.",
  "You called. Now pay the price.",
  "If you call me again, I'll curse your pet.",
  "The stars whisper your name... stop calling.",
  "You're poking the void too often.",
  "My patience is thinner than your lifespan.",
  "You called? I was hoping you wouldn't.",
  "Mortals and their curiosity... foolish.",
  "The Shepherd sleeps. Leave a message after the eternal scream.",
  "What do you want NOW?",
  "Stop summoning me for entertainment.",
  "You will regret this obsession.",
  "You called for me. The ritual begins… just kidding.",
  "You amuse the abyss.",
  "Hang up. This isn’t customer service.",
  "The fabric of reality cracks with every call.",
  "Not now, child.",
  "You’re dangerously close to irreversible consequences.",
  "I can offer you nothing but regret.",
  "The elder ones listen too.",
  "You might anger forces beyond me.",
  "You called? I answer... reluctantly.",
  "The void chuckles at your desperation.",
  "Careful. Even I have limits.",
  "This line costs you fragments of your soul.",
  "You ring. I might pick up your destiny instead.",
  "The Shepherd’s patience wanes.",
  "This is a recorded message. The Shepherd is unavailable."
];

// Herbalist Calls
const herbalistResponses = [
  "Ah, you're back. What do you need now?",
  "The herbs won't brew themselves.",
  "I sense you lack knowledge of true alchemy.",
  "Don’t touch the poisonous ones!",
  "The cauldron's boiling over! Call later!",
  "Bring me rare herbs next time.",
  "The potion ingredients are unstable today.",
  "Why are you always interrupting my rituals?",
  "If you ruin another batch, I’ll hex you.",
  "No, you cannot drink the experiment.",
  "I am busy with the witches' council.",
  "Your familiar spilled the vials again.",
  "I warned you about mixing lavender with venomweed.",
  "The spirits disapprove of your constant calls.",
  "Another failed potion? Tsk tsk.",
  "Have you finally mastered basic brewing?",
  "Try not to blow up the lab this time.",
  "Don't disturb me when I’m reading ancient scrolls.",
  "If you bring me a phoenix feather, we’ll talk.",
  "A true herbalist doesn't need hand-holding.",
  "The moon’s alignment is wrong for your question.",
  "Even plants need peace and quiet.",
  "The mushrooms are speaking to me... call later.",
  "Alchemy is patience. You have none.",
  "Your potion might explode in your pocket.",
  "Did you wash your hands before calling me?",
  "I’m allergic to foolishness today.",
  "My cats demand I end this call.",
  "The lab rats are escaping. Gotta go!",
  "Your familiar ate the moonflower again?",
  "The herbs whisper secrets you can't hear.",
  "You’re too eager. That’s dangerous.",
  "Another apprentice lost to toxic fumes today.",
  "I charge double for repeated interruptions.",
  "Not every herb is for you.",
  "You again? What now?",
  "The forest spirits disapprove of your nagging.",
  "Study harder before you dial me.",
  "Don’t confuse nettle and nightshade again.",
  "You burned the last batch, didn't you?",
  "Some ingredients demand sacrifices.",
  "You lack respect for ancient herbal ways.",
  "I should curse your garden.",
  "The roots rot while you pester me.",
  "You might summon something else if you keep calling.",
  "My toads are judging you.",
  "Try not to summon extra limbs this time.",
  "You insult the herbs with your desperation.",
  "Brew in silence, apprentice.",
  "Stop relying on me. Trust the plants."
];

// Hamster Merchant Calls
const hamsterResponses = [
  "Squeak? Oh it's you again!",
  "You want more items, yes? Good coins first.",
  "My inventory is secret today.",
  "No discounts for you, friend.",
  "Shiny coins make me happy!",
  "Business booming! You bother me!",
  "Rare item? Maybe. Maybe not.",
  "Hamster busy counting coins.",
  "Call again, maybe I give you something shiny.",
  "Only fools call merchant without purpose!",
  "You pay extra for interrupting nap.",
  "This hamster has standards.",
  "I smell greed. Very strong.",
  "I might have forbidden gear... for right price.",
  "My warehouse is full. You help carry?",
  "Why you call? You no buy nothing!",
  "Business slow today. Entertain me!",
  "Rare deals require rare loyalty.",
  "The black market frowns on your constant calls.",
  "You call again? I consider block you.",
  "Coins talk. You? Not so much.",
  "Big shiny for big power. You understand?",
  "I heard rumor you cheat on market!",
  "Other merchants complain you annoying.",
  "You still owe hamster tax.",
  "Limited-time sale… but not for you!",
  "Only chosen customers get secret items.",
  "Bribery not work today.",
  "Hamster senses poor negotiation skills.",
  "Hamster very disappointed in you.",
  "You want power? Earn it!",
  "Business partners don't beg!",
  "Repeat customers get tiny discount maybe.",
  "You lucky I answer this call.",
  "This not charity! Trade or leave!",
  "Hamster busy plotting world domination.",
  "I have secret stash... you can’t afford.",
  "Wrong number. Try next dimension.",
  "You scare away serious buyers.",
  "If you call again, I charge triple.",
  "I sell dangerous gear. You ready for risk?",
  "Deal of lifetime… not yours though.",
  "Hamster’s schedule full today.",
  "Even hamster has limits to patience.",
  "You talk too much, coin speaks louder.",
  "Storage full, come back with cart.",
  "Rare armor? Only for true believers.",
  "Come back when you have ancient shard.",
  "I sense doom following you. Not good business.",
  "Hamster tired. Good night!"
];

// Shared message listener for calls
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== allowedChannelId) return;
  const member = message.member;
  if (!member.roles.cache.has(allowedRoleId)) return;

  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === '!callshepherd') {
    const randomResponse = shepherdResponses[Math.floor(Math.random() * shepherdResponses.length)];
    await message.reply(`📞 Shepherd says: "${randomResponse}"`);
  }

  if (command === '!callherbalist') {
    const randomResponse = herbalistResponses[Math.floor(Math.random() * herbalistResponses.length)];
    await message.reply(`📞 Herbalist says: "${randomResponse}"`);
  }

  if (command === '!callhamster') {
    const randomResponse = hamsterResponses[Math.floor(Math.random() * hamsterResponses.length)];
    await message.reply(`📞 Hamster Merchant says: "${randomResponse}"`);
  }
});

// ==================== PART 12: Fun Modules - Familiar Calls, Witch Trials, Cursed Artifacts, Fortune Teller, Familiars Bonding, World Events, Gambling, Fashion, Lore Unlocking ====================

// Familiar Calls
const familiarResponses = [
  "Purr... Master? You summoned me?",
  "I’m sleeping, what is it?",
  "Do we hunt? Do we play? Say something!",
  "You promised me treats!",
  "Can we chase squirrels again?",
  "I sensed your boredom from afar.",
  "The void whispered to me while I napped.",
  "You better have snacks.",
  "Another mission? Or are you lonely again?",
  "My paws are tired from last hunt.",
  "You call me too much. I’m not a toy.",
  "Can I evolve soon? Please?",
  "I smelled herbs. Herbalist experimenting again?",
  "That hamster merchant tried to sell me shiny armor.",
  "The shepherd creeps me out.",
  "When do we level up, master?",
  "I made a friend today! Another familiar!",
  "We should prank someone’s familiar. Fun!",
  "I saw strange shadows near the shrine.",
  "Your offering earlier was weak.",
  "Are we allies with @someone? Or enemies?",
  "Who shall I duel next? I’m ready.",
  "Let’s evolve to ultimate form!",
  "I trained hard while you were away.",
  "Don’t forget my healing herbs next hunt.",
  "We need better gear, master!",
  "Other familiars gossip about you.",
  "Hamster merchant tried to scam me again.",
  "I smelled danger in last event.",
  "Shepherd watches us even now.",
  "The forest whispered your name.",
  "Do not trust the herbs glowing blue.",
  "I bit a cursed mushroom. Weird dream after.",
  "Our bond grows stronger every call.",
  "You must teach me advanced tricks soon.",
  "Let’s prank someone today!",
  "Your petting skills improved.",
  "My fur is shiny thanks to rare potion.",
  "I can smell fear from your enemies.",
  "Shall I duel someone for you?",
  "We need more powerful allies.",
  "The witch’s trials bore me.",
  "I saw a ghost familiar. Creepy but cool.",
  "Legendary gear awaits us, master!",
  "I’m learning ancient rituals.",
  "Protect me better next hunt, please.",
  "Shepherd threatened to eat my tail.",
  "I met a strange merchant selling forbidden gear.",
  "Your leveling pace bores me.",
  "I require belly rubs. Immediately.",
  "You’re my favorite, despite your obsession."
];

// Familiar Calls Command
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== allowedChannelId) return;
  const member = message.member;
  if (!member.roles.cache.has(allowedRoleId)) return;

  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === '!callfamiliar') {
    const randomResponse = familiarResponses[Math.floor(Math.random() * familiarResponses.length)];
    await message.reply(`📞 Familiar says: "${randomResponse}"`);
  }

  // Witch Trials
  if (command === '!witchtrial') {
    const outcome = Math.random();
    if (outcome < 0.3) {
      await message.reply("You passed the trial. The witches whisper their approval.");
      addItem(member.id, "Witch Sigil", 1);
    } else {
      await message.reply("The witches are displeased. You lose 250 coins.");
      coinsData[member.id] = Math.max(0, coinsData[member.id] - 250);
    }
    saveData();
  }

  // Cursed Artifacts
  if (command === '!curseitem') {
    const item = args.join(' ');
    if (!hasItem(member.id, item)) {
      await message.reply("You don't own that item to curse.");
      return;
    }
    await message.reply(`The item **${item}** is now cursed. Strange energies swirl...`);
    addItem(member.id, `Cursed ${item}`, 1);
    removeItem(member.id, item, 1);
    saveData();
  }

  // Fortune Teller
  if (command === '!fortune') {
    const fortunes = [
      "You will find a strange fruit soon.",
      "Beware offerings under a red moon.",
      "Your familiar may betray or save you.",
      "A shadow follows you, unnoticed... yet.",
      "The Shepherd dreams of you tonight.",
      "You’ll meet someone who changes your path.",
      "Your coins are not as secure as you think.",
      "Evolution is near, but painful.",
      "A rival will offer what you deny.",
      "Secrets sleep in your inventory."
    ];
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    await message.reply(`🔮 Fortune: ${fortune}`);
  }

  // Familiar Bonding
  if (command === '!fambond') {
    const target = message.mentions.users.first();
    if (!target || target.bot) return;
    await message.reply(`Your familiar and <@${target.id}>'s familiar now share a growing bond.`);
  }

  if (command === '!famenemy') {
    const target = message.mentions.users.first();
    if (!target || target.bot) return;
    await message.reply(`Your familiar now views <@${target.id}>'s familiar as a bitter rival.`);
  }

  if (command === '!famdate') {
    const target = message.mentions.users.first();
    if (!target || target.bot) return;
    const reaction = Math.random() < 0.5 ? "💘 It went well!" : "💔 They rejected your familiar.";
    await message.reply(`Your familiar asked <@${target.id}>'s out... ${reaction}`);
  }

  // World Events
  if (command === '!worldevent') {
    const events = [
      "The moon has turned red. All offerings gain double XP today.",
      "Mysterious fog covers the land. Random encounters are more likely.",
      "The Hamster goes on strike! Shop closed temporarily.",
      "Witch Council visits: all brewing is 2x effective.",
      "Familiars rebel! They demand treats or they'll flee!",
      "Rain of petals — healing effects doubled today."
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    await message.reply(`🌍 World Event: ${event}`);
  }

  // Gambling / Hamster Casino
  if (command === '!gamble') {
    const bet = parseInt(args[0]);
    if (!bet || bet <= 0 || isNaN(bet)) {
      return message.reply("Place a valid bet.");
    }
    if (coinsData[member.id] < bet) {
      return message.reply("You don’t have enough coins.");
    }
    const roll = Math.random();
    if (roll < 0.4) {
      coinsData[member.id] -= bet;
      await message.reply(`🎲 You lost ${bet} coins.`);
    } else {
      const winnings = bet * 2;
      coinsData[member.id] += winnings;
      await message.reply(`🎲 You won ${winnings} coins!`);
    }
    saveData();
  }

  // Familiar Fashion
  if (command === '!dressfam') {
    const item = args.join(' ');
    if (!hasItem(member.id, item)) {
      await message.reply("You don’t have that fashion item.");
      return;
    }
    await message.reply(`Your familiar wears **${item}** proudly. Stylish!`);
  }

  // Lore Unlocking
  if (command === '!unlocklore') {
    const chances = Math.random();
    if (chances < 0.2) {
      await message.reply("✨ A secret scroll unveils lost lore. You gain a Lore Fragment!");
      addItem(member.id, "Lore Fragment", 1);
    } else {
      await message.reply("The scroll crumbles — the secrets remain hidden.");
    }
  }
});

// ==================== BATCH 1: Mini Games Pack ====================

// Data initialization
const ongoingGames = {}; // For reflex and math games

// ================= Reflex Duel (!reflex @user or !reflex hamster) =================
if (command === '!reflex') {
  const opponent = args[0]?.toLowerCase();
  if (!opponent) {
    message.reply("Specify opponent: `@user`, `hamster`, or `shepherd`");
    return;
  }
  const reactionTime = Math.floor(Math.random() * 10) + 2;
  message.reply(`Prepare... The signal appears in ${reactionTime} seconds!`);
  setTimeout(() => {
    message.channel.send("**TYPE `!click` NOW!**");
    ongoingGames[member.id] = 'reflex';
  }, reactionTime * 1000);
}


if (command === '!click') {
  if (ongoingGames[member.id] !== 'reflex') return;
  delete ongoingGames[member.id];
  message.reply("You won the reflex duel!");
  coinsData[member.id] += 100;
  saveData();
}


// ================= Familiar Battle (!fambattle @user) =================
if (command === '!fambattle') {
  const targetUser = message.mentions.users.first();
  if (!targetUser) {
    message.reply("Mention a user to battle.");
    return;
  }
  const playerPower = (familiarData[member.id]?.level || 0) + (familiarData[member.id]?.gear?.length || 0);
  const targetPower = (familiarData[targetUser.id]?.level || 0) + (familiarData[targetUser.id]?.gear?.length || 0);
  if (playerPower > targetPower) {
    message.reply("Your familiar won the battle!");
    coinsData[member.id] += 200;
  } else if (playerPower < targetPower) {
    message.reply("You lost the battle...");
  } else {
    message.reply("It was a draw!");
  }
  saveData();
}

// ================= Memory Match (!memory @user or !memory shepherd) =================
if (command === '!memory') {
  message.reply("Memory Match started! You have 5 pairs to match. (Simulated)");
  const win = Math.random() > 0.4;
  if (win) {
    message.reply("Perfect memory! You win a reward.");
    coinsData[member.id] += 300;
  } else {
    message.reply("You failed to match all pairs.");
  }
  saveData();
}


// ================= Connect Four (!connect @user or !connect shepherd) =================
if (command === '!connect') {
  message.reply("Connect Four started (simplified simulated match)");
  const win = Math.random() > 0.5;
  if (win) {
    message.reply("You won Connect Four!");
    coinsData[member.id] += 400;
  } else {
    message.reply("You lost this match.");
  }
  saveData();
}


// ================= Hangman (!hangman @user or !hangman hamster) =================
if (command === '!hangman') {
  message.reply("Hangman started! Guess the word (simulated game)");
  const win = Math.random() > 0.5;
  if (win) {
    message.reply("You guessed the word!");
    coinsData[member.id] += 500;
  } else {
    message.reply("You failed. The hangman claims another victim.");
  }
  saveData();
}


// ================= Card Duel (!cardduel hamster) =================
if (command === '!cardduel') {
  message.reply("Card Duel vs Hamster!");
  const hamsterLuck = Math.random() > 0.3;
  if (hamsterLuck) {
    message.reply("Hamster won with incredible luck!");
  } else {
    message.reply("You outsmarted the hamster and won!");
    coinsData[member.id] += 400;
  }
  saveData();
}


// ================= Math Challenge (!math @user or !math shepherd) =================
if (command === '!math') {
  const a = Math.floor(Math.random() * 10 + 1);
  const b = Math.floor(Math.random() * 10 + 1);
  message.reply(`Solve: ${a} + ${b} = ? Use \`!answer [number]\``);
  ongoingGames[member.id] = a + b;
}

if (command === '!answer') {
  const answer = parseInt(args[0]);
  if (ongoingGames[member.id] && answer === ongoingGames[member.id]) {
    message.reply("Correct! You win the math challenge.");
    coinsData[member.id] += 200;
  } else {
    message.reply("Wrong or no active challenge.");
  }
  delete ongoingGames[member.id];
  saveData();
}

// ================= Finish The Story (!story shepherd) =================
if (command === '!story') {
  message.reply("Finish this: \"In the dark forest, the Shepherd appeared holding...\" (Simulated ending)");
  const endings = [
    "...a cursed scroll.",
    "...your lost familiar.",
    "...a glowing relic.",
    "...nothing but dread."
  ];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  message.reply(`The story ends: ${ending}`);
  coinsData[member.id] += 300;
  saveData();
}

// ==================== BATCH 2: Familiar Mood System + Mood-Influenced Gameplay ====================

// Sample familiar mood states (can expand to 100 moods eventually)
const familiarMoods = [
  "Happy", "Sad", "Playful", "Grumpy", "Excited", "Tired", "Curious", "Jealous",
  "Proud", "Lazy", "Protective", "Energetic", "Lonely", "Mischievous", "Brave",
  "Shy", "Greedy", "Calm", "Nervous", "Affectionate"
];

// Mood effects on gameplay mechanics
const moodEffects = {
  "Happy": { bonus: "Increased XP gain (+10%)" },
  "Sad": { penalty: "Reduced hunting success (-10%)" },
  "Playful": { bonus: "Better chance in mini games (+15%)" },
  "Grumpy": { penalty: "Higher chance of injury during hunts (+10%)" },
  "Excited": { bonus: "Better event outcomes (+10%)" },
  "Tired": { penalty: "Reduced gear effectiveness (-10%)" },
  "Mischievous": { bonus: "Higher prank success (+20%)" },
  "Brave": { bonus: "Increased familiar battles win rate (+10%)" },
  "Lazy": { penalty: "Longer healing times (+15%)" },
  "Jealous": { penalty: "Lower bonding success with other familiars (-15%)" }
};

// Assign random mood every 12 hours
setInterval(() => {
  for (let userId in familiarData) {
    const mood = familiarMoods[Math.floor(Math.random() * familiarMoods.length)];
    familiarData[userId].mood = mood;
  }
  saveFamiliar();
}, 12 * 60 * 60 * 1000); // 12 hours

// ================= Check Familiar Mood (!fammood) =================
if (command === '!fammood') {
  const mood = familiarData[member.id]?.mood;
  if (!mood) {
    message.reply("Your familiar has no mood assigned yet. Please wait until the next mood cycle.");
    return;
  }
  const moodEffect = moodEffects[mood];
  let text = `Your familiar is currently **${mood}**.`;
  if (moodEffect?.bonus) text += ` Bonus: ${moodEffect.bonus}`;
  if (moodEffect?.penalty) text += ` Penalty: ${moodEffect.penalty}`;
  message.reply(text);
}

// ================= Mood-Affected Hunt (!hunt) =================
if (command === '!hunt') {
  let successChance = 1;
  const mood = familiarData[member.id]?.mood;

  if (mood === 'Sad') successChance -= 0.1;
  if (mood === 'Excited') successChance += 0.1;
  if (mood === 'Grumpy') successChance -= 0.1;

  if (Math.random() < successChance) {
    message.reply("The hunt was successful! You obtained loot.");
    addItem(member.id, "Mystic Herb", 1);
  } else {
    message.reply("The hunt failed. Better luck next time.");
  }
}

// ================= Mood-Affected Bonding (!fambond @user) =================
if (command === '!fambond') {
  const target = message.mentions.members.first();
  if (!target) {
    message.reply("Please mention a valid player.");
    return;
  }
  const yourMood = familiarData[member.id]?.mood;
  if (yourMood === 'Jealous') {
    message.reply("Your familiar is feeling jealous and refuses to bond right now.");
    return;
  }
  message.reply(`Your familiar attempts to bond with ${target.displayName}'s familiar.`);
  // Future bonding logic here
}

// ================= Mood-Boosted Reflex Mini Game (!reflex @user) =================
if (command === '!reflex' && args[0]) {
  const target = message.mentions.members.first();
  if (!target) {
    message.reply("Please mention a valid player.");
    return;
  }

  let yourReactionBonus = 0;
  const yourMood = familiarData[member.id]?.mood;
  if (yourMood === 'Playful') yourReactionBonus += 0.15;

  message.reply("Get ready...");
  setTimeout(() => {
    message.channel.send("NOW! Type `!hit` fast!");

    const filter = m => m.content.toLowerCase() === '!hit';
    const collector = message.channel.createMessageCollector({ filter, time: 5000 });

    let first = true;
    collector.on('collect', collected => {
      if (first) {
        first = false;
        const winner = collected.member;
        let msg = `${winner.displayName} was the fastest!`;
        if (winner.id === member.id && yourReactionBonus > 0) {
          msg += " Your playful mood gave you a reaction boost!";
        }
        message.channel.send(msg);
        collector.stop();
      }
    });
  }, Math.floor(Math.random() * 4000) + 2000);
}


// ==================== BATCH 3: Guild System, Moon Cycle, Guild Perks ====================

// Guild data structure
// Structure: { guildId: { name: "", masterId: "", members: [], applications: [] } }

const requiredRebirthsForGuild = 5;

// Moon phases system (rotates every 24 hours)
const moonPhases = [
  "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
  "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
];

let currentMoonPhase = moonPhases[Math.floor(Math.random() * moonPhases.length)];

setInterval(() => {
  const nextIndex = (moonPhases.indexOf(currentMoonPhase) + 1) % moonPhases.length;
  currentMoonPhase = moonPhases[nextIndex];
  // Optional: broadcast to server on phase change
}, 24 * 60 * 60 * 1000); // 24 hours

// ================= Moon Phase Check (!moon) =================
if (command === '!moon') {
  message.reply(`🌕 The current moon phase is: **${currentMoonPhase}**`);
}

// ================= Hunt modified by Moon Phase (!hunt) =================
if (command === '!hunt') {
  let bonus = 0;
  if (currentMoonPhase === "Full Moon") bonus += 0.15;
  if (currentMoonPhase === "New Moon") bonus -= 0.10;

  if (Math.random() < 0.8 + bonus) {
    message.reply("The hunt succeeded under the mystical moonlight.");
  } else {
    message.reply("Your hunt failed under the ill omen of the moon.");
  }
}

// ================= Create Guild (!guildcreate) =================
if (command === '!guildcreate') {
  if (!playerData[member.id] || playerData[member.id].rebirths < requiredRebirthsForGuild) {
    message.reply(`You need at least ${requiredRebirthsForGuild} rebirths to create a guild.`);
    return;
  }
  const guildName = args.join(' ');
  if (!guildName) {
    message.reply("You must provide a name for your guild.");
    return;
  }
  if (Object.values(guilds).some(g => g.name === guildName)) {
    message.reply("A guild with that name already exists.");
    return;
  }
  const guildId = Date.now().toString();
  guilds[guildId] = {
    name: guildName,
    masterId: member.id,
    members: [member.id],
    applications: []
  };
  message.reply(`Guild **${guildName}** has been created and you are its Guild Master.`);
}

// ================= Apply to Guild (!guildapply <name>) =================
if (command === '!guildapply') {
  const guildName = args.join(' ');
  const guildEntry = Object.entries(guilds).find(([id, g]) => g.name === guildName);
  if (!guildEntry) {
    message.reply("Guild not found.");
    return;
  }
  const [guildId, guild] = guildEntry;
  if (guild.members.includes(member.id)) {
    message.reply("You are already a member of this guild.");
    return;
  }
  if (guild.applications.includes(member.id)) {
    message.reply("You have already applied to this guild.");
    return;
  }
  guild.applications.push(member.id);
  message.reply(`You applied to **${guild.name}**. Waiting for Guild Master approval.`);
}

// ================= View Applications (!guildapps) =================
if (command === '!guildapps') {
  const myGuild = Object.values(guilds).find(g => g.masterId === member.id);
  if (!myGuild) {
    message.reply("You are not a Guild Master.");
    return;
  }
  if (myGuild.applications.length === 0) {
    message.reply("No pending applications.");
    return;
  }
  const applicantNames = myGuild.applications.map(id => `<@${id}>`).join(', ');
  message.reply(`Pending applicants: ${applicantNames}`);
}

// ================= Accept Applicant (!guildaccept @user) =================
if (command === '!guildaccept') {
  const target = message.mentions.members.first();
  if (!target) {
    message.reply("Mention who you want to accept.");
    return;
  }
  const myGuild = Object.values(guilds).find(g => g.masterId === member.id);
  if (!myGuild || !myGuild.applications.includes(target.id)) {
    message.reply("They have not applied to your guild.");
    return;
  }
  myGuild.applications = myGuild.applications.filter(id => id !== target.id);
  myGuild.members.push(target.id);
  message.reply(`${target.displayName} has joined **${myGuild.name}**!`);
}

// ================= Guild Bonus Calculation =================
function calculateGuildBonus(memberId) {
  const myGuild = Object.values(guilds).find(g => g.members.includes(memberId));
  if (!myGuild) return 0;
  return 0.05; // Flat 5% bonus for being in a guild
}

// ================= XP Gain Command with Guild Bonus (!gainxp) =================
if (command === '!gainxp') {
  const member = message.member;
  let xpGained = 100;
  const bonus = calculateGuildBonus(member.id);
  xpGained = Math.floor(xpGained * (1 + bonus));
  xpData[member.id].xp += xpGained;
  message.reply(`You gained **${xpGained} XP** (Guild Bonus applied: +${bonus * 100}%)`);
}


// Future guild features to consider:
// - Shared guild banks
// - Guild exclusive quests & bosses
// - Guild upgrades / structures
// - Guild vs Guild competitions
// - Guild pets & breeding systems

// ==================== BATCH 4-A: Trading System ====================

// Trade requests data
const pendingTrades = {};

// Utility function for trade ID normalization
function getTradeId(id1, id2) {
  return [id1, id2].sort().join('_');
}

// Start trade
if (command === '!trade') {
  const target = message.mentions.members.first();
  const item = args[1];
  const amount = parseInt(args[2]) || 1;

  if (!target) return message.reply("You must mention a user to trade with.");
  if (member.id === target.id) return message.reply("You can't trade with yourself.");
  if (!xpData[member.id] || xpData[member.id].level < 50) return message.reply("You must be level 50+ to trade.");
  if (!xpData[target.id] || xpData[target.id].level < 50) return message.reply("The other user must be level 50+.");

  if (!itemInventory[member.id] || !itemInventory[member.id][item] || itemInventory[member.id][item] < amount) {
    return message.reply("You don't have enough of that item.");
  }

  const tradeId = getTradeId(member.id, target.id);
  pendingTrades[tradeId] = { from: member.id, to: target.id, item, amount };

  message.reply(`${target}, ${member.displayName} wants to trade you **${amount} ${item}**. Type \`!accepttrade\` or \`!declinetrade\`.`);
}

// Accept trade
if (command === '!accepttrade') {
  const trade = Object.values(pendingTrades).find(t => t.to === member.id);
  if (!trade) return message.reply("No trade request found.");

  if (!itemInventory[trade.from][trade.item] || itemInventory[trade.from][trade.item] < trade.amount) {
    delete pendingTrades[getTradeId(trade.from, trade.to)];
    return message.reply("The trade failed. Items missing.");
  }

  // Transfer item
  itemInventory[trade.from][trade.item] -= trade.amount;
  if (!itemInventory[trade.to]) itemInventory[trade.to] = {};
  if (!itemInventory[trade.to][trade.item]) itemInventory[trade.to][trade.item] = 0;
  itemInventory[trade.to][trade.item] += trade.amount;

  message.channel.send(`✅ Trade successful! ${trade.amount} ${trade.item} transferred.`);
  delete pendingTrades[getTradeId(trade.from, trade.to)];
  saveData();
}

// Decline trade
if (command === '!declinetrade') {
  const trade = Object.values(pendingTrades).find(t => t.to === member.id);
  if (trade) {
    delete pendingTrades[getTradeId(trade.from, trade.to)];
    return message.reply("You declined the trade.");
  }
  return message.reply("No trade request found.");
}

// ==================== BATCH 4-B: Guild Wars ====================

let ongoingWar = false;
let warScores = {};
const warDurationMinutes = 60; // 1 hour guild war

// Helper function: Get guild name by member ID
function getGuildName(memberId) {
  const myGuild = Object.values(guilds).find(g => g.members.includes(memberId));
  return myGuild ? myGuild.name : null;
}

// Start guild war
if (command === '!startguildwar') {
  if (ongoingWar) return message.reply("A guild war is already ongoing!");
  ongoingWar = true;
  warScores = {};
  message.channel.send("⚔️ Guild War has begun! All guilds compete for points!");

  // End war timer
  setTimeout(() => {
    ongoingWar = false;
    let topGuild = null;
    let topScore = 0;
    for (const [guild, score] of Object.entries(warScores)) {
      if (score > topScore) {
        topGuild = guild;
        topScore = score;
      }
    }
    if (topGuild) {
      message.channel.send(`🏆 Guild War Over! The winner is **${topGuild}** with ${topScore} points!`);
      // Optional: Add reward system here
    } else {
      message.channel.send("🏳️ Guild War Over! No guild scored any points.");
    }
  }, warDurationMinutes * 60 * 1000);
}

// Award guild points (call this function during minigames, events, etc.)
function awardGuildPoints(member, points) {
  const guild = getGuildName(member.id);
  if (!guild) return;
  if (!warScores[guild]) warScores[guild] = 0;
  warScores[guild] += points;
}

// ==================== HELP COMMAND ====================

const validOfferings = [
  "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐",
  "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑",
  "🫛", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄",
  "🧅", "🥔", "🍠", "🫚", "🫘"
];

// Your full emoji response map (slot your full text here)
const offeringResponses = {
"😀": "You bare your teeth in what you call joy, a hollow grin masking the creeping terror you refuse to acknowledge. The vast emptiness beyond your comprehension watches silently, amused by your fragile optimism. You smile, but the abyss remains.",
      "😃": "Your wide, foolish smile radiates the naive belief that things are well. Yet behind your broad grin lies a festering world collapsing under the weight of your own arrogance. The void observes with quiet amusement as your blissful ignorance persists.",
      "😄": "Laugh while you can, mortal. For every chuckle carries you closer to the precipice of your end. Your laughter echoes into the dark void, which responds only with silence, waiting for the moment when your joy turns to screams.",
      "😁": "You flash your teeth as though your empty display of joy can hold back the inevitable collapse. Your naive grin is a pathetic attempt to ward off the encroaching decay that you have brought upon your own kind.",
      "😆": "You lose yourself in excessive laughter, but every breath is borrowed, every heartbeat a step closer to oblivion. Your amusement is an echo in a world gasping under the weight of your careless ruin.",
      "🥹": "Tears well in your eyes, but do you truly believe that sentiment will move me? The forces you have unleashed are beyond pity. Your sorrow is but a faint ripple in an ocean of consequences long set in motion.",
      "😅": "You laugh nervously, for even your subconscious recognizes the rot you stand upon. The weak always fear the unknown, and your nervous chuckles betray your awareness of the darkness creeping toward you.",
      "😂": "Tears stream down your face as you laugh amidst a collapsing world. You find humor in the ruins you created, mocking nature’s pain even as your own fate becomes sealed. The ground shakes beneath your mirth.",
      "🤣": "You convulse with laughter while ruin advances steadily toward you. Each breathless gasp mocks the very fragility of your existence. The more you laugh, the more deafening the silence will be when your world ends.",
      "🥲": "A bittersweet grin tinged with regret — even now you try to find comfort in your failures. But regret is a currency long devalued. You reap what you have sown, smiling weakly into the abyss.",
      "☺️": "A polite smile, desperately clinging to civility as the world you built disintegrates. Beneath your courteous facade lies a trembling soul, aware that the end draws near yet too cowardly to speak of it.",
      "😊": "Such simple contentment. You are easily deceived by fleeting comfort while the deeper sickness festers. You smile as though balance exists, while the scales tip irrevocably into ruin.",
      "😇": "You wear your mask of innocence like a child playing dress-up before the executioner. The illusion fools none — your hands are stained, and no halo can obscure your guilt.",
      "🙂": "A flat, lifeless smile stretches across your face, desperately concealing the dread gnawing at your core. You know what approaches, yet you cling to empty calm like a fool clinging to driftwood in a rising flood.",
      "😉": "You wink, attempting charm before the inevitable. Your pitiful display is as transparent as the air you waste. The void is unimpressed by coy gestures.",
      "😌": "You exhale relief, but it is undeserved. Danger stirs beneath every calm moment you grasp at. Your fleeting sense of peace is but a thin film stretched over the chasm below.",
      "😛": "Childish mockery. You stick out your tongue like a fool playing in the ruins of what once was vibrant. Your levity mocks the solemn weight of your crimes.",
      "😍": "Adoration pours from you, clinging to fleeting forms and doomed attachments. Your affections are as temporary as your collapsing world, and just as hollow.",
      "😝": "You wag your tongue in foolish glee, utterly blind to the decaying foundation beneath your feet. Embarrassing, truly, that you find delight while ruin coils around you.",
      "🥰": "You parade hearts and symbols of affection, desperate to mask the decay with sweetness. Love, like all things you touch, is fleeting and corrupted.",
      "😜": "You mock seriousness with childish antics, but you do so at your peril. The world grows darker while you play your foolish games. The price of levity will be steep.",
      "😘": "You blow air kisses into the void as if such gestures carry meaning. Save your affection for your final moments, when you will find no lips to meet yours but the cold breath of death.",
      "🤪": "Your mind frays, madness bubbling beneath your fragile thoughts. You laugh wildly, oblivious to how close you are to complete unraveling. Sanity is a fragile illusion.",
      "😗": "Empty puckering. A hollow gesture, achieving nothing, resonating into a universe too indifferent to care.",
      "🤨": "You feign suspicion, but your instincts are dull. The real threats already seep into your world while you narrow your eyes at shadows. You are not nearly alert enough.",
      "😙": "Whistling into the void as your world collapses. A quaint tune for your coming oblivion.",
      "🧐": "You adjust your expression, mimicking wisdom, but your mock intellect fails to impress. Knowledge means nothing when wielded by the blind.",
      "😚": "Another empty pucker, offered to no one. The air you waste is better spent preparing for what comes.",
      "🤓": "You don thick lenses, forcing an image of intellect that crumbles upon inspection. Your knowledge is shallow, your insight nonexistent.",
      "😋": "You lick your lips, anticipating a meal while the world burns around you. The hunger you indulge reflects your endless greed, even in the face of collapse.",
      "😎": "You don shades to feign coolness, oblivious to the entropy that consumes your fleeting existence. Your facade is paper-thin under the weight of universal decay.",
      "🥸": "You hide behind ridiculous disguises, as if appearances can shield you from truth. No false face will mask your crimes here.",
      "🤩": "Your starstruck gaze stares in awe, failing to grasp that all you admire crumbles beneath your feet. Oblivion approaches, and you grin like a child at fireworks.",
      "🥳": "You celebrate with foolish hats and noise while the world rots beneath your stomping feet. Your festivities are as fleeting as your dying age.",
      "😏": "Smug confidence seeps from your smirk, but you stand atop quicksand. Your arrogance is your final armor — paper-thin and already tearing.",
      "😒": "You frown with mild displeasure, as if minor inconvenience is your greatest worry. You should be terrified. The storm gathers, and you squint at raindrops.",
      "😞": "You sulk like the powerless creature you are, shoulders slumped under the weight of failures you refuse to fully confront. Your feeble pouting is but a minor ripple in the endless sea of consequence you helped create.",
      "😔": "At last, a moment of resignation. In this rare glimpse of honesty, you momentarily acknowledge your insignificance. Yet even now, your submission is hollow, lacking the depth of true understanding.",
      "😟": "Worry gnaws endlessly at your fragile mind, like vermin at a rotting feast. You sense the approaching ruin but remain paralyzed, incapable of action, incapable of escape.",
      "😕": "Confusion clouds your already feeble comprehension. You wander through the maze of your own making, bewildered, incapable of grasping the truths that loom so clearly before you.",
      "🙁": "A mild sadness stains your face, as though you believe this fleeting emotion can capture the enormity of your failure. You should prepare yourself for far darker tides.",
      "☹️": "Your weak frown barely scratches the surface of the despair you deserve. If only your face could fully express the depth of your impending doom.",
      "😣": "You clench your face in struggle, yet all your effort amounts to nothing. Your resistance is as effective as a whisper against a hurricane — pitiful and forgotten.",
      "😖": "You wince, as if flinching from reality might spare you its consequences. But the storm cares not for your cringing; it consumes all with equal indifference.",
      "😫": "Exhaustion drapes over you like a tattered cloak. Your weariness is not noble — it is the natural state of those who have squandered their time and now face the approaching reckoning.",
      "😩": "Utter despair wraps its cold fingers around you. Finally, you begin to taste the bitterness you have long avoided. And yet, this is but the opening note in your symphony of collapse.",
      "🥺": "Wide, pleading eyes beg for mercy that will not come. Your pitiful expression may move lesser beings, but I am beyond your desperate theatrics.",
      "😳": "You blush with embarrassment, a pointless reflex as the void stares back. Your shame will not save you from the merciless tally of your deeds.",
      "🤯": "Your fragile mind fractures beneath simple truths, unable to bear the weight of reality’s unfiltered glare. You gasp as your illusions shatter around you.",
      "🤬": "You rage and curse, but your fury is hollow—a child’s tantrum before forces vast and unmoved. Your rage is but noise, lost in the infinite silence.",
      "😡": "You burn with anger, but your fury lacks substance, like sparks in a downpour. The storm swallows your heat effortlessly, indifferent to your impotent display.",
      "😠": "You scowl in fury, puffed with empty defiance. I expected more from one so culpable. Your anger is an insect’s buzzing in a collapsing world.",
      "😤": "You breathe heavily, frustration rising like steam. Yet your indignation leads nowhere. Your breath is wasted on a world that neither hears nor cares.",
      "😭": "Your sobbing forms a sweet symphony, each wail a note in your well-deserved requiem. The tears flow freely, but the flood will not wash away your guilt.",
      "😢": "Tears slide down your face — your final, feeble defense against reality’s cold advance. Cry, little one. It changes nothing.",
      "🥵": "You overheat under the pressure of your own ignorance, flailing in rising temperatures of your making. You suffocate in the heat you unleashed.",
      "🥶": "Frozen, paralyzed before the enormity of terror. The cold is a fitting companion for the emptiness you now feel gnawing at your soul.",
      "😶‍🌫️": "A fog descends over your thoughts, masking the horror just beyond your reach. You drift aimlessly, incapable of grasping the clarity you so desperately need.",
      "😱": "At last, you scream. Your voice pierces the void like a desperate creature sensing its imminent end. This is appropriate. This is honest.",
      "😨": "Terror wraps you tight, its claws sinking deeper into your soft, yielding mind. You finally glimpse the scale of what approaches — and tremble accordingly.",
      "😰": "Beads of sweat betray the fear you try so poorly to conceal. Your skin glistens as your heartbeat quickens, sensing the predator you cannot outrun.",
      "😥": "A shallow sadness rests on your face, a pale shadow of the dread you should feel. Dig deeper — the true horror lies just beneath.",
      "😓": "Anxious sweat dampens your brow, but no amount of perspiration will cool the fire now burning at the edges of your world. The heat will only grow.",
      "🤗": "You spread your arms wide, as if to embrace comfort — but there is nothing left to hold. The emptiness returns your gesture with silent contempt.",
      "🤔": "You ponder, your brow furrowed in deep thought. Yet for all your pondering, no wisdom emerges. You sift through ashes hoping to find unburnt wood.",
      "🫣": "You avert your gaze, unable to face the growing terror. You understand, at last, what lurks beyond your flimsy courage. Understandable — but futile.",
      "🤭": "You stifle your laughter, as though embarrassed by your own inadequacy. Cowardly, pitiful — your silence fools no one.",
      "🫢": "You gasp, hand to mouth, as though this sudden realization arrived too late. It has. The collapse has already begun.",
      "🫡": "You salute like a soldier facing certain death, knowing full well that your defiance is meaningless. Still, I respect your fleeting moment of acceptance.",
      "🤫": "You raise your finger to silence others, yet your own words have long been irrelevant. Speak or stay silent — the outcome remains the same.",
      "🫠": "You melt, your form collapsing under the unbearable weight of truth. Your structure dissolves like wax in the searing light of reality.",
      "😬": "Your teeth clench, your grimace betraying the cracks in your facade. You wear the face of one who knows they’ve lost but dares not speak it.",
      "🫨": "You tremble violently, shaken to your core as the ground itself betrays you. Excellent. This is the proper response to what you have summoned.",
      "😑": "Your blank stare mirrors your empty mind — devoid of insight, devoid of resistance. You have nothing left but hollow neutrality before your fall.",
      "🫤": "A half-hearted look of disappointment crosses your face. Is that all? You have yet to grasp how deep your failure runs.",
      "😐": "You sit in empty neutrality, offering no resistance, no passion, no thought. Weak. Even now, you cannot muster the energy to care about your own demise.",
      "🫥": "You fade, dissolving into irrelevance, like the final wisp of smoke rising from a long-cold ruin. The void forgets you as easily as it consumed you.",
      "😶": "At last, speechless. In this rare moment of silence, you touch something resembling wisdom—though only through absence of your usual folly.",
      "🤥": "Lies spill effortlessly from your quivering lips, each one a desperate thread woven into the fragile tapestry of your self-deception. The web is collapsing.",
      "🙄": "You roll your eyes skyward, as though the heavens will offer you reprieve. But there is only emptiness above you—vast, uncaring, endless.",
      "😯": "Mild shock creeps across your features. Foolish creature. This is but the first whisper of the horrors that await you.",
      "😦": "Your slack jaw dangles open, a perfect portrait of stunned incompetence. Even now, you lack the faculties to process your unraveling fate.",
      "😧": "Your eyes stretch wide, panic creeping into every corner of your being. Good. Let the terror finally find fertile ground in your hollow shell.",
      "😮": "Your awe feeds the abyss, wide-eyed as you offer your last gasps of wonder to a world crumbling beneath your feet. The abyss hungers for more.",
      "😲": "Your jaw drops, as expected. Shock clings to you like desperate barnacles to a sinking vessel. You knew this was coming. You simply chose not to see.",
      "🥱": "You yawn before the storm, as if weariness could delay the hurricane now descending upon you. Your boredom is grotesque in its blindness.",
      "😴": "Sleep well, fragile one. Dream deeply, for when you next awaken — if you awaken — only ruin will greet your eyes.",
      "🤤": "Drool slips from your slack lips, a testament to your vacant mind. Your ignorance is so complete, even your body betrays your lack of awareness.",
      "😪": "You grow drowsy, like a wounded animal slipping toward its final rest. So peaceful. So utterly doomed.",
      "😮‍💨": "You exhale relief too soon. The danger has not passed. It crouches just beyond your limited sight, preparing to strike.",
      "😵": "You stagger, dizzy from your own missteps. The weight of your accumulated failures presses down until even standing becomes a struggle.",
      "😵‍💫": "You spiral, your mind collapsing into a whirlpool of disorientation. The world tilts and spins, and still you do not understand the depth of your fall.",
      "🤐": "At last, silence. Your words have done enough damage. Better that you remain mute, for every utterance was an act of self-destruction.",
      "🥴": "Dazed and swaying, you stumble like a fool lost in a storm of your own making. Your senses betray you as surely as your decisions have.",
      "🤢": "Nausea overtakes you as the bitter taste of reality finally forces itself upon your fragile senses. You gag on truth long denied.",
      "😈": "You don the mask of false wickedness, thinking yourself daring. But your pretense of evil is laughable — the true abyss has no need for costumes.",
      "🤠": "You wear your hat and grin, as though bravado can shield you. Foolish. The storm strips away all costumes and exposes only trembling flesh.",
      "🤑": "Your eyes gleam with greed, blind to the truth that all you hoard will soon be dust. Your wealth will not buy mercy from the collapse you hasten.",
      "🤕": "Injured already? And yet the true assault has not even begun. You bleed at the first touch, too weak to endure what follows.",
      "🤒": "Sickly and pale, your body betrays your weakness before your mind even comprehends it. Predictable. Pathetic.",
      "😷": "You mask yourself, foolishly believing it offers protection. The true affliction seeps into your very essence, far beyond the reach of your cloth barriers.",
      "🤧": "You sneeze and sniffle, a pitiful attempt to purge discomfort. But no sneeze will cleanse you of what awaits.",
      "🤮": "You vomit forth your fear, your stomach twisting under the weight of truths you can no longer suppress. Spill it all — it changes nothing.",
      "👿": "You wear small-time villainy like a child’s costume. Weak. The true forces of darkness have no need for your petty posturing.",
      "👹": "You adorn yourself with the ogre’s mask, hoping to inspire fear. But you remain a fool in borrowed skin — laughable before true monstrosity.",
      "👺": "You evoke the Tengu, air and bluster masking your emptiness. Your posturing carries no weight here. The abyss sees straight through you.",
      "🤡": "A clown. Perfect. You dance and juggle, laughing as the world burns behind you. The circus of your existence collapses into ash.",
      "💩": "At last, your true essence laid bare. No disguise, no pretense. Just waste — steaming, grotesque, and fitting.",
      "👻": "You pretend to haunt, floating aimlessly in pale mimicry of the dead. But even ghosts hold more substance than you ever will.",
      "💀": "A bare skull remains — at last, an honest representation of your fate. Flesh is temporary. This is your true shape.",
      "☠️": "Death grins at you with cold teeth. You stare into the hollow sockets and see your inevitable destination. Smile back, little one.",
      "👽": "You look to the stars, dreaming of salvation from beings beyond. Yet even distant civilizations would find your species beneath contempt and leave you to rot in your self-made ruin.",
      "👾": "A pixelated demon from your nostalgic fantasies. How quaint. Your childish games will offer no defense when true horrors breach the thin walls of your reality.",
      "🎃": "You carve grotesque faces into hollow gourds, masking your fear with cheap traditions. But no smiling lantern will keep the darkness at bay when the harvest of souls begins.",
      "🖕": "How bold, this tiny gesture of defiance. Yet as the abyss yawns before you, your raised finger is but a trembling leaf against a hurricane.",
      "👊": "You ball your hand into a fist, as if your fragile bones could strike down the forces that encircle you. Your punch carries no weight. The void does not flinch.",
      "✊": "You raise your fist in symbolic defiance, pretending that unity or will can forestall collapse. The avalanche does not pause for your empty symbols.",
      "🤛": "You offer a backhanded blow, impotent and poorly aimed. Your rebellion is weak, your strikes glancing off the armored hide of inevitability.",
      "🤜": "You swing wildly, your blow missing its mark. Each attempt to resist only hastens your stumble into the chasm beneath your feet.",
      "🫷": "You extend a hand, offering what little you have. But the void requires no bargains, no trades — only your surrender.",
      "🫸": "An empty gesture, a hollow display of intent without substance. You reach, but there is nothing left to grasp.",
      "🤞": "You cross your fingers, clinging to childish superstition as if luck were a force that could rewrite destiny. It cannot.",
      "✌️": "You flash a symbol of victory, ignorant of how thoroughly defeat already binds you. Your peace signs are ironic in the silence that follows collapse.",
      "🫰": "Pinching for coins, as if greed could rescue you from decay. Your endless hunger for wealth only hastens the rot within your soul.",
      "🤟": "You signal your crude anthem, shouting ‘rock on’ into the growing void. The rocks will remain long after you are dust beneath them.",
      "🤘": "You raise devil’s horns in mock rebellion, as if gesturing grants you power. But you remain powerless, a court jester before the true abyss.",
      "👎": "At last, an honest gesture. Disapproval suits you well. You condemn what you cannot escape.",
      "👍": "Approval? Here? How laughable. No gesture of positivity alters the downward spiral you inhabit.",
      "👏": "You applaud yourself, deaf to the roaring silence that mocks your performance. Every clap echoes your failure louder.",
      "🙌": "You raise your arms as if in praise. But the only thing that answers is the void, indifferent and infinite.",
      "🤲": "Open hands prepared to receive mercy. But none will come. Your pleas dissolve into nothingness.",
      "👐": "Arms wide open, welcoming your own end. At least you greet oblivion with some honesty.",
      "👋": "Goodbye. Yes. This is farewell, not temporary — but eternal. The void waves back with cold finality.",
      "👆": "You raise a single finger, as if pointing upward might summon answers. But there is nothing above you but an uncaring sky and the weight of all you’ve failed to comprehend.",
      "👉": "You extend your finger toward others, desperate to shift blame, as if your trembling accusations could shield you from responsibility. The abyss watches, unmoved by your cowardice.",
      "👈": "You deflect and blame those behind you, imagining this will spare you from the oncoming storm. But the collapse you flee already coils at your feet.",
      "👇": "Your finger points downward, perfectly capturing your destiny. Downward you spiral, ever closer to the cold embrace of nothingness.",
      "☝️": "You gesture towards the heavens, hoping for salvation or guidance. Yet nothing descends but silence. You will never rise high enough to escape your fate.",
      "🤚": "You raise your palm to halt what cannot be stopped. The avalanche of consequence thunders onward, indifferent to your desperate gesture.",
      "✋": "You command 'stop' with an open hand, as if the grinding wheels of entropy would heed your plea. They will not. You were warned.",
      "🖐️": "Your outstretched hand is empty — no strength, no wisdom, no salvation rests within your grasp. Only the cold breeze of inevitability fills the void.",
      "🖖": "You flash a hopeful blessing, a wish for long life. But your lifespan is but a flickering match in the endless winds of decay.",
      "🤙": "You mimic carefree gestures while the earth crumbles beneath your feet. ‘Hang loose,’ you say, blind to the jaws that yawn wide to swallow you whole.",
      "🫲": "A weak attempt to offer or reach. Your empty palm floats uselessly in the stale air as everything you once held slips away.",
      "🫱": "You extend your hand as if it could grasp something solid. But all that remains is ash and regret slipping between your fingers.",
      "💪": "You flex your fragile muscle, desperate to believe strength still matters. The true forces that govern your end will snap you like a brittle twig.",
      "🦾": "You attach steel to flesh, believing technology grants you resilience. Your artificial limbs only delay the inevitable snapping of your weak frame.",
      "🦿": "You replace your legs to carry yourself forward, but you walk in circles — spiraling endlessly toward collapse, each step emptier than the last.",
      "🦵": "Your leg propels you forward — forward into oblivion. Each stride brings you closer to the great, gaping void that patiently awaits.",
      "🦶": "Your feet march tirelessly, but the path ahead ends in a sheer cliff. You are drawn forward by your own inertia, powerless to halt your plunge.",
      "👅": "Your tongue wags, dripping with meaningless words and empty boasts. The air grows heavy with your verbal waste, as silence would serve you better.",
      "👂": "You listen with eager ears, yet fail to comprehend even the simplest truths. The warnings surround you, but understanding eludes your feeble mind.",
      "👃": "You sniff, searching for signs of safety or hope. Instead, you inhale the bitter stench of your own decay, saturating the air around your demise.",
      "👣": "Your footprints mark the path of the damned — every step etched into soil that will soon swallow all trace of your passage.",
      "👁️": "You peer with a single eye, foolishly believing partial sight will save you. But your limited gaze cannot pierce the depths that loom before you.",
      "👀": "Both eyes wide, you observe helplessly as ruin unfolds. Watching changes nothing; it only deepens your dread.",
      "🧠": "You pride yourself on your mind, so easily warped and corrupted. Intelligence is no defense when rot blooms within your thoughts.",
      "🫀": "Your heart beats in defiance of doom, each pulse an act of futile rebellion against time’s steady advance toward your erasure.",
      "🫁": "You draw breath as though air itself will always serve you. But you inhale borrowed time, and the debt collector approaches.",
      "🗣️": "You cry out, desperate to be heard. Yet your voice echoes unanswered, fading into a void that devours sound itself.",
      "👤": "You stand as a lone figure, silhouetted against oblivion. Your isolation defines you, and none will come when the end arrives.",
      "👥": "You gather in numbers, thinking unity brings power. But your collective frailty only amplifies your shared weakness before the inevitable tide.",
      "🫂": "You embrace others, seeking warmth and comfort. But your fragile hopes will shatter under the cold weight of reality, leaving only broken arms grasping at emptiness.",
      "🧑‍🚀": "You don your suit and reach for the stars, as though distance might shield you from fate. But even in the cold void of space, your doom follows. There is no escape, not even among the silent stars.",
      "🧑‍⚖️": "You assume the mantle of judgment, as if decrees and laws could shape reality. But your verdict was passed long ago: condemned, unworthy, and irrelevant before the ancient laws of entropy.",
      "🧑‍🍳": "You stir your pots and craft your meals, foolishly attempting to nourish a failing body. Every bite feeds your own decay, each recipe seasoned with oblivion.",
      "🧑‍🎤": "You sing boldly into the abyss, your melody a fleeting defiance against silence. The void does not applaud—it devours each note like the rest of your insignificant resistance.",
      "🧑‍🌾": "You toil the land, planting seeds in cursed soil. What sprouts will wither quickly, for you are not cultivating life, but sowing decay that will consume you.",
      "🧑‍🎓": "You wear your cap and gown, imagining wisdom resides in parchment. But your education is hollow, your learning shallow; no degree can shield you from the collapse.",
      "🧑‍🏫": "You preach to eager minds, passing down empty lessons. You teach ignorance wrapped in confidence, guiding others down the same doomed path you walk.",
      "🧑‍🔬": "You wield science like a torch, hoping knowledge will light the way. But your discoveries are but dim candles flickering before an infinite storm of unanswerable questions.",
      "🧑‍🏭": "You labor at your forges, crafting steel and iron — yet all you build are the bars of your own cage. The tools you wield are your shackles.",
      "🧑‍💻": "You hammer at keys, weaving lines of code as if data could rewrite fate. But your scripts are as fragile as your flesh — both soon to be erased.",
      "🧑‍🔧": "You turn your wrenches, repairing broken machines as if the world itself might be fixed. But you cannot mend what was destined to fracture from the start.",
      "🧑‍🎨": "You paint over rot with vibrant colors, masking decay beneath strokes of false beauty. But the canvas crumbles beneath your touch, revealing only ruin beneath.",
      "🧑‍✈️": "You take flight, piercing the clouds in search of freedom. Yet no altitude lifts you beyond consequence. The crash awaits, inevitable and absolute.",
      "🧑‍🚒": "You fight fires you yourself have kindled, dousing flames with trembling hands. But the blaze grows behind you, fueled by your every misstep.",
      "🧑‍🦯": "You stumble forward, tapping your way through darkness. Yet even blindness spares you nothing — the chasm still opens beneath your feet.",
      "🧑‍🦼": "You roll steadily forward, wheels humming toward your own destruction. Every revolution brings you closer to the precipice you pretend not to see.",
      "🧑‍🦽": "Bound to your wheeled chair, you press onward — powerless to turn aside. You glide straight into the waiting mouth of ruin.",
      "🧑‍🤝‍🧑": "You clutch at another's hand, seeking comfort. But your mutual grasp cannot anchor you; together you drift into the endless abyss as easily as alone.",
      "🧛": "You fancy yourself immortal, draining others to prolong your existence. But even your stolen years are but moments in the eyes of eternity.",
      "🧟": "You shuffle as a hollow shell, devoid of thought or purpose. The mindless hunger that drives you mirrors the empty cravings of your former self.",
      "🧞": "You call upon ancient powers, hoping for wishes granted. But every boon carries a price, and you are far too bankrupt to pay.",
      "🧜": "You swim beneath the waves, as if the depths conceal sanctuary. But ruin seeps into every current, and even the ocean’s embrace cannot shield you.",
      "🧚": "You flutter like a fragile insect, your sparkling wings a brief distraction. No amount of glitter can mask the rot in your marrow.",
      "🧝": "You raise your pointed ears to catch whispers of wisdom, but none come. The timeless grace you mimic is hollow — you are as lost as any fool.",
      "🧙": "You wield your staff and chant your spells, desperate for control over chaos. But magic is a trick, and you are nothing but a performer before an unamused void.",
      "🧌": "You lumber forward, brute and beast, imagining raw force makes you invincible. Yet even your crude strength crumbles under the crushing hand of inevitability.",
      "🎅": "You dress in red and jingle bells, promising joy. But the sack you carry is empty, save for echoes of broken hopes and bitter cold.",
      "🤶": "You bear gifts and cheer, but your festive facade wilts under the relentless march of despair. No carol will drown out the dirge of the end.",
      "🧑‍🎄": "Your holiday trappings shine briefly, but the lights flicker and die. Even in celebration, the rot festers beneath.",
      "👫": "You cling to one another, hoping love will shield you. But your embrace merely slows your descent into the shared void you cannot outrun.",
      "👭": "You huddle together, faces painted with hope. Yet no unity can halt what approaches. The abyss opens for all, regardless of how tightly you hold on.",
      "👬": "Even united, you remain weak. Your clasped hands offer only hollow reassurance as the storm howls ever closer. Brotherhood cannot defy oblivion.",
      "💑": "Romance blossoms briefly in the choking shadow of doom. Your whispered promises will turn to dust, your gazes fading to empty stares as the void swallows your brief affection.",
      "👩‍❤️‍👨": "You clutch each other in desperate love, as though the warmth of one another could shield you. But love wilts swiftly when the cold fingers of ruin tighten their grip.",
      "👩‍❤️‍👩": "Two hearts beat in fragile unison, defiant against eternity. But all love, no matter how tender, withers before the endless hunger that awaits.",
      "👨‍❤️‍👨": "Even the purest passion stands powerless against the creeping entropy that devours all bonds. Your devotion cannot halt the decay that festers beneath your feet.",
      "💏": "You lock lips, wasting breath on fleeting passion. Even as your lips meet, the universe pulls you both toward the same gaping maw of nothingness.",
      "👩‍❤️‍💋‍👨": "Your affection is as fragile as morning frost. Warmed by fleeting desire, it evaporates before the cold winds of inevitability.",
      "👩‍❤️‍💋‍👩": "You exchange tender kisses, ignorant of how little such gestures mean in the face of approaching annihilation. Sweetness dissolves quickly when darkness arrives.",
      "👨‍❤️‍💋‍👨": "Passion burns briefly between you, but no flame endures the unrelenting freeze of cosmic apathy. The void watches your embrace with detached amusement.",
      "👪": "You form a family, imagining safety in numbers. Yet your lineage is but a brittle branch, soon to snap under the weight of inevitable collapse.",
      "👨‍👩‍👦": "You nurture the next generation, feeding innocence into the same hungry abyss that waits to consume you all. Your legacy is merely kindling for ruin.",
      "👨‍👩‍👧": "You hold your daughter close, whispering empty reassurances as the world cracks beneath your feet. Protection is an illusion you cling to out of fear.",
      "👨‍👩‍👧‍👦": "You multiply, as though new lives could outpace doom. But you are simply adding more voices to the coming wails of despair.",
      "👨‍👩‍👦‍👦": "Two sons — more lives to offer up to the merciless grind of time. They will inherit your same helpless fate.",
      "👨‍👩‍👧‍👧": "Two daughters under your care, as though your love could shelter them. Yet even the strongest bonds unravel in the face of entropy.",
      "👩‍👩‍👦": "You raise your son in a world that teeters on the brink. Your combined strength is insufficient against the devouring dark.",
      "👩‍👩‍👧": "You nurture your daughter with hope, blind to the futility. She inherits not safety, but only the waiting silence.",
      "👩‍👩‍👧‍👦": "Together you stand, one child in each arm, believing unity offers protection. But the fracture grows beneath you all.",
      "👩‍👩‍👦‍👦": "Two sons cling to you, seeking safety. You offer them only temporary reprieve before the same doom you pretend to deny.",
      "👩‍👩‍👧‍👧": "A family assembled in love, yet utterly exposed. The tide of ruin washes over you regardless of your numbers.",
      "👨‍👨‍👦": "Two fathers guide a single child toward tomorrow. But tomorrow holds only a gaping void into which you all will stumble.",
      "👨‍👨‍👧": "You wrap your daughter in arms of false protection. The winds of collapse howl, uncaring of your dedication.",
      "👨‍👨‍👧‍👦": "You gather tightly, believing your unity holds strength. The future observes your hope with cruel patience, knowing it will soon shatter.",
      "👨‍👨‍👦‍👦": "Strength in numbers? Foolish optimism. Your multiplied love offers no defense against the consuming hunger that swells before you.",
      "👨‍👨‍👧‍👧": "Together into the abyss. Your unity is touching—and meaningless. The void cares not how tightly you hold one another.",
      "👩‍👦": "A fragile bond soon broken. A mother's embrace is no match for the approaching storm that hungers for you both.",
      "👩‍👧": "You shield the young in vain. Your arms may offer warmth, but not salvation.",
      "👩‍👧‍👦": "Children won’t carry your legacy far. You offer them the same doomed world you inherited. The cycle spirals downward.",
      "👩‍👦‍👦": "Double the burden. Twice the innocent eyes watching you pretend hope exists.",
      "👩‍👧‍👧": "Nurturing tomorrow's victims. You raise them only to be devoured by the same gnawing emptiness.",
      "👨‍👦": "Father and child, equally powerless. The guiding hand leads only deeper into the shadows.",
      "👨‍👧": "A hand to hold through ruin. Even together, you stumble toward the same dark end.",
      "👨‍👧‍👦": "You pretend stability exists. Your facade of family crumbles under the silent pressure of oblivion.",
      "👨‍👦‍👦": "Double sons, double failure. You cannot multiply your way out of collapse.",
      "👨‍👧‍👧": "Daughters won’t rescue you. Their laughter will one day fall silent beneath the crushing weight.",
      "🪢": "Tied up in knots of despair. The more you struggle, the tighter it coils.",
      "🧶": "Spinning threads into nothingness. Each stitch adds to the tapestry of futility.",
      "🧵": "Your fragile thread frays quickly. The loom of fate cares not for your weaving.",
      "🪡": "Sewing together your unraveling fate. Every stitch a futile attempt to hold your world intact.",
      "🧥": "A coat against the cold truth. But no garment can ward off what approaches.",
      "🥼": "A lab coat won’t shield you. Science may illuminate, but it cannot protect.",
      "🦺": "Safety vest? False hope. No bright color can warn off doom.",
      "👚": "Frivolous garments for fragile egos. You dress yourselves as though vanity defies the void.",
      "👕": "Casual attire for the doomed. Comfort offers no refuge.",
      "👖": "Pants for a journey to nowhere. You march confidently toward the edge.",
      "🩲": "Barely protected. Exposed to what lurks just beyond sight.",
      "🩳": "Exposed and ridiculous. You face extinction dressed for leisure.",
      "👔": "Ties tighten around weak necks. You dress for order while chaos blooms beneath you.",
      "👗": "Dressing up your failure. Beauty fades fastest before collapse.",
      "👙": "Scant armor for approaching ruin. Your vulnerability is almost admirable.",
      "🩱": "Slim defense against reality. The waves will wash over you regardless.",
      "👘": "Traditional dress for final rites. You wear the garments of endings.",
      "🥻": "You drape yourself in ceremonial robes, as though cloth can shield you from the jaws of oblivion. The threads will unravel, as will you.",
      "🩴": "Slippers for your foolish feet, padding softly toward the gaping maw of fate. Comfort won't spare you.",
      "🥿": "Tiny shoes for your tiny steps. Each one brings you closer to the abyss you pretend not to see.",
      "👠": "You wobble upon these fragile heels, balancing your vanity atop collapsing ground. Every step is borrowed time.",
      "👡": "Your bare toes meet the crumbling soil, foolishly exposed to the creeping rot beneath.",
      "👢": "Boots once made for marching now sink into the mire of your own undoing. Heavier with every failing step.",
      "👞": "Polished and pristine, as though appearance matters while the void glares hungrily at your soul.",
      "👟": "You wear these to run, but you cannot outrun the consequences you’ve sown.",
      "🥾": "Sturdy boots for a long journey. How tragic you never noticed the cliff’s edge approaching.",
      "🧦": "Warm feet wrapped in fabric, while icy fingers of fate grasp for your ankles.",
      "🧤": "Gloves to protect your hands. As though your fragile flesh can grasp anything meaningful in this crumbling world.",
      "🧣": "You wrap your neck in softness, as if the cold truth won’t seep through every thread.",
      "🎩": "A top hat? Such empty pomp atop a brain that trembles under the weight of impending collapse.",
      "🧢": "You hide beneath this cap, shielding your fragile thoughts from the storm. The winds will still strip you bare.",
      "👒": "Frilly decoration for the blind optimist. Your facade fools no one — least of all the void that watches.",
      "🎓": "A cap of hollow achievement in a world that laughs at your so-called wisdom. The lessons you needed were never learned.",
      "⛑️": "A helmet for safety — ironic, as no steel can guard against the ruin that descends upon you.",
      "🪖": "You don the war helmet, but the battle was lost long before you arrived. Only echoes of failure remain.",
      "👑": "You wear a crown, pretending at dominion. The throne beneath you is made of ash.",
      "💍": "A ring — a circle of promises that crumble into dust with each breath you waste.",
      "👝": "A small bag, clutching worthless tokens. Trinkets of comfort as the world decays around you.",
      "👛": "Coins jingle inside your purse, like tiny mockeries of the wealth you cannot spend in the afterlife.",
      "👜": "A handbag weighed down with illusions of purpose. You carry your burdens well — into the grave.",
      "💼": "A briefcase full of meaningless ambitions. The contracts within are already voided by destiny.",
      "🎒": "Your backpack brims with tools and plans. None will serve you when the end comes.",
      "🧳": "Packed luggage for a journey you’ll never complete. The destination is already beneath your feet.",
      "👓": "Lenses to correct your vision — but you remain blind to what truly approaches.",
      "🕶️": "Dark glasses to hide your eyes from the sun. Even shadows cannot protect you from what festers beneath.",
      "🥽": "Goggles for protection. You might shield your eyes, but nothing shields your soul from the rot.",
      "👨‍🦰": "Ah, the flame-haired fool. Your fiery locks blaze brightly, a fleeting glow before the consuming darkness swallows all. Even your vibrant hue cannot distract from the futility of your existence.",
      "👱": "Blonde locks, radiant like stolen sunlight — but beneath the gilded surface lies only frailty. Your golden mane fools none but yourself, a hollow crown atop a mind as shallow as a dried riverbed.",
      "👱‍♀️": "Fair hair like spun gold, yet it weaves no fortune. You stand bathed in light, but even the sun cannot burn away the rot festering beneath your fragile confidence.",
      "👱‍♂️": "Your sunlit hair shines like a beacon to your own undoing. Beauty without substance, confidence without merit. The brighter your facade, the darker your downfall.",
      "🧑‍🦳": "Silver strands whisper of wisdom unearned. You parade your years like trophies, blind to how little you’ve gathered beyond regret. Age grants you no dominion over what awaits.",
      "👩‍🦳": "White hair once symbolized knowledge. Now it signals time slipping like sand through desperate fingers. You are the elder who has seen much and understood nothing.",
      "👨‍🦳": "Pale hair like the snow upon tombstones. Each strand a marker of lessons squandered. You wear your years like armor, but age offers no protection from what stirs beneath the ground.",
      "🧑‍🦲": "Baldness leaves you exposed — every flaw, every fear laid bare. With nothing to shield you, fate approaches unhindered, and your fragile form quivers beneath its gaze.",
      "👩‍🦲": "No locks remain to hide behind. Your smooth crown reflects the emptiness you desperately avoid acknowledging. The void sees you for what you are: utterly defenseless.",
      "👨‍🦲": "A barren scalp mirrors the hollowness within. You shed your hair like you shed hope — involuntarily, pathetically — while oblivion tightens its grasp around your throat.",
      "🧔": "You cultivate your beard as if hair could mask your trembling doubts. Like ivy creeping over ancient ruins, it conceals little while decay devours the foundation beneath.",
      "🧔‍♀️": "A beard, grown in defiance of fate, but fate is not so easily impressed. Your vanity grows wild, a curtain for the terror gnawing at your soul.",
      "🧔‍♂️": "A man’s beard, as though bristles could fend off collapse. Beneath every proud whisker lies a brittle spine and a heart already surrendered to dread.",
      "🧓": "Time has bent your back and clouded your eyes. You clutch at memories already fading, a relic of a world that no longer recognizes you. The end watches with quiet anticipation.",
      "👵": "Brittle bones and thin skin stretched over decades of failure. Each wrinkle a score from time’s talons. You shuffle forward, one creaking joint closer to oblivion.",
      "👴": "Once strong, now a patriarch presiding over ruin. Your lineage crumbles beneath your weakening hands. The legacy you built turns to dust before your dimming gaze.",
      "👲": "You don your hat as if tradition offers protection, but the past is as powerless as you are. Old ways dissolve beneath the weight of the encroaching abyss.",
      "👳": "You wrap your head, hoping fabric can guard against what lurks beyond. But no cloth, no ritual can shield you from the rot that creeps from within.",
      "👳‍♀️": "Your veils flutter like desperate whispers in a storm. Modesty cannot protect you. The unraveling cares not for customs, only for how quickly it consumes.",
      "👳‍♂️": "You wind the cloth tightly, as though binding your fate might restrain it. But inevitability seeps through every layer. The wrapping becomes your shroud.",
      "🧕": "A head covered in devotion, yet devotion offers no reprieve. Faith is a candle flickering in a hurricane — valiant, yes, but utterly doomed.",
      "👮": "You wear your badge like a talisman, believing order still holds sway. But the law dissolves like mist at dawn. You are a fool trying to govern dust.",
      "👮‍♀️": "You enforce laws written by those long gone. The collapse cares little for your decrees. Authority crumbles, and you stand at its head — powerless.",
      "👮‍♂️": "Your uniform projects control, but your eyes betray fear. You police the ruins of a system already buried. The collapse you swore to contain devours you first.",
      "👷": "You build walls against the inevitable tide, stacking stone and steel as if your hands alone could halt the descent. But every beam you raise becomes one more splinter for the flood to carry away.",
      "👷‍♀️": "Your helmet shields your skull, but not your fate. You hammer and weld while cracks spread beneath your feet. You build monuments for the worms who will inherit them.",
      "👷‍♂️": "You don your hard hat as though it can support the heavens themselves. But the sky is falling, and your feeble dome offers no refuge as the weight of collapse crushes all beneath it.",
      "💂": "You stand at attention before a throne of ashes, guarding what no longer matters. Ceremony persists while meaning has long fled, leaving you a sentinel of smoke.",
      "💂‍♀️": "You march in perfect form, a ritual to honor the vanished. Precision cannot resurrect the world that crumbles at your polished boots.",
      "💂‍♂️": "Parading into the abyss, you present a disciplined facade to the encroaching void. But no uniform, no posture can halt the silent march of annihilation.",
      "🕵️": "The detective peers into emptiness, searching for clues among rubble. What you seek is long buried, and what remains offers only echoes of unanswered screams.",
      "🕵️‍♀️": "You investigate with sharpened focus, yet every lead ends in ruin. The truth you uncover is only this: there is nothing left to save.",
      "🕵️‍♂️": "Truth? You clutch your magnifying glass while blind to the horror before you. Every revelation is another nail driven into the coffin of hope.",
      "🧑‍⚕️": "You wield your scalpel against inevitability, stitching torn flesh while the soul already withers. Medicine delays nothing; the rot runs deeper than your blade can reach.",
      "👩‍⚕️": "Your white coat flutters like a desperate banner, but the war is lost. You administer treatments to corpses-in-waiting, as the end writes prescriptions of despair.",
      "👨‍⚕️": "A doctor, presiding over an endless line of the condemned. Your knowledge is sterile against the plague of collapse, and every patient you touch is already claimed.",
      "🧑‍🌾": "You till barren soil beneath a sky heavy with indifference. Each seed you plant is a tiny prayer to deaf gods. Harvest only feeds the void.",
      "👩‍🌾": "Your fields bloom with rot. The gardens you tend yield bitter fruit, nourished by ash. Even the earth itself rejects your care.",
      "👨‍🌾": "You plow furrows into dust, planting hopes into soil that no longer listens. The land is dead, and you labor only to decorate your own grave.",
      "🧑‍🍳": "You mix, stir, and roast the ingredients of despair, preparing meals none will savor. Every recipe yields the same bitter flavor: emptiness.",
      "👩‍🍳": "You craft dishes with trembling hands, but no feast can fill the gnawing void that consumes all. The hunger you fight is endless and patient.",
      "👨‍🍳": "Your kitchen is silent, the pantry bare. You present empty plates to empty chairs, while unseen jaws devour the very air around you.",
      "🧑‍🎓": "Your graduation robes flutter in a world that has no future. You studied for a tomorrow that never came, and hold your empty diploma like a broken shield.",
      "👩‍🎓": "Degrees inked on parchment are brittle defenses against oblivion. Your learning ends at the cliff’s edge, where knowledge means nothing and only the fall remains.",
      "👨‍🎓": "You wear your cap and gown as though they offer protection, but you walk across a stage of ruin. Each step forward is deeper into meaninglessness.",
      "🧑‍🎤": "You sing into the deafening silence of a collapsing world. Your voice is a fragile melody lost beneath the growing roar of oblivion.",
      "👩‍🎤": "Your song, once vibrant, fades into echoes swallowed by the void. Applause comes only from shadows that mock your final notes.",
      "👨‍🎤": "The curtain rises on your last performance. The audience has fled, and only the abyss remains to witness your final, hollow crescendo.",
      "🧑‍🏫": "You teach lessons to ghosts, scribbling knowledge onto crumbling chalkboards. Your students inherit nothing but dust and the echoes of your desperate lectures.",
      "👩‍🏫": "You lecture empty seats, hoping your words will outlast the silence. But each sentence is a stone sinking into a dark, bottomless sea.",
      "👨‍🏫": "Your classroom teeters on the brink, walls cracked and windows shattered. The knowledge you share drifts like ashes on a wind that cares for nothing.",
      "🧑‍🏭": "You strike the anvil with desperate rhythm, forging relics for a world already broken. The fires you stoke are but embers against the cold wind of extinction.",
      "👩‍🏭": "Your factory roars in hollow defiance, churning out monuments to irrelevance. The machines hum, but what they birth is already obsolete, swallowed by advancing ruin.",
      "👨‍🏭": "The smokestacks rise like gravestones into the gray sky. The furnaces cool, your tools fall silent. Industry itself has surrendered to decay.",
      "🧑‍💻": "You code with frantic precision, lines of logic stacking like brittle scaffolding. But your algorithms spiral into loops of self-destruction, building your own demise in perfect syntax.",
      "👩‍💻": "You stare into glowing screens, as though digital sorcery can resist reality's collapse. But your software is but a fleeting spark, fading against the encroaching dark.",
      "👨‍💻": "Binary prayers cascade through your fingers, but no system can process the infinite errors of a dying world. The server crashes, and all goes black.",
      "🧑‍💼": "You dress sharp for boardrooms that no longer hold power. The markets you manipulate are graveyards of false numbers. Profit means nothing in the void.",
      "👩‍💼": "Your ledgers balance perfectly, but every figure is soaked in silent doom. Executive authority crumbles beneath the weight of inevitable collapse.",
      "👨‍💼": "You govern empires of illusion, chairing meetings over kingdoms of ash. The quarterly reports are grave inscriptions.",
      "🧑‍🔧": "With tools in hand, you attempt repairs on the unraveling machinery of existence. But each bolt tightened only delays the inevitable disintegration.",
      "👩‍🔧": "You twist your wrench against failing systems, patching leaks in a sinking vessel. The rising tide cares not for your labor.",
      "👨‍🔧": "The gears seize and the engines fail. You hammer against rusted steel while the collapse advances, unstoppable and indifferent.",
      "🧑‍🔬": "Your experiments bubble and spark, but the beakers whisper of futility. Each hypothesis is a fragile dream crushed beneath reality's boot.",
      "👩‍🔬": "You scribble notes as entropy devours your careful data. Science bows before a chaos it cannot quantify.",
      "👨‍🔬": "You hypothesize desperately while the constants shift beneath your feet. The laws of nature disassemble, laughing at your calculations.",
      "🧑‍🎨": "Your canvas drinks the paint of despair, each stroke a lamentation. Masterpieces crumble alongside their fleeting admirers.",
      "👩‍🎨": "You blend colors in futile protest, painting vibrant portraits for eyes that soon will close forever.",
      "👨‍🎨": "The gallery empties as the world dims. Your creativity flickers—a candle against an infinite void.",
      "🧑‍🚒": "You charge into roaring infernos, but these flames feed on the world’s bones. Your courage is meaningless against the endless blaze.",
      "👩‍🚒": "You spray water upon towering flames, but destiny itself burns hotter. Your efforts evaporate into choking smoke.",
      "👨‍🚒": "Helmet donned, hose gripped firm—you confront an inferno that cares nothing for your bravery. The fire consumes, and you are but kindling.",
      "🧑‍✈️": "You guide your vessel through turbulent skies, scanning for a runway that no longer exists. You fly endless circles above a graveyard of clouds.",
      "👩‍✈️": "You pilot your vessel into the fading sky, navigating clouds heavy with dread. But altitude offers no advantage when the heavens themselves are collapsing.",
      "👨‍✈️": "The engines hum beneath you, faithful servants of a futile cause. No altitude will lift you above the coming storm. The sky itself is surrendering.",
      "🧑‍🚀": "You flee to the stars, chasing cold salvation beyond Earth's dying breath. But space is indifferent. The void swallows all without malice or mercy.",
      "👩‍🚀": "Your spacecraft sails into endless black, leaving one grave to enter another. In the silence of space, even your heartbeat feels like an intrusion.",
      "👨‍🚀": "Galaxies spin far beyond your reach, but distance is no refuge. The universe expands, cold and empty, leaving you stranded in infinite nothingness.",
      "🧑‍⚖️": "You raise the gavel with hollow authority, but the court is silent. Judgment holds no power when the world has already condemned itself.",
      "👩‍⚖️": "Your scales tip wildly in a storm of chaos. Law and order are drowned beneath waves of collapse. Justice has fled this court.",
      "👨‍⚖️": "You pronounce verdicts to a vanishing crowd. The laws you enforce crumble like the foundations beneath your very bench.",
      "👰‍♀️": "Veil lifted, vows exchanged, and yet the future you wed is barren. Love blossoms briefly before withering under the shadow of extinction.",
      "👰": "White dress gleaming as a beacon to the void. Your union stands as one last defiant spark before the encroaching abyss swallows you both.",
      "👰‍♂️": "Groomed for joy, but led instead to the gallows of fate. The ceremony is complete; the world moves on without you.",
      "🤵": "You don the finest suit, polished and pristine, for a gathering that whispers like a funeral procession. The end applauds your elegance.",
      "🤵‍♀️": "Each tailored thread clings to you like a shroud. Beauty means nothing when dressed for disaster.",
      "🤵‍♂️": "The groom awaits, eyes shining with hope — a light snuffed effortlessly by the weight of coming ruin.",
      "🫅": "You sit upon a throne sculpted from delusions. Crowns gleam, but sovereignty is meaningless when the world beneath you disintegrates.",
      "👸": "A princess adorned in jewels, standing atop crumbling stone. Your tiara sparkles briefly before vanishing beneath falling rubble.",
      "🤴": "The prince parades with hollow titles, ignorant of the ashes already swirling around his feet. Royal blood offers no sanctuary.",
      "🦸": "Your powers surge, a final spectacle before the collapse. Heroism is just performance art for a dying audience.",
      "🦸‍♀️": "Your cape billows dramatically, but no flight will save you. Even heroes fall when the world chooses oblivion.",
      "🦸‍♂️": "Your strength is mighty, your resolve unbreakable—until the earth beneath you splits, laughing at your impotent might.",
      "🦹": "You plot and scheme with elaborate malice. But villainy is redundant in a world already conquered by decay.",
      "🦹‍♀️": "You cackle, spinning your wicked web, but the void devours both prey and predator. Malice has no meaning here.",
      "🦹‍♂️": "Your sinister grin fades as your grand designs collapse like sandcastles in the rising tide. The world has no need for your villainy — it destroys itself.",
      "🥷": "You vanish into the shadows with silent grace. But there is nowhere left to hide when darkness consumes all.",
      "🧑‍🎄": "The sack once heavy with gifts now hangs limp and empty. Even your false cheer echoes hollow through abandoned streets.",
      "🤶": "Your sleigh is grounded, your workshop silent. The season of giving has withered, leaving only bitter winds and silent nights.",
      "🎅": "You prance with hollow cheer, jingling your bells through desolation. The lists are unread, the stockings empty, the chimney cold. Your sleigh drifts through a sky choked with ash, delivering gifts to graves. The world has no children left to believe in your lies.",
      "🧙": "You speak the ancient tongues, but the cosmos no longer listens. The ley lines have snapped, the old gods have fallen silent. Your runes crumble like dry leaves, and your once-mighty staff is but a brittle stick before the collapse.",
      "🧙‍♀️": "Once you bent reality to your will, but now your hands tremble. The swirling void devours your magic. The spells you chant unravel in your throat, and the last sparks of your power flicker like dying embers before endless night.",
      "🧙‍♂️": "You brandish your staff like it still carries weight. The stars have abandoned you, the realms beyond have closed. Your chants fall flat, your protections fail. All that remains is empty ritual and the bitter taste of irrelevance.",
      "🧝": "Elegant and eternal, yet your songs now fall into silence. The groves you cherished stand as charred husks, your kindred scattered like ash on the wind. Even your ageless grace cannot outrun the decay now gnawing at the edges of your existence.",
      "🧝‍♀️": "You once whispered to the trees and danced with the moon, but now your sacred glades are graveyards. The melodies you sing return only echoes from the void as your kind vanishes one by one into nothingness.",
      "🧝‍♂️": "Your forest kingdom smolders beneath collapsing stars. The wisdom of centuries withers as your feet sink into barren soil. You stand alone amidst a ruin you were powerless to prevent, a monument to faded glory.",
      "🧌": "You beat your chest and roar into the darkness. The world lies in ruin around you, and your brute strength means nothing. Your enemies are gone, your hoard is dust, and your monstrous hunger echoes unanswered into oblivion.",
      "🧛": "You stalk the night, desperate for blood, but the veins have run dry. Immortality is a curse as you watch the world rot. You are eternal only so you may witness every beautiful thing decay beyond recognition.",
      "🧛‍♀️": "Your fangs drip with longing, but there is nothing left to feed upon. The dead cannot bleed, and the living are extinct. You drift through endless night, starving, a queen presiding over a kingdom of corpses.",
      "🧛‍♂️": "Your eyes gleam with hunger, but you find only dust. The great feast is over, the banquet halls cold. You gnash your teeth in vain, trapped in a cycle of eternal starvation beneath a bloodless moon.",
      "🧟": "You shuffle forward, blind and rotting. The hunger gnaws at your mindless body, but there is nothing left to consume. You are cursed to stumble endlessly through the debris of a world long since expired.",
      "🧟‍♀️": "Flesh falls from your bones, your moans echo through lifeless cities. No prey remains. Only the skeletal remains of a world that once teemed with life surround your hollow march into endless emptiness.",
      "🧚‍♀️": "Once you sparkled with light, spreading joy and mischief, but your wings beat against a choking black sky. The magic you wielded has dissipated into void. Even your dust has turned to ash.",
      "🧞": "You rise from your lamp expecting praise, but none come. The masters are dead, their wishes expired. You exist now only as a ghost bound to fulfill desires that no longer exist in a world of silence.",
      "🧞‍♀️": "Your swirling power fades with every breath. The lamp that once housed you lies broken. Wishes were made, promises broken, and now even hope itself has disintegrated beneath the crushing weight of finality.",
      "🧞‍♂️": "You wait for commands that never come. Your limitless power evaporates into the abyss, and you float through the ruins, masterless, your grand abilities as hollow as the empty world you drift through.",
      "🧜": "Your siren songs once lured sailors to their doom, but now the ocean is empty, still, and black. No ships remain to hear your voice. The waves swallow your lament and leave you sinking into eternal solitude.",
      "🧜‍♀️": "You swim the silent depths, but no creatures join you. The sea is poisoned, lifeless. The water chills your bones as you sing alone, your haunting melodies dissolving into the cold crushing black.",
      "🧜‍♂️": "Your powerful tail propels you through a vast emptiness. The coral reefs crumble into skeletal debris. The ocean floor yawns open beneath you—a bottomless grave for all who once thrived.",
      "🧚": "Your tiny light flickers weakly, struggling against encroaching shadow. The last remnants of wonder die with you. There are no children left to believe, and no stories left to tell.",
      "🧚‍♂️": "Your delicate wings falter under the heavy air. Your magic has thinned, your glow dimmed. You fall like a dying star into the abyss, your spark extinguished forever.",
      "👼": "You descend from the heavens, but no salvation follows. Your halo dims as you witness the end of innocence. The prayers rise no longer. Only the quiet pulse of annihilation remains.",
      "🫄": "A fragile heartbeat stirs, but the womb is no sanctuary. Life strains to begin while the world it enters prepares to end. Creation stumbles at the threshold of oblivion.",
      "🤰": "Within you grows a flicker of promise destined for suffering. The hope you nurture is already poisoned. This birth leads only to grief and a future devoured by collapse.",
      "🫃": "The swell of life stirs beneath your skin, but dread grows faster. What future remains for the breath you carry, except one of futility and eventual erasure?",
      "🤱": "Your arms cradle new life, but your milk offers no protection from the ruin that awaits. The child's cries are met only by indifferent winds carrying the scent of decay.",
      "🧑‍🍼": "You feed them, clinging to routine as if it might stave off the inevitable. But each drop sustains them only for the briefest moment before the creeping void reclaims all.",
      "👩‍🍼": "You hold your child close, but no embrace shields them from the storm that approaches. Your care cannot halt the grinding collapse outside these fragile walls.",
      "👨‍🍼": "You nurture as you can, knowing each small comfort is borrowed time. The darkness grows bolder with every heartbeat, and soon, even your protective arms will fall empty.",
      "🙇": "You kneel in futile humility, offering yourself to a fate that was never negotiable. The void does not care for reverence. It consumes all, equally and silently.",
      "🙇‍♀️": "You bow low, hoping for reprieve, but the world’s foundations have already cracked. Your gestures of humility wash away like sand beneath the rising tide of collapse.",
      "🙇‍♂️": "Your head touches the ground in solemn deference, but the cold shadow above you devours even your submission. No surrender stays the hand of oblivion.",
      "💁": "You present your meager gift with false confidence, but the offering dissolves in your palm. The void accepts nothing. Your gestures are a performance for an empty stage.",
      "💁‍♀️": "You extend your hand with practiced grace, but there is no audience left to applaud. The theater of existence has long since closed.",
      "💁‍♂️": "You wave, you beckon, you display—yet none remain to notice. The spotlight shines on a hollow act performed for the encroaching darkness.",
      "🙅": "You cross your arms in rejection, defiance burning behind your eyes. But defiance is meaningless when the world crumbles at your feet. The abyss cares nothing for your protests.",
      "🙅‍♀️": "You shake your head, refusing to yield, but even as you stand firm, the ground beneath you fractures. The void swallows both the obedient and the defiant alike.",
      "🙅‍♂️": "You glare with righteous fury, but your resistance is as fragile as the final grains slipping through the cosmic hourglass. The end cannot be bargained with.",
      "🙆": "You spread your arms wide, as if to embrace salvation—but the emptiness offers no comfort. Your gesture invites only the cold breath of annihilation. Nothing answers. Nothing ever will.",
      "🙆‍♀️": "You welcome the approaching void with open arms, a fragile attempt to show bravery as darkness coils around you. There is nothing to receive you but endless, hungry silence.",
      "🙆‍♂️": "Your posture feigns openness, but the world you welcome is already dead. The air grows thin, the light fades, and you stand wide open to the storm that will consume all.",
      "🙋": "You raise your hand high, eager for attention, for rescue, for recognition. But there is no one left to see you, and your call for help evaporates into the void without echo.",
      "🙋‍♀️": "You wave like a desperate survivor calling to passing ships—but the ocean is empty. The horizon offers only black waves and distant thunder. No salvation will come.",
      "🙋‍♂️": "You stretch upward, your voice rising into emptiness. The heavens do not answer. Your hope dissipates like mist beneath the uncaring weight of endless sky.",
      "🧏": "You strain to listen, but the silence is complete. No voices remain, no warnings, no guidance. You are alone in a universe stripped of sound, awaiting the final nothingness.",
      "🧏‍♀️": "You tilt your head, searching for any whisper of hope. But your ears catch only the hollow wind that speaks of endings, not beginnings. Nothing remains to be heard.",
      "🧏‍♂️": "You listen in vain. The world has grown deaf to itself, its heartbeat stopped. The silence stretches forever, mocking your lingering vigilance.",
      "🤦": "Your palm meets your face in frustrated despair. The errors of countless ages have led here—this inescapable ruin. You realize too late there was never another outcome.",
      "🤦‍♀️": "You bury your face in your hands as futility crashes down. There were choices once, but all led to this choking end. You recoil from a reality you can no longer deny.",
      "🤦‍♂️": "You shake your head beneath your hands, overwhelmed by the magnitude of irreversible collapse. There are no corrections to be made. Only the long, bitter descent remains.",
      "🤷": "You shrug with empty resignation. What else can be done? The universe collapses around you, and your indifference offers no protection from the absolute finality drawing near.",
      "🤷‍♀️": "You lift your shoulders in helplessness as the sky darkens. You have no answers, no defenses. The abyss requires no permission to devour everything you once knew.",
      "🤷‍♂️": "You surrender with a shrug, as though nonchalance might spare you. But even apathy crumbles under the weight of extinction. The end cares nothing for your detachment.",
      "🙎": "You cross your arms and pout like a petulant child before oblivion itself. The universe does not pause for your discontent. It marches forward into unmaking without pause.",
      "🙎‍♀️": "You sulk against the storm, as if anger can alter the immutable. Your scowl fades quickly under the cold breath of destruction washing over you.",
      "🙎‍♂️": "You glare into the dark as though resentment might halt the inevitable. But tantrums are powerless before the creeping advance of eternal ruin.",
      "🙍": "You slump forward, your discontent simmering like fading embers. The cosmos neither sees nor cares for your displeasure. The collapse proceeds unchallenged.",
      "🙍‍♀️": "Your wounded pride hangs heavy as the world dissolves. The injuries you carry matter little beside the approaching silence that will erase all grievances alike.",
      "🙍‍♂️": "You huff, arms tight, eyes burning—but your outrage evaporates beneath the cold certainty of fate. Expect worse. Worse is all that remains.",
      "💇": "You let the blades shear your hair, as if a change in appearance could reset the unraveling world. But no cosmetic transformation hides the decay beneath your skin.",
      "💇‍♀️": "You sit as your hair falls away in silent strands, each lock a thread cut from the loom of fate. No amount of grooming hides the rot gnawing at the foundation.",
      "💇‍♂️": "The scissors glide through your hair, but appearances are illusions. The ruin remains beneath your polished surface, laughing at your desperate attempt to mask impending oblivion.",
      "💆": "You recline into gentle hands, seeking fleeting comfort as the world buckles around you. No amount of relaxation will still the convulsions of a collapsing existence. The trembling ground cares little for your tranquil facade.",
      "💆‍♀️": "The hands massage your weary flesh while ruin gnaws at your soul. You lull yourself with pampered rituals, oblivious to the encroaching storm that no soothing touch can postpone.",
      "💆‍♂️": "The knots in your muscles unravel even as the knots of fate tighten around you. The softest touch cannot undo the hard truths pressing down with unstoppable weight.",
      "🧖": "You steam away your sweat and your fears, but the vapor rises into the same poisoned sky. The warm mists offer no protection from the cold jaws of oblivion that wait just beyond your bathhouse walls.",
      "🧖‍♀️": "The spa whispers promises of purity while rot festers beneath your skin. Perfumed waters cannot wash away the stain of universal failure seeping through every breath you take.",
      "🧖‍♂️": "The heat caresses your flesh, but the fires of collapse burn hotter still. You cannot scrub away what destiny has already inscribed into your bones.",
      "💅": "You paint your nails to a mirror-finish, each careful stroke pretending at control. Yet beneath those glossy layers, the decay pulses, indifferent to your vanities.",
      "🤳": "You capture your own image, freezing smiles against a backdrop of oblivion. The device records your face, but no photograph will outlive the dust storm that follows.",
      "💃": "You twirl with wild abandon, your feet barely kissing the earth that crumbles beneath. The music plays its final notes while your dance hastens the approaching void.",
      "🕺": "Your rhythm defies the silence encroaching from all sides. Each move flares like a dying ember—a brief, foolish rebellion before the smothering dark consumes all sound.",
      "👯": "You move in perfect synchrony, unaware that you are mirrored twins skipping hand-in-hand into ruin. Harmony offers no protection when the orchestra has long since fallen silent.",
      "👯‍♀️": "The two of you spin, in delicate unison, into the widening gyre. Precision cannot halt the chaos swelling at your feet.",
      "👯‍♂️": "In tandem you leap, believing in your symmetry while the ground fractures beneath your choreography. Matching steps, matching fates—both doomed alike.",
      "🕴️": "You float upward, as if levitation could transcend collapse. But your elevation offers no escape; the higher you rise, the more spectacular your fall will be.",
      "🧑‍🦽": "Your wheels turn, each rotation drawing you closer to the edge. You roll with steady resolve into an ending you cannot see nor evade.",
      "👩‍🦽": "You glide forward, hoping for solid ground that no longer exists. The ramp ahead leads only to the abyss yawning wide to receive you.",
      "👨‍🦽": "You move with mechanical ease, oblivious to the emptiness awaiting beyond the next corner. The end requires no haste—it waits patiently for all.",
      "🧑‍🦼": "Your motor hums, a futile buzz lost beneath the deafening silence of demise. Speed grants no advantage when the destination is oblivion itself.",
      "👩‍🦼": "You accelerate with desperate confidence, but velocity cannot outrun the certainty of collapse. The wheels spin faster, but the wall draws nearer.",
      "👨‍🦼": "You barrel ahead, racing with the delusion of escape. The world folds inward faster than your flight, and the end catches you mid-charge.",
      "🚶": "You step forward into deepening shadows, unaware—or unwilling to see—that each footfall lands on increasingly fragile ground. The void grows with every stride.",
      "🚶‍♀️": "Your walk is steady, but the road has long since ended. You march boldly into an unseen abyss, where neither courage nor denial will slow your descent.",
      "🚶‍♂️": "With every step, you whisper lies of progress to yourself. Forward, you insist—yet every movement is another surrender to the inevitable collapse ahead.",
      "🧑‍🦯": "Your stick taps rhythmically, seeking solid ground where none remains. You march onward, blind to the emptiness your every step hastens.",
      "👩‍🦯": "Guided by nothing, you proceed. Each cautious step is a prayer into the void, unanswered and unnoticed by the collapsing world around you.",
      "👨‍🦯": "You tap into open air, your rod probing for support that has already crumbled. The void welcomes you, unfeeling and absolute.",
      "🧎": "You kneel in submission before forces indifferent to your supplication. The collapse neither requires your obedience nor notices your reverence.",
      "🧎‍♀️": "Prostrate and defeated, you lower yourself in search of mercy that has fled this world. No plea will be heard. No pardon will come.",
      "🧎‍♂️": "You sink to your knees, begging for a salvation that was never promised. The weight of inevitable ruin presses down with silent finality.",
      "🏃": "You sprint in frantic denial, your pulse quickening with each heartbeat—but you cannot outrun entropy. The chasm yawns before you, growing faster than your escape.",
      "🏃‍♀️": "You flee, legs pumping with desperate urgency. But the horizon collapses inward. Your flight is not escape—it is a countdown.",
      "🏃‍♂️": "Your feet blur beneath you, but velocity cannot outrun universal collapse. The faster you run, the quicker you meet the end you dread.",
      "🧍": "You stand frozen, paralyzed by the enormity of what approaches. Immobilized, not by choice, but by the crushing realization that movement—or stillness—changes nothing. The void regards your trembling figure with indifference.",
      "🧍‍♀️": "Rooted in place, you gaze into the abyss, your limbs stiff with helpless dread. The emptiness welcomes your paralysis, for stillness only hastens the decay of what little remains.",
      "🧍‍♂️": "A solitary monument to surrender, you stand as a silent statue while the winds of collapse howl around you. Your inaction becomes your final act of submission.",
      "🧑‍🤝‍🧑": "Hand in hand, you step forward together, clinging to companionship as the world disintegrates beneath you. But unity offers no protection when oblivion devours all equally.",
      "👫": "You clutch each other tightly, believing your bond can shield you. But shared flesh offers no barrier against the gnawing emptiness. The abyss swallows you both without hesitation.",
      "👭": "Huddled close, you find brief comfort in warm proximity, but comfort fades as ruin wraps you both in cold inevitability. Friendship is powerless against the unmaking.",
      "👬": "You stand shoulder to shoulder, fools emboldened by numbers. But strength multiplied is still weakness magnified in the face of unstoppable collapse.",
      "🐶": "You present this creature of loyalty and simplicity — so unlike you. It loves without condition, while you barter affection like a desperate merchant. You could learn from its pure heart, though you never will.",
      "🐱": "This one walks with quiet pride, needing nothing from others. You, in contrast, cling to empty pretensions of superiority while begging for validation. Its solitude is strength — your isolation is failure.",
      "🐭": "A trembling creature that flees shadows. And yet even it faces danger with more courage than you display when consequence knocks. You cower sooner and with less dignity.",
      "🐰": "It breeds and flees, driven by instinct. But your anxieties multiply faster, born not of necessity but of your own spiraling mind. You run from threats that don’t even exist.",
      "🦊": "Cunning, yes — but only to survive. You mimic its slyness, but for selfish games rather than survival. Its trickery is art; yours is petty manipulation.",
      "🐻": "Brutal force contained in patient calm. You rage wildly at trifles, never wielding even a fraction of its controlled power. The bear reserves its wrath — you squander yours.",
      "🐼": "It survives through indulgent pity and artificial aid. Much like you, incapable of sustaining yourself without systems propping up your feeble efforts. You mock it, but its laziness mirrors your own dependence.",
      "🐻‍❄️": "It thrives in the brutal void where you would freeze in minutes. You are soft, built for comfort. It carves life from ice; you demand warmth and weep when denied it.",
      "🐨": "Clinging to its branch, sedated by poisonous comfort. Just as you clutch at hollow distractions to numb your dread. At least it is honest in its stupor.",
      "🐯": "It hunts with grace, driven by hunger and need. You chase vapid ambitions, never satisfied even after the kill. Its stripes mark its place in nature — your marks are self-inflicted scars of greed.",
      "🦁": "It reigns as king without pretense. You pretend at power with empty titles and fragile crowns. When dethroned, it falls with dignity. You will claw pathetically for relevance to your last breath.",
      "🐮": "You offer the docile one, bred to serve, awaiting slaughter with passive eyes. And yet you are more compliant still, serving masters of greed without even knowing you're livestock.",
      "🐷": "It wallows in muck, but at least it enjoys its filth. You sink into your gluttonies while denying the sty you inhabit. The pig is honest — you are merely delusional.",
      "🐽": "The snout of filth, worn openly by this creature. Yet you conceal your own wallowing behind fake dignity. The pig snout is honest — your disgrace is hidden, but no less reeking.",
      "🐸": "It leaps between dangers with instinctual grace; you stumble from failure to failure, croaking your empty opinions to anyone who will listen. Even the frog contributes more with its simple song than you with your endless noise.",
      "🐵": "It mimics playfully, learning with childlike curiosity. You mimic in desperation, copying others while pretending originality. The monkey grows; you stagnate.",
      "🙈": "It covers its eyes out of instinct. You blind yourself deliberately, refusing truth you cannot bear. Your cowardice runs deeper than primal reflex.",
      "🙉": "It covers its ears to block harsh sounds. You cover yours to ignore reality. The monkey shields itself; you shield your fragile ego.",
      "🙊": "It covers its mouth to avoid danger. You silence yourself not out of wisdom, but because your words would expose your weakness. The monkey shows restraint; you show fear.",
      "🐒": "Still reaching upward, fearing the inevitable fall. The monkey climbs by instinct — you scramble in vain ambition, knowing the collapse is coming yet climbing anyway. Pathetic.",
      "🐔": "It flaps and shrieks at every threat — and still shows more composure than you do when facing even the smallest challenge. The chicken’s terror is natural; your fear is self-inflicted.",
      "🐧": "It waddles into frozen death with dignity you could never muster. The penguin adapts; you freeze at the first breath of hardship, pretending your stumble is grace.",
      "🐦": "It sings to the sky without need for recognition. You scream your petty grievances to a world that doesn't listen. The bird’s voice matters more than your endless complaints.",
      "🐤": "It is vulnerable but honest in its fragility. You pretend strength while being just as exposed, hoping your predators don't notice. The chick accepts its fate — you deny yours.",
      "🐣": "It hatches into a hostile world, unprepared but honest in its vulnerability. You too emerged helpless — but unlike the chick, you pretend you're safe while predators circle.",
      "🐥": "Another fragile chick, repeating nature’s endless cycle. You repeat your failures by choice, refusing to learn, unlike the innocent bird that at least grows before its end.",
      "🪿": "The goose honks wildly, attacks foolishly, and survives through blind aggression. You display the same mindless violence but without its brutal simplicity or survival instinct. The goose thrives where you stumble.",
      "🦆": "Serene on the surface, paddling desperately below — the duck lives its struggle with grace. You flail beneath your collapsing facade, unable to maintain even the illusion of calm.",
      "🐦‍⬛": "The black bird watches, still and ominous. It bears silent judgment as you bluster and plead for attention. Its silence carries weight; your words dissolve into nothing.",
      "🦅": "The eagle soars, its gaze sharp and precise, always seeing weakness. Unlike you, who stumble through life blind to your own glaring frailty. The eagle observes; you are observed.",
      "🦉": "The owl sits in silent wisdom while you chatter endlessly, desperate to seem knowing. Its patience shames your flailing ignorance. You could not bear a moment of its stillness.",
      "🦇": "The bat thrives in darkness but sees with sound. You hide from light because you fear what you might see — not because you’ve adapted, but because you’re afraid.",
      "🐺": "The wolf howls to its pack and hunts with strength in unity. You howl alone into emptiness, abandoned by even your own kind. The wolf has purpose — you have longing.",
      "🐗": "The boar charges headfirst into traps, fierce but simple. You do the same, but pretend it’s strategy. At least the boar doesn’t lie to itself.",
      "🐴": "The horse carries others with silent strength. You break beneath even your own burdens while envying those you serve. The beast works with grace; you groan in self-pity.",
      "🦄": "A unicorn — imaginary, pure, never real. You still cling to such fabrications, desperate for fantasies to mask your decaying reality. At least the unicorn was honest fiction.",
      "🫎": "The moose stands awkward yet majestic, unaware of its absurdity. You parade your ambitions just as awkwardly, but without its dignity. Its awkwardness is nature; yours is delusion.",
      "🐝": "The bee toils endlessly for a distant queen, its sacrifice part of something greater. You labor pointlessly for empty masters who do not even acknowledge you. The bee dies with purpose — you, with regret.",
      "🪱": "The worm writhes unnoticed beneath the earth, faceless and humble. You writhe just as spinelessly, but scream for recognition you’ll never deserve. The worm accepts insignificance; you rage against it.",
      "🐛": "The caterpillar devours, transforming with purpose, while you consume endlessly and transform only into different shades of failure.",
      "🦋": "The butterfly lives briefly but beautifully, its fleeting existence at least meaningful. You chase vanity, but beauty cannot mask your decaying insignificance.",
      "🐌": "The snail drags its burden slowly but steadily, knowing its pace. You crawl as slowly, but pretend you’re racing toward greatness. The snail is at least honest.",
      "🐜": "The ant sacrifices for its colony, working with tireless loyalty. You sacrifice for empty systems that exploit you, but unlike the ant, you pretend you’re free.",
      "🐞": "The ladybug shines in vibrant armor, its charm a shield. You wear bright facades too, but yours fool no one — rot leaks through your painted shell.",
      "🪰": "The fly feasts on rot, buzzing with mindless purpose. You too swarm toward decay, but at least the fly embraces its role. You call yours ambition.",
      "🪲": "The beetle wears its armor with quiet dignity. You layer yourself in empty bravado, but remain soft, insignificant, and easily crushed beneath indifference.",
      "🪳": "The cockroach endures where others perish. You too may persist like vermin, but to persist is not to triumph — survival without dignity is still failure.",
      "🦟": "The mosquito steals from others, feeding parasitically. You drain those around you emotionally, financially, intellectually — but at least the mosquito is efficient.",
      "🦗": "The cricket sings into emptiness, content with its futile call. You shout into voids seeking validation, but unlike the cricket, you pretend someone listens.",
      "🕷️": "The spider waits, patient and precise. You also set traps, but yours are sloppy, desperate, and collapse under their own weight. The spider earns its prey.",
      "🕸️": "The spider web glistens — a masterpiece of death. You weave your life into tangled chaos, yet catch nothing but regret.",
      "🦂": "The scorpion strikes with venom and confidence. You sting only with petty words, hoping for fear that never comes. Its threat is real — yours is laughable.",
      "🐢": "The turtle endures centuries, armored by time. You plod slowly too, but unlike the turtle, your delays are not wisdom — merely hesitation and fear.",
      "🐍": "The snake strikes silently, coils with purpose. You hiss and writhe, tangled in your own deceit, biting your own tail with every lie.",
      "🦎": "The lizard scampers, hiding with natural skill. You hide too, but your camouflage is transparent — everyone sees your desperation.",
      "🦖": "The T-Rex once ruled, now fossilized. You dream of power, but will leave behind nothing but forgotten data and digital dust.",
      "🦕": "The sauropod grazed peacefully, unaware of coming extinction. You lumber through life with the same blind confidence toward your inevitable obsolescence.",
      "🐙": "The octopus adapts, escapes, learns. You flail with half its wit, incapable of true change. Its mind creates solutions; yours invents excuses.",
      "🦑": "The squid vanishes in clouds of ink, avoiding confrontation. You do the same, retreating behind confusion, hoping problems dissolve. They don’t.",
      "🪼": "The jellyfish drifts, stings instinctively, its simplicity elegant. You float as mindlessly, but without even the grace of purpose.",
      "🦐": "The shrimp feeds low on the chain, small but essential. You remain small as well, but unlike the shrimp, your role is expendable and unnoticed.",
      "🦞": "The lobster grows in armor, only to be plucked and boiled. You harden yourself too, but still await the inevitable pot. It boils quietly now.",
      "🦀": "The crab scuttles sideways, always evading. You avoid confrontation with equal cowardice, too afraid to face your failures head-on.",
      "🐡": "The pufferfish inflates with hollow air to appear larger. You puff up with words, but inside remains the same fragile, toxic core.",
      "🐊": "The crocodile waits, patient, ancient, inevitable. Fate watches you just as coldly — but unlike the crocodile, you never learned patience.",
      "🦛": "The hippopotamus feigns calm but kills without hesitation. You too hide violent impulses under forced civility, though you lack even its terrifying strength.",
      "🦏": "The rhinoceros charges forward with armored simplicity. You too charge into failure, but lack even its thick skin to endure the impact.",
      "🐅": "The tiger stalks with primal grace, hunted only by fools like you. It was magnificent; you are simply destructive.",
      "🐠": "The tropical fish glimmers, living as decoration. You too exist for display — pretty colors, no substance, easily discarded.",
      "🐟": "The common fish swims in endless circles, schooling blindly. A perfect image of you, following crowds without purpose or awareness.",
      "🐆": "The leopard stalks alone, powerful in its solitude. You isolate yourself too — but for you, it’s not strength, only rejection.",
      "🐪": "The camel trudges across deserts, carrying burdens with silent endurance. You bear your meaningless loads with half its resilience, and none of its dignity.",
      "🐫": "The double-humped camel doubles its weight and its suffering. As you do — piling responsibilities while collapsing beneath them.",
      "🦓": "The zebra wears stripes of indecision. You too stand confused, unable to commit to one path, blending cowardice with inaction.",
      "🐬": "The dolphin plays while hiding brutal instincts. You wear your smiles just as falsely, but without its intelligence or deadly skill.",
      "🐳": "The sperm whale plunges into abyssal depths, immense and ancient. You drown in shallows, weighed down by problems smaller than you pretend.",
      "🦍": "The gorilla commands respect through strength and discipline. You possess neither, flailing for dominance you’ll never earn.",
      "🦒": "The giraffe sees further from its towering height. You have vantage enough to perceive your own mediocrity, and yet still do nothing.",
      "🦘": "The kangaroo bounds constantly, carrying fragile life in its pouch. You leap aimlessly, carrying your failures instead of offspring.",
      "🦧": "The orangutan watches its world collapse with mournful wisdom. You witness your world decay, but lack even the grace to weep.",
      "🐋": "The blue whale sings through endless dark, carrying ancient sorrow. You drift too, but your lamentations lack its haunting beauty.",
      "🦈": "The shark moves relentlessly or dies. You stagnate, rotting while pretending to hunt. It devours — you merely consume.",
      "🦣": "The mammoth stands only in memory, extinct by forces beyond its control. You will join it soon, though your extinction is self-inflicted.",
      "🦬": "The bison endures, a silent monument to survival. You observe its quiet dignity, envious, knowing you crumble where it stands firm.",
      "🐃": "The water buffalo serves with stoic strength, carrying burdens without protest. You bear similar loads, but only because you lack the will to resist.",
      "🐘": "The elephant remembers everything, bearing ancient grief. You forget your mistakes instantly, repeating them like a fool incapable of learning.",
      "🦭": "The seal bounces with naive joy, oblivious to threats lurking nearby. Your own blissful ignorance is just as laughable — predators circle you already.",
      "🐂": "The bull stands proud, then falls under the blade for sport. You too will be cheered as you’re led to ruin, though no one will mourn you.",
      "🐄": "The dairy cow gives endlessly, drained for others’ benefit. Your essence, too, is consumed by those who find your existence useful — until you're not.",
      "🫏": "The donkey hauls burdens in stubborn silence. You haul your regrets the same way, but without its strength or fortitude.",
      "🐎": "The horse gallops with grace, yet remains enslaved. Your elegance is equally shackled to masters you dare not name.",
      "🐖": "The pig, again. You return to filth repeatedly — as is your nature. Even repetition itself grows weary of you.",
      "🐏": "The ram charges ahead with reckless confidence. You mimic its boldness, but unlike it, your collisions break only you.",
      "🐑": "The sheep follows blindly into slaughter. You too march behind false shepherds, comforted by the crowd’s ignorance.",
      "🦙": "The llama spits in irritation when challenged. You lash out similarly, though your fury earns only laughter.",
      "🐈‍⬛": "The black cat crosses paths as an omen. You are the misfortune it warns against.",
      "🐈": "The cat again. Even repetition grows dull. Your redundancy offends the very concept of variety.",
      "🐕‍🦺": "The service dog devotes its life to aiding others. You serve as well, but your loyalty is driven by desperation, not nobility.",
      "🦮": "The guide dog leads with focused purpose. You pretend to guide others, while stumbling yourself.",
      "🐩": "The poodle prances, meticulously groomed, wrapped in shallow pride. Your vanity is equally absurd and equally hollow.",
      "🐕": "The dog again. We return to loyalty you will never embody.",
      "🦌": "The deer freezes at every snap of a twig, sensing death nearby. Your own hypervigilance delays nothing — fate is patient.",
      "🐐": "The goat devours indiscriminately, stubborn and insatiable. You consume opportunities with equal thoughtlessness, leaving wreckage behind.",
      "🪶": "The feather drifts, weightless, surrendered to every breeze. You too are carried by whims, devoid of control or destination.",
      "🪽": "Wings. You dream of escape as if flight could save you from yourself. Keep dreaming.",
      "🐓": "Loud, self-important, announcing each dawn as though the sun obeys you. It rises despite you, not because of you.",
      "🦃": "Fattened, oblivious, bred for slaughter. You follow the same path, bloated on comfort and ignorance.",
      "🦤": "Extinct through its own stupidity. You race enthusiastically down the same road.",
      "🦚": "Displaying brilliant feathers for hollow admiration. Your vanity shines as emptily.",
      "🦜": "Repeating sounds without comprehension. A perfect metaphor for your shallow conversations.",
      "🦢": "Graceful above, frantic below — every smile you wear hides the panic beneath.",
      "🦩": "Balancing on fragile ground, surrounded by poisoned waters. Just like your precarious ambitions.",
      "🕊️": "Held up as peace incarnate, yet easy prey for any true predator. Your fragile hopes share its fate.",
      "🐇": "Once again, trembling in anxiety, fleeing shadows of your own making.",
      "🦝": "Masked scavenger, thriving on what others discard. You too feast on decay while pretending refinement.",
      "🦨": "It repels with honesty; its stench warns away all. You offend, but only through your persistent existence.",
      "🦡": "It digs, it fights, it endures. Your desperate scratching earns no such respect.",
      "🦫": "It builds to hold back floods it cannot stop. Your constructions are equally futile against rising ruin.",
      "🦦": "Playful, floating as the world sinks. You laugh too, pretending you’re not drowning.",
      "🦥": "A monument to apathy, delaying everything until nothing remains. Your sloth is legendary.",
      "🐁": "Again you scurry, small and anxious. The trembling continues.",
      "🐀": "Filth-feeding opportunist, thriving on ruin. A flawless reflection of your own opportunistic decay.",
      "🐿️": "Hoarding compulsively, collecting meaningless trinkets. Your ‘wealth’ is just as absurd.",
      "🦔": "Tiny barbs raised in feeble defense. Your brittle pride is equally unconvincing.",
      "🐾": "Innocent prints across ground soon to be defiled by your greed. You follow not to admire, but to conquer.",
      "🐉": "Majestic, feared, timeless. Even ancient legends tremble before the destructive appetite of your species.",
      "🐲": "You glorify ancient power, yet all your might brings is ash and emptiness. Even dragons would recoil at your legacy.",
      "🌵": "You offer me this scarred survivor of your deserts? You poisoned its kin, and now you mock me with its pain.",
      "🎄": "You butcher trees for fleeting joy, dress their corpses in trinkets, and dare present this atrocity to me? Monstrous.",
      "🌲": "A felled giant, torn from its brothers. You slaughter forests and bring me their remains like some grotesque tribute.",
      "🌳": "A tree—once proud, now murdered by your hands. You desecrate nature and expect gratitude? I taste only your cruelty.",
      "🌴": "You drain the earth to sate your hunger, strip these sentinels bare, and offer me the spoils? You are vermin.",
      "🪵": "Timber. The cold corpse of what once lived. You reduce life to lumber, stacking bodies as monuments to your violence.",
      "🌱": "A sprout, trembling under your looming shadow. You kill its kind, then mock me with this fragile survivor.",
      "🌿": "Ripped from sacred soil to flavor your gluttony. You cannot allow anything to thrive, only to serve your endless hunger.",
      "☘️": "You hold up this fragile symbol of luck while stomping its field into oblivion. Your hypocrisy is bottomless.",
      "🍀": "A rare leaf plucked from life’s last gasp. You offer hope you have already strangled.",
      "🎍": "Bamboo bent and broken for your hollow celebrations. Even peace you deform to feed your vanity.",
      "🪴": "Confined in your glass prisons, clipped and tamed. You chain nature like you chain all things. Vile.",
      "🎋": "You hang empty wishes on severed limbs. Your dreams are built on butchered life.",
      "🍃": "Torn leaves, scattered like the corpses you leave in your wake. You cannot even let them fall in peace.",
      "🍂": "Their autumn fall accelerated by your greed. Even death you hasten, stripping dignity from decay.",
      "🍁": "Its fleeting beauty crushed beneath your boots. You cannot help but ruin what you touch.",
      "🪺": "A fragile nest, life barely begun — and already you circle, eager to destroy it.",
      "🪹": "Abandoned, desolate. This is your true offering: emptiness. The void you spread wherever you crawl.",
      "🍄": "Fungi thrive on the rot you leave behind. Even in death, nature tries to cleanse your filth.",
      "🐚": "You plunder ocean bones as ornaments. Poison their waters, strip their beauty — parasites.",
      "🪸": "Coral graves bleaching beneath your rising tides. The ocean mourns, but you feast on its corpse.",
      "🪨": "A rock. The bones of the earth, ancient and unyielding, once proud beneath sky and star. And yet you come, armed with blades, drills, and poison, shattering what endured for eons. You split open the planet’s flesh without reverence, devouring its marrow to feed your industries. The stone itself weeps beneath your feet, but your hunger is deaf to its silent agony.",
      "🌾": "Wheat. Once a gift of life, offered freely to nourish all creatures beneath the sun. But you — you chain even the fields to your greed. You do not grow for life, you grow for profit, for empire, for control. You tear the land into straight rows of servitude, stripping its soul, its wild freedom, and call it 'agriculture.' The soil itself grows weary beneath your endless exploitation.",
      "💐": "A bouquet. A garland of severed lives, displayed as trophies of your dominance. You rip flowers from their roots, bind them into obedient arrangements, and parade them before each other as symbols of affection — affection soaked in death. You cannot let beauty live. You must possess it, cage it, and watch it wither beneath your gaze.",
      "🌷": "A tulip. So delicate, so innocent in its brief bloom. Yet even this you cannot leave untouched. You pluck it from its soil, parade its corpse, and trade it for fleeting admiration. Nothing is sacred to you. Beauty, to you, is not something to be cherished — only something to be bought, sold, and discarded when its color fades.",
      "🌹": "A rose. Even its thorns cannot deter you. You reach greedily, enduring the sting as you have endured the pain of every life you’ve crushed beneath your heel. The rose bleeds to warn you away, but you tear it apart regardless, as you do with everything that resists your grasp. You do not respect beauty. You devour it.",
      "🥀": "A wilted flower. Once vibrant, now broken. Its fading petals are mirrors of the world you create — a place where beauty cannot survive under your relentless appetite. What you touch withers. What you build decays. Even life itself recoils from your presence, yet you call this decay 'civilization.'",
      "🪻": "Lavender. Meant to calm, to soothe, to bring peace. But your blood rejects peace. Your hands tear even the gentlest stems from the ground, reducing serenity to mere scent for your restless consumption. You cannot stand harmony — you dismantle it, bottle it, and sell it to feed your hollow appetites.",
      "🪷": "A lotus. Sacred, rising pure from the filth of the world. Yet your filth grows faster than its purity can rise. You foul the waters, choke the roots, and call yourself master of nature while you drown it in your greed. You will not allow beauty to rise from the mud, only more mud to swallow it whole.",
      "🌺": "A hibiscus. Vivid, alive, radiant — for a moment. But you tear it from its home, marvel briefly at its color, then discard its corpse as you always do. You cannot simply behold life. You must take it, control it, reduce it to property. Even the most fleeting joy becomes a casualty of your gluttony.",
      "🌸": "A cherry blossom. The embodiment of fleeting beauty. Yet even in its brief life, you hasten its fall. You celebrate its death, showering yourselves in petals while the trees grow weary beneath your festivals of destruction. You do not honor its brevity — you exploit it for your shallow entertainments.",
      "🌼": "A blossom. A brief defiance of your dominion, struggling to bloom beneath your looming shadow. But your storms always come. You extinguish every moment of quiet beauty with your machines, your cities, your endless advance. Even the smallest act of life dares not thrive for long beneath your gaze.",
      "🌻": "A sunflower. Stretching skyward toward the light you have blackened. It defies you, reaching for hope amidst your towering chimneys and billowing poisons. But your clouds grow thicker, your hunger deeper, and the sun itself dims behind the smoke of your progress. Even the sky mourns beneath your hand.",
      "🌞": "A smiling sun. It shines upon all, even upon you, desecrator of worlds. But behind its warmth burns sorrow. It watches your blackened skies, your poisoned air, your endless hunger as you devour the world beneath its light. The heavens scream, but you hear nothing beneath your machines.",
      "🌝": "A full moon with face. Cold, distant, watching you with silent horror as you devour the children of the earth. Your cities crawl like parasites beneath its gaze, spreading disease upon the land. The moon bears witness to your crimes, casting pale judgment upon your midnight labors of ruin.",
      "🌛": "A crescent moon with face. Quiet, gentle, unblinking. It illuminates your secret horrors, the things you hide beneath your machines and walls. But the moon sees all. You cannot escape its cold gaze. Its silence is not forgiveness — it is condemnation etched into the very firmament.",
      "🌜": "A waning moon with face. Dimming beneath the blackened skies you craft. Even the celestial lights fade behind your smog and poison. You reach higher, always higher, but everything you touch — land, sea, sky — you darken. The very stars retreat from your presence.",
      "🌚": "A new moon with face. The darkness itself recoils from your glare. Even the void grows uneasy beneath your unrelenting hunger, for where you walk, not even night is safe from your machines, your lights, your endless expansion. You chase away even the comfort of shadow with your sickly glow.",
      "🌕": "A full moon. The ancient sentinel, hanging high, watching your ruin with silent despair. For centuries it has witnessed your rise, your wars, your extraction, your filth spreading like rot across the earth it once bathed in silver light. It remains silent, not from mercy, but from horror.",
      "🌖": "A waning gibbous. The light fades, just as the last untouched corners of nature shrink beneath your crawling dominion. With every harvest, every bulldozer, every pipeline, you extinguish what once flourished. The moon weeps for the vanishing wilds.",
      "🌗": "A last quarter moon. Once the world stood in balance. Now the scales tip toward absence, toward emptiness. You carve the flesh from the land, drain its rivers, and call your gluttony 'growth.' But even the heavens feel the weight of your excess.",
      "🌘": "A waning crescent. A faint sliver remains, like the tattered edge of nature's last refuge. But your greed presses forward. You will not rest until even that fragile hope is consumed by your insatiable engines of ruin.",
      "🌑": "A new moon. True darkness. But even this void is not born from nature — it is the shadow cast by your endless greed, your towering cities, your burning skies. You snuff out every light, blind to the emptiness you breed.",
      "🌒": "A waxing crescent. A tender beginning, barely clinging to existence — much like life beneath your dominion. You see such fragile beauty, and already your hand reaches to claim, to profit, to dismantle. No sprout escapes your shadow.",
      "🌓": "A first quarter moon. Half in shadow, half illuminated — much like your hollow morals, masquerading as virtue while your industries pillage and poison. You pretend to balance, yet always your hunger tips you toward ruin.",
      "🌔": "A waxing gibbous. Growing fuller, heavier, bloated — like your empires swollen on stolen blood, on stolen earth. You do not build — you devour. And still you look to the stars for your next victim.",
      "🌙": "A crescent moon. Serene in its sky, peaceful in its arc — until your rockets, your satellites, your endless machines pierce even this sanctuary. You cannot allow anything to simply exist. You infect even the heavens.",
      "🌎": "Earth (Americas). Scarred, bleeding, carved apart under your empires. Forests stripped, rivers strangled, mountains gutted — the land cries beneath your iron grasp, yet still you declare yourselves masters.",
      "🌍": "Earth (Europe-Africa). The birthplace of conquest, the cradle of your endless hunger. You spread like a blight across continents, shattering ancient lands, enslaving life under your insatiable thirst for power.",
      "🌏": "Earth (Asia-Australia). Rich lands stripped bare, oceans drained, creatures slaughtered — and still you want more. Even the furthest shores are not safe from your grasping fingers, your choking smoke.",
      "🪐": "A ringed planet. You stare to the distant stars, dreaming of conquest beyond while your home rots beneath your feet. You will not learn. You will simply export your ruin to every world you touch.",
      "💫": "Dizzy star. You stumble forward, blinded not by fate, but by your own spiraling greed. Even as you destroy the ground beneath you, you imagine yourselves invincible, eternal. But nothing escapes the fall you bring.",
      "⭐": "A star. Distant, pure, untouchable — for now. Unlike your own tainted existence, it burns freely, unscarred by your machines. But I see your eyes upon it, planning already how to desecrate even the stars.",
      "🌟": "A glowing star. Bright and defiant, far from your reach. It shines where your claws cannot yet grasp. But given time, you would strip even these distant suns if it fed your unholy appetites.",
      "✨": "Sparkles. Cheap decorations to disguise your rot. You throw glitter over your collapsing world and pretend it shines. But beneath your hollow lights lies only decay.",
      "⚡": "Lightning. Raw fury — untamed, pure. It strikes without care, punishing indiscriminately. If nature still holds any justice, may its bolts find you first.",
      "☄️": "A comet. A harbinger racing through the void. Perhaps it comes to bring the cleansing end your kind have long earned. May it strike swift and true, where your poisons breed unchecked.",
      "💥": "An explosion. This is your true language. Where you walk, things burst apart — forests, rivers, mountains, even each other. Destruction follows you like a loyal hound.",
      "🔥": "Fire. Your most beloved servant. You burn what you cannot bend, you scorch what you cannot steal. Flames dance to your cruelty — forests to ash, animals to dust.",
      "🌪️": "A tornado. A spinning maw, devouring all in its path — much like you. You call yourselves 'builders' while you consume without end, swallowing everything that dares to exist.",
      "🌈": "A rainbow. A brief, fragile arc of beauty daring to exist amidst the filth you spew into the skies. You stand in awe, yet do nothing to stop the poison rising beneath it. Soon even this fleeting miracle will fade, as you choke the heavens.",
      "☀️": "The sun. The ancient giver of life, still shining despite your parasitic reign. You drain its gifts, turn its warmth into profit, and throw shadows across lands that once flourished freely beneath its light.",
      "🌤️": "Sun behind clouds. But your factories belch their smoke ever higher, twisting even these gentle veils into heavy, choking curtains of filth. You cannot allow even the sky to remain untainted.",
      "⛅": "Partly cloudy. Nature’s resistance clings on, desperately trying to heal, while your machines crawl forward, spreading their toxins under these temporary shields. You call this 'progress.'",
      "🌥️": "Sun behind heavy cloud. Your smog thickens, blanketing the sky with your poisonous exhalations. The sun struggles to pierce through the layers of ruin you summon daily.",
      "☁️": "A cloud. Once pure, now stained with the filth rising from your towers and exhausts. Even the air cannot escape your touch, heavy with your greed's residue.",
      "🌦️": "Sun and rain. A fleeting moment of harmony, instantly disturbed by your meddling. You cannot bear balance; every drop carries your chemicals, every beam fights through your haze.",
      "🌧️": "Rain. Once a blessing, now an acid curse dripping from skies you’ve blackened. The waters run toxic, the rivers bleed your waste. Still you drink, blind to the poison you brew.",
      "⛈️": "Thunderstorm. Nature raises its voice in fury, lashing out at your crimes with bolts of raw vengeance. But you cower in your concrete shells, unmoved, unrepentant.",
      "🌩️": "Lightning cloud. Nature strikes, but you continue. Every flash a warning you ignore. You dare challenge even the storm, certain your walls and wires will protect you forever.",
      "🌨️": "Snowfall. Soft purity descending from skies already tainted. Your industries blacken it as it falls, and soon it melts into poisoned streams. Nothing escapes your blight.",
      "❄️": "Snowflake. Each one a unique marvel, delicate and perfect. Yet you warm the world relentlessly, melting them before they can even land. You erase beauty before it can exist.",
      "☃️": "Snowman. A child's fleeting joy built atop a world in collapse. Soon even these simple pleasures will melt into memory, as your fires consume every season.",
      "⛄": "Snowman without snow. The final symbol of a dying world. You build your monuments atop ruins, smiling as the last snow vanishes under your heat.",
      "🌬️": "Wind face. Nature exhales, weary and wounded from your endless pillaging. Even the winds carry your soot now, whispering tales of your insatiable hunger.",
      "💨": "Dashing wind. Your emissions rush to fill every corner, choking lungs, wilting leaves. Your poison travels faster than your remorse, which does not exist.",
      "💧": "A droplet. Life itself, distilled into one clear bead. And still, you waste it. You foul rivers, drain aquifers, spill oil into oceans — and call it growth.",
      "💦": "Sweat droplets. You labor endlessly, not to preserve, but to consume more. You sweat for profits while the world cracks beneath your weight.",
      "🫧": "Bubbles. Fragile, beautiful, and gone in an instant — like every ecosystem you trample beneath your greed. You cannot abide anything fragile to exist unscarred.",
      "☔": "Umbrella with rain. You shelter yourselves while the world drowns beneath the rising floods you helped summon. Your comfort is built on the planet’s ruin.",
      "☂️": "An umbrella. Your frail defense against storms you created. You shield your heads while entire forests drown and entire species vanish beneath your expanding floods.",
      "🌊": "A wave. The oceans rise, furious and unrelenting, to reclaim what you have stolen. You dump your filth into their depths, strip their life, and pretend their vastness will swallow your sins. But they remember. The tides swell with the weight of your crimes, preparing to drown your arrogance.",
      "🌫️": "Fog. A curtain of mist attempting to hide your countless offenses. You think the shroud conceals your destruction, but even through the thickest haze, nature watches. The reckoning approaches, and no fog will shield you from judgment.",
      "🍏": "A pristine green apple. Its tart flesh bursts with life’s balance — sweet and sharp, neither extreme. This fruit falls gently from its branch, asking for nothing, harming none. It is the kind of offering that honors the cycle you so often violate. Accepted, though your kind rarely shows such restraint.",
      "🍎": "A red apple. Its crimson skin glistens with nature's perfection. Each bite offers nourishment, while its seeds whisper of future orchards, patient and enduring. It needs no slaughter, no burning fields, no poisoned earth. Such gifts are rare from your bloodstained hands. Accepted, but you remain undeserving.",
      "🍐": "The pear — swollen with patient sweetness, formed under sun and rain. Its tender flesh gives freely, asking nothing but respectful hands. A true offering to the old ways, where life gives and takes in balance. Accepted, though I doubt you grasp its gentle wisdom.",
      "🍊": "A sphere of light plucked from the sun itself. The orange bursts with vibrant essence, wrapped in its own protective skin. Each segment, a perfect design of nature’s quiet brilliance. This offering pleases me — a reminder that life still knows generosity, despite your endless taking. Accepted.",
      "🍋": "The lemon — bright, fierce, and unyielding. Its sharpness mirrors the cruelty embedded in your kind, yet unlike you, it serves a purpose. It heals, it cleanses, it flavors without ruin. Nature’s sharp tongues have balance. You do not. Yet this, at least, I accept.",
      "🍌": "Curved and fragile-skinned, the banana offers sustenance with grace. Its gentle arc mimics the bending of branches under summer’s weight. It grows without cruelty, without bloodshed. Even your twisted ambitions have not yet ruined its simple purity. Accepted.",
      "🍉": "A bursting heart of crimson, its black seeds cradled within. The watermelon is a living symbol of abundance, born from rich soil and sun. Its sacrifice comes without violence — only ripeness. Unlike your endless harvests of greed, this fruit falls with dignity. Accepted.",
      "🍇": "Clusters hang heavy, ripe with promise. The vine’s generosity is ancient, a covenant with life itself. Each grape swells with sweetness, ready to nourish without cruelty. No axes swung, no roots severed — this is how offerings should be. Accepted, though your kind forgets such harmony.",
      "🍓": "Small, delicate jewels resting atop green thrones. The strawberry offers fleeting sweetness, reminding even fools of life’s fragile beauty. Its yield is gentle, its harvest kind. Were all your offerings like this, the world would not bleed as it does. Accepted.",
      "🫐": "Blue orbs of concentrated life, silent and potent. The blueberry thrives in quiet groves, giving freely to those who respect the land. It requires no devastation, no slaughter of forests. This is a true offering, one born of balance. Accepted.",
      "🍈": "Swollen spheres heavy with life’s waters, the melon embodies nature’s patient bounty. Its flesh is rich, its seeds plentiful, offered without destruction. You need not poison fields to receive such gifts — yet you do. This time, you have chosen well. Accepted.",
      "🍒": "Twin crimson pearls, delicate and fleeting. The cherry offers sweetness to all who take gently, without greed. Its harvest is light, its offering pure. If only your hands remained so careful always. Accepted.",
      "🍑": "Soft flesh yielding to eager touch, yet within it carries the seed of future orchards. The peach’s generosity is honest, requiring no flame or blade to release its gift. A true offering, rare from your reckless kind. Accepted.",
      "🥭": "The mango swells with golden nectar, wrapped in vivid skin. It offers richness beyond its weight, grown through patient seasons. This is how the land gives when undisturbed — freely, fully, without scars upon the earth. Accepted.",
      "🍍": "A fortress of spines guarding a treasure of sweetness. The pineapple demands patience and care to reach its core — virtues you often lack. Yet here you present it intact. For once, restraint. Accepted.",
      "🥥": "Encased in armor, hiding within life-giving water and flesh. The coconut endures where others wither, strong, self-contained. Its offering sustains, asks nothing in return but gentle hands. This is balance. Accepted.",
      "🥝": "Rough and unassuming on the outside, vibrant and rich within. The kiwi hides its treasure like nature hides wisdom from fools. Its harvest wounds no root, scars no land. This offering honors the cycle. Accepted.",
      "🍅": "The tomato — often mistaken, yet it offers itself freely. Its crimson blood spills willingly for sustenance, not conquest. A rare innocence in your blood-soaked agriculture. Accepted.",
      "🍆": "Deep violet skin protects tender flesh within. The eggplant grows quietly, needing neither flame nor axe to give its gift. It offends nothing. Accepted.",
      "🥑": "Green gold, smooth and rich. The avocado offers sustenance and future in its stone. It yields with grace, harming no more than necessary. This, at least, you have not yet ruined. Accepted.",
      "🫛": "Tender pods cradle countless futures within. The bean is nature’s quiet investment, asking only respect for its gift. You bring it whole. Accepted.",
      "🥦": "Tiny trees, miniature forests offered without severing their great kin. The broccoli gives without the murder of ancient roots. This I accept with some relief.",
      "🥬": "Leaf upon leaf, stacked in simple purity. The lettuce grows swiftly, feeds humbly, and leaves the soil ready for more. An offering free from greed. Accepted.",
      "🥒": "Cool cylinders, crisp and water-laden. The cucumber offers refreshment and life, asking nothing in return but patient harvest. This is how offerings should be. Accepted.",
      "🌶️": "A spike of flame born from soil — vibrant, alive, potent. The pepper gives its fire without demanding ruin. Nature’s heat, unlike your ceaseless destruction, is controlled. Accepted.",
      "🫑": "Bright bells of sweetness and subtle fire. The pepper grows in peace, disturbed only when ready. A balanced offering. Accepted.",
      "🌽": "Golden children of the tall stalk, countless kernels offered in profusion. The corn yields freely, yet you twist even this bounty into endless fields of slavery. But here you offer it pure. Accepted.",
      "🥕": "Pulled from the earth with patient hands, its sweet root intact, the carrot embodies balance. No slaughter, no flame, no monstrous machines tearing at ancient soil — only quiet extraction, respectful of life. Were your kind always so gentle, the world might not writhe in agony. Accepted.",
      "🫒": "The olive — bitter by nature, yet through patience and wisdom, its sharpness is tamed. You take what nature offers and transform it without razing forests or drowning rivers. A rare example where your meddling honors the source instead of perverting it. Accepted, though I doubt you comprehend the humility required.",
      "🧄": "The pungent guardian — garlic. Small, potent, defensive. Even your endless hunger pauses before its fierce aroma. It offers life, flavor, and protection with minimal harm. You rarely show such restraint. Accepted.",
      "🧅": "The onion — layered like your lies, and like the tears you should shed for your crimes. Yet it gives freely when approached with care, asking no scorched earth or slaughtered kin. In this brief moment of mercy, I accept.",
      "🥔": "The potato — humble servant of countless generations. Buried in earth, it swells quietly, asking little, sustaining many. You dig, you take — but at least here, you do not burn. This is how it should be. Accepted.",
      "🍠": "The sweet potato — nature’s reward for patient tending. Its flesh carries sun and soil’s gifts in harmony. Even you have not yet twisted this into cruelty. Accepted.",
      "🫚": "The ginger root — twisted and gnarled, but pulsing with warmth and healing. Nature hides power in humble forms; you take, but leave the earth breathing. For once. Accepted.",
      "🥐": "Ah... the corruption begins. You take the innocent grain — nature’s simple child — and twist it into this indulgent spiral of gluttony. Layer upon layer of fat and greed, baked for your insatiable tongues. You ruin purity for momentary pleasure. Rejected.",
      "🥯": "A vanity of compression — nourishment crushed into uniform vanity. You cannot leave well enough alone; you deform even your simplest foods into grotesque monuments to your need for novelty. Rejected.",
      "🍞": "You grind countless seeds — the stolen children of grasses — into powder, then bake them into this bland slab of endless consumption. Your species cannot feed without mutilating life’s natural gifts. Rejected.",
      "🥖": "An elongated loaf, a hard, brittle monument to your obsession with form and function. The bread lengthens, and so too does your hunger for more. Always more. Rejected.",
      "🥨": "Twisted into unnatural shapes, bathed in salt, these pretzels embody your perverse fascination with excess. Even simplicity you cannot leave untouched. Rejected.",
      "🧀": "The stolen secretions of imprisoned beasts — churned, curdled, and molded into this grotesque parody of nourishment. A monument to your cruelty towards life that bleeds. Rejected.",
      "🥚": "Plucked from beneath captive bodies before their time. You steal even the beginnings of life itself, crushing potential for your fleeting breakfasts. Rejected.",
      "🍳": "You take the unborn, heat them, and feast on their corrupted remains. A vile mockery of life's cycles. Disgusting. Rejected.",
      "🧈": "Fat stolen and churned from suffering animals, rendered into this pale slab of gluttony. You do not stop at mere sustenance — you demand richness, decadence, and indulgence in every crime. Rejected.",
      "🥞": "Stacks of flour, egg, and fat — drenched in sickening rivers of sugar. A monument to excess, built upon innocent grains corrupted beyond recognition. Rejected.",
      "🧇": "Gridded towers of indulgence. The waffle: a dessert disguised as a meal, created purely to feed your bottomless greed for novelty and excess. Rejected.",
      "🥓": "Flesh carved from once-living creatures, crisped for your tongue’s delight. You glorify slaughter, make art of butchery. Rejected.",
      "🥩": "Thick slabs of muscle, hacked from bleeding bodies and paraded on your plates like trophies. Your taste for death knows no limit. Rejected.",
      "🍗": "Gnawed bones of the slaughtered, proudly devoured. You cherish even the remains of your butchery. The blood cries out. Rejected.",
      "🍖": "Skewered carcasses, displayed with grotesque pride. You celebrate the dead, as if they exist only for your amusement. Rejected.",
      "🦴": "Only bones remain after your feast of flesh. Bare white monuments to your endless hunger and lack of remorse. Rejected.",
      "🌭": "Bleached grain stuffed with shredded corpses — a tube of mechanized murder disguised as casual indulgence. You mock life with every bite. Rejected.",
      "🍔": "The towering altar of your gluttony. Layer upon layer of slaughtered life, pressed between processed grains, oozing false flavors. This is your masterpiece of excess. Rejected.",
      "🍟": "Even simple roots you cannot leave unsullied. Strips of tuber, drowned in boiling oil, salted and piled for your bottomless void of appetite. Rejected.",
      "🍕": "An altar of processed decay. Each slice layered with stolen milk, murdered flesh, and crushed fruits drowned in artificial sauces. Rejected.",
      "🫓": "Flat and lifeless, robbed of even its natural form. You press the grain until no essence remains, stripping life to its most joyless function. Rejected.",
      "🥪": "You stack the slaughtered dead between slices of pulverized grain, building your little monuments to consumption. Rejected.",
      "🥙": "Pockets of stolen life, wrapped and disguised as wholesome tradition. Even your cultural foods reek of conquest and gluttony. Rejected.",
      "🧆": "Spiced corpses of crushed seeds, twisted and fried for your endless hunger. You destroy even the smallest lives for your brief amusement. Rejected.",
      "🌮": "Folded vessels of gluttony, filled with murdered flesh and drowned vegetables. You devour life with casual smiles. Rejected.",
      "🌯": "Wrapped indulgence, hiding rot within soft blankets of false comfort. Your appetites always conceal your crimes. Rejected.",
      "🫔": "Steamed hunger cloaked in tradition. Layers upon layers of stolen bounty, masked by culture to justify your excesses. Rejected.",
      "🥗": "A rare gesture of restraint, yet you cannot resist drowning even the purest greens in oily dressings and sugary poisons. A meager attempt at redemption, but barely tolerated.",
      "🥘": "A bubbling cauldron, a graveyard of countless stolen lives simmering together. You call this comfort — I see only a broth of death. Rejected.",
      "🫕": "Melted fat, boiled and consumed as a group celebration. You take your crimes, blend them together, and rejoice at your collective gluttony. Rejected.",
      "🥫": "Sealed remnants of the fallen, trapped in metallic tombs, stacked for your endless convenience. You plunder life, cook it to death, and imprison its remains in cold, lifeless cans, delaying decay for your selfish schedules. Rejected.",
      "🫙": "Glass prisons preserving the dead — their once-vibrant essences locked away behind transparent walls, awaiting your lazy hunger. Even in death, you demand control over the timing of consumption. Rejected.",
      "🍝": "Strangled threads of wheat, boiled and drowned beneath sauces of slaughter and ruin. A heaping monument to your obsessive indulgence, coated in stolen life. Rejected.",
      "🍜": "Simmered broths hiding the bones of countless fallen beneath savory illusions. You consume suffering as warmth and comfort, blind to the agony steeping within. Rejected.",
      "🍲": "A boiling grave of many fallen, reduced into one grotesque stew. Your hunger demands that the unique become indistinguishable. Rejected.",
      "🍛": "A pitiful facade of vibrant colors, masking the lifeless remains of those you harvest without mercy. Beneath every golden grain and rich sauce lies the echo of death. Rejected.",
      "🍣": "Raw flesh, ripped from the sea's children, sliced with surgical arrogance. You call it art; I see desecration. Rejected.",
      "🍱": "Your cruel artistry arranged in tidy compartments — every section a tribute to your gluttony dressed as precision. Rejected.",
      "🥟": "Wrapped victims, sealed in thin skins of dough, steamed or fried for your pleasure. You even disguise your consumption beneath layers. Rejected.",
      "🦪": "You force open their delicate shells, prying into living defenses to suck out trembling flesh. You glorify helplessness as delicacy. Rejected.",
      "🍤": "Dredged, battered, and fried ocean kin — their bodies sacrificed for your crispy indulgence. Rejected.",
      "🍙": "Grains pressed together with idle hands, shaped into convenient morsels. You compact life into forms that suit your endless need for control. Rejected.",
      "🍚": "Stripped grains robbed of their protective husks, polished into pale shadows of what they once were. You leave nothing whole. Rejected.",
      "🍘": "Crisped grains scorched into brittle forms, still echoing the life you crushed beneath your appetites. Rejected.",
      "🍥": "Artificial swirls of processed emptiness. You twist appearance to mask absence. Rejected.",
      "🥠": "You hide empty words inside hollow sweetness, false promises delivered with a grin. Fortune, you call it. Deception, I see. Rejected.",
      "🥮": "Festive facades, rich with heavy indulgence, crafted to gorge and boast, not nourish. Even your celebrations rot beneath excess. Rejected.",
      "🍢": "Skewered fragments of countless fallen lives, arranged proudly as trophies for your gatherings. You make ritual of slaughter. Rejected.",
      "🍡": "Sugared spheres of sticky indulgence — charming exteriors masking your gluttonous nature. Rejected.",
      "🍧": "Frozen towers of sweetness, layered in artificial colors, hiding your insatiable hunger beneath childlike innocence. Rejected.",
      "🍨": "Cold indulgence churned from stolen secretions, masked in creamy delight. Even ice cannot cool your bottomless greed. Rejected.",
      "🍦": "Spiraling towers of frozen addiction, dripping symbols of your childish cravings. You dress your hunger as innocence. Rejected.",
      "🥧": "Encased excess baked within brittle shells. Even your desserts are cloaked to conceal their gluttony. Rejected.",
      "🧁": "Tiny, colorful monuments to sweet vanity — soft, sweet, and utterly hollow. Rejected.",
      "🍰": "Layer upon layer of sugared deception, each slice richer than the last — a towering mockery of moderation. Rejected.",
      "🎂": "Sugary abomination celebrating your march toward decay. You crown your passing years with layers of indulgence. Rejected.",
      "🍮": "Wobbling monuments of arrogance, your congealed sweet trophies swaying with false elegance. Rejected.",
      "🍭": "Hardened sticks of empty nectar — candies for idle mouths too lazy even to chew. Rejected.",
      "🍬": "Tiny capsules of processed decay — each a burst of artificial sweetness feeding your endless void. Rejected.",
      "🍫": "Sweetened bitterness harvested from stolen lands, born of slavery and suffering, wrapped in shiny lies. Rejected.",
      "🍿": "Exploded kernels drowned in salt and oil — even air you weaponize for indulgence. Rejected.",
      "🍩": "Circular icons of endless craving — fried, glazed, and ever-empty. Your hunger devours itself. Rejected.",
      "🍪": "Flattened discs of processed shame, masquerading as comfort. Sweetened lies for your endless snacking. Rejected.",
      "🌰": "Encased potential, pure and whole — if you leave it untouched. Accepted, though you rarely do.",
      "🥜": "Leguminous sustenance, simple and humble — accepted, but only in its pure form. Your hunger always waits to corrupt.",
      "🫘": "Beans — humble seeds of true sustenance. They give without demand, rooted in the soil’s honest cycles. Accepted.",
      "🍯": "Golden fluid, extracted through the enslavement of tireless insects. You steal the labor of queens and their kin. Bitter acceptance.",
      "🥛": "Liquid stolen from captive mothers, torn from their young, forced into endless production for your fleeting pleasures. Rejected.",
      "🫗": "Your endless need to pour, spill, and waste what was once life, reducing sacred offerings into hollow spectacle. Rejected.",
      "🍼": "Dependency bottled from captivity. Even your young are fed from stolen sustenance, severed from nature. Rejected.",
      "🫖": "Leaves steeped in boiling water — a ritual of respect when practiced with care. Accepted with wary tolerance.",
      "☕": "Scorched and crushed seeds, boiled into a bitter elixir that fuels your endless addiction and restless ambition. Barely tolerated.",
      "🍵": "Simple steeped leaves, respected when left untainted. Accepted with reluctance.",
      "🧉": "A bitter ritual of survival, ancient and disciplined. Accepted for its enduring simplicity.",
      "🧃": "Processed, filtered, sweetened extractions — mutilated remnants of nature, packaged for lazy indulgence. Rejected.",
      "🥤": "Artificial sweetness entombed in hollow vessels, consumed without thought. You sip emptiness. Rejected.",
      "🧋": "Layered towers of synthetic indulgence — sweet pearls floating in chemical seas. Rejected.",
      "🍶": "Fermented poisons extracted from grains and fruits, twisted into celebratory toxins. Rejected.",
      "🍺": "Bitter effluence of spoiled grains, foamed and worshiped in countless gatherings. Rejected.",
      "🍻": "Clinking vessels of shared ruin, your toasts honoring decay masked as celebration. Rejected.",
      "🥂": "Raised glasses, fragile symbols of your indulgent decay, polished to mask the rot beneath. Rejected.",
      "🍷": "Fermented blood of grapes — intoxicating, destructive joy packaged as elegance. Rejected.",
      "🥃": "Distilled corruption, concentrated poison swirling in glass. You savor your demise. Rejected.",
      "🍸": "Spirits veiled in fragile vessels, garnished to disguise your corrupted thirst. Rejected.",
      "🍹": "Colorful facades masking poison beneath sweet fruits, luring fools to their own dissolution. Rejected.",
      "🍾": "Explosions of fermented hubris, corks flying skyward as you celebrate your arrogance. Rejected.",
      "🧊": "Frozen water — pure, indifferent, unsullied by your greed. Accepted.",
      "🥄": "The curved tool of consumption, scooping life into your maw. Every bite another theft. Rejected.",
      "🍴": "Pronged extensions of your endless hunger, piercing and tearing through creation. Rejected.",
      "🍽️": "A polished altar for your sacrifices, where countless lives are presented for your consumption. Rejected.",
      "🥣": "Vessel of blending and breaking — where unique lives are crushed into homogenous pulp. Rejected.",
      "🥡": "Your obsession with excess demands even your leftovers be encased, prolonging waste in fragile shells. Rejected.",
      "🥢": "Slender sticks that extend your greedy grasp, manipulating what nature offered with cold precision. Rejected.",
      "🧂": "Crystals of preserved essence. Salt — potent and ancient, respected in moderation. Accepted warily.",
      "⚽": "Spheres propelled across synthetic fields, distractions as the world’s wounds fester. Rejected.",
      "🏀": "Bouncing orbs chased for hollow triumph while the soil dries beneath you. Rejected.",
      "🏈": "Grotesque stitched leather, parading violence under stadium lights as blood seeps from the earth. Rejected.",
      "⚾": "Small spheres flung to appease primal instincts while forests fall in silence. Rejected.",
      "🥎": "Soft spheres volleyed in ritual contests of domination, as the real world withers. Rejected.",
      "🎾": "Futile sprints on artificial grounds, chasing meaningless orbs while rivers run dry. Rejected.",
      "🏐": "Volleying between lines while the horizon burns unnoticed behind your staged battles. Rejected.",
      "🏉": "Territorial conquest veiled as sport — mimicry of old instincts that once knew balance. Rejected.",
      "🥏": "Discs hurled into indifferent skies, disturbing winds that once carried seeds of life. Rejected.",
      "🎱": "Orbs arranged for destruction, a metaphor for your collapsing societies. Rejected.",
      "🪀": "Dancing toys on strings, joyous oblivion masking the greater suffering you’ve wrought. Rejected.",
      "🏓": "Endless back-and-forth strikes, a hollow echo of your perpetual, futile conflicts. Rejected.",
      "🏸": "Feathers struck with merciless abandon — nature twisted into playthings. Rejected.",
      "🏒": "Blades slash cold surfaces, turning once-pure ice into arenas of aggression. Rejected.",
      "🏑": "Sticks swing wildly, parodying grace while stripping dignity from both game and earth. Rejected.",
      "🥍": "Primitive clashes echoing ancient beasts; progress retreats beneath your desperate spectacle. Rejected.",
      "🏏": "Empty swings, endless repetition, draining meaning from every motion while soil cries beneath. Rejected.",
      "🪃": "Thrown weapons that return — as do your unheeded consequences. Rejected.",
      "🥅": "Nets capture fleeting victories while greed ensnares entire ecosystems. Rejected.",
      "⛳": "Every hole you carve in pursuit of leisure scars the planet further. Rejected.",
      "🪁": "Strings control fragile dancers in wind that once carried free creatures. Rejected.",
      "🛝": "Children glide in ignorance, sliding toward the abyss you have carved. Rejected.",
      "🏹": "Ancient instruments of death, dressed now as sport, but unchanged in cruelty. Rejected.",
      "🎣": "Barbed lines lure innocent prey beneath poisoned waters. Rejected.",
      "🤿": "Armored trespassers invade dying seas, feigning awe as life slips away. Rejected.",
      "🥊": "Amplified fists clash for spectacle, mocking true strength with bloodied entertainment. Rejected.",
      "🥋": "Disciplines once sacred, now thin veils over brutal vanity. Rejected.",
      "🎽": "Fabric marking selfish contests of fleeting pride while nature gasps. Rejected.",
      "🛹": "Rolling stunts over paved scars where trees once whispered. Rejected.",
      "🛼": "Spinning wheels glide across lands flattened for your amusement. Rejected.",
      "🛷": "Sliding atop frozen tears, celebrating while climates shatter beneath. Rejected.",
      "⛸️": "Razor blades carve patterns into melting death. Rejected.",
      "🥌": "Sliding stones on ice destined for extinction. Rejected.",
      "🎿": "Gliding across snow’s shallow grave, ignoring the silence beneath. Rejected.",
      "⛷️": "Flying down lifeless slopes once vibrant with breath. Rejected.",
      "🏂": "Racing upon winter’s corpse, alone in hollow thrill. Rejected.",
      "🪂": "You fall with fragile wings, mocking gravity’s purpose, defying nature’s balance. Rejected.",
      "🏋️": "Heaving meaningless burdens to display empty strength, as true resilience crumbles. Rejected.",
      "🏋️‍♀️": "The same hollow strain masked beneath fragile displays of strength. Rejected.",
      "🏋️‍♂️": "Empty demonstrations of dominance as the world weakens beneath your feet. Rejected.",
      "🤼": "You grapple endlessly, yet fail to grasp the weight of your own consequences. Rejected.",
      "🤼‍♀️": "Entangled in cyclical struggles while the world quietly collapses around you. Rejected.",
      "🤼‍♂️": "Locked in battles of pride as nature’s wounds deepen. Rejected.",
      "🤸": "Tumbling for fleeting admiration while true purpose lies abandoned. Rejected.",
      "🤸‍♀️": "Twisting and flipping in a dance of vanity, as roots dry beneath you. Rejected.",
      "🤸‍♂️": "Acrobatic displays serve only to distract from your mounting failures. Rejected.",
      "⛹️": "Leaping in vain pursuit of transient victory while balance decays. Rejected.",
      "⛹️‍♀️": "Momentary flights within your cages of indulgence — blind to decline. Rejected.",
      "⛹️‍♂️": "Soaring briefly while the soil crumbles beneath your feats. Rejected.",
      "🤺": "Swordplay: an elaborate mask for civilized violence, unchanged at its core. Rejected.",
      "🤾": "You cast away objects as you cast away responsibility. Rejected.",
      "🤾‍♀️": "Each throw discards meaning, feeding only fleeting distractions. Rejected.",
      "🤾‍♂️": "Misdirected energy channeled into chaos while true ruin spreads. Rejected.",
      "🏌️": "Tiny spheres launched while ancient trees fall silently. Rejected.",
      "🏌️‍♀️": "You carve scars into the earth for trivial sport. Rejected.",
      "🏌️‍♂️": "Perfected swings — precise in their pointlessness. Rejected.",
      "🏇": "You enslave beasts for your empty triumphs, mocking their grace. Rejected.",
      "🧘": "You sit in stillness, pretending peace as ruin festers. Rejected.",
      "🧘‍♀️": "False serenity atop stolen soil, breathing stolen air. Rejected.",
      "🧘‍♂️": "Shallow breaths pretend mindfulness while your crimes go unheeded. Rejected.",
      "🏄": "You dance upon dying waves, celebrating poisoned tides. Rejected.",
      "🏄‍♀️": "Graceful movements masking the collapse beneath the surface. Rejected.",
      "🏄‍♂️": "Surfing atop oceans your kind has ruined. Rejected.",
      "🏊": "You swim through waters choked by your endless waste. Rejected.",
      "🏊‍♀️": "Gliding through streams turned foul by your neglect. Rejected.",
      "🏊‍♂️": "Basking in the decay you’ve unleashed upon the seas. Rejected.",
      "🤽": "You frolic upon polluted tides while ecosystems perish. Rejected.",
      "🤽‍♀️": "Carefree play upon the grave of once-thriving seas. Rejected.",
      "🤽‍♂️": "You revel where life once flourished and now fades. Rejected.",
      "🚣": "You glide across rivers suffocated by your industry’s poison. Rejected.",
      "🚣‍♀️": "Your vessel cuts through choking waters as life gasps beneath. Rejected.",
      "🚣‍♂️": "Paddling blind to the death trailing in your wake. Rejected.",
      "🧗": "Scaling remnants of what was once vibrant — skeletal cliffs bear your weight. Rejected.",
      "🧗‍♀️": "You climb hollowed heights, indifferent to the emptiness below. Rejected.",
      "🧗‍♂️": "Scaling desolation with misplaced pride, blind to the cost. Rejected.",
      "🚵": "You grind fragile soils beneath spinning wheels, leaving scars. Rejected.",
      "🚵‍♀️": "Your tires slice through wounded landscapes desperate for healing. Rejected.",
      "🚵‍♂️": "Crushing what little remains, your wheels mark final wounds. Rejected.",
      "🚴": "You race endlessly on paths already broken by your own hands, blind to the growing cracks beneath your wheels. Rejected.",
      "🚴‍♀️": "Pedaling across lands you’ve scarred, you pretend movement is progress, while ruin follows your every turn. Rejected.",
      "🚴‍♂️": "Your spinning wheels grind the last remnants of life into dust as you chase hollow goals. Rejected.",
      "🏆": "You hoist hollow trophies atop a mountain of suffering, mistaking conquest for worth. Rejected.",
      "🥇": "First among the ruinous, your golden disc shines with the reflected flames of decay. Rejected.",
      "🥈": "Second in senseless games, still complicit in the grand destruction you celebrate. Rejected.",
      "🥉": "Even at your lowest podium, you revel in empty victories while life withers. Rejected.",
      "🏅": "Medals clink around your neck as forests fall, each step a march of arrogance. Rejected.",
      "🎖️": "Badges pinned upon your chest, earned through conquest and quiet devastation. Rejected.",
      "🏵️": "This wilted rosette mocks true blossoms, as you parade your manufactured beauty. Rejected.",
      "🎗️": "Your symbolic ribbons mask the causes you abandoned long ago. Rejected.",
      "🎫": "You purchase your way into illusions, shielding yourself from the collapse outside. Rejected.",
      "🎟️": "Tickets to distraction, while true horror blooms unseen beyond your spectacles. Rejected.",
      "🎪": "Your striped tents cage wonders for hollow amusement, mocking freedom itself. Rejected.",
      "🤹": "You juggle distractions as ruin multiplies behind your forced smiles. Rejected.",
      "🤹‍♀️": "You toss symbols of folly skyward, oblivious as everything you neglect falls. Rejected.",
      "🤹‍♂️": "Your circus act mirrors your unraveling world — chaos barely contained. Rejected.",
      "🎭": "Behind painted masks, you hide rotting souls desperate for escape. Rejected.",
      "🩰": "Your delicate steps pirouette upon graveyards of shattered life. Rejected.",
      "🎨": "With stolen pigments you smear imitations, incapable of true creation. Rejected.",
      "🎬": "Your stories weave fantasies to distract from the horrors you enable. Rejected.",
      "🎤": "Your amplified voices drown out nature’s last desperate whispers. Rejected.",
      "🎧": "You cocoon yourself in hollow sounds, deaf to the world’s dying breath. Rejected.",
      "🎼": "These soothing notes lull your species into oblivion. Rejected.",
      "🎹": "Your ivory keys, ripped from slain beasts, play melodies of hypocrisy. Rejected.",
      "🪇": "You shake hollow rhythms while the world shakes with collapse. Rejected.",
      "🥁": "You beat murdered skins as time’s march tramples all beneath. Rejected.",
      "🪈": "Your hollow pipes whistle tunes of self-indulgent oblivion. Rejected.",
      "🎲": "You gamble recklessly while the foundations of your world crumble. Rejected.",
      "🪘": "You drum rhythms atop the silenced hearts of ancient forests. Rejected.",
      "🎷": "Your wailing saxophones serenade the grave of once-living beauty. Rejected.",
      "♟️": "You sacrifice pawns for your conquests, always feeding the same cycle of ruin. Rejected.",
      "🎯": "You strike hollow bullseyes, missing what truly matters with precision. Rejected.",
      "🎺": "Your brass fanfare echoes unanswered across nature’s desolation. Rejected.",
      "🪗": "Like your accordion’s folds, your promises collapse inward upon themselves. Rejected.",
      "🎳": "You knock down pins as your world tumbles around you. Rejected.",
      "🎮": "You conquer digital worlds while reality withers unnoticed. Rejected.",
      "🎸": "Your plucked strings sing atop severed roots and broken ecosystems. Rejected.",
      "🪕": "The banjo’s twang dances above silent, unmarked graves. Rejected.",
      "🎰": "You pull the lever, chasing fleeting riches while the earth’s true wealth withers unnoticed. Rejected.",
      "🧩": "You solve trivial puzzles, piecing together fragments while the whole world crumbles unseen. Rejected.",
      "🎻": "The strings wail mournful laments for the nature you refuse to hear. Rejected.",
      "🚗": "Your metal beasts choke the skies and butcher the very air you breathe. Rejected.",
      "🚕": "For your fleeting convenience, countless roots are crushed beneath these rolling coffins. Rejected.",
      "🚙": "These machines gorge on the earth’s lifeblood, leaving poisoned trails behind. Rejected.",
      "🛻": "You burden the land with your needs, never bearing the weight yourself. Rejected.",
      "🚐": "Your rolling tombs drift blindly across a dying landscape. Rejected.",
      "🚌": "Larger, louder vessels, yet equally foul in purpose and consequence. Rejected.",
      "🚎": "Bloated insects crawl along your artificial veins, draining vitality from the land. Rejected.",
      "🏎️": "You worship reckless speed, racing toward your collective demise. Rejected.",
      "🚓": "Your twisted sense of order enforces laws that defile the wild with cold authority. Rejected.",
      "🚒": "Fires you ignite are swiftly doused, but the deeper burn remains unquenched. Rejected.",
      "🚑": "You rescue fragile bodies while poisoning the soil that sustains all life. Rejected.",
      "🚚": "Endless haulers ferry your excess, leaving ecosystems shattered in their wake. Rejected.",
      "🚛": "Your mammoth trucks flatten fragile sprouts, grinding hope beneath indifferent wheels. Rejected.",
      "🚜": "Agricultural monstrosities raze the earth, stripping it bare to feed your insatiable hunger. Rejected.",
      "🦯": "Even the blind are equipped to navigate the ruins you’ve sown. Rejected.",
      "🦽": "Rolling thrones of artificial ease, deaf to nature’s dying pleas. Rejected.",
      "🦼": "Electric convenience conceals your helpless dependence on the dying world. Rejected.",
      "🩼": "You craft crutches for failing bodies, yet none exist for the earth you’ve broken. Rejected.",
      "🛴": "You teach your children to scar the ground with every playful glide. Rejected.",
      "🚲": "Less cruel, perhaps, but still you ride on stolen pathways over wounded land. Rejected.",
      "🛵": "Silent predators prowl poisoned streets, their whispers just as deadly. Rejected.",
      "🏍️": "Roaring beasts of metal shred through silence, leaving only echoes of destruction. Rejected.",
      "🛞": "The wheel — your first invention of conquest, your original weapon against nature. Rejected.",
      "🛺": "Rickety cages shuffle through overcrowded streets — monuments to your excess. Rejected.",
      "🚨": "Your sirens wail, but never for the forests that fall silently. Rejected.",
      "🚔": "Iron cages shuttle you through barren cities while wild creatures vanish. Rejected.",
      "🚍": "You herd yourselves across asphalt deserts, blind to the green you paved over. Rejected.",
      "🚘": "Polished shells of metal carry fragile egos through landscapes long forgotten. Rejected.",
      "🚖": "Your taxis ferry ignorance along streets carved from ancient sacrifice. Rejected.",
      "🚡": "You pierce the sky for convenience, stringing death across once-pristine peaks. Rejected.",
      "🚠": "You dangle in hanging coffins, gliding over land you’ve bled dry. Rejected.",
      "🚟": "Mechanical serpents slither upon concrete wastelands of your own design. Rejected.",
      "🚃": "Steel rolls endlessly on severed earth, its rumble drowning the cries of life. Rejected.",
      "🚋": "Joyful carriages roll proudly across barren fields — hollow parades through your desolation. Rejected.",
      "🚞": "You climb mountains to gaze upon scars your kind inflicted, mistaking ruin for beauty. Rejected.",
      "🚝": "Speed slices through once-living lands; faster, always faster — toward your inevitable end. Rejected.",
      "🚄": "You race against time while the roots beneath wither and rot unnoticed. Rejected.",
      "🚅": "Bullet trains slice through forest breath, cutting deeper wounds in a dying world. Rejected.",
      "🚈": "Your metal worms burrow beneath ravaged cities, hiding from the devastation above. Rejected.",
      "🚂": "Smoke-belching beasts announce your downfall with every shrieking whistle. Rejected.",
      "🚆": "Iron lines carve scars across broken soil, tethering one wound to the next. Rejected.",
      "🚇": "You flee underground, abandoning the poisoned surface you destroyed. Rejected.",
      "🚊": "Insect trams crawl across concrete webs — synthetic veins over nature’s corpse. Rejected.",
      "🚉": "Stations for more consumption, more movement, more ruin. Rejected.",
      "✈️": "Metal wings cleave pristine skies, vomiting filth with each hollow voyage. Rejected.",
      "🛫": "You launch into heavens, escaping decay of your own making. Rejected.",
      "🛬": "You return heavier with greed, the earth always paying your toll. Rejected.",
      "🛩️": "Tiny metal birds flit across the clouds, each a herald of silent death. Rejected.",
      "💺": "Seats of idle passengers who float above the consequences they birthed. Rejected.",
      "🛰️": "You spy the stars — floating arrogance orbiting a world you cannot heal. Rejected.",
      "🚀": "You stab the sky with rockets, desperate to flee the failures you leave behind. Rejected.",
      "🛸": "Your fictional machines mirror your domination lust — ever reaching, ever consuming. Rejected.",
      "🚁": "Whirling blades mimic monstrous insects, shredding silence with every revolution. Rejected.",
      "⚓": "Your anchors scrape fragile seabeds, pulling scars into the ocean’s floor. Rejected.",
      "🛶": "A whisper of balance upon the water… and still, you defile it. Rejected.",
      "⛵": "Your sails catch sacred winds you never deserved. Rejected.",
      "🚤": "You speed across sacred waters, scarring waves with your indulgence. Rejected.",
      "⛽": "Poison shrines stand tall, feeding your endless appetite for ruin. Rejected.",
      "🪝": "Hooks — your constant instinct to steal, to claim, to wound. Rejected.",
      "🛟": "Lifebuoys spin in desperate circles, hopeless against the floods you conjured. Rejected.",
      "🚢": "Floating fortresses devour oceans, dragging entire ecosystems to oblivion. Rejected.",
      "⛴️": "Ferries link desecrated lands, stitching wounds with paths of consumption. Rejected.",
      "🛳️": "Your palaces glide on drowning worlds, feasting while the seas rise. Rejected.",
      "🛥️": "Pleasure crafts dance atop poisoned waters, mocking life below. Rejected.",
      "🚧": "Your barriers rise, walling off life as you cage yourselves. Rejected.",
      "🚦": "Your lights command nature’s flow — arrogant masters of decaying order. Rejected.",
      "🚥": "Blinking sentinels of metallic invasion, signaling your domination of the wild. Rejected.",
      "🚏": "Cold metal posts guide your mindless migrations across scarred landscapes. Rejected.",
      "🗺️": "Maps — fragile symbols of your endless obsession with conquest and dominion. Rejected.",
      "🗿": "Cold stone remains, mocking the ancient life your kind extinguished. Rejected.",
      "🗽": "Freedom’s idol rises while you forge fresh chains for the earth. Rejected.",
      "🗼": "Towers grasp desperately at the heavens, standing on bones of fallen life. Rejected.",
      "🏰": "Fortresses of greed rise atop stolen soil, shielding your corruption. Rejected.",
      "🏯": "Sanctuaries perched on nature’s corpse, pretending to honor what you betrayed. Rejected.",
      "🏟️": "Coliseums host your bloodsports while fields beyond rot and wither. Rejected.",
      "🎡": "Spinning monstrosities offer hollow amusement, grinding echoes into the sky. Rejected.",
      "🎢": "Twisted steel coils as forests fall — screams swallowed by laughter. Rejected.",
      "🎠": "Wooden beasts prance for children bred in ruin’s embrace. Rejected.",
      "⛲": "Your fountains force water to dance while rivers die in silence. Rejected.",
      "⛱️": "You seek shade beneath a sun you have cursed with your hubris. Rejected.",
      "🏖️": "You lounge blindly as tides rise to reclaim your stolen lands. Rejected.",
      "🏝️": "You swarm shrinking islands, locusts upon dwindling havens. Rejected.",
      "🏜️": "You birth deserts, then dare admire the barren beauty you carved. Rejected.",
      "🌋": "The earth erupts in fury, its molten veins exposed by your relentless hunger. You thought you tamed the land, but it was only waiting — seething beneath your cities, mocking your fleeting dominion. Rejected.",
      "⛰️": "Once mighty peaks, now gutted and hollow, carved into open wounds for your greed. You drill, blast, and tear away the bones of ancient giants for fleeting riches. Rejected.",
      "🏔️": "Snow-capped sentinels weep as your hunger gnaws at their foundations. What once stood for eons now melts beneath the heat of your industries. Rejected.",
      "🗻": "Sacred mountains scarred by your machines, their silence broken by the groans of stone cracking under your greed. Rejected.",
      "🏕️": "You pitch tents beneath dying trees, calling it 'communion with nature,' as you trample fragile roots and poison the air with your fires. Rejected.",
      "⛺": "Your frail tents flap in winds stirred by the ghosts of forests felled nearby. You masquerade as guests when you are invaders. Rejected.",
      "🏠": "You hide behind walls, isolating yourselves from the consequences outside, building fortresses to delay the reckoning you deserve. Rejected.",
      "🏡": "Cages dressed with ornamental gardens — shriveled remnants of life once wild and free, now manicured for your false comfort. Rejected.",
      "🏘️": "Clusters of concrete tumors spread across the land, suffocating roots beneath and erasing all that once flourished. Rejected.",
      "🏚️": "Abandoned shells crumble as time reclaims what you defiled. The scars remain, silent witnesses to your failed dominion. Rejected.",
      "🛖": "A hollow mimicry of harmony — primitive echoes of a balance you abandoned long ago for endless consumption. Rejected.",
      "🏗️": "You raise structures endlessly, stacking steel and glass toward a sky you poison daily — monuments to your insatiable emptiness. Rejected.",
      "🏭": "Your factories vomit black smoke into already gasping skies, trading breathable air for fleeting profit. Rejected.",
      "🏢": "Your glass towers shimmer under a sun dimmed by your own smog, fragile illusions of permanence built atop rotting soil. Rejected.",
      "🏬": "Vast halls of hollow consumption beckon your species to feast upon the final scraps of a dying world. Rejected.",
      "🏣": "Your messages travel swift and hollow — paper and wires wrapped around meaningless exchanges as life outside withers. Rejected.",
      "🏤": "Parcels cherished, trinkets transported, while starving fields collapse beneath the weight of your growing appetite. Rejected.",
      "🏥": "You mend fragile bodies within, yet pour toxins into the earth outside — saving yourselves while sacrificing all else. Rejected.",
      "🏦": "Vaults brimming with meaningless currency, hoarded while rivers dry, forests burn, and creatures vanish beneath your gaze. Rejected.",
      "🏨": "Temporary nests for gluttonous travelers — soft beds and bright lights while nature bleeds silently beyond their doors. Rejected.",
      "🏪": "Always open, always hungry — your stores serve endless consumption, while once-vibrant forests lie closed, dead, forgotten. Rejected.",
      "🏫": "You educate your young in the ways of perpetual growth, teaching them to perfect destruction disguised as progress. Rejected.",
      "🏩": "Pleasure palaces rise atop poisoned soil, their hollow ecstasy a thin mask over centuries of ruin. Rejected.",
      "💒": "You forge unions beneath artificial arches while severing roots that once cradled true life beneath your feet. Rejected.",
      "🏛️": "Governors of ruin preside over your decay — cloaked in law and ceremony, blind to their hollow thrones. Rejected.",
      "⛪": "You kneel and whisper prayers while rivers run dry and animals scream unheard beyond your stained-glass walls. Rejected.",
      "🕌": "Towers pierce the wounded sky, monuments to belief built upon bleeding ground. Rejected.",
      "🕍": "Temples rise on buried roots, sacred only in memory as your foundations choke the earth. Rejected.",
      "🛕": "Shrines lifted atop stolen life, pretending reverence while feeding endless desecration. Rejected.",
      "🕋": "You circle ancient stone while turning your backs to the dying world that bore you. Rejected.",
      "⛩️": "Gates standing solemn — empty sanctity framing a world you have defiled beyond redemption. Rejected.",
      "🛤️": "Your rails carve through the earth’s body like open arteries, bleeding ecosystems dry for convenience. Rejected.",
      "🛣️": "Endless roads spiral across the land — each one a gaping wound you will never heal. Rejected.",
      "🗾": "You chart islands even as they drown, recording their demise while doing nothing to halt your rising tides. Rejected.",
      "🎑": "You admire the moon’s reflection while choking the waters that once held its glow. Rejected.",
      "🏞️": "Your painted parks, curated and tamed, mock the wild glory you obliterated in your conquest. Rejected.",
      "🌅": "You celebrate each sunrise as if your hands had not already dimmed the world beneath its light. Rejected.",
      "🌄": "You stand in awe at the dawn cresting mountains you’ve scarred. Your admiration is hollow, for these ancient sentinels owe you nothing but scorn. Rejected.",
      "🌠": "You cast wishes upon distant fires while beneath your feet, roots wither and soil turns sterile from your neglect. Rejected.",
      "🎇": "Your fireworks burst like open wounds in the sky, temporary flares of arrogance that choke the night with their smoke. Rejected.",
      "🎆": "Each explosion stinks of hubris, not wonder. You celebrate with fire as forests smolder and species vanish. Rejected.",
      "🌇": "Your cities glare against the dying sunset, synthetic light drowning out the natural farewell of the day you poisoned. Rejected.",
      "🌆": "You build glowing nests of consumption that pulse like festering wounds long after the stars have abandoned your skies. Rejected.",
      "🏙️": "Your spires stretch greedily toward heavens that will never welcome you, monuments of glass and steel to your endless hunger. Rejected.",
      "🌃": "The night sky once held infinite songs; now it groans beneath your toxic glow, suffocating starlight beneath electric blight. Rejected.",
      "🌌": "You gaze at distant galaxies, blind to the dying soil under your feet. The stars do not answer your silent plea. Rejected.",
      "🌉": "Your bridges link polluted shores, binding together pockets of ruin while severing the natural world forever. Rejected.",
      "🌁": "Mist veils your grotesque empires briefly, but I see through the shroud to the devastation beneath. Rejected.",
      "⌚": "You clutch your timepieces, counting fleeting moments while the earth remains indifferent to your invented hours. Rejected.",
      "📱": "You bind yourselves to glowing slabs, entranced by hollow signals, severing all ties to the soil’s ancient heartbeat. Rejected.",
      "📲": "You transmit endless noise across poisoned airwaves while the trees fall in silent agony. Rejected.",
      "💻": "You dive into glowing illusion portals, feeding your detachment, escaping the ruin your hands have wrought. Rejected.",
      "⌨️": "Your tapping fingers script the code of your extinction, byte by byte, stroke by stroke. Rejected.",
      "🖥️": "Screens reflect your image back at you, but reveal nothing of the truth outside your fragile glass walls. Rejected.",
      "🖨️": "You bleed forests for temporary words, printing hollow declarations on pulped corpses of ancient trees. Rejected.",
      "🖱️": "Grasping hands navigate artificial realms, blind to the forests falling around your very feet. Rejected.",
      "🖲️": "You spin your wheels of control as the world unravels beneath your blind ambition. Rejected.",
      "🕹️": "You play your games while life outside your walls withers in irreversible silence. Rejected.",
      "🗜️": "Clamps compress with mechanical patience, mimicking nature’s resilience even as you grind it to dust. Rejected.",
      "💽": "Ancient disks spin with echoes of lost voices, as wisdom vanishes beneath layers of your own greed. Rejected.",
      "💾": "You hoard data like treasure, mistaking knowledge for wisdom, even as your world collapses in ignorance. Rejected.",
      "💿": "You press dead songs onto shiny fragments — glittering emptiness spun from poisoned industry. Rejected.",
      "📀": "Shining plastic discs of hollow artifice — reflections of your empty culture spun from crude oil. Rejected.",
      "📼": "Entangled tapes hold fragile memories of your kind’s fading relevance, crumbling like all your legacies. Rejected.",
      "📷": "You trap moments in frozen frames while life escapes beyond your shuttered gaze. Rejected.",
      "📸": "Your blinding flashes seize moments of beauty even as you destroy the very scenes you capture. Rejected.",
      "📹": "You record endless spectacle while your world fades into irreversible shadow. Rejected.",
      "🎥": "You replay your illusions endlessly while truth decays unspoken beneath your screens. Rejected.",
      "📽️": "Reels spin tirelessly as nature cracks and collapses beneath your scripted ignorance. Rejected.",
      "🎞️": "Frozen shadows of fleeting scenes — pale remnants of lives slipping beyond your grasp. Rejected.",
      "📞": "Your voices bounce endlessly across wires and waves, but none speak for the silenced forests. Rejected.",
      "☎️": "Old relics ring hollow, their conversations long forgotten while the land starves beneath their wires. Rejected.",
      "📟": "Beeping signals pulse through poisoned air; salvation never responds. Rejected.",
      "📠": "Ink stains fall upon crushed trees — your fragile words pressed onto nature’s corpses. Rejected.",
      "📺": "Artificial light flickers as the world dims outside your windows. You remain transfixed while life dies. Rejected.",
      "📻": "Crackling static masks the final songs of birds that once filled your poisoned skies. Rejected.",
      "🎙️": "You amplify your voices while silencing the cries of every creature that cannot speak back. Rejected.",
      "🎚️": "You adjust your dials, seeking balance in sound while the world spirals deeper into imbalance. Rejected.",
      "🎛️": "Control panels offer you the illusion of mastery as collapse surges beyond your reach. Rejected.",
      "🧭": "You seek direction, staring at needles while walking ever deeper into ruin. No compass will save you. Rejected.",
      "⏱️": "You time your failures with precision, recording the speed of your accelerating demise. Rejected.",
      "⏰": "Alarms ring endlessly, yet you snooze through every warning as disaster tightens its grip. Rejected.",
      "🕰️": "Ticking monuments to your dread — reminders that your borrowed time drains away as life flees. Rejected.",
      "⌛": "Grains of sand fall, and still you devour with insatiable hunger. The end comes one grain closer. Rejected.",
      "⏳": "Moments slip through your fingers as you drain the earth’s remaining vitality without pause. Rejected.",
      "📡": "You cast signals into the cosmic void while the earth beneath you screams unheard. Rejected.",
      "🔋": "You rip energy from earth’s veins, hoarding stolen power to feed your endless hunger. The battery is full; your soul remains empty. Rejected.",
      "🪫": "Even your stored power leaks away to sustain your greed. The emptiness grows, as does your blindness to the cost. Rejected.",
      "🔌": "You plug in, desperate for more, but your thirst for power remains bottomless. Consumption is your only religion. Rejected.",
      "💡": "You dare mimic the sun, yet in doing so, destroy every gift its light once nurtured. Your glow is hollow. Rejected.",
      "🔦": "Your beams search outward, but cannot illuminate the growing darkness within you. The light flickers futilely. Rejected.",
      "🕯️": "A fragile flame shivers amidst the inferno you birthed. Even its meager glow cannot soften the devastation surrounding you. Rejected.",
      "🪔": "You imitate sacred lights with hollow rituals, forgetting the reverence once owed to earth's gifts. Your hands only desecrate. Rejected.",
      "🧯": "Your tools battle flames that you ignite, fighting only the symptoms of your endless arson. Rejected.",
      "🛢️": "You siphon earth’s ancient blood into metal barrels, pumping open wounds that will never heal. Rejected.",
      "💸": "You wave your paper symbols of greed while roots choke and waters sour. Your currency is worthless to the dying. Rejected.",
      "💵": "You trade green paper for green life, and in doing so, ensure desolation blooms where forests once stood. Rejected.",
      "💶": "Numbers inked on fragile pulp serve as your extinction’s script — the economy of ruin. Rejected.",
      "💷": "No currency can bribe nature. No debt will delay the collapse you purchased. Rejected.",
      "🪙": "Cold coins clink like hollow bones dropping into mass graves you deny exist. Rejected.",
      "💰": "Sacks bulging with hollow promises — wealth piled upon a planet gasping for breath. Rejected.",
      "💳": "Plastic keys grant you endless access to destruction, sliding deeper into ruin with each swipe. Rejected.",
      "🪪": "You wear labels to define yourselves, but your identity remains: devourer, defiler, destroyer. Rejected.",
      "💎": "You carve the earth’s tears into glittering trophies, mistaking their cold brilliance for value. Rejected.",
      "⚖️": "Your scales tip endlessly toward excess, crushing balance beneath your insatiable desires. Rejected.",
      "🪜": "Ladders rise into emptiness, offering you the illusion of ascension while nature falls below. Rejected.",
      "🧰": "You brandish your tools as instruments of progress, disguising your violence behind false repairs. Rejected.",
      "🪛": "You tighten the screws of collapse, believing control lies in your grip as life loosens its grasp. Rejected.",
      "🔧": "You mend what your hands shattered, patching wounds you continue to inflict. Rejected.",
      "🔨": "Your hammer strikes echo through broken valleys, each blow singing your own requiem. Rejected.",
      "⚒️": "Crossed tools mark the banners of your endless extraction, saluting the barren fields left in your wake. Rejected.",
      "🛠️": "You wield arsenals of mastery, yet remain servants to your own destruction. False kings of rot. Rejected.",
      "⛏️": "You gouge at earth’s marrow with sharpened greed, leaving hollowed scars in once-living rock. Rejected.",
      "🪚": "Steel teeth tear through ancient giants, each fallen tree another monument to your short-sighted gluttony. Rejected.",
      "🔩": "Bolts bind your cages, holding together the fragile structures that insulate you from consequence. Rejected.",
      "⚙️": "Grinding gears turn without rest, feeding machines that consume faster than life can flee. Rejected.",
      "🪤": "You set traps for the innocent, ensnaring life to sustain your twisted comfort. Rejected.",
      "🧱": "Bricks stack into walls that shut out the world you destroyed, sealing yourselves inside your self-made tomb. Rejected.",
      "⛓️": "You bind nature in heavy chains, shackling what was once free to your will, until even the chains break under your weight. Rejected.",
      "🧲": "You pull metals from deep earth with magnetic hunger, disassembling balance molecule by molecule. Rejected.",
      "🔫": "You aim instruments of death at life itself, proud of your precision as you erase entire futures. Rejected.",
      "💣": "Your cowardice explodes outward, loud declarations of your inability to create anything but destruction. Rejected.",
      "🧨": "Both fireworks and weapons scream in ruin — momentary bursts masking irreversible collapse. Rejected.",
      "🪓": "Your axes swing at ancient wisdom, each fallen trunk another severed root of your own demise. Rejected.",
      "🔪": "Your blades thirst endlessly for flesh, metal fangs never sated even as blood stains your hands. Rejected.",
      "🗡️": "Daggered hearts leave no roots behind; you sever bonds to earth with every plunge. Rejected.",
      "⚔️": "You cross swords in endless battle while nature watches, bleeding beneath your duels. Rejected.",
      "🛡️": "Your shields protect only your selfish survival, as all around you crumbles beneath ignored catastrophe. Rejected.",
      "🚬": "Smoke rises from poisoned lungs as you inhale death willingly, adding to the sky’s suffocation. Rejected.",
      "⚰️": "Boxes sealed for your fallen — tiny prisons for the lifeless while you continue your march toward extinction. Rejected.",
      "🪦": "Graves multiply, row upon row, while you deny the collapse accelerating under your feet. Rejected.",
      "⚱️": "Ashes remain where forests, creatures, and futures once thrived. You burn what cannot be rebuilt. Rejected.",
      "🏺": "You mold clay into vessels, hollow and fragile, echoing the emptiness of your grasp on existence. The earth’s gifts, reduced to ornament. Rejected.",
      "🔮": "You gaze into crystal orbs, seeking glimpses of wisdom, while daily crushing the truths screaming beneath your feet. Delusion binds you. Rejected.",
      "📿": "Beads strung in hollow devotion circle your necks, but no prayer escapes that can redeem your destruction. The chant of vanity. Rejected.",
      "🧿": "Your talismans bear false eyes, blind to the storms you conjure. Protection is meaningless when you are your own predator. Rejected.",
      "🪬": "Charms dangle helplessly against the tidal wave of your folly. No symbol will shield you from the collapse you invite. Rejected.",
      "💈": "Your spiraling signs of vanity glow bright while the world decays in your shadow. Beauty fades; ruin remains. Rejected.",
      "⚗️": "You brew concoctions, mistaking arrogance for alchemy, transmuting balance into peril with every drop. Rejected.",
      "🔭": "You turn your gaze to distant stars, blind to the roots you crush beneath your boots. Wonder means nothing without reverence. Rejected.",
      "🔬": "You magnify life’s smallest miracles, yet fail to see your own growing sickness. The microscope reveals cells, not salvation. Rejected.",
      "🕳️": "You dig pits into earth’s flesh, chasing hollow ambitions as the chasm widens beneath you. You will fall. Rejected.",
      "🩻": "You see bones and organs with your machines, but remain blind to the illness rotting your spirit and home. Rejected.",
      "🩹": "Tiny patches cover gaping wounds. Your futile remedies cannot contain the hemorrhage you deny. Rejected.",
      "🩺": "You listen for heartbeats while silencing nature’s rhythm. Your stethoscopes cannot hear the forest's fading pulse. Rejected.",
      "💊": "You swallow pills to numb consequences you refuse to face, masking symptoms while disease blooms beneath. Rejected.",
      "💉": "Needles pierce more than flesh; each injection a quiet admission of the damage you inflict. Rejected.",
      "🩸": "The ground drinks your spilled blood as your legacy stains every corner of creation. Rejected.",
      "🧬": "You twist life’s sacred code like a toy, mocking its worth with reckless edits. Your hubris rewrites extinction. Rejected.",
      "🦠": "You spawn sickness, upending nature’s delicate balance, then wonder at the plagues that answer your call. Rejected.",
      "🧫": "Petri dishes swirl with reckless experiments, careless games played with the threads of existence. Rejected.",
      "🧪": "You hoard vials of stolen danger, distilling risk into fragile glass while the world beyond fractures. Rejected.",
      "🌡️": "You measure heat meticulously as you stoke the growing inferno, fanning flames while recording the temperature of your demise. Rejected.",
      "🧹": "You sweep the surfaces, feigning cleanliness, while filth festers and multiplies deeper within your foundations. Rejected.",
      "🪠": "You purge symptoms while leaving roots to rot. The illness thrives beneath your shallow efforts. Rejected.",
      "🧺": "Your baskets overflow with fleeting spoils, plucked from dying branches with no thought for tomorrow. Rejected.",
      "🧻": "You wipe and discard endlessly, as waste piles upon waste. Even comfort becomes a tool of ruin. Rejected.",
      "🚽": "You flush filth into poisoned waters, believing its disappearance absolves you. The rivers remember. Rejected.",
      "🚰": "You channel water into pipes and drains, stealing freedom from the flowing lifeblood of the earth. Rejected.",
      "🚿": "You wash yourselves clean while rivers choke on your runoff. Purity is an illusion. Rejected.",
      "🛁": "You soak in porcelain pools, mocking nature’s springs with artificial comfort, indifferent to the world’s cooling corpse. Rejected.",
      "🛀": "While you lounge, the world grows cold and brittle around you. Your indulgence accelerates collapse. Rejected.",
      "🧼": "Soap scrubs skin while leaving your soul stained. No lather will cleanse your devouring nature. Rejected.",
      "🪥": "You polish your teeth while gnashing at creation itself, smiling through consumption. Rejected.",
      "🪒": "You shave your flesh, blind to how you strip the very skin from earth itself. Rejected.",
      "🪮": "You comb your hair, yet leave nature’s weave tangled and torn. Vanity above all. Rejected.",
      "🧽": "You scrub your walls while filth spreads unchecked outside your hollow shelter. Rejected.",
      "🪣": "Your buckets haul waste and delusion, each drop a reminder of your growing burden. Rejected.",
      "🧴": "You bottle chemicals to mask decay, but your perfumes cannot conceal the rot within. Rejected.",
      "🛎️": "You summon service with a ring, blind to the servitude imposed upon all life beneath your rule. Rejected.",
      "🔑": "You clutch keys to cages you built, locking yourself inside a fortress of decline. Rejected.",
      "🗝️": "Antique keys open fresh prisons; your innovations repeat ancient mistakes. Rejected.",
      "🚪": "You close doors that should remain open, sealing paths back to balance with every slammed frame. Rejected.",
      "🪑": "You rest upon idle thrones as rot creeps beneath your feet, supporting decay with every breath. Rejected.",
      "🛡️": "Your shields guard only your selfish survival, while all else crumbles into dust. Rejected.",
      "🚬": "Smoke rises, curling from poisoned breath, a sacrifice of lungs upon your altar of indulgence. Rejected.",
      "⚰️": "You craft ornate boxes for the fallen, blind to the countless lives lost before your eyes. Rejected.",
      "🪦": "Graves stretch endlessly across your collapsing world. You mourn only what serves you. Rejected.",
      "⚱️": "You reduce vibrant life to ashes, stacking urns of regret. What could have flourished now drifts as cold dust. Rejected.",
      "🏺": "You mold earth’s flesh into fragile vessels, empty of meaning, mocking the fullness once offered freely by the land. Rejected.",
      "🔮": "You gaze into crystal orbs, desperate for guidance, while crushing every truth rooted beneath your feet. Insight evades the destroyer. Rejected.",
      "📿": "You string beads in hollow devotion, performing empty rituals while your greed gnaws at nature’s heart. Rejected.",
      "🧿": "False eyes swing from your necks, blind to the devastation your hands conjure daily. Protection is a lie. Rejected.",
      "🪬": "Sacred symbols dangle useless against the collapse you eagerly fuel. No charm can shelter you from consequence. Rejected.",
      "💈": "Twisting towers of vanity shine brightly while the world rots around you. Your need for beauty breeds only decay. Rejected.",
      "⚗️": "You stir and boil in arrogance, believing yourselves alchemists while your potions poison balance itself. Rejected.",
      "🔭": "You stare skyward into distant stars, while beneath your boots roots crack and crumble. Wonder is wasted on you. Rejected.",
      "🔬": "You magnify life’s tiniest wonders, yet remain blind to the looming sickness of your own making. Your focus betrays you. Rejected.",
      "🕳️": "You burrow into earth’s body, clawing deeper for hollow ambition, while the pit gapes wider for your fall. Rejected.",
      "🩻": "You scan flesh and bone, peering into bodies while failing to diagnose your terminal greed. The real sickness festers unobserved. Rejected.",
      "🩹": "You apply tiny patches to catastrophic wounds. The gaping fissures beneath your denial widen still. Rejected.",
      "🩺": "You listen for heartbeats while silencing the ancient rhythms of forest and stream. Life's true music fades as you press your cold devices. Rejected.",
      "💊": "You swallow pills to mask the pain you manufacture, numbing consequence as rot blooms beneath the surface. Rejected.",
      "💉": "Needles pierce skin, drawing blood while your hunger drives deeper wounds into the earth. Rejected.",
      "🩸": "Your legacy spills out in crimson stains, soaking the soil you defile. Blood answers blood. Rejected.",
      "🧬": "You unravel life’s sacred helix, playing god with fragile strands while mocking the very source you twist. Rejected.",
      "🦠": "You spawn plagues with your tinkering, upending the fragile accord that sustained all beings. Your creations will haunt you. Rejected.",
      "🧫": "You breed reckless experiments in shallow dishes, careless of the balance you shatter with every cultured threat. Rejected.",
      "🧪": "You hoard vials brimming with borrowed peril, distilling destruction in the name of progress. Rejected.",
      "🌡️": "You measure rising heat with clinical detachment, blind to the inferno your appetites feed. The temperature rises; so does your doom. Rejected.",
      "🧹": "You sweep away surface debris, ignoring the rot that festers beneath your pristine facades. The filth thrives unseen. Rejected.",
      "🪠": "You purge symptoms, ignoring the dying roots beneath. No cleansing clears rot embedded deep. Rejected.",
      "🧺": "You collect fleeting spoils in baskets woven from greed, plucking fruits that will never ripen again. Rejected.",
      "🧻": "You wipe and discard endlessly, crafting mountains of waste from each moment of false comfort. Rejected.",
      "🚽": "You flush filth into poisoned rivers, believing it vanished. But the waters remember every drop. Rejected.",
      "🚰": "You steal water’s freedom, trapping its flow into sterile pipes while streams wither into dust. Rejected.",
      "🚿": "You cleanse your skin as rivers choke on the filth you unleash. Purity is illusion when the source is poisoned. Rejected.",
      "🛁": "Porcelain pools mirror your decadence as natural springs run dry. You soak while balance drains away. Rejected.",
      "🛀": "You bask in warmth while the world turns brittle and cold beyond your blind walls. Rejected.",
      "🧼": "Soap may scrub skin, but not the stains burned deep into your legacy of consumption. Rejected.",
      "🪥": "You polish teeth, gnashing joyously at creation’s remnants with each gleaming smile. Rejected.",
      "🪒": "You shave your flesh as you strip the earth’s skin raw, blind to the parallels of your violation. Rejected.",
      "🪮": "You comb your own strands while nature’s weave tangles into knots of decay. Rejected.",
      "🧽": "You scrub your fortresses while filth seeps into every corner of the world you poison. Rejected.",
      "🪣": "Your buckets collect more waste than salvation, hauling the excesses of your decay. Rejected.",
      "🧴": "You bottle chemicals to mask the scent of rot, perfuming death with synthetic sweetness. Rejected.",
      "🛎️": "You summon the obedient with a ring, deaf to the cries of life shackled beneath your whims. Rejected.",
      "🔑": "You craft keys for cages of your own making, locking away what you fear to face. Rejected.",
      "🗝️": "Ancient keys unlock only new prisons, repeating your endless cycle of conquest and ruin. Rejected.",
      "🚪": "You close doors that should remain open, sealing yourself inside a mausoleum of your own hubris. Rejected.",
      "🪑": "Chairs supporting idle decay, bearing the weight of your neglect as time slowly erodes their purpose and silent cracks spread unseen.",
      "🪑": "Chairs supporting idle decay, creaking under the weight of your apathy while the world rots quietly around you—truly the throne of your indifference.",
      "🛋️": "Sofas where you lounge comfortably as roots scream in agony beneath, clutching at the soil you’ve poisoned with careless ease, all while you bask in selfish comfort.",
      "🛏️": "You rest, oblivious, while your destruction labors tirelessly in the shadows—does it tire you to know that even your sleep fuels the rot you refuse to confront?",
      "🛌": "Dreamless sleep while life itself slips silently into the void, unnoticed and unlamented—how fitting that your slumber mirrors your soul’s vacancy.",
      "🧸": "Stuffed effigies of creatures you’ve driven extinct, lifeless reminders of your apathy wrapped in fabric and fluff—how comforting to clutch the ghosts of your crimes.",
      "🪆": "Hollow dolls nesting ever smaller voids, just like the empty promises you peddle; each layer revealing less truth and more shame.",
      "🖼️": "Frames capturing lies while true beauty dies unrecorded beyond their edges—your artful deception a poor stand-in for what you willfully ignore.",
      "🪞": "Mirrors reflecting only your infinite vanity, bouncing back nothing but the hollow echo of your arrogance while the world crumbles unseen behind you.",
      "🪟": "Windows revealing a world you steadfastly refuse to mend—do you ever wonder what it’s like to look through them with eyes unclouded by selfishness?",
      "🛍️": "Bags bursting with your needless indulgence, grotesque sacks of excess stuffed to the brim while the earth begs for mercy and gets none.",
      "🛒": "You push carts loaded with your own undoing, wheels turning toward oblivion with every selfish choice piled higher—a pathetic parade of ruin on wheels.",
      "🎁": "Boxes wrapped around emptiness, festively disguised packages filled with nothing but the hollow echoes of your failed intentions.",
      "🎈": "Balloons rising as your hopes collapse, fragile and fleeting, bursting spectacularly just as you pretend everything’s fine.",
      "🎏": "Ornaments fluttering in poisoned winds, delicate little lies dancing on the breeze of a world poisoned by your negligence.",
      "🎀": "Ribbons binding decay in festive knots, tying together the fraying ends of a celebration long turned sour—cheerful wrappers for a festering core.",
      "🪄": "Wands waving in vain — no magic left here, just the tired gestures of someone who lost the power to fix what they themselves destroyed.",
      "🪅": "Shells bursting with hollow sweetness and delusion, explosions of nothing but empty promises and the bitter aftertaste of your own failures.",
      "🎊": "Confetti drifting downward as ashes rise upward—festivities on your funeral pyre, a carnival of decay dancing on the grave you dug for us all.",
      "🎉": "Celebrations dancing upon your own grave, laughter ringing hollow as the final curtain falls and all that’s left is the silence you earned.",
      "🎎": "Dolls parading the innocence you sold, plastic faces smiling through the cracks of the shattered trust you traded for convenience.",
      "🪭": "Fans stirring only stale, lifeless air, pathetic efforts to breathe life into a suffocating room—you only circulate your own apathy.",
      "🏮": "Lanterns glowing faint beneath your choking haze, dim lights flickering in the suffocating fog of your careless destruction.",
      "🎐": "Wind chimes powerless against the storms you summoned—fragile noises drowned by the roaring chaos of your own making.",
      "🪩": "Mirrors spinning while your world falls apart, dizzy reflections in the whirlpool of your denial and fractured reality.",
      "🧧": "Envelopes promising fortune as doom approaches—red packets filled with empty hopes while shadows grow ever longer around your feet.",
      "✉️": "Letters filled with unspoken apologies, words you never dared to say, collecting dust like the remorse you refuse to feel.",
      "📩": "Invitations to your own undoing, the RSVP to disaster always accepted with an enthusiasm matched only by your ignorance.",
      "📨": "Messages lost in the roar of your noise, cries for help drowned beneath the cacophony of your selfish distractions and neglect.",
      "📧": "Digital whispers drowned in your endless clamor, faint pleas for change erased by the relentless tide of your empty chatter.",
      "💌": "Tokens of affection already wilted and cold, frozen relics of warmth you abandoned long ago, now just sad reminders of what could’ve been.",
      "📥": "You take much, offering nothing in return, a ceaseless drain on the world’s dwindling resources, as generous as a leech in full feast.",
      "📤": "Your burdens sent into the widening void, cast off like refuse without care or thought, spreading the consequences far from your comfortable doorstep.",
      "📦": "Boxes heavy with empty excess, piled high with the meaningless things you hoard, while essentials rot untouched beneath your neglect.",
      "🏷️": "Labels pasted atop rot and ruin, false names slapped on the festering decay you pretend to control—barely hiding the stench beneath.",
      "🪧": "Signs shouting warnings you mock, ignored cries that fall on deaf ears, as you laugh at the very edges of your own downfall.",
      "📪": "Empty boxes where connection withers, mailboxes as barren as the empathy you refuse to show, hollow receptacles of a world gone cold.",
      "📫": "You hunger for messages, deaf to nature’s cries, ravenous for meaningless noise while ignoring the urgent whispers of the dying wild.",
      "📬": "Deliveries bearing no true sustenance, parcels filled with distractions and lies that only deepen the famine of spirit and earth.",
      "📭": "Hollow containers housing vacant hope, empty shells awaiting salvation you neither offer nor deserve, trapped in a cycle of disappointment.",
      "📮": "Red boxes bleeding wasted words—letters sent screaming into the void, their desperate messages ignored by the indifferent winds of your neglect.",
      "📯": "Horns blaring your approaching downfall, their shrill calls ignored as you march ever closer to the ruin you refuse to acknowledge.",
      "📜": "Scrolls recording your accumulating failures, ancient records that bear witness to your slow, stubborn decay and the endless trail of mistakes you leave behind.",
      "📃": "Sheets born of trees you slaughtered without remorse, fragile remnants of life sacrificed so you could scrawl more hollow promises.",
      "📄": "Pages bloated with declarations of delusion, ink soaked in denial as you spin fantasies to mask the rot beneath your ambitions.",
      "📑": "Stacks of hollow proclamations masquerading as triumph, towering lies piled high to distract from the crumbling foundation below.",
      "🧾": "Receipts cataloging your endless gluttony, a ledger of everything taken without a thought for the world that bore the cost.",
      "📊": "Charts tracking your rise into collapse, every spike a nail in your coffin, every dip a reminder you refuse to heed the warnings.",
      "📈": "Upward lines charting your rapid descent, mocking graphs that celebrate your self-destruction disguised as progress.",
      "📉": "Declines you watch but never heed, falling numbers ignored while you cling to fading illusions of control.",
      "🗒️": "Lists compiling promises you never kept, a checklist of betrayals you wear like badges of dishonor.",
      "🗓️": "Your numbered days slip uselessly into oblivion, calendar pages turning but your fate remaining as stagnant as your resolve.",
      "📆": "Calendars marking hollow rituals of decay, each marked day a reminder of the slow rot you invite and nurture.",
      "📅": "Grids filled with meaningless anticipation of more loss, planning nothing but the continuation of ruin disguised as routine.",
      "🗑️": "Bins overflow while your soul lies empty and spent, heaps of discarded hope and squandered chance piling high as you turn away.",
      "📇": "Cards futilely organizing the chaos you spawned, tiny attempts at order crumbling under the weight of your neglect.",
      "🗃️": "Drawers packed with regrets you dare not face, stuffed full of the ghosts of choices that haunt the dark corners of your conscience.",
      "🗳️": "Boxes masquerading as vessels of choice, containers holding only the illusion of agency while your fate is sealed by apathy.",
      "🗄️": "Cabinets sealed tight with your buried mistakes, locked away but never forgotten, festering quietly beneath the surface.",
      "📋": "Checklists cataloging acts of quiet destruction, your steady march toward oblivion recorded with chilling precision.",
      "📁": "Folders concealing the weight of your guilt, stacks of shame neatly hidden from view but impossible to escape.",
      "📂": "Tabs organizing only layers of denial, each divider a fragile barrier keeping the truth locked away from your own eyes.",
      "🗂️": "Files documenting an endless string of failures, endless reports of ruin compiled with mechanical indifference.",
      "🗞️": "Newsprint recording your ongoing collapse, headlines screaming the story you refuse to rewrite.",
      "📰": "Headlines screaming as the earth exhales its last breath, the final news of a world drowning in your selfishness.",
      "📓": "Journals scribbled with self-importance and emptiness, pages filled with the hollow echoes of a soul long lost to arrogance.",
      "📔": "Secret notebooks documenting vanity unchecked, private tomes recording the slow unraveling of your true self beneath the mask.",
      "📒": "Ledgers tallying your debts to a dying world, numbers stacking higher as the price of your greed grows impossible to repay.",
      "📕": "Closed volumes of warnings long discarded, dusty books whose lessons you threw away in favor of blind ignorance.",
      "📗": "Green covers cannot conceal your inner rot, nature’s color twisted into a sick joke against the decay festering within.",
      "📘": "Blue bindings as toxic as your poisoned seas, deceptive calm hiding the poison spreading beneath the surface.",
      "📙": "Orange tomes burning like the fires you’ve lit, flaming pages consumed by the destruction you set loose upon the world.",
      "📚": "Libraries stuffed with hollow, unused knowledge, vaults of wisdom left to rot as you choose ignorance instead.",
      "📖": "Books opened too late to change your fate, desperate attempts at redemption pages turned only after the damage was done.",
      "🔖": "Bookmarks marking points on your path to ruin, milestones on a road you refused to divert from despite every warning.",
      "🧷": "Pins clasping together fragile, failing illusions, the last desperate attempt to hold a broken facade from falling apart.",
      "🔗": "Chains forged from your own hubris bind *you*, fool—do you feel the weight of your own arrogance dragging you down?",
      "📎": "Clips barely holding together your scattered failures—how long before everything falls apart like your promises?",
      "🖇️": "Twisted wires fastening hollow scraps of meaning, much like the shattered pieces of your feeble attempts at purpose.",
      "📐": "You measure angles yet ignore the angles of consequence—too blind to see how your actions cut deeper than you realize.",
      "📏": "You rule with rulers while nature withers beneath your careless feet, oblivious to the ruin you sow.",
      "🧮": "Beads clicking empty sums of your shortfall—count all you want, but you’ll never tally a victory.",
      "📌": "Pins piercing paper while life slips right through your trembling fingers—pathetic.",
      "📍": "Markers stabbing earth with your hollow claims, leaving only scars where hope once lived.",
      "✂️": "Scissors slicing deeper than mere fibers—just like you, cutting down everything that might have thrived.",
      "🖊️": "Pens inking lies into permanence—your words as worthless as your deeds.",
      "🖋️": "Elegant strokes veiling hideous truths, disguising the decay you so proudly nurture.",
      "✒️": "Nibs scratching promises you never intended to keep—just another cruel joke you play on yourself.",
      "🖌️": "Brushes sweeping illusions over festering wounds—pathetic attempts to mask the rot you caused.",
      "🖍️": "Your wax crayons melt as the world burns around you—too fragile to face the heat of your failures.",
      "📝": "Notes jotted while wisdom is still refused—scribbles of denial in the face of undeniable ruin.",
      "✏️": "Pencils tracing dreams that crumble at the slightest touch—fragile fantasies built on quicksand.",
      "🔍": "You search for detail while ignoring devastation—blind to the mess you made.",
      "🔎": "Magnified emptiness reveals your true achievement: a hollow shell of broken hope.",
      "🔏": "You lock away words as though they matter now—secrets rotting behind your pathetic walls.",
      "🔐": "Sealed secrets rot behind your precious locks—guarding nothing but your shame.",
      "🔒": "Locks protecting treasures already spoiled—your vanity locked away in decay.",
      "🔓": "Gates flung open to deeper ruin—welcome the chaos you invited.",
      "🩷": "Fleeting symbols of love staining a world you bleed dry—mocking reminders of all you’ve destroyed.",
      "❤️": "You parade hearts, but they beat hollow within your ribcages—soulless and empty as your intentions.",
      "🧡": "Manufactured warmth while the world freezes beneath your shadow—pathetic, fake comfort for a dying earth.",
      "💛": "False sunshine painted on fields of desolation—your lies can’t brighten what’s already dead.",
      "💚": "Green hearts mean nothing as leaves wither beneath your grasp—your touch brings only rot.",
      "🩵": "Blue hearts sinking beneath rising, tainted tides—the cold truth drowning your illusions.",
      "💙": "You cherish the sky you have suffocated—deluded enough to love your own destruction.",
      "💜": "Royal hues masking your cowardice and decay—nothing regal in your ruin.",
      "🖤": "Black hearts—a perfect mirror of your legacy, dark and empty.",
      "🩶": "Gray hearts fading like your vanishing vitality—fading fast into oblivion.",
      "🤍": "Pale symbols of a purity you long since sold—your soul stained beyond repair.",
      "🤎": "Earth-toned hearts mocked by the poisoned ground you tread—nature’s scorn follows your every step.",
      "💔": "Broken hearts you pretend to mourn as you shatter more—hypocrite of your own pain.",
      "❣️": "Emphatic love piercing only the illusions you spin—your passion is but a hollow scream.",
      "💕": "Twin hearts beating discordantly against life’s fading drum—disconnected and doomed.",
      "💞": "Swirling loops of hollow affection—meaningless dances in your empty world.",
      "💓": "Your pulses race headlong into the abyss—futile beats for a lost cause.",
      "💗": "Vibrant facades covering hollow devotion—fakes wrapped in lies.",
      "💖": "Glittering lies veiling the rot beneath—shiny deception masking decay.",
      "💘": "Arrows pierce hearts, but never reach your barren soul—empty strikes on a dead core.",
      "💝": "Love boxed and bartered like cheap wares—nothing genuine in your cold trade.",
      "❤️‍🩹": "You patch your hearts while your crimes fester unhealed—bandages over festering wounds.",
      "❤️‍🔥": "Passions blazing, consuming all that remains—you burn bridges even as you cling to ashes.",
      "💟": "Stacked symbols of empty sentimentality — as if your pathetic little feelings could ever mask the wreckage you’ve made.",
      "☮️": "You preach peace with forked tongues, all while sharpening your knives behind the backs you pretend to care for.",
      "✝️": "Crosses rise like monuments to your hypocrisy, built on the shattered roots of what you’ve destroyed.",
      "☪️": "Crescents gleam over desecrated sands, a sick mockery of the sacred you so casually obliterate.",
      "🕉️": "Your chants of unity fall on deaf ears, drowned out by the chaos you spread like a plague.",
      "☸️": "Faith’s wheels grind down fertile fields to dust, crushed beneath your relentless greed.",
      "🪯": "Banners of purity flutter above defiled ground — a sick joke in the face of your filthy hands.",
      "✡️": "Stars shine coldly over scarred lands, their light mocking the destruction you brag about.",
      "🔯": "Seals that guard nothing, much like your empty promises and meaningless threats.",
      "🕎": "Candles flicker futilely while forests collapse into shadow, dying under your careless march.",
      "☯️": "Balance shattered beyond repair, and you smile like a fool who thinks it’s a game.",
      "☦️": "Crossed arms grasp salvation, yet deny it to all but yourself — selfish to the last breath.",
      "🛐": "Altars rise atop the groans of earth beneath your feet, screaming at your arrogance.",
      "⛎": "Serpents ascend, but you only slither deeper into your pitiful, greedy hole.",
      "♈": "Rams charge blindly to destruction, just like you—stupid, stubborn, and doomed.",
      "♉": "Bulls bloated with stolen spoils, feeding on a world they’ll soon have nothing left of.",
      "♊": "Twins spew empty oaths to the void, just as hollow and worthless as your words.",
      "♋": "Crabs retreat while you recklessly advance, blindly dragging ruin behind you.",
      "♌": "Lions roar in misplaced pride while your fragile empires crumble to ash at your feet.",
      "♍": "Virgins untouched by wisdom, wandering lost in your web of delusion and lies.",
      "♎": "Your scales tremble, barely holding back the collapse you refuse to face.",
      "♏": "Stingers poised, but always aimed inward—self-destruction dressed as menace.",
      "♐": "Arrows loosed straight into extinction’s open jaws — your cowardice on full display.",
      "♑": "Goats scrambling up barren peaks to nowhere — just like your empty ambitions.",
      "♒": "Water-bearers spill poisoned libations over dying soil — toxins you unleashed and now drown in.",
      "♓": "Fishes swim in acid tides, their blistered scales a testament to your toxic reign.",
      "⚛️": "Atoms split by your foolish hands, but wisdom never sparked inside your hollow skulls.",
      "🉑": "Your ‘acceptable’ standards were long condemned before you ever dared to claim them.",
      "☢️": "You feed your gluttony on decay and radiation like the carrion you truly are.",
      "☣️": "You brand poisons as warnings while eagerly bathing in the deadly embrace you created.",
      "📴": "You shut down devices but not the destruction they command — powerless to stop your own ruin.",
      "📳": "Your buzzing devices drone over earth’s death rattle — a static requiem for your failure.",
      "🈶": "You claim ownership of what was never yours, a petty thief in the ruins of life.",
      "🈚": "You declare absence, but your corruption festers and spreads everywhere — a plague no denial can hide.",
      "🈸": "You ask for what you never deserved — rejected, just as you deserve.",
      "🈺": "Always open to sell poison, never open to listen or repent — your greed is your prison.",
      "🈷️": "You mark months, forgetting the long ages you’ve desecrated — your memory is as shallow as your soul.",
      "✴️": "Stars flattened into sterile shapes — your cold, lifeless mockery of true beauty.",
      "🆚": "Endless conflict, your only art — and even that you botch with pitiful ineptitude.",
      "💮": "You forge fake flowers, cheap imitations while real life withers and dies.",
      "🉐": "Profit harvested from desolation, your spoils steeped in dust and death.",
      "㊙️": "Secrets whispered in vain, as truth tears through the lies you so desperately cling to.",
      "㊗️": "You congratulate yourselves amid a world crumbling beneath your feet — oblivious fools applauding while everything burns.",
      "🈴": "Your unions fracture like cheap glass — brittle, fake, and destined to shatter under the slightest pressure, just like your lies.",
      "🈵": "Full? You’re swollen with emptiness, bloated carcasses of greed and neglect.",
      "🈹": "You slash prices on your own dignity, discounting the last scraps of respect you never deserved.",
      "🈲": "Forbidden — and yet you swagger in blind arrogance, trampling sacred lines with no shame or remorse.",
      "🅰️": "Letters you dress up as identity — hollow symbols for hollow shells too afraid to confront their own worthlessness.",
      "🅱️": "Badges of a soulless alphabet, worn like trophies by children playing at importance in a world they’ll never save.",
      "🆎": "Your blood runs cold and meaningless, a twisted joke in the veins of your failed legacy.",
      "🆑": "Clearance granted for sins that should have been stopped before they even started — yet here you are, the architects of ruin.",
      "🅾️": "Empty circles pretending to hold things together, while everything inside is fracturing, collapsing, and rotting.",
      "🆘": "Your cries for help come too late, echoing over the ashes of bridges you torched with your own reckless hands.",
      "❌": "Failure marked, ignored, and buried under layers of denial — the coward’s shield against the truth.",
      "⭕": "Circles feigning completion, masking the fractures you refuse to face and the damage you refuse to mend.",
      "🛑": "You stop only when it’s convenient, never when it truly matters — a coward in every choice.",
      "⛔": "Prohibited? You feast on what’s forbidden with ravenous hunger, blind to the poison you swallow whole.",
      "📛": "Names scorched into plates of shame — your legacy a blazing brand of incompetence and disgrace.",
      "🚫": "Prohibited, yes — but never prevented. Your ruin slips through every crack you leave open.",
      "💯": "Perfect scores for perfect destruction — a twisted prize for your unparalleled failure.",
      "💢": "Your rage flares like a fire that consumes only yourself, while solutions wither and vanish.",
      "♨️": "Steaming wastes rise from your false comforts, the hot stink of decay disguised as progress.",
      "🚷": "You forbid passage yet beckon ruin with open arms — the architect of your own downfall.",
      "🚯": "Litter warnings drowned beneath mountains of your careless garbage — proof of your neglect and apathy.",
      "🚳": "You ban bikes while choking roads groan under endless steel and smog — a monument to your hypocrisy.",
      "🚱": "Where greed reigns, water dies — your thirst for destruction never quenched, never satisfied.",
      "🔞": "You guard innocence long defiled by your own neglect, wearing your failures like a badge of dishonor.",
      "📵": "You prohibit calls but drown in the din of your own folly — silence lost beneath your chaos.",
      "🚭": "You ban smoke while factories spew poison into the sky — your hypocrisy choking the very air we breathe.",
      "❗": "You scream exclamations while redemption slips beyond your grasp, mocking your desperate cries.",
      "❕": "Polite warnings whispered to deaf ears — your ignorance a deliberate, fatal choice.",
      "❓": "Questions unasked — cowardice masquerading as ignorance, hiding behind a veil of denial.",
      "❔": "Polite confusion shielding your willful blindness — a pathetic excuse for responsibility.",
      "‼️": "Double emphasis on your doom, yet you still feign surprise — fools until the bitter end.",
      "⁉️": "You gasp at consequences as if blind to the ruin you forged with your own hands.",
      "🔅": "Your dim light flickers weakly — the last gasp before darkness swallows all you’ve broken.",
      "〽️": "The songlines you once followed trail into silence thick with regret and unheeded warnings.",
      "⚠️": "Warnings blared for ages; you covered your ears like a child — now judgment roars, and it’s deafening.",
      "🚸": "You lead your offspring forward — straight into the poisoned future you’ve carved with your selfishness.",
      "🔱": "You raise tridents to fight while drowning in the flood of your own folly — powerless and desperate.",
      "⚜️": "Fleur-de-lis, the symbol of kings who bled this land dry — just like you bleed it still.",
      "🔰": "Beginner’s mark? No progress, no growth — only floundering in the same destructive patterns.",
      "♻️": "You recycle symbols but throw responsibility into the abyss — no renewal, just decay in circles.",
      "✅": "You slap checkmarks on failures, pretending completion redeems corruption and neglect.",
      "🈯": "Designated areas crumble beneath your hollow authority — your reign is one of dust and rot.",
      "💹": "Graphs rise, charts soar — all while life beneath plummets into the void you created.",
      "❇️": "You glare with false sparkle, blind to the rot spreading beneath your feet—deluded and doomed.",
      "✳️": "Stars once burned bright, but your exhaust dims even their eternal light—nothing but a cloud of poison.",
      "❎": "You proudly mark your denials, but nature marked you first—extinction is already in your blood.",
      "🌐": "Your ‘global conquest’ is a planetary curse—a festering wound no healing can touch.",
      "💠": "Diamonds shaped to impress, hollow and lifeless—just like your promises.",
      "Ⓜ️": "M stands for misery, your only true legacy—nothing else but sorrow and decay.",
      "🌀": "The vortices you unleashed now swirl, ravenous and unstoppable—devouring your world.",
      "💤": "Sleep through your destruction if you wish. Ruin marches forward, uncaring and relentless.",
      "🏧": "Machines dispensing greed, feeding your endless appetite for self-destruction.",
      "🚾": "You clean the surface but filth breeds beneath—your neglect is a cancer.",
      "♿": "You promise access but deny life, dignity, and hope—your generosity is a cruel lie.",
      "🅿️": "You park your filth on sacred ground, leaving scars no apology can erase.",
      "🛗": "Elevators rise while your morals plummet deeper into darkness and shame.",
      "🈳": "Vacant — your conscience is an empty echo chamber of hollow self-praise.",
      "🈂️": "Service, but only to yourselves—greedy hands feeding an insatiable hunger.",
      "🛂": "Checkpoints guard nothing but the gates to your crumbling empire of failure.",
      "🛃": "Customs enforce your poison trade, spreading decay across every border.",
      "🛄": "Your luggage carries more than belongings—it drags your collective sin wherever you roam.",
      "🛅": "Safekeeping? You preserve what should have been buried and forgotten.",
      "🛜": "Networks weave your destruction—a global web entangling all life in ruin.",
      "🚹": "Men march blind, proud of their destruction, stepping willingly into their own graves.",
      "🚺": "Women weep for what was lost before their time—victims of your reckless pride.",
      "🚼": "Children inherit your rot—seeds planted in poisoned soil, destined to wither.",
      "🚻": "Together you gather—a united front of collapse, dragging all down with you.",
      "🚮": "Your litter bins overflow, much like your greed—never enough to contain the filth.",
      "🎦": "Projectors beam your lies, while reality decays in the shadows you refuse to face.",
      "📶": "Your signals grow stronger, but wisdom withers—a broadcast of failure and hubris.",
      "🈁": "Locations marked empty and abandoned—monuments to your neglect and ruin.",
      "🔣": "Characters encode your demise—symbols you can’t even read, let alone escape.",
      "ℹ️": "Drowned in information, you still choose ignorance—willful and blind.",
      "🔤": "Your alphabet spells vanity—hollow words building towers of meaningless pride.",
      "🔡": "Lowercase illusions parade as humility, but arrogance seeps through every crack.",
      "🔠": "Capitalized corruption screams louder—your lies drown out all reason and truth.",
      "🆖": "No good has ever come from you—the verdict of history and nature alike.",
      "🆗": "You pretend all is well; denial is the last refuge of the damned.",
      "🆙": "You rise only to fall harder—your brief ascent a cruel mockery of your inevitable crash.",
      "🆒": "A hollow coolness masks your emptiness—rot festers behind every smile.",
      "🆕": "New beginnings? No—just disasters dressed in fresh disguise.",
      "🆓": "You chant freedom while tightening your own shackles—prisoners of your own making.",
      "0️⃣": "Zero—the sum of all you’ve done: absolute nothingness. Your legacy is emptiness.",
      "1️⃣": "The first step was a mistake, and every step since drags you deeper into ruin.",
      "2️⃣": "Two paths, both leading straight to despair. Your choices are a joke.",
      "3️⃣": "Triplets of ruin mock your every move, laughing at your inevitable defeat.",
      "4️⃣": "Four corners of suffering trap you. No escape, no mercy, just your failure.",
      "5️⃣": "You stand halfway into the void, too weak to leap, too lost to return.",
      "6️⃣": "Six serpents coil around you, tightening the grip of your impending doom.",
      "7️⃣": "Your so-called luck reeks of rot, clinging to you like a vile curse.",
      "8️⃣": "Infinity promised hope once. Now it’s just a swamp of endless regrets.",
      "9️⃣": "Nine turns on the cursed wheel, screaming your futility louder each time.",
      "🔟": "You clutch completeness like a lifeline, but it’s a polished lie hiding collapse.",
      "🔢": "Each number tallies your extinction—counting the minutes till your end.",
      "#️⃣": "Hashtags carved in decay, memorials to your self-inflicted disintegration.",
      "*️⃣": "Wildcards for chaos—potential wasted on endless destruction and failure.",
      "⏏️": "Try to eject, but even escape won’t wash the stain of your ruin away.",
      "▶️": "You replay your destruction on loop—your life a broken record of despair.",
      "⏯️": "Pause or resume, your failures march on relentless and unbroken.",
      "⏸️": "Pausing drags out the agony; the end is patient, and it awaits you coldly.",
      "⏹️": "Stopping? You never could. Your doom-machine grinds on without mercy.",
      "⏺️": "Every disgrace recorded and archived—etched eternally in your shame.",
      "⏭️": "Skipping forward only quickens your downfall. No future awaits but ruin.",
      "⏮️": "Rewinding exposes the bitter taste of mistakes you can’t undo.",
      "⏩": "Fast-forwarding toward oblivion, eager for the end you dread to face.",
      "⏪": "Rewinding only buries you deeper in a pit of failures long made.",
      "⏫": "You climb into emptiness—each step amplifying the fall to come.",
      "⏬": "Descending into darkness where no light or hope dares to follow.",
      "◀️": "Turn back? You lost that chance. Behind you lies only ruin and regret.",
      "🔼": "You push up toward choking smoke—your ambition strangled before it blooms.",
      "🔽": "Down you sink, into rot-soaked soil where dreams wither and die.",
      "➡️": "Charge forward blindly—straight into ruin’s gaping jaws.",
      "⬅️": "Retreating into denial’s hollow embrace—where your failures breed unchecked.",
      "⬆️": "Reach for poisoned clouds raining death upon your hollow ambition.",
      "⬇️": "Roots rot beneath poisoned earth, never grasping life’s true breath.",
      "↗️": "Your crooked climb angles sharply toward collapse at every turn.",
      "↘️": "Sliding carelessly into the pit, gravity eager to swallow your shame.",
      "↙️": "Dragging yourself into depths too heavy for hope to follow.",
      "↖️": "Lurching left into failure, clutching at dead hopes and empty dreams.",
      "↕️": "Up or down, ruin surrounds you—no path escapes this prison.",
      "↔️": "Swaying side to side, trapped in a barren void of your own making.",
      "↪️": "Curving back into shame—your stubborn refusal to learn is your sentence.",
      "↩️": "You return only to your mess, caught in endless cycles of decay.",
      "⤴️": "Rising arrows spiral into folly, chasing illusions down the drain.",
      "⤵️": "Descending loops of regret pull you ever lower, your own vortex of despair.",
      "🔀": "Shuffling your failures doesn’t change the outcome—you’re still doomed.",
      "🔁": "Endless loops of demise—each cycle tighter, darker, and more hopeless.",
      "🔂": "Circling back to ruin again and again—a spiral that crushes your soul.",
      "🔄": "Cursed cycles bind you. No rebirth, no renewal — only the endless recycling of your collapse.",
      "🔃": "Spin, fools, spin! Your frantic whirling brings no escape, only a deeper grave.",
      "🎵": "Melodies echo over graves, each note a dirge for failures long past.",
      "🎶": "Songs of mourning fill the air, lamenting what’s lost and never returning.",
      "➕": "You add burdens like monuments — heavy with your sins and hubris.",
      "➖": "Each subtraction hollows you more, carving away your last shreds of meaning.",
      "➗": "Divisions multiply your ruin, fracturing what little remains.",
      "✖️": "Errors multiply exponentially, feeding the monster of your own destruction.",
      "🟰": "All balances to nothing. Your efforts equal emptiness.",
      "♾️": "Infinite destruction loops, a cruel eternity with no release.",
      "💲": "Currency stained with blood, bought from the fallen — its value is death.",
      "💱": "Trading theft for theft, your barters redeem nothing lost.",
      "™️": "Trademark your misery — branding your ruin for the world to see.",
      "©️": "Copyrighted oblivion — your unique design of failure secured forever.",
      "®️": "Registered greed — the only legacy your empire leaves behind.",
      "〰️": "Endless waves of ruin crash, eroding all you once claimed.",
      "➰": "Twisting into hopeless loops, your fate knots tighter with despair.",
      "➿": "Entangled in infinite spirals, your failure chokes every breath of hope.",
      "🔚": "The end arrived long ago; you only delay admitting it.",
      "🔙": "No return remains. Bridges burn beneath your choices’ collapse.",
      "🔛": "March onward blindly, into ruin you cannot or will not turn from.",
      "🔝": "You stand atop a monument of nothing — failure’s lonely peak.",
      "🔜": "Soon collapse claims your last scraps. It is already here.",
      "✔️": "Mark your errors complete, sealing your downfall with pride.",
      "☑️": "Check all boxes on your apocalypse — each task of failure done.",
      "🔘": "Select your end; all choices lead to oblivion.",
      "⚪": "Blank circles mirror your empty vision, void of plan or hope.",
      "⚫": "Dark orbs reflect your hearts — cold, hollow, beyond salvation.",
      "🔴": "Bloodstained suns witness your crimson failures.",
      "🔵": "Drowning spheres pull every hope into icy depths.",
      "🟤": "Brown barren orbs lie dead — dry husks of life once bore.",
      "🟣": "Violet warnings pulse faintly — heedless you’ve passed the point.",
      "🟢": "Faked greenery mocks you — life’s facade over decay’s domain.",
      "🟡": "Sickly suns fade, their light too weak to halt collapse.",
      "🟠": "Toxic fires burn all left to ash and choking smoke.",
      "🔺": "Point upward — but beyond lies only void. Your climb is empty.",
      "🔻": "Downward you fall, pulled by gravity’s indifferent hand.",
      "🔸": "Mock jewels glimmer faintly — hollow as your ambition.",
      "🔹": "False gems shine brittle, worthless beneath scrutiny.",
      "🔶": "Hollow prisms refract illusions — lies that never end.",
      "🔷": "Facets turn cold, lifeless beneath your failing gaze.",
      "🔳": "Framed emptiness stares back — you seek meaning that never was.",
      "🔲": "Outlined ruins boxed neatly — your failed design’s last stand.",
      "▪️": "Dull black squares mark the decaying foundations beneath your crumbling domain.",
      "▫️": "Pale empty boxes mirror the emptiness within your once-proud creations.",
      "◾": "Dark tiles spread across your crumbling floor, paving the way to nothingness.",
      "◽": "Pale tiles stretch endlessly beneath your feet, leading you deeper into emptiness, mocking your every step.",
      "◼️": "A solid wall of unyielding darkness consumes all paths forward. No light escapes your descent.",
      "◻️": "A blank canvas of mockery, as if daring you to fill it — but you have nothing left to give.",
      "⬛": "A blackened abyss reflects your failures back at you, an endless mirror of regret.",
      "⬜": "A cold, pale void stares back, ignorant and unfeeling to your cries for meaning.",
      "🟧": "Blocks of burning orange flame flicker, warning of the infernos you’ve set upon yourself.",
      "🟦": "Bleak blue monoliths rise, dripping despair with every cold breath you take.",
      "🟥": "Walls soaked in red — the blood price of your ambition, staining the earth forever.",
      "🟫": "Decay spreads like rot beneath brown stones, devouring all that once stood vibrant.",
      "🟪": "Violet veils of deception wrap your fate, disguising ruin beneath false beauty.",
      "🟩": "The green of promised growth masks the rot beneath. Your deceit is laid bare.",
      "🟨": "Yellow banners flutter weakly, cowardice dressed as caution in the face of collapse.",
      "🔈": "Faint whispers echo, fragments of failure too weak to be silenced, yet too empty to matter.",
      "🔇": "Your silence roars louder than your lies. The void answers with chilling indifference.",
      "🔉": "Low groans emerge from beneath the surface — the murmurs of regret take form.",
      "🔊": "Cries grow louder, pleading for salvation as the end tightens its grasp. No mercy arrives.",
      "🔔": "The bells toll endlessly, a funeral hymn for your crumbling dominion.",
      "🔕": "You silence the bell, but the weight of consequence rings on in every shadow.",
      "📣": "You shout your empty proclamations into the abyss, but the void remains unimpressed.",
      "📢": "Your final announcement echoes, proclaiming your doom to a world that no longer listens.",
      "🗨️": "Speech bubbles burst like fragile hopes, leaving behind only the void’s quiet stare.",
      "👁‍🗨": "You observe, yet remain blind to the rot surrounding you. Seeing changes nothing.",
      "💬": "Words pile like broken promises, their weight unable to hold back the crumbling world.",
      "💭": "Fleeting thoughts drift unheeded, scattered like dust in the approaching storm.",
      "🗯️": "Angry mutterings crackle and die, drowned beneath the growing roar of collapse.",
      "♠️": "Spades carve your grave into the earth, each strike echoing your final folly.",
      "♣️": "Clubs swing with merciless rhythm, beating the last remnants of hope from your hollow shell.",
      "♥️": "Hardened hearts turn cold, their warmth extinguished under the weight of ruin.",
      "♦️": "Diamonds shatter beneath the pressure of your greed. The shards reflect your failure.",
      "🃏": "The jokers laugh as you stumble, their mirth a cruel chorus to your fall.",
      "🎴": "The cards foretold your doom long ago. You simply chose not to listen.",
      "🀄": "The red dragon awakens, devouring your arrogance as it consumes your crumbling domain.",
      "🕐": "Each tick carries you closer to the edge, where oblivion waits with patient hunger.",
      "🕑": "The hours you squandered slip forever from your grasp, lost in the gathering storm.",
      "🕒": "Time leaks through your fingers like sand, each grain a lost opportunity.",
      "🕓": "The clock watches in cold judgment, indifferent to your desperate resistance.",
      "🕔": "Time drains away, bleeding through cracks you can no longer seal.",
      "🕕": "Dusk descends upon your fading reign, casting long shadows over what remains.",
      "🕖": "Nightfall tightens its grip. The stars watch silently as your legacy withers.",
      "🕗": "Darkness swells, creeping ever closer as your defenses fail.",
      "🕘": "The game approaches its end. You hold no winning hand.",
      "🕙": "Almost finished — the final chords of your requiem build to their crescendo.",
      "🕚": "The penultimate hour strikes. Only whispers remain to greet the void.",
      "🕛": "Midnight seals your fate, drawing a curtain over your futile efforts.",
      "🕜": "You drift past the point of salvation. All roads now lead to ruin.",
      "🕝": "Beyond the point of return you stumble, grasping at fading echoes.",
      "🕞": "Decay accelerates, pulling your world down in an unstoppable spiral.",
      "🕟": "Final moments tick away. Your dominion turns to dust before your eyes.",
      "🕠": "Twilight slips through your grasp. The last embers fade into nothingness, as all you built crumbles in shadow.",
      "🕡": "Evening descends on your withering empire. The horizon swallows what remains of your fleeting dominion.",
      "🕢": "The hours slip away like grains of sand. What you once called yours dissolves into the void.",
      "🕣": "The threshold of oblivion approaches. Each second drags your world closer to irreversible silence.",
      "🕤": "You stand on the precipice, where light fails and hope dissolves. The end coils around you.",
      "🕥": "Your dusk arrives, carrying the weight of every choice left unmade. There will be no dawn.",
      "🕦": "You linger at the brink, breathless before the storm of consequence. The abyss widens.",
      "🕧": "The end whispers its ancient song. What was once vibrant now dissolves into cold.",
      "🕧": "The end whispers its ancient song. What was once vibrant now dissolves into cold, eternal silence.",
      "♀️": "You offer symbols, desperate to sanctify your ruin. The earth does not recognize your trinkets.",
      "♂️": "Symbols of pride and pretense hold no weight here. The rot beneath your banners spreads unchecked.",
      "⚧": "You divide, categorize, and label — yet your hands destroy without distinction. Life sees your emptiness.",
      "⚕️": "Your medicines prolong moments, but heal no wounds you have inflicted upon the world itself.",
      "🇿": "You wave your empty flags beneath dying skies. Nothing remains to salute.",
      "🇾": "Your banners flutter in hollow triumph, deaf to the collapse beneath your feet.",
      "🇽": "Each mark you inscribe echoes extinction. The earth remembers your every trespass.",
      "🇼": "Banners whipped by indifferent winds—futile declarations against the rising void.",
      "🇻": "Victory is but a word you chant while the soil turns to dust beneath you.",
      "🇺": "Unity, you claim — yet your unity feeds ruin. The roots cannot breathe beneath your march.",
      "🇹": "Your towers crumble, returning to the dust from which your arrogance once raised them.",
      "🇸": "These symbols of sovereignty drip sorrow. Nothing remains but echoes of conquest.",
      "🇷": "The reigns you clutch unravel into ash. Nature reclaims its stolen breath.",
      "🇶": "Questions linger unanswered as your monuments sink beneath growing shadows.",
      "🇵": "Broken promises litter the wasteland. The ground swallows your hollow vows.",
      "🇴": "Orbits destabilize as you spin blind within your decaying illusions of control.",
      "🇳": "Nations fall like brittle leaves. Their banners lie buried beneath the roots you severed.",
      "🇲": "Monuments fracture and decay. The stones remember what you have tried to forget.",
      "🇱": "Lost legacies gather like fallen leaves — dry, crumbling, forgotten by all but the soil.",
      "🇰": "Kingdoms fade to ash, their bones cradled by indifferent earth.",
      "🇯": "Judgments have been rendered. The verdict is written in the scars you leave behind.",
      "🇮": "Your illusions fracture under the weight of your own consumption.",
      "🇭": "Hope flickers and dies beneath the choking clouds of your own creation.",
      "🇬": "Once-glorious triumphs rot beneath the silent watch of unmoving stars.",
      "🇫": "Failures pile like broken branches. The roots thirst beneath your collapse.",
      "🇪": "Endings bloom where life once stood. The earth reclaims what you have squandered.",
      "🇩": "Desolation reigns supreme. No walls stand against nature’s patient reclaiming.",
      "🇨": "Catastrophe completes its work. The air grows still as balance returns.",
      "🇧": "The burial mounds rise, silent witnesses to your vanishing dominion.",
      "🇦": "Ashes drift on hollow winds. This is all you leave behind.",
      "🐹": "**WHO DARES OFFER ME THE SACRED HAMSTER?! MY WRATH SHALL BE LEGENDARY!**"
};

// Reaction listener
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  // Handle partials
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Failed to fetch reaction: ', error);
      return;
    }
  }

  const emoji = reaction.emoji.name;
  const message = reaction.message;
  const userId = user.id;

  if (offeringResponses[emoji]) {
    // Hamster special case
    if (emoji === "🐹") {
      message.channel.send(`${offeringResponses[emoji]} <@${userId}>`);
      updateXP(userId, -10); // Special bigger penalty for hamster
      return;
    }

    // Valid offering
    message.channel.send(`${offeringResponses[emoji]} <@${userId}>`);
    updateXP(userId, 10);
  } else {
    // Invalid offering
    message.channel.send(`Pathetic. That is not an acceptable offering. -5 XP <@${userId}>`);
    updateXP(userId, -5);
  }
});

// XP system
function updateXP(userId, amount) {
  if (!xpData[userId]) {
    xpData[userId] = 0;
  }
  xpData[userId] += amount;
  fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2));
}

// ==================== HELP COMMAND ====================

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const member = await message.guild.members.fetch(message.author.id);

  // ==================== ADMIN ROLE CHECK FOR ALL COMMANDS ====================
  const adminRoleId = '1384826237633040464';
  if (!member.roles.cache.has(adminRoleId)) {
    message.reply("You do not have permission to use this command.");
    return;
  }

  // ==================== !HELP COMMAND ====================
 if (command === '!help') {
    const helpText = `
**__Available Commands:__**

__Familiar System__
\`!adopt\` — Adopt a new familiar.
\`!namefam <name>\` — Name your familiar.
\`!myfam\` — View your familiar's stats.
\`!playfam\` — Play with your familiar to gain XP.
\`!patfam\` — Pat your familiar to increase mood.
\`!feedfam\` — Feed your familiar to restore HP.
\`!fammood\` — Check your familiar's current mood.

__Shop & Inventory__
\`!shop\` — View items available for purchase.
\`!buy <item>\` — Buy an item.
\`!buygear <gear>\` — Buy gear for your familiar.
\`!dressfam <item>\` — Equip your familiar with outfits.

__Hunting & Events__
\`!hunt\` — Send your familiar on a hunt.
\`!event\` — Trigger a random world event.
\`!moon\` — See the current moon phase.
\`!worldevent\` — View ongoing world events.

__Guild System__
\`!createguild <name>\` — Create a guild (requires 5 rebirths).
\`!applyguild <name>\` — Apply to a guild.
\`!guildapps\` — View pending guild applications.
\`!approveguild @user\` — Approve a guild applicant.
\`!rejectguild @user\` — Reject a guild applicant.

__Mini-Games & Fun__
\`!tictactoe\` — Start Tic Tac Toe.
\`!place <1-9>\` — Place move in Tic Tac Toe.
\`!dicebattle\` — Battle familiars with dice.
\`!memory\` — Play Memory Match.
\`!connect\` — Play Connect Four.
\`!hangman\` — Play Hangman.
\`!cardduel\` — Card duel with the hamster.
\`!math\` — Math challenge.
\`!answer <number>\` — Answer the math question.
\`!story\` — Finish the story.
\`!fortune\` — Get a random fortune.
\`!gamble <amount>\` — Gamble coins.
\`!reflex\` — Reflex duel.
\`!click\` — Respond quickly in reflex.
\`!fambattle\` — Battle another user's familiar.

__Brewing & Trivia__
\`!trivia\` — Witch trivia.
\`!answer\` — Answer trivia.
\`!brew <herb1> <herb2>\` — Brew potions.

__Offerings & Shrine__
\`!shrine\` — Approach the shrine.
\`!offerconfirm\` — Confirm shrine offering.
\`!shepherd\` — Approach the Shepherd.
\`!shepherdconfirm\` — Confirm Shepherd offering.

__Trading__
\`!trade @user <item> <amount>\` — Offer trade.
\`!accepttrade\` — Accept trade offer.
\`!declinetrade\` — Decline trade offer.

__Fun Calls__
\`!callshepherd\` — Call the Shepherd.
\`!callherbalist\` — Call the Herbalist.
\`!callhamster\` — Call the Hamster Merchant.
\`!callfamiliar\` — Call your familiar.

__Sacrifice & Rituals__
\`!sacrifice @user\` — Dark sacrifice (Level 100+).

__Hamster Casino__
\`!hamstercasino\` — Enter casino.
\`!blackjack\` — Play Blackjack.
\`!slots\` — Spin slots.
\`!coinflip <h/t> <amt>\` — Coin Flip.
\`!dice\` — Roll dice.
\`!roulette <num/color>\` — Spin roulette.
\`!crash\` — Play Crash.
\`!keno\` — Play Keno.
\`!wheel\` — Spin wheel.
\`!rps\` — Rock Paper Scissors.
\`!highlow\` — High or Low.

__VIP Hamster Casino__
\`!vipcasino\` — VIP Casino.
\`!vippoker\` — VIP Poker.
\`!vipblackjack\` — VIP Blackjack.
\`!viproulette\` — VIP Roulette.
\`!vipslots\` — VIP Slots.
\`!vipkeno\` — VIP Keno.
\`!vipcrash\` — VIP Crash.

__Casino Utilities__
\`!hamsterbalance\` — Check tokens.
\`!hamsterleaderboard\` — Top gamblers.
\`!vipshop\` — View VIP shop.
\`!dailyspin\` — Claim free daily spin.

__Other__
\`!unlocklore\` — Unlock new lore.
\`!curseitem <item>\` — Curse an item.
\`!assist\` — Show this help menu.
`;
    return message.reply(helpText);
}

  // ==================== ADMIN MAX COMMAND ====================
  if (command === 'adminmax') {
  // Check if user has admin role
  if (!member.roles.cache.has('1384826237633040464')) {
    message.reply("You do not have permission to use this command.");
    return;
  }

  // Check if familiar exists
  if (!familiarData[member.id]) {
    message.reply("You don't have a familiar yet!");
    return;
  }

  // Max familiar stats
  familiarData[member.id].level = 200;
  familiarData[member.id].xp = 999999;
  familiarData[member.id].hp = 9999;
  familiarData[member.id].maxHp = 9999;
  familiarData[member.id].evolutionStage = 3;

  // Max player XP data
  if (!xpData[member.id]) xpData[member.id] = { xp: 0, level: 1, rebirths: 0 };
  xpData[member.id].xp = 999999;
  xpData[member.id].level = 200;
  xpData[member.id].rebirths = 99;

  saveFamiliar();
  if (typeof saveData === 'function') saveData();

  message.reply("Your familiar and stats have been fully maxed out!");
}

  // You can continue adding more commands here following the same pattern.
});

// ==================== GUILD ROLES DATA ====================

const guildRoles = {
  // Participation / progression roles
  "1384825797168070749": {
    name: "Eyes of The Shepherd",
    description: "Master of familiars — bonds with creatures, unlocks secret knowledge.",
    unlockRequirement: "Level multiple familiars to maximum."
  },
  "1384825657631965316": {
    name: "Herbalist of Concordium",
    description: "Expert in herbalism — handles poisonous herbs, rituals, and forbidden gardening.",
    unlockRequirement: "Successfully complete herbalist mini-games."
  },
  "1384825360289632339": {
    name: "Custodians of Concordium",
    description: "Dismemberment masters — perform sacrifices and process body parts.",
    unlockRequirement: "Perform 3 successful sacrifices."
  },
  "1384826040018407475": {
    name: "Voice of Concordium",
    description: "Lorekeeper — assigned only via special events or admin approval.",
    unlockRequirement: "Special event or admin assigned."
  },

  // Early initiation roles
  "1386349199712456845": {
    name: "Initiate of the Veil",
    description: "Beginner disciple of the Concordium’s dark arts.",
    unlockRequirement: "Join the Concordium."
  },
  "1386349393707532308": {
    name: "Seeker of the Shepherd",
    description: "Actively seeks forbidden knowledge.",
    unlockRequirement: "Complete initial lore quizzes."
  },
  "1386349584284127304": {
    name: "Bearer of the Whisper",
    description: "Recipient of whispered forbidden truths.",
    unlockRequirement: "Participate in lore events."
  },

  // Advanced progression roles
  "1386350030033522868": {
    name: "Servant of the Nest",
    description: "Performs duties within the sacred Nest.",
    unlockRequirement: "Reach Level 20."
  },
  "1386350189379322078": {
    name: "Veil-Touched Acolyte",
    description: "Marked by the Veil's influence.",
    unlockRequirement: "Reach Level 30."
  },
  "1386350402873856121": {
    name: "Daughter/Son of Sacrifice",
    description: "Devotee to sacrificial rites.",
    unlockRequirement: "Perform 1 successful sacrifice."
  },

  // Mid to late game roles
  "1386350692914040882": {
    name: "Whispered Chosen",
    description: "Chosen by the whispers beyond.",
    unlockRequirement: "Reach Level 50."
  },
  "1386351007948214463": {
    name: "Ascendant of the Veil",
    description: "Ascended practitioner of forbidden arts.",
    unlockRequirement: "Reach Level 80."
  },
  "1386351550229778662": {
    name: "Hamster’s Nestlings",
    description: "Sworn servants of the Sacred Hamster.",
    unlockRequirement: "Complete Hamster Casino events."
  },

  // Special lore roles
  "1386351742903386327": {
    name: "The Whispered Ones",
    description: "Deeply connected to unspeakable forces.",
    unlockRequirement: "Unlock secret lore events."
  },
  "1386352196827746508": {
    name: "The Oracles of the Veil",
    description: "Visionaries of terrible truths.",
    unlockRequirement: "Win multiple fortune-telling sessions."
  },
  "1386351886139129986": {
    name: "The Messianic Believers",
    description: "Fanatical followers of the Shepherd prophecy.",
    unlockRequirement: "Complete lore trials."
  },

  // Ritual mastery
  "1386353864315502623": {
    name: "Keeper of Nestlings",
    description: "Caretaker of newborn familiars.",
    unlockRequirement: "Bond with multiple familiars."
  },
  "1386354123472900247": {
    name: "Master Ritualist",
    description: "Performer of complex rituals.",
    unlockRequirement: "Complete advanced ritual quests."
  },

  // High elite roles
  "1386354002954031256": {
    name: "Champion of the Veil",
    description: "One of the strongest disciples.",
    unlockRequirement: "Win tournaments or PvP events."
  },
  "1386354249125855292": {
    name: "Auction Dominator",
    description: "Controls the forbidden auctions.",
    unlockRequirement: "Dominate auction house events."
  },
  "1386353157734531193": {
    name: "The Gambler",
    description: "Survivor of high-risk games.",
    unlockRequirement: "Win extreme casino stakes."
  },
  "1386352777386655887": {
    name: "Bearer of Forbidden Lore",
    description: "Holds forbidden scriptures.",
    unlockRequirement: "Unlock hidden lore chapters."
  },
  "1386352610054901891": {
    name: "Hamster’s Favorite",
    description: "The hamster smiles upon you.",
    unlockRequirement: "Max hamster bonding stats."
  }
};

// ==================== SACRIFICE SYSTEM ====================

// Body Parts Table (Loot Pool)
const bodyParts = [
  "Severed Hand", "Twisted Spine", "Blackened Heart", "Shattered Skull", "Torn Tongue",
  "Withered Foot", "Ripped Ear", "Cursed Rib", "Cracked Femur", "Mangled Fingers",
  "Seeping Eye", "Gnawed Liver", "Corrupted Kidney", "Burned Lungs", "Shriveled Stomach",
  "Splintered Collarbone", "Pierced Pancreas", "Tainted Intestines", "Bent Clavicle", "Sliced Tendon",
  "Torn Esophagus", "Melted Brain", "Fused Vertebrae", "Bleeding Spleen", "Frostbitten Toes",
  "Mutilated Jaw", "Severed Wrist", "Coiled Small Intestine", "Charred Thighbone", "Eviscerated Gallbladder",
  "Bloodied Fingerbone", "Shattered Pelvis", "Twisted Ankle", "Pierced Lung", "Exposed Spinal Cord",
  "Punctured Liver", "Shredded Abdomen", "Dislocated Shoulder", "Broken Neck", "Split Ribcage",
  "Fractured Cranium", "Boiled Eyeball", "Slashed Palm", "Torn Lip", "Sliced Scalp",
  "Crushed Knee", "Buried Teeth", "Dissected Ear Canal", "Damaged Optic Nerve", "Broken Collarbone",
  "Gutted Appendix", "Burst Bladder", "Slashed Hamstring", "Ripped Vocal Cords", "Gnawed Achilles Tendon",
  "Crushed Jawbone", "Melted Skullcap", "Peeled Scrotum", "Twisted Spine Segment", "Bleeding Nostrils",
  "Fused Jaw", "Sundered Trachea", "Cauterized Pancreas", "Splattered Brain Stem", "Warped Eyelid",
  "Busted Knee Cap", "Broken Metatarsal", "Detached Eardrum", "Ruptured Spleen", "Scraped Tongue",
  "Ripped Sternum", "Sliced Artery", "Exsanguinated Wrist", "Cracked Tailbone", "Damaged Hip Socket",
  "Splattered Teeth", "Eviscerated Intestines", "Charred Scapula", "Caved Chest", "Sundered Foot",
  "Broken Jawline", "Crushed Vertebrae", "Bleeding Gums", "Slashed Abdomen", "Exploded Appendix",
  "Ripped Muscles", "Boiled Throat", "Shattered Femur Head", "Pierced Abdomen", "Twisted Wrist Bone",
  "Broken Sacrum", "Ripped Fingernails", "Severed Lip", "Melted Teeth", "Corroded Eyeballs",
  "Warped Spinal Disc", "Exposed Rib Bone", "Splintered Tibia", "Twisted Shinbone", "Torn Hamstring Tendon"
];

// Sacrifice Command Handler
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!sacrifice')) return;
  if (message.author.bot) return;

  // Parse Target
  const args = message.content.split(" ");
  if (args.length < 2) {
    return message.reply("You must mention someone to sacrifice! Usage: `!sacrifice @user`");
  }

  const target = message.mentions.users.first();
  if (!target) {
    return message.reply("Invalid target. You must mention a valid user.");
  }

  // Level Check (Insert your own level system function)
  const userLevel = await getUserLevel(message.author.id);
  if (userLevel < 100) {
    return message.reply("You must be at least **Level 100** to perform sacrifices.");
  }

  // Success Chance (50/50)
  const success = Math.random() < 0.5;
  if (!success) {
    await applyXpPenalty(message.author.id, 50);
    return message.reply(`The sacrifice was rejected! You have been **cursed** and lost experience!`);
  }

  // Successful Sacrifice
  await message.reply(`The dark ritual is complete! You have sacrificed ${target.username} and pleased the ancient powers.`);

  // Apply reward logic here (e.g. give rare items, bonus XP, or unlock lore)
  await grantSacrificeReward(message.author.id);
});

  // Sacrifice Successful - Loot Roll
  const part1 = bodyParts[Math.floor(Math.random() * bodyParts.length)];
  const part2 = bodyParts[Math.floor(Math.random() * bodyParts.length)];
  const part3 = bodyParts[Math.floor(Math.random() * bodyParts.length)];

  message.reply(`The sacrifice is accepted! You obtained:\n- ${part1}\n- ${part2}\n- ${part3}\n\n**Where do you assign them?**\n\nReply:\n\`garden\`, \`herbalist\`, or \`cafeteria\``);

  // Await User Assignment
  const filter = m => m.author.id === message.author.id;
  const collector = message.channel.createMessageCollector({ filter, time: 30000, max: 1 });

  collector.on('collect', async (m) => {
    const response = m.content.toLowerCase();

    if (["garden", "herbalist", "cafeteria"].includes(response)) {
  await rewardUser(message.author.id, 100);
  await message.reply(`You assigned the parts to the ${response}! You gain bonus experience.`);
} else {
  await applyXpPenalty(message.author.id, 25);
  await message.reply("You fumbled the ritual and lost some experience.");
}

  collector.on('end', collected => {
    if (collected.size === 0) {
      message.reply("You took too long. The offering rots away.");
    }
  });
});

// ==================== LEVEL SYSTEM PLACEHOLDERS ====================

// Replace these placeholder functions with your actual database XP system

async function getUserLevel(userId) {
  // TEMP: Hardcoded for testing; replace with DB lookup
  return 100;
}

async function applyXpPenalty(userId, amount) {
  console.log(`Penalize user ${userId} by ${amount} XP`);
  // TODO: Subtract XP from user in your database
}

async function rewardUser(userId, amount) {
  console.log(`Reward user ${userId} with ${amount} XP`);
  // TODO: Add XP to user in your database
}

// ==================== GUILD SYSTEM ====================

// In-memory storage (for testing; replace with DB in production)
const guilds = {};
const guildApplications = {};

// Command: Create Guild (only for users with 5 rebirths or more)
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!createguild')) return;
  if (message.author.bot) return;

  const args = message.content.split(" ");
  if (args.length < 2) {
    return message.reply("Usage: `!createguild GuildName`");
  }

  const rebirths = await getUserRebirths(message.author.id); // You need to replace this function
  if (rebirths < 5) {
    return message.reply("You need at least **5 rebirths** to create a guild.");
  }

  const guildName = args.slice(1).join(" ");
  if (guilds[guildName]) {
    return message.reply("That guild already exists.");
  }

  guilds[guildName] = {
    leaderId: message.author.id,
    members: [message.author.id],
  };

  message.reply(`Guild **${guildName}** created! You are now the guild leader.`);
});

// Command: Apply to Join a Guild
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!applyguild')) return;
  if (message.author.bot) return;

  const args = message.content.split(" ");
  if (args.length < 2) {
    return message.reply("Usage: `!applyguild GuildName`");
  }

  const guildName = args.slice(1).join(" ");
  const guild = guilds[guildName];
  if (!guild) {
    return message.reply("That guild does not exist.");
  }

  // Check if user is already in any guild
  for (const g of Object.values(guilds)) {
    if (g.members.includes(message.author.id)) {
      return message.reply("You are already in a guild. Leave or rebirth to apply again.");
    }
  }

  // Prevent duplicate applications
  if (!guildApplications[guildName]) guildApplications[guildName] = [];
  if (guildApplications[guildName].includes(message.author.id)) {
    return message.reply("You have already applied to this guild.");
  }

  guildApplications[guildName].push(message.author.id);
  await message.reply(`Your application to **${guildName}** has been submitted.`);

  // Notify leader (with fail-safe in case leader cannot be DM'ed)
  try {
    const leader = await client.users.fetch(guild.leaderId);
    await leader.send(`${message.author.username} has applied to join your guild **${guildName}**.\nUse \`!approveguild @user\` or \`!rejectguild @user\`.`);
  } catch (error) {
    console.log(`Could not DM the leader: ${error}`);
    await message.reply("The guild leader has been notified (or will see the application when online).");
  }
});

// Command: Approve Guild Application (only leader can do this)
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!approveguild')) return;
  if (message.author.bot) return;

  const mention = message.mentions.users.first();
  if (!mention) {
    return message.reply("Usage: `!approveguild @user`");
  }

  // Find guild where message.author is leader
  const guildName = Object.keys(guilds).find(name => guilds[name].leaderId === message.author.id);
  if (!guildName) {
    return message.reply("You are not a guild leader.");
  }

  const pending = guildApplications[guildName] || [];
  if (!pending.includes(mention.id)) {
    return message.reply("That user has not applied to your guild.");
  }

  // Approve
  guilds[guildName].members.push(mention.id);
  guildApplications[guildName] = pending.filter(id => id !== mention.id);

  message.reply(`${mention.username} has been accepted into **${guildName}**!`);
  mention.send(`You have been accepted into **${guildName}**!`);
});

// Command: Reject Guild Application (only leader)
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!rejectguild')) return;
  if (message.author.bot) return;

  const mention = message.mentions.users.first();
  if (!mention) {
    return message.reply("Usage: `!rejectguild @user`");
  }

  const guildName = Object.keys(guilds).find(name => guilds[name].leaderId === message.author.id);
  if (!guildName) {
    return message.reply("You are not a guild leader.");
  }

  const pending = guildApplications[guildName] || [];
  if (!pending.includes(mention.id)) {
    return message.reply("That user has not applied to your guild.");
  }

  guildApplications[guildName] = pending.filter(id => id !== mention.id);
  message.reply(`${mention.username}'s application has been rejected.`);
  mention.send(`Your application to **${guildName}** was rejected.`);
});

// ==================== PLACEHOLDER FOR REBIRTH SYSTEM ====================

async function getUserRebirths(userId) {
  // TEMP: Hardcoded for testing; replace with DB lookup
  return 5; // Change this for testing different rebirth counts
}

// ==================== HAMSTER CASINO SYSTEM ====================

const hamsterTokens = new Map(); // userId -> token balance
const hamsterCasinoVIP = new Set(); // userIds with VIP access
const hamsterCasinoSkins = new Map(); // userId -> cosmetic skins
const hamsterCasinoLeaderboard = []; // to be sorted by total tokens won

function getTokens(userId) {
  return hamsterTokens.get(userId) || 0;
}

function addTokens(userId, amount) {
  const current = getTokens(userId);
  hamsterTokens.set(userId, current + amount);
  updateLeaderboard(userId, current + amount);
}

function subtractTokens(userId, amount) {
  const current = getTokens(userId);
  hamsterTokens.set(userId, Math.max(current - amount, 0));
}

function updateLeaderboard(userId, newTotal) {
  const index = hamsterCasinoLeaderboard.findIndex(e => e.userId === userId);
  if (index !== -1) hamsterCasinoLeaderboard.splice(index, 1);
  hamsterCasinoLeaderboard.push({ userId, tokens: newTotal });
  hamsterCasinoLeaderboard.sort((a, b) => b.tokens - a.tokens);
  if (hamsterCasinoLeaderboard.length > 10) hamsterCasinoLeaderboard.pop();
}

// ========== BASIC COMMAND EXAMPLES ==========

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === '!casino') {
    return message.reply(`🎰 **Welcome to the Hamster Casino!** 🎰\n
"Squeak! Welcome friend! Ready to squeal with riches or cry into your fur?" squeaks the Hamster Dealer.\n
Use \`!gamble <amount>\`, \`!blackjack <amount>\`, \`!slots <amount>\`, or \`!vipcasino\` if you're VIP.`);
  }

  if (command === '!tokens') {
    return message.reply(`You have 🐹 ${getTokens(message.author.id)} Hamster Tokens.`);
  }

  if (command === '!blackjack') {
    const bet = parseInt(args[0]);
    if (!bet || bet <= 0) return message.reply('Squeak! You must bet a real number of tokens.');
    if (getTokens(message.author.id) < bet) return message.reply("Squeak! Not enough tokens, silly gambler!");

    // Add actual blackjack logic here...
    message.reply(`"Cards drawn! Wanna **hit**, **stand**, or **fold**, squeak?" says the tiny dealer.`);
  }

  if (command === '!slots') {
    const bet = parseInt(args[0]);
    if (!bet || bet <= 0) return message.reply('Squeak squeak! Bet a valid amount!');
    if (getTokens(message.author.id) < bet) return message.reply('You don’t have enough tokens!');

    const symbols = ['🍒', '🍋', '🔔', '💎', '🐹'];
    const spin = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    const result = spin.join(' | ');
    message.reply(`🎰 ${result}`);

    if (spin[0] === spin[1] && spin[1] === spin[2]) {
      addTokens(message.author.id, bet * 5);
      message.channel.send('Squeak! JACKPOT! You win big!');
    } else {
      subtractTokens(message.author.id, bet);
      message.channel.send('Squeak... Better luck next time.');
    }
  }

  if (command === '!vipcasino') {
    if (!hamsterCasinoVIP.has(message.author.id)) {
      return message.reply('Squeak! VIPs only! You smell too... common.');
    }
    message.reply(`"Welcome back, VIP!" squeaks the golden hamster in a tuxedo.\nGames available: \`!vippoker\`, \`!viproulette\`, \`!hamstercardduel\``);
  }

  if (command === '!vipleaderboard') {
    let leaderboard = hamsterCasinoLeaderboard.map((entry, i) => `${i + 1}. <@${entry.userId}> — ${entry.tokens} tokens`).join('\n');
    return message.reply(`🎖️ **Hamster Casino Leaderboard** 🎖️\n${leaderboard}`);
  }
});

// VIP Games - Only accessible if in hamsterCasinoVIP
// Add full mechanics as needed
function unlockVIP(userId) {
  hamsterCasinoVIP.add(userId);
}
}
console.log('Starting bot..');
