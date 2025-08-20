import fs from "fs";

import fetch from "node-fetch";
import { imageHash } from "image-hash";
import { promisify } from "util";

const imageHashAsync = promisify(imageHash);

export const hashImageFromUrl = (filePathOrUrl: string): Promise<string> => {
    return imageHashAsync(filePathOrUrl, 16, true) as Promise<string>;
};

export const hammingDistance = (hash1: string, hash2: string): number => {
    let dist: number = 0;
    for (let i = 0; i < hash1.length; i++) {
        if (hash1[i] !== hash2[i]) dist++;
    }
    return dist;
};

export const downloadFile = async (url: string, outputPath: string): Promise<void> => {
    const res = await fetch(url);
    if (!res.ok) 
        throw new Error(`Failed to fetch ${url}: ${res.statusText}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
}

