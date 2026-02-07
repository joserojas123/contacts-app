import fs from "fs";
import path from "path";
import { Contact } from "@/types/contact";

const filePath = path.join(process.cwd(), "data", "contacts.csv");

export function readContacts(): Contact[] {
    if (!fs.existsSync(filePath)) return [];

    const file = fs.readFileSync(filePath, "utf-8").trim();
    if (!file) return [];

    const lines = file.split("\n");
    if (lines.length <= 1) return [];

    const [, ...rows] = lines;

    return rows
        .map((row) => {
            const [name, phone, active] = row.split(",");

            if (!name || !phone || !active) return null;

            return {
                name: name.trim(),
                phone: phone.trim(),
                active: active.trim() === "true",
            };
        })
        .filter(
            (c): c is Contact =>
                c !== null && c.active
        );
}
