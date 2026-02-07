import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "contacts.csv");

function updateContact(name: string, activeValue: boolean) {
    const file = fs.readFileSync(filePath, "utf-8");
    const lines = file.split("\n");

    const updated = lines.map((line, index) => {
        if (index === 0) return line;

        const [n, phone] = line.split(",");

        if (n?.trim() === name) {
            return `${n},${phone},${activeValue}`;
        }

        return line;
    });

    fs.writeFileSync(filePath, updated.join("\n"));
}

export function deactivateContact(name: string) {
    updateContact(name, false);
}

export function restoreContact(name: string) {
    updateContact(name, true);
}
