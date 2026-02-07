import fs from "fs";
import path from "path";

export type Contact = {
    name: string;
    phone: string;
    active: boolean;
};

const filePath = path.join(process.cwd(), "data", "contacts.csv");

export function readContacts(): Contact[] {
    const csv = fs.readFileSync(filePath, "utf-8");
    const lines = csv.trim().split("\n");

    return lines.slice(1).map((line) => {
        const [name, phone, active] = line.split(",");
        return {
            name,
            phone,
            active: active === "true",
        };
    });
}
