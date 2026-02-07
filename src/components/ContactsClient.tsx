"use client";

import { useState } from "react";
import { Contact } from "@/types/contact";
import { deleteContact } from "@/app/actions";

type Props = {
    contacts: Contact[];
};

export default function ContactsClient({ contacts }: Props) {
    const [contactList, setContactList] = useState<Contact[]>(contacts);
    const [filter, setFilter] = useState("");
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

    const filteredContacts = contactList.filter(contact =>
        contact.name.toLowerCase().includes(filter.toLowerCase())
    );

    const confirmDelete = async () => {
        if (!contactToDelete) return;

        await deleteContact(contactToDelete.name);

        setContactList(prev =>
            prev.filter(c => c.name !== contactToDelete.name)
        );

        setContactToDelete(null);
    };

    return (
        <main className="h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-md flex flex-col">

                {/* 🔒 HEADER ESTÁTICO */}
                <div className="sticky top-0 bg-gray-100 px-6 py-6 z-10">
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                        📇 Mis Contactos
                    </h1>

                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg
                       border border-gray-300
                       text-gray-900
                       placeholder-gray-400
                       focus:outline-none
                       focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 📋 LISTA */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="grid gap-4 mt-4">
                        {filteredContacts.map((contact, index) => (
                            <div
                                key={index}
                                className="bg-white p-5 rounded-xl shadow
                           flex items-center justify-between"
                            >
                                <div className="flex-1 text-center">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {contact.name}
                                    </p>
                                    <p className="text-gray-600">
                                        📞 {contact.phone}
                                    </p>
                                </div>

                                {/* ❌ BOTÓN ELIMINAR */}
                                <button
                                    onClick={() => setContactToDelete(contact)}
                                    className="ml-4 text-red-500 hover:text-red-700
                             font-bold text-xl"
                                    title="Eliminar contacto"
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🪟 MODAL */}
                {contactToDelete && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">
                                ¿Eliminar contacto?
                            </h2>

                            <p className="text-gray-700 mb-6">
                                {contactToDelete.name}
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setContactToDelete(null)}
                                    className="px-4 py-2 rounded-lg
                             bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-lg
                             bg-red-600 text-white hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
