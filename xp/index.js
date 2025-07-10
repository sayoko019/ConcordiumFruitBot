const fs = require("fs");
const path = require("path");

const xpFile = path.join(__dirname, "/xp.json");

const DEFAULT_XP_DATA = {
    xp: 0,
    level: 0,
    rebirths: 0
};

// TODO: add a set of required intents and partials

let xpData = {};

function commands(message) {
    return {
        "xp": {
        description: "Check your XP.",
        execute: () => {
            const userXpData = xpData[message.author.id] || DEFAULT_XP_DATA;
            const xp = userXpData.xp;
            message.reply(`<@${message.author.id}>, your XP is ${xp}.`);
        }
        },
    }
}

function onStart() {
    if (fs.existsSync(xpFile)) {
      xpData = JSON.parse(fs.readFileSync(xpFile));
    }
}

function onShutdown() {
    fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2));
}

function updateXP(userId, amount) {
  if (!xpData[userId]) {
    xpData[userId] = DEFAULT_XP_DATA;
  }
  xpData[userId].xp += amount;
  fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2));
}

function maximizeXP(userId) {
    xpData[userId] = { xp: 999999, level: 200, rebirths: 99 };
    fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2));
}

module.exports = {
  commands,
  onStart,
  onShutdown,
  updateXP,
  maximizeXP
};
