"use client";

import { useState, useMemo } from "react";
import {
    deleteContact,
    restoreContactAction,
    deleteContactForeverAction,
} from "@/app/actions";

export type Contact = {
    name: string;
    phone: string;
    active: boolean;
};

type Props = {
    contacts: Contact[];
};

export default function ContactsClient({ contacts }: Props) {
    const [contactList, setContactList] = useState<Contact[]>(contacts);
    const [search, setSearch] = useState("");
    const [view, setView] = useState<"active" | "trash">("active");

    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
    const [contactToDeleteForever, setContactToDeleteForever] =
        useState<Contact | null>(null);

    const filteredContacts = useMemo(() => {
        return contactList.filter(
            (c) =>
                c.active === (view === "active") &&
                c.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [contactList, search, view]);

    /* ---------- acciones ---------- */

    const confirmDelete = async () => {
        if (!contactToDelete) return;

        await deleteContact(contactToDelete.name);

        setContactList((prev) =>
            prev.map((c) =>
                c.name === contactToDelete.name ? { ...c, active: false } : c
            )
        );

        setContactToDelete(null);
    };

    const restore = async (contact: Contact) => {
        await restoreContactAction(contact.name);

        setContactList((prev) =>
            prev.map((c) =>
                c.name === contact.name ? { ...c, active: true } : c
            )
        );
    };

    const confirmDeleteForever = async () => {
        if (!contactToDeleteForever) return;

        await deleteContactForeverAction(contactToDeleteForever.name);

        setContactList((prev) =>
            prev.filter((c) => c.name !== contactToDeleteForever.name)
        );

        setContactToDeleteForever(null);
    };

    /* ---------- UI ---------- */

    return (
        <main className="h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-xl flex flex-col">

                {/* ====== PESTAÑAS SUPERIORES ====== */}
                <div className="flex bg-white shadow">
                    <button
                        onClick={() => setView("active")}
                        className={`flex-1 py-3 font-semibold ${
                            view === "active"
                                ? "border-b-4 border-blue-600 text-blue-600"
                                : "text-gray-500"
                        }`}
                    >
                        📇 Activos
                    </button>

                    <button
                        onClick={() => setView("trash")}
                        className={`flex-1 py-3 font-semibold ${
                            view === "trash"
                                ? "border-b-4 border-red-600 text-red-600"
                                : "text-gray-500"
                        }`}
                    >
                        🗑️ Papelera
                    </button>
                </div>

                {/* ====== HEADER FIJO ====== */}
                <div className="sticky top-0 bg-gray-100 z-10 p-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        📇 Mis Contactos
                    </h1>

                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                    />
                </div>

                {/* ====== LISTA SCROLL ====== */}
                <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
                    {filteredContacts.length === 0 && (
                        <p className="text-center text-gray-500">
                            No hay contactos
                        </p>
                    )}

                    {filteredContacts.map((contact) => (
                        <div
                            key={contact.name}
                            className="bg-white p-5 rounded-xl shadow flex items-center justify-between"
                        >
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {contact.name}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {contact.phone}
                                </p>
                            </div>

                            {view === "active" ? (
                                <button
                                    onClick={() => setContactToDelete(contact)}
                                    className="text-red-500 text-xl"
                                    title="Eliminar"
                                >
                                    ❌
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => restore(contact)}
                                        className="text-green-600 text-xl"
                                        title="Restaurar"
                                    >
                                        ♻️
                                    </button>

                                    <button
                                        onClick={() =>
                                            setContactToDeleteForever(contact)
                                        }
                                        className="text-red-600 text-xl"
                                        title="Eliminar definitivamente"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* MODALES */}
            {contactToDelete && (
                <Modal
                    title="Eliminar contacto"
                    message={`¿Eliminar a ${contactToDelete.name}?`}
                    onCancel={() => setContactToDelete(null)}
                    onConfirm={confirmDelete}
                />
            )}

            {contactToDeleteForever && (
                <Modal
                    title="Eliminar definitivamente"
                    message="Este contacto se eliminará para siempre. ¿Deseas continuar?"
                    danger
                    onCancel={() => setContactToDeleteForever(null)}
                    onConfirm={confirmDeleteForever}
                />
            )}
        </main>
    );
}

/* ---------- MODAL ---------- */

function Modal({
                   title,
                   message,
                   onCancel,
                   onConfirm,
                   danger = false,
               }: {
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    danger?: boolean;
}) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-80">
                <h2
                    className={`text-lg font-semibold mb-4 ${
                        danger ? "text-red-600" : "text-gray-800"
                    }`}
                >
                    {title}
                </h2>

                <p className="mb-6 text-gray-700">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-lg ${
                            danger ? "bg-red-600" : "bg-blue-600"
                        }`}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
