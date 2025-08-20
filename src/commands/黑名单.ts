import { ApplicationCommandType, Client, CommandInteraction, ApplicationCommandOptionType, GuildMember, PermissionsBitField, Guild } from "discord.js";
import { ICommand } from "../interfaces/command";

import { downloadFile } from "../utilities/file";
import { pushBlacklisted } from "src/utilities/loader";

import path from "path";
import fs from "fs";

export const 黑名单: ICommand = {
    name: "黑名单",
    description: "将图像列入黑名单。",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "图片",
            description: "要列入黑名单的图片 (TL: Gambar yang mau lu blacklist.)",
            type: ApplicationCommandOptionType.Attachment,
            required: true,
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        if (!interaction.isChatInputCommand()) {
            await interaction.editReply("此命令仅作为斜线命令起作用。(TL: Ini slash command bang.)");
            return;
        }
        
        const member: GuildMember = interaction.member as GuildMember;
        if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.editReply("请提供一张图片。(TL: Mana gambarnya wok?)");
            return;
        }

        const attachment = interaction.options.getAttachment("图片");
        if (!attachment) {
            await interaction.editReply("你没有权限这么做。(TL: Lu gak ada permission untuk ngelakuin ini.)");
            return;
        }

        const url = attachment.url;
        const urlObj = new URL(url);
        const filename = path.basename(urlObj.pathname);

        const dir = path.join(process.cwd(), "blacklisted");
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });

        const savePath = path.join(process.cwd(), "blacklisted", filename);

        try {
            await downloadFile(url, savePath);
            await interaction.editReply(`下载了 ${filename} ✅。\nTL: File telah diunduh.`);
            pushBlacklisted(client.knownHashes, savePath);
        } catch (err) {
            console.error(err);
            await interaction.editReply("❌ 下载文件失败。\nTL: File gagal diunduh.");
        }

        await interaction.editReply(`已将图片加入黑名单。\nTL: Gambar berhasil ditambahkan ke blacklist dawg.\nData: ${url}`);
    }
};
