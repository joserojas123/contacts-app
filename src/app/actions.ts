"use server";

import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "contacts.csv");

/* ---------- util ---------- */
function readLines() {
    const csv = fs.readFileSync(filePath, "utf-8");
    return csv.trim().split("\n");
}

/* ---------- eliminar (soft) ---------- */
export async function deleteContact(name: string) {
    const lines = readLines();

    const updated = lines.map((line, i) => {
        if (i === 0) return line;
        const [n, p] = line.split(",");
        return n === name ? `${n},${p},false` : line;
    });

    fs.writeFileSync(filePath, updated.join("\n"));
}

/* ---------- restaurar ---------- */
export async function restoreContactAction(name: string) {
    const lines = readLines();

    const updated = lines.map((line, i) => {
        if (i === 0) return line;
        const [n, p] = line.split(",");
        return n === name ? `${n},${p},true` : line;
    });

    fs.writeFileSync(filePath, updated.join("\n"));
}

/* ---------- eliminar definitivo ---------- */
export async function deleteContactForeverAction(name: string) {
    const lines = readLines();
    const header = lines[0];

    const filtered = lines.filter(
        (line, i) => i === 0 || !line.startsWith(name + ",")
    );

    fs.writeFileSync(filePath, [header, ...filtered.slice(1)].join("\n"));
}

/* ---------- agregar contacto ---------- */
export async function addContactAction(name: string, phone: string) {
    const lines = readLines();

    for (const line of lines.slice(1)) {
        const [n, p] = line.split(",");
        if (n === name) throw new Error("Nombre duplicado");
        if (p === phone) throw new Error("Celular duplicado");
    }

    fs.appendFileSync(filePath, `\n${name},${phone},true`);
}

/* ---------- actualizar contacto ---------- */
export async function updateContactAction(
    oldName: string,
    newName: string,
    newPhone: string
) {
    const lines = readLines();

    for (const line of lines.slice(1)) {
        const [n, p] = line.split(",");
        if (n !== oldName && n === newName) throw new Error("Nombre duplicado");
        if (p === newPhone && n !== oldName) throw new Error("Celular duplicado");
    }

    const updated = lines.map((line, i) => {
        if (i === 0) return line;
        const [n, p, active] = line.split(",");
        if (n === oldName) return `${newName},${newPhone},${active}`;
        return line;
    });

    fs.writeFileSync(filePath, updated.join("\n"));
}
