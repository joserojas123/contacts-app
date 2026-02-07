import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "contacts.csv");

function readLines() {
    return fs.readFileSync(filePath, "utf-8").split("\n");
}

function writeLines(lines: string[]) {
    fs.writeFileSync(filePath, lines.join("\n"));
}

function updateContact(name: string, activeValue: boolean) {
    const lines = readLines();

    const updated = lines.map((line, index) => {
        if (index === 0) return line;

        const [n, phone] = line.split(",");
        if (n?.trim() === name) {
            return `${n},${phone},${activeValue}`;
        }
        return line;
    });

    writeLines(updated);
}

export function deactivateContact(name: string) {
    updateContact(name, false);
}

export function restoreContact(name: string) {
    updateContact(name, true);
}

export function deleteContactForever(name: string) {
    const lines = readLines();

    const filtered = lines.filter((line, index) => {
        if (index === 0) return true;
        const [n] = line.split(",");
        return n?.trim() !== name;
    });

    writeLines(filtered);
}
