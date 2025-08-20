import fs from "fs";
import path from "path";

import { hashImageFromUrl } from "./file";

export const pushBlacklisted = async (knownHashes: string[], filePath: string) => {
    const hash = await hashImageFromUrl(filePath);
    knownHashes.push(hash);
}

export const loadBlacklisted = async (knownHashes: string[]): Promise<void> => {
    const dir = path.join(process.cwd(), "blacklisted");
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });

    const files = fs.readdirSync(dir).filter(f => f.match(/\.(png|jpg|jpeg)$/i));
    console.log(`加载 ${files.length} 个列入黑名单的图片... | Loaded ${files.length} blacklisted images.`);

    for (const file of files) {
        const filePath = path.join(dir, file);
        try {
            pushBlacklisted(knownHashes, filePath);
            console.log(`✔ 列入黑名单: ${file}`);
        } catch (err) {
            console.error(`❌ 哈希失败 ${file}:`, err);
        }
    }
}