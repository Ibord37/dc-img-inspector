import { Client, GatewayIntentBits } from "discord.js";

import { ready, interactionCreate, messageCreate } from "./listeners";

import type { BotUser } from "./utilities/users";
import { loadBlacklisted } from "./utilities/loader";
import { loadUsers } from "./utilities/users";

import { BOT_TOKEN } from "./config";

const keepAlive = require("./keepAlive");

console.log("图片检查器正在启动...");

declare module "discord.js" {
    interface Client {
        knownHashes: string[];
        botUsers: BotUser[];
    }
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.knownHashes = [];
client.botUsers = [];

loadBlacklisted(client.knownHashes).then(() => {
    loadUsers(client.botUsers).then(() => {
        client.login(BOT_TOKEN).then(() => {
            console.log("图片检查器已通过身份验证");

            ready(client);
            interactionCreate(client);
            messageCreate(client);
        });
    })
});