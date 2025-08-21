import { Client, Events, Message } from "discord.js";

import type { BotUser } from "../utilities/users";
import { hammingDistance, hashImageFromUrl } from "../utilities/file";
import { loadUser, updateUser } from "../utilities/users";

export default (client: Client): void => {
    client.on(Events.MessageCreate, async (message: Message) => {
        handleChatRestriction(client, message);
    });
};

const handleChatRestriction = async (client: Client, message: Message): Promise<void> => {
    const attachment = message.attachments.first();

    if (!attachment?.contentType || !attachment.contentType.startsWith("image/") || !message.guild) return;

    const hash = await hashImageFromUrl(attachment.url);

    for (const known of client.knownHashes) {
        const dist = hammingDistance(hash, known);
        if (dist < 5) { // threshold
            try {
                const penalty: number = 300;
                let user: BotUser = loadUser(client.botUsers, message.author.id);

                if (!user)
                    user = { id: message.author.id, socialCredit: 0 };

                user.socialCredit -= 300;

                if (user.socialCredit < -1000) {
                    user.socialCredit += 1000;

                    if (message.member?.moderatable)
                        await message.member?.timeout(180 * 60 * 1000, '由于超出了最大违规次数，您将被逮捕三个小时。t');

                    await message.reply(`☭: 🚫 由于超出了最大违规次数，您将被逮捕三个小时。\n☭: 🚫 Kamu ditahan selama tiga jam karena telah melewati batas jumlah pelanggaran. (Translated)`);
                }

                await updateUser(client.botUsers, user);

                await message.reply(`☭: 🚫 此图片已被列入黑名单! -${penalty} Social Credits\n☭: 🚫 Foto masuk blacklist wok! -${penalty} Social Credits. (Translated)\nStatus: (${user.socialCredit} / -1000 social credits to timeout)`);

                if (message.deletable) {
                    await message.delete();
                } else {
                    console.warn(`Message from ${message.author.tag} not deletable`);
                }
            } catch (err) {
                console.error("Failed to delete message:", err);
            }

            return;
        }
    }
};
