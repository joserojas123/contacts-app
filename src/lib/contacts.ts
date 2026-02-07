import fs from "fs";
import path from "path";
import { Contact } from "@/types/contact";

const filePath = path.join(process.cwd(), "data", "contacts.csv");

export function getContacts(): Contact[] {
    const file = fs.readFileSync(filePath, "utf-8");

    const [, ...rows] = file.split("\n");

    return rows
        .filter(Boolean)
        .map(row => {
            const [name, phone, active] = row.split(",");
            return {
                name,
                phone,
                active: active === "true",
            };
        })
        .filter(contact => contact.active);
}

export function deactivateContact(name: string) {
    const file = fs.readFileSync(filePath, "utf-8");
    const lines = file.split("\n");

    const updated = lines.map((line, index) => {
        if (index === 0) return line; // header

        const [n, phone, active] = line.split(",");
        if (n === name) {
            return `${n},${phone},false`;
        }
        return line;
    });

    fs.writeFileSync(filePath, updated.join("\n"));
}
