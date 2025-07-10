const { Client, IntentsBitField, Partials } = require('discord.js');
const fs = require('fs');
const xp = require('./xp/index.js');
const offerings = require("./offerings/index.js");

const updateXP = xp.updateXP;
const maximizeXP = xp.maximizeXP;

console.log("Starting bot...");
require('dotenv').config();

xp.onStart();

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

client.on('messageReactionAdd', async (reaction, user) => {
  await offerings.onMessageReactionAdd(reaction, user);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const commands = {
    ...xp.commands(message),
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
        maximizeXP(member.id);
        fs.writeFileSync(familiarFile, JSON.stringify(familiarData, null, 2));
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

process.on('SIGINT', async () => {
    console.log('Caught interrupt signal (Ctrl+C)');

    // Optional: Inform you're shutting down (e.g., log or notify a channel)
    try {
        await client.destroy(); // cleanly log out from Discord
        console.log('Discord client destroyed');
        xp.onShutdown();
    } catch (err) {
        console.error('Error during shutdown:', err);
    }

    process.exit(0); // Exit explicitly
});

