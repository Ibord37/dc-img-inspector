import fs from "fs";
import path from "path";

export interface BotUser {
    id: string;
    socialCredit: number;
}

export const loadUsers = async (botUsers: BotUser[]): Promise<void> => {
    const dir = path.join(process.cwd(), "users.json");

    if (!fs.existsSync(dir)) {
        const data = JSON.stringify([], null, 2);
        fs.writeFile(dir, data, { flag: 'wx' }, (err) => {
            if (err) throw err;
        });
    }

    const file = fs.readFileSync(dir, 'utf-8');
    const data: BotUser[] = JSON.parse(file);

    botUsers.splice(0, botUsers.length, ...data);
    console.log(`Loaded ${botUsers.length} users.`);
}

export const loadUser = (botUsers: BotUser[], id: string): BotUser => {
    return botUsers.find(botUser => botUser.id === id) as BotUser;
}

export const updateUser = async (botUsers: BotUser[], user: BotUser) => {
    const index = botUsers.findIndex(u => u.id === user.id);

    if (index !== -1) 
        botUsers[index] = user;
    else 
        botUsers.push(user);
    
    const dir = path.join(process.cwd(), "users.json");
    fs.writeFileSync(dir, JSON.stringify(botUsers, null, 3));
}