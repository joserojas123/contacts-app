import fs from "fs";
import path from "path";

export type Contact = {
    name: string;
    phone: string;
};

export function getContactsFromCSV(): Contact[] {
    const filePath = path.join(process.cwd(), "src/data/contacts.csv");
    const file = fs.readFileSync(filePath, "utf8");

    const lines = file.trim().split("\n");
    const [, ...rows] = lines; // quitar header

    return rows.map(row => {
        const [name, phone] = row.split(",");
        return {
            name: name.trim(),
            phone: phone.trim(),
        };
    });
}
