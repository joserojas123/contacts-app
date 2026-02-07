"use server";

import {
    deactivateContact,
    restoreContact,
    deleteContactForever,
} from "@/lib/contacts";

export async function deleteContact(name: string) {
    deactivateContact(name);
}

export async function restoreContactAction(name: string) {
    restoreContact(name);
}

export async function deleteContactForeverAction(name: string) {
    deleteContactForever(name);
}
