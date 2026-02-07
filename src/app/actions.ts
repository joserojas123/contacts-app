"use server";

import { deactivateContact, restoreContact } from "@/lib/contacts";

export async function deleteContact(name: string) {
    deactivateContact(name);
}

export async function restoreContactAction(name: string) {
    restoreContact(name);
}
