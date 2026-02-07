"use server";

import { deactivateContact } from "@/lib/contacts";

export async function deleteContact(name: string) {
    deactivateContact(name);
}
