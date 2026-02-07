"use client";

import { useMemo, useState } from "react";
import { deleteContact, restoreContactAction } from "@/app/actions";
import { Contact } from "@/types/contact";

type Props = {
    contacts: Contact[];
};

export default function ContactsClient({ contacts }: Props) {
    const [search, setSearch] = useState("");
    const [contactList, setContactList] = useState<Contact[]>(contacts);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
    const [view, setView] = useState<"active" | "trash">("active");

    const filteredContacts = useMemo(() => {
        return contactList
            .filter((c) => (view === "active" ? c.active : !c.active))
            .filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
            );
    }, [contactList, search, view]);

    const confirmDelete = async () => {
        if (!contactToDelete) return;

        await deleteContact(contactToDelete.name);

        setContactList((prev) =>
            prev.map((c) =>
                c.name === contactToDelete.name
                    ? { ...c, active: false }
                    : c
            )
        );

        setContactToDelete(null);
    };

    const restore = async (contact: Contact) => {
        await restoreContactAction(contact.name);

        setContactList((prev) =>
            prev.map((c) =>
                c.name === contact.name
                    ? { ...c, active: true }
                    : c
            )
        );
    };

    return (
        <main className="h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-xl flex flex-col">

                {/* Header fijo */}
                <div className="sticky top-0 bg-gray-100 z-10 pb-4">
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={() =>
                                setView(view === "active" ? "trash" : "active")
                            }
                            className="text-sm px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
                        >
                            {view === "active" ? "🗑️ Papelera" : "⬅ Volver"}
                        </button>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                        {view === "active" ? "📇 Mis Contactos" : "🗑️ Papelera"}
                    </h1>

                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto mt-4">
                    <div className="grid gap-4">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.phone}
                                className="bg-white p-5 rounded-xl shadow flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900">{contact.name}</p>
                                    <p className="text-gray-600">{contact.phone}</p>
                                </div>

                                {view === "active" ? (
                                    <button
                                        onClick={() => setContactToDelete(contact)}
                                        className="ml-4 text-red-500 hover:text-red-700 font-bold text-xl"
                                        title="Eliminar contacto"
                                    >
                                        ❌
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => restore(contact)}
                                        className="ml-4 text-green-600 hover:text-green-800 font-bold text-xl"
                                        title="Restaurar contacto"
                                    >
                                        ♻️
                                    </button>
                                )}
                            </div>
                        ))}

                        {filteredContacts.length === 0 && (
                            <p className="text-center text-gray-500 mt-6">
                                No hay contactos
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {contactToDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            ¿Eliminar contacto?
                        </h2>

                        <p className="text-gray-700 mb-6">
                            ¿Seguro que deseas eliminar a{" "}
                            <span className="font-semibold">
                {contactToDelete.name}
              </span>
                            ?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setContactToDelete(null)}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
